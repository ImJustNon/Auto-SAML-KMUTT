import express, { Router } from "express";

abstract class AppRouter {
    public router: Router;

    constructor(){
        this.router = express.Router();
    }

    protected abstract initializeRoutes(): void;

    public getRouter(): Router {
        this.initializeRoutes();
        return this.router;
    }
}

export default AppRouter;