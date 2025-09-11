"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppRouter_1 = __importDefault(require("../classes/AppRouter"));
const SAML_controller_1 = require("../controllers/SAML.controller");
class SAMLRouters extends AppRouter_1.default {
    constructor() {
        super();
    }
    initializeRoutes() {
        const samlController = new SAML_controller_1.SAMLController();
        this.router.get('/saml/request', (req, res) => samlController.request(req, res));
    }
}
exports.default = SAMLRouters;
;
