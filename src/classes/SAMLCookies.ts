import { chromium } from "playwright";

export class SAMLCookies {
    private kmuttEmail: string;
    private kmuttPassword: string;
    private kmuttLoginURL: string = 'https://dl.lib.kmutt.ac.th/repository/loadfile.php?obj_id=5749';

    private samlCookies: { [key: string]: string } = {};

    private browserOptions: { 
        headless: boolean; 
        args: string[];
    };

    constructor(email: string, password: string, option?: {headless: boolean; args: string[]}) {
        this.kmuttEmail = email;
        this.kmuttPassword = password;

        this.browserOptions = {
            headless: option?.headless ?? true,
            args: option?.args ?? ['--no-sandbox', '--disable-setuid-sandbox'],
        };
    }

    public async loginAndGetSamlCookies(): Promise<void> {
        // Launch browser
        const browser = await chromium.launch(this.browserOptions);
        
        // Create a new browser context and page
        const context = await browser.newContext();
        const page = await context.newPage();

        // Navigate to KMUTT login page
        await page.goto(this.kmuttLoginURL);

        // Click KMUTT Microsoft login button
        try {
            await page.waitForSelector("a[href*='microsoft'], button", { timeout: 7000 });
            await page.click("a[href*='microsoft'], button");
            console.log("[Log] Clicked KMUTT Microsoft login button.");
        } catch {
            console.log("[Log] No KMUTT login button found, maybe redirected directly.");
        }

        // Fill email
        await page.waitForSelector("input[type='email'], #i0116", { timeout: 10000 });
        await page.fill("input[type='email'], #i0116", this.kmuttEmail);
        await page.click("input[type='submit'], #idSIButton9");
        console.log("[Log] Filling Email.");
        await page.waitForTimeout(1000);

        // Fill password
        await page.waitForSelector("input[type='password'], #i0118", { timeout: 10000 });
        await page.fill("input[type='password'], #i0118", this.kmuttPassword);
        console.log("[Log] Filling Password.");
        await page.click("input[type='submit'], #idSIButton9");

        // Handle "Stay signed in?" prompt
        try {
            await page.waitForSelector("#idSIButton9", { timeout: 7000 });
            await page.click("#idSIButton9");
            console.log("[Log] Skipped 'Stay signed in?'");
        } catch {}

        // Revisit protected page to trigger SimpleSAMLAuthToken
        await page.goto(this.kmuttLoginURL);
        await page.waitForTimeout(2000); // wait a bit for cookies to be set

        // Extract cookies
        // Get SAML cookies
        const cookies = await context.cookies();
        for (const c of cookies) {
            if (["SimpleSAMLAuthToken", "SimpleSAMLphp"].includes(c.name)) {
                this.samlCookies[c.name] = c.value;
            }
        }

        if (Object.keys(this.samlCookies).length) {
            console.log("[Log] SimpleSAML cookies found");
        } else {
            console.log("[Log] SimpleSAML cookies not found");
        }

        await browser.close();
    }

    getCookies(): { [key: string]: string } {
        return this.samlCookies;
    }

    getErrorMessage(): string | null {
        if (!this.samlCookies["SimpleSAMLAuthToken"] || !this.samlCookies["SimpleSAMLphp"]) {
            return "SimpleSAMLAuthToken or SimpleSAMLphp cookie not found. Login may have failed. please try again. Make sure your KMUTT credentials are correct. If the problem persists, there might be changes in the KMUTT authentication system. Please check the logs for more details.";
        }
        return null;
    }
}