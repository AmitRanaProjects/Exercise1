const { chromium } = require('playwright');

async function runAutomation() {
    console.log('🚀 Starting automation script...');
    
    const browser = await chromium.launch({ 
        headless: false,  // Set to true if you don't want to see the browser
        slowMo: 500      // Slow down actions so you can see what's happening
    });
    
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 720 });
    
    try {
        // Step 1: Go to Google and search for "Automation"
        console.log('🔍 Step 1: Searching Google for "Automation"');
        await page.goto('https://www.google.com');
        
        // Wait for and fill the search box
        await page.waitForSelector('textarea[name="q"]');
        await page.fill('textarea[name="q"]', 'Automation');
        await page.keyboard.press('Enter');
        
        // Wait for search results
        await page.waitForSelector('#search');

        // Step 2: Find Wikipedia link
        console.log('📚 Step 2: Finding Wikipedia link');
        
        // Wait a bit for results to load
        await page.waitForTimeout(2000);
        
        // Look for Wikipedia links
        const wikiLink = await page.$('a[href*="wikipedia.org"]');
        
        if (!wikiLink) {
            // If no Wikipedia link found, take screenshot to debug
            await page.screenshot({ path: 'screenshots/debug-search-results.png' });
            throw new Error('Wikipedia link not found in search results');
        }

        const wikiUrl = await wikiLink.getAttribute('href');
        console.log('✅ Found Wikipedia URL:', wikiUrl);

        if (!wikiUrl) {
            throw new Error('Could not get Wikipedia URL');
        }

        // Step 3: Go to Wikipedia page
        console.log('🌐 Step 3: Navigating to Wikipedia page');
        await page.goto(wikiUrl);
        
        // Wait for Wikipedia page to load
        await page.waitForSelector('.mw-parser-output');

        // Step 4: Search for early automation years
        console.log('📅 Step 4: Searching for historical automation information');
        const content = await page.textContent('body');
        
        // Look for years that might indicate early automation (1700-1950)
        const yearMatches = content?.match(/\b(1[7-9]\d{2})\b/g) || [];
        const earlyYears = yearMatches
            .filter((year: string) => {
                const yearNum = parseInt(year);
                return yearNum >= 1700 && yearNum <= 1950;
            })
            .sort((a: string, b: string) => parseInt(a) - parseInt(b));
        
        const earliestYear = earlyYears[0] || 'Not found';
        console.log('📅 Earliest year found related to automation:', earliestYear);

        // Step 5: Take screenshot
        console.log('📸 Step 5: Taking screenshot of Wikipedia page');
        const fs = require('fs');
        if (!fs.existsSync('screenshots')) {
            fs.mkdirSync('screenshots');
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const screenshotPath = `screenshots/wikipedia-automation-${timestamp}.png`;
        
        await page.screenshot({ 
            path: screenshotPath, 
            fullPage: true 
        });

        console.log('\n🎉 AUTOMATION COMPLETED SUCCESSFULLY!');
        console.log('========================================');
        console.log('📚 Wikipedia URL:', wikiUrl);
        console.log('📅 Early automation year found:', earliestYear);
        console.log('📸 Screenshot saved:', screenshotPath);

    } catch (error) {
        console.error('❌ Error during automation:', error);
        
        // Take screenshot on error for debugging
        const fs = require('fs');
        if (!fs.existsSync('screenshots')) {
            fs.mkdirSync('screenshots');
        }
        await page.screenshot({ path: 'screenshots/error.png', fullPage: true });
        console.log('📸 Error screenshot saved: screenshots/error.png');
        
    } finally {
        // Close browser
        await browser.close();
        console.log('🔚 Browser closed.');
    }
}

// Run the automation
runAutomation().catch(console.error);