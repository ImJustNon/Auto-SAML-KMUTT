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
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const SAMLCookies_1 = require("./SAMLCookies");
const config_1 = require("../config/config");
class App {
    constructor(port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.initializeMiddlewares();
        this.initializeRoutes();
    }
    initializeMiddlewares() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.urlencoded({
            limit: '50mb',
            extended: true
        }));
        this.app.use(express_1.default.json({
            limit: '50mb',
        }));
    }
    initializeRoutes() {
        this.app.get('/api/saml', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const getsaml = new SAMLCookies_1.SAMLCookies(config_1.config.kmuttEmail, config_1.config.kmuttPassword);
            yield getsaml.loginAndGetSamlCookies();
            if (getsaml.getErrorMessage()) {
                return res.status(500).json({ message: getsaml.getErrorMessage() });
            }
            const result = getsaml.getCookies();
            res.status(200).json({ message: 'SAML Response retrieved successfully', data: result });
        }));
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port: ${this.port}`);
        });
    }
}
exports.App = App;
