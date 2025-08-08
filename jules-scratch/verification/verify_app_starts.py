from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the application
        page.goto("http://localhost:5173/")

        # Wait for the main heading to be visible in the DOM
        expect(page.locator("h1:has-text('Révélez votre équation financière')")).to_be_visible(timeout=15000)

        # Take a full page screenshot
        page.screenshot(path="jules-scratch/verification/verification.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    run_verification()
