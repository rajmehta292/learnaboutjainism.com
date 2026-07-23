import json
import os
import time
import asyncio
from g4f.client import AsyncClient

# Path to the ontology
ONTOLOGY_PATH = os.path.join("..", "src", "data", "ontology.json")
TOPICS_DIR = os.path.join("..", "src", "data", "topics")
AI_ARCH_PATH = os.path.join("..", "docs", "ai_architecture.md")

def get_prompt_for_topic(topic_title, ai_arch_text):
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

async def generate_topic(client, title, prompt, retries=3):
    for attempt in range(retries):
        try:
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Attempt {attempt + 1} failed for {title}: {e}")
            await asyncio.sleep(3)
    return None

async def process_topic(client, topic, ai_arch, sem):
    async with sem:
        topic_id = topic['topic_id']
        title = topic['title']
        out_file = os.path.join(TOPICS_DIR, f"{topic_id}.json")
        
        if os.path.exists(out_file) or os.path.exists(out_file + ".raw.txt"):
            print(f"Skipping {title} ({topic_id}) - already exists.")
            return
            
        print(f"\nProcessing {title} ({topic_id})...")
        prompt = get_prompt_for_topic(title, ai_arch)
        
        response_text = await generate_topic(client, title, prompt)
        
        if not response_text:
            print(f"Could not fetch response for {title}.")
            return
            
        # Try to clean and parse the JSON
        try:
            clean_text = response_text.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            elif clean_text.startswith("```"):
                clean_text = clean_text[3:]
                
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
                
            data = json.loads(clean_text.strip())
            
            with open(out_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"Successfully saved {topic_id}.json!")
            
        except json.JSONDecodeError:
            print(f"Failed to parse JSON for {title}. Raw output saved.")
            with open(out_file + ".raw.txt", 'w', encoding='utf-8') as f:
                f.write(response_text)
                
        # Small delay to prevent hammering
        await asyncio.sleep(1)

async def run_async():
    print("Starting g4f automation (async)...")
    
    with open(ONTOLOGY_PATH, 'r', encoding='utf-8') as f:
        ontology = json.load(f)
        
    with open(AI_ARCH_PATH, 'r', encoding='utf-8') as f:
        ai_arch = f.read()

    os.makedirs(TOPICS_DIR, exist_ok=True)

    # Flatten topics for easier processing
    topics_to_process = []
    for domain in ontology.get("domains", []):
        for topic in domain.get("topics", []):
            topics_to_process.append(topic)
            
    client = AsyncClient()
    sem = asyncio.Semaphore(15) # Concurrent requests

    tasks = []
    for topic in topics_to_process:
        tasks.append(process_topic(client, topic, ai_arch, sem))
        
    await asyncio.gather(*tasks)

    print("Finished processing.")

if __name__ == "__main__":
    asyncio.run(run_async())
