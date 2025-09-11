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
        // Example: Add a TokenCache document
        // this.app.get('/api/token-cache/add', async (req, res) => {
        //     try {
        //         const [simpleSAMLphp, simpleSAMLAuthToken] = ["arfawfdsfasdf", "asdasdasdasdasdregergregergergrg"];
        //         const tokenCache = new SAMLTokenCache({ simpleSAMLphp, simpleSAMLAuthToken });
        //         const saved = await tokenCache.save();
        //         res.status(201).json({ message: 'TokenCache saved', data: saved });
        //     } catch (error) {
        //         res.status(500).json({ message: 'Error saving TokenCache', error });
        //     }
        // });

        // // Example: Read all TokenCache documents
        // this.app.get('/api/token-cache/get', async (req, res) => {
        //     try {
        //         const tokens = await SAMLTokenCache.find();
        //         res.status(200).json({ message: 'TokenCache list', data: tokens });
        //     } catch (error) {
        //         res.status(500).json({ message: 'Error fetching TokenCache', error });
        //     }
        // });

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