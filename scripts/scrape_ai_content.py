import json
import os
import time
import asyncio
from playwright.async_api import async_playwright

# Path to the ontology
ONTOLOGY_PATH = os.path.join("..", "src", "data", "ontology.json")
TOPICS_DIR = os.path.join("..", "src", "data", "topics")
AI_ARCH_PATH = os.path.join("..", "docs", "ai_architecture.md")

async def get_prompt_for_topic(topic_title, ai_arch_text):
    return f"""You are an expert, academic guide on Jainism.
Read the following architecture rules and strictly abide by them:
{ai_arch_text}

Write a comprehensive encyclopedia article about: "{topic_title}".
Respond ONLY in valid JSON format with the following structure:
{{
  "overview": "A detailed, multi-paragraph explanation of the topic.",
  "primary_sources": [
    {{
      "title": "Name of the text",
      "author": "Author (if known)",
      "original_text": "Original prakrit/sanskrit if applicable",
      "transliteration": "Transliteration",
      "translation": "English translation",
      "notes": "Contextual notes"
    }}
  ],
  "misconceptions": [
    {{
      "myth": "A common myth",
      "reality": "The factual reality"
    }}
  ]
}}
Ensure the JSON is perfectly formatted. Do not include markdown code blocks like ```json, just the raw JSON object.
"""

async def run():
    print("Starting Playwright automation...")
    
    with open(ONTOLOGY_PATH, 'r', encoding='utf-8') as f:
        ontology = json.load(f)
        
    with open(AI_ARCH_PATH, 'r', encoding='utf-8') as f:
        ai_arch = f.read()

    os.makedirs(TOPICS_DIR, exist_ok=True)

    # Flatten topics for easier processing (Just testing the first 3 for now)
    topics_to_process = []
    for domain in ontology.get("domains", []):
        for topic in domain.get("topics", []):
            topics_to_process.append(topic)
            
    topics_to_process = topics_to_process[:3] # Testing limit
    
    async with async_playwright() as p:
        # Launch browser in non-headless mode so the user can see what's happening
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()

        print("Navigating to DuckDuckGo AI Chat...")
        await page.goto("https://duckduckgo.com/chat", wait_until="networkidle")
        
        # Click through initial DuckDuckGo welcome screens
        try:
            get_started = await page.wait_for_selector("text='Get Started'", timeout=5000)
            if get_started:
                await get_started.click()
                print("Clicked 'Get Started'")
                
            i_agree = await page.wait_for_selector("text='I Agree'", timeout=5000)
            if i_agree:
                await i_agree.click()
                print("Clicked 'I Agree'")
        except Exception as e:
            print("No welcome screen detected, proceeding to chat.")

        for topic in topics_to_process:
            topic_id = topic['topic_id']
            title = topic['title']
            out_file = os.path.join(TOPICS_DIR, f"{topic_id}.json")
            
            if os.path.exists(out_file):
                print(f"Skipping {title} ({topic_id}) - already exists.")
                continue
                
            print(f"\nProcessing {title} ({topic_id})...")
            prompt = await get_prompt_for_topic(title, ai_arch)
            
            # Find the chat input box and send the prompt
            input_box = await page.wait_for_selector("textarea")
            await input_box.fill(prompt)
            await input_box.press("Enter")
            
            print("Waiting for AI response to generate...")
            # Wait for the "Stop generating" button to disappear or a certain time to pass
            # DDG Chat has a structure we can wait for. We'll wait 20 seconds for the stream to finish.
            # In a production script, we'd look for the specific DOM element indicating completion.
            await asyncio.sleep(25) 
            
            # Extract the last message from the assistant
            messages = await page.query_selector_all("[data-testid='message-bubble']")
            if messages:
                last_message = messages[-1]
                response_text = await last_message.inner_text()
                
                # Try to clean and parse the JSON
                try:
                    # Remove potential markdown code blocks if the AI disobeyed
                    if response_text.startswith("```json"):
                        response_text = response_text[7:]
                    if response_text.endswith("```"):
                        response_text = response_text[:-3]
                        
                    data = json.loads(response_text.strip())
                    
                    with open(out_file, 'w', encoding='utf-8') as f:
                        json.dump(data, f, indent=2, ensure_ascii=False)
                    print(f"Successfully saved {topic_id}.json!")
                    
                except json.JSONDecodeError:
                    print(f"Failed to parse JSON for {title}. Raw output saved.")
                    with open(out_file + ".raw.txt", 'w', encoding='utf-8') as f:
                        f.write(response_text)
            else:
                print("Could not find response message.")

        print("Finished processing.")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
