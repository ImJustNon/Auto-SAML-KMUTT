import express from 'express';
import cors from 'cors';
import { SAMLCookies } from './SAMLCookies';
import { config } from '../config/config';
import { get } from 'http';
import { Mongoose } from './Mongoose';
import { SAMLTokenCache } from '../models/SAMLTokenCache';
import SAMLRouters from '../routes/SAML.route';

export class App {
    public app: express.Application;
    public port: number;
    public mongoose: Mongoose;

    constructor(port: number) {
        this.app = express();
        this.port = port;
        
        this.initializeMiddlewares();
        this.initializeRoutes();

        this.mongoose = new Mongoose(config.mongoURI);
    }

    private initializeMiddlewares() {
        this.app.use(cors());
        this.app.use(express.urlencoded({ 
            limit: '50mb',
            extended: true 
        }));
        this.app.use(express.json({
            limit: '50mb',
        }));
    }

    private initializeRoutes() {
        this.app.use("/api", new SAMLRouters().getRouter());

        this.app.get('/', (req, res) => {
            res.status(200).json({ message: 'API is running' });
        });
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port: ${this.port}`);
            this.mongoose.connect();
        });
    }
}