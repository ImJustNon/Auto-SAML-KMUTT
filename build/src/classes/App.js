"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("../config/config");
const Mongoose_1 = require("./Mongoose");
const SAML_route_1 = __importDefault(require("../routes/SAML.route"));
class App {
    constructor(port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.mongoose = new Mongoose_1.Mongoose(config_1.config.mongoURI);
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
        this.app.use("/api", new SAML_route_1.default().getRouter());
        this.app.get('/', (req, res) => {
            res.status(200).json({ message: 'API is running', gay: config_1.config.mongoURI });
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port: ${this.port}`);
            this.mongoose.connect();
        });
    }
}
exports.App = App;
