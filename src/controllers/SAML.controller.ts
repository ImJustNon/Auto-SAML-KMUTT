import { Request, Response } from "express";
import { SAMLCookies } from "../classes/SAMLCookies";
import { config } from "../config/config";
import { SAMLTokenCache } from "../models/SAMLTokenCache";
import { Mongoose } from "../classes/Mongoose";

export class SAMLController {

    private samlToken: SAMLCookies;

    constructor() {
        this.samlToken = new SAMLCookies(config.kmuttEmail!, config.kmuttPassword!, {isServerless: config.isServerless});
    }

    public async request(req: Request, res: Response) {
        await new Mongoose(config.mongoURI).connect();

        const getSAMLCaches = await SAMLTokenCache.find();
        const sortedByDateSAMLTokenCache = getSAMLCaches.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        if(this.samlToken.isRunning) {
            return res.status(503).json({ 
                message: 'SAML Request is already in progress. Please try again later.' 
            });
        }

        if(sortedByDateSAMLTokenCache.length === 0) {
            res.status(200).json({ 
                message: 'SAML Response retrieving. Please try again in a few moments.',
            });
            await this.samlToken.createNewAndUpdateToDatabase();
            return;
        }

        if((sortedByDateSAMLTokenCache[0].createdAt.getTime() + 50*60*1000) < new Date().getTime()) {
            res.status(200).json({ 
                message: 'SAML Response retrieving. Please try again in a few moments.',
            });
            await this.samlToken.createNewAndUpdateToDatabase();
            return;
        }

        return res.status(200).json({ 
            message: 'SAML Response retrieved from cache', 
            data: {
                simpleSAMLphp: sortedByDateSAMLTokenCache[0].simpleSAMLphp,
                simpleSAMLAuthToken: sortedByDateSAMLTokenCache[0].simpleSAMLAuthToken
            } 
        });
    }
}
