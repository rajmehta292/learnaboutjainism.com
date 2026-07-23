import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        print("Loading page...")
        await page.goto("https://duckduckgo.com/chat")
        
        # Click through
        try:
            get_started = await page.wait_for_selector("text='Get Started'", timeout=5000)
            if get_started: await get_started.click()
            i_agree = await page.wait_for_selector("text='I Agree'", timeout=5000)
            if i_agree: await i_agree.click()
        except: pass
        
        # Type something
        box = await page.wait_for_selector("textarea")
        await box.fill("Hello, what are you?")
        await box.press("Enter")
        
        print("Waiting for generation...")
        await asyncio.sleep(10)
        
        # Dump the HTML
        html = await page.content()
        with open("ddg_dump.html", "w", encoding="utf-8") as f:
            f.write(html)
            
        print("Saved to ddg_dump.html")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
