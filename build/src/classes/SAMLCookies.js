"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SAMLCookies = void 0;
const playwright_core_1 = require("playwright-core");
const chromium_1 = __importDefault(require("@sparticuz/chromium"));
const SAMLTokenCache_1 = require("../models/SAMLTokenCache");
class SAMLCookies {
    constructor(email, password, option) {
        this.kmuttLoginURL = 'https://dl.lib.kmutt.ac.th/repository/loadfile.php?obj_id=5749';
        this.samlCookies = {};
        this.isRunning = false;
        this.kmuttEmail = email;
        this.kmuttPassword = password;
        this.isServerless = option.isServerless;
        this.browserOptions = {
            headless: true,
            args: option.isServerless ? chromium_1.default.args : [],
        };
    }
    loginAndGetSamlCookies() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isRunning = true;
            const browser = yield playwright_core_1.chromium.launch(Object.assign(Object.assign({}, this.browserOptions), { executablePath: this.isServerless ? yield chromium_1.default.executablePath() : undefined }));
            const context = yield browser.newContext();
            const page = yield context.newPage();
            yield page.goto(this.kmuttLoginURL);
            try {
                yield page.waitForSelector("a[href*='microsoft'], button", { timeout: 7000 });
                yield page.click("a[href*='microsoft'], button");
                console.log("[Log] Clicked KMUTT Microsoft login button.");
            }
            catch (_a) {
                console.log("[Log] No KMUTT login button found, maybe redirected directly.");
            }
            yield page.waitForSelector("input[type='email'], #i0116", { timeout: 10000 });
            yield page.fill("input[type='email'], #i0116", this.kmuttEmail);
            yield page.click("input[type='submit'], #idSIButton9");
            console.log("[Log] Filling Email.");
            yield page.waitForTimeout(1000);
            yield page.waitForSelector("input[type='password'], #i0118", { timeout: 10000 });
            yield page.fill("input[type='password'], #i0118", this.kmuttPassword);
            console.log("[Log] Filling Password.");
            yield page.click("input[type='submit'], #idSIButton9");
            try {
                yield page.waitForSelector("#idSIButton9", { timeout: 7000 });
                yield page.click("#idSIButton9");
                console.log("[Log] Skipped 'Stay signed in?'");
            }
            catch (_b) { }
            yield page.goto(this.kmuttLoginURL);
            yield page.waitForTimeout(5000);
            const cookies = yield context.cookies();
            for (const c of cookies) {
                if (["SimpleSAMLAuthToken", "SimpleSAMLphp"].includes(c.name)) {
                    this.samlCookies[c.name] = c.value;
                }
            }
            if (Object.keys(this.samlCookies).length) {
                console.log("[Log] SimpleSAML cookies found");
            }
            else {
                console.log("[Log] SimpleSAML cookies not found");
            }
            yield browser.close();
            this.isRunning = false;
        });
    }
    getCookies() {
        return this.samlCookies;
    }
    getErrorMessage() {
        if (!this.samlCookies["SimpleSAMLAuthToken"] || !this.samlCookies["SimpleSAMLphp"]) {
            return "SimpleSAMLAuthToken or SimpleSAMLphp cookie not found. Login may have failed. please try again. Make sure your KMUTT credentials are correct. If the problem persists, there might be changes in the KMUTT authentication system. Please check the logs for more details.";
        }
        return null;
    }
    createNewAndUpdateToDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loginAndGetSamlCookies();
            this.isRunning = true;
            const newSAMLToken = this.getCookies();
            try {
                const tokenCache = new SAMLTokenCache_1.SAMLTokenCache({
                    simpleSAMLphp: newSAMLToken['SimpleSAMLphp'],
                    simpleSAMLAuthToken: newSAMLToken['SimpleSAMLAuthToken']
                });
                yield tokenCache.save();
            }
            catch (error) {
                console.error('Error saving TokenCache:', error);
            }
            this.isRunning = false;
        });
    }
}
exports.SAMLCookies = SAMLCookies;
