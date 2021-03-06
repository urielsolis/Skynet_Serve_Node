"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./clases/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const post_1 = __importDefault(require("./routes/post"));
const server = new server_1.default();
//body Parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//FileUpload
server.app.use(express_fileupload_1.default({ useTempFiles: true }));
//Configurar Cors
// server.app.use( cors({ origin: true, credentials: true }) );
server.app.use(cors_1.default({ origin: '*' }));
//Rutas de mi app 
server.app.use('/user', usuario_1.default);
server.app.use('/post', post_1.default);
//Conectar a la DB
mongoose_1.default.connect('mongodb://localhost:27017/skynet', { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err)
        throw err;
    console.log('base de datos online');
});
//Levantar Express
server.start(() => {
    console.log(`servidor corriendo en el puerto ${server.port}`);
});
