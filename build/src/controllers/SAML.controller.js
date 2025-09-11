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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SAMLController = void 0;
const SAMLCookies_1 = require("../classes/SAMLCookies");
const config_1 = require("../config/config");
const SAMLTokenCache_1 = require("../models/SAMLTokenCache");
const Mongoose_1 = require("../classes/Mongoose");
class SAMLController {
    constructor() {
        this.samlToken = new SAMLCookies_1.SAMLCookies(config_1.config.kmuttEmail, config_1.config.kmuttPassword, { isServerless: config_1.config.isServerless });
    }
    request(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Mongoose_1.Mongoose(config_1.config.mongoURI).connect();
            const getSAMLCaches = yield SAMLTokenCache_1.SAMLTokenCache.find();
            const sortedByDateSAMLTokenCache = getSAMLCaches.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            if (this.samlToken.isRunning) {
                return res.status(503).json({
                    message: 'SAML Request is already in progress. Please try again later.'
                });
            }
            if (sortedByDateSAMLTokenCache.length === 0) {
                res.status(200).json({
                    message: 'SAML Response retrieving. Please try again in a few moments.',
                });
                yield this.samlToken.createNewAndUpdateToDatabase();
                return;
            }
            if ((sortedByDateSAMLTokenCache[0].createdAt.getTime() + 50 * 60 * 1000) < new Date().getTime()) {
                res.status(200).json({
                    message: 'SAML Response retrieving. Please try again in a few moments.',
                });
                yield this.samlToken.createNewAndUpdateToDatabase();
                return;
            }
            return res.status(200).json({
                message: 'SAML Response retrieved from cache',
                data: {
                    simpleSAMLphp: sortedByDateSAMLTokenCache[0].simpleSAMLphp,
                    simpleSAMLAuthToken: sortedByDateSAMLTokenCache[0].simpleSAMLAuthToken
                }
            });
        });
    }
}
exports.SAMLController = SAMLController;
