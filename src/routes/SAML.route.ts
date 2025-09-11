import express from "express";
import AppRouter from "../classes/AppRouter";
import { SAMLController } from "../controllers/SAML.controller";


export default class SAMLRouters extends AppRouter {
    constructor() {
        super();
    }
    
    protected initializeRoutes(): void {
        const samlController = new SAMLController();
        this.router.get('/saml/request', (req, res) => samlController.request(req, res));
    }
};