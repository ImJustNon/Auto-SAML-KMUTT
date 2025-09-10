import express from 'express';
import cors from 'cors';
import { SAMLCookies } from './SAMLCookies';
import { config } from '../config/config';

export class App {
    public app: express.Application;
    public port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;
        
        this.initializeMiddlewares();
        this.initializeRoutes();
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
        this.app.get('/api/saml', async (req, res) => {
            const getsaml = new SAMLCookies(config.kmuttEmail!, config.kmuttPassword!);
            await getsaml.loginAndGetSamlCookies();
            const result = getsaml.getCookies();
            res.status(200).json({ message: 'SAML Response retrieved successfully', data: result });
        });
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port: ${this.port}`);
        });
    }
}