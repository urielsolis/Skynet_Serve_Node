"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const post_model_1 = require("../models/post.model");
const file_system_1 = __importDefault(require("../clases/file-system"));
const postRoutes = express_1.Router();
const fileSystem = new file_system_1.default();
//Crear Post
postRoutes.post('/create', [autenticacion_1.verificaToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    const imagenes = fileSystem.imagenesDeTempHaciaPost(req.usuario._id);
    body.img = imagenes;
    post_model_1.Post.create(body).then((PostDB) => __awaiter(this, void 0, void 0, function* () {
        yield PostDB.populate('usuario', '-password').execPopulate();
        res.json({
            ok: true,
            body: PostDB
        });
    })).catch(err => {
        res.json(err);
    });
});
//Obtener Post
postRoutes.get('/index', [autenticacion_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    const body = req.body;
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const post = yield post_model_1.Post.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('usuario', '-password')
        .exec();
    res.json({
        ok: true,
        pagina,
        post
    });
}));
//Subir Archivos
postRoutes.post('/upload', [autenticacion_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo -image'
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Lo que subio no es una imagen'
        });
    }
    yield fileSystem.guardarImagenTemporal(file, req.usuario._id);
    res.json({
        ok: true,
        file: file.mimetype
    });
}));
//Traer Imagen
postRoutes.get('/imagen/:img', [autenticacion_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    const userId = req.usuario._id;
    const img = req.params.img;
    const pathphoto = fileSystem.getFotoUrl(userId, img);
    res.sendFile(pathphoto);
}));
exports.default = postRoutes;
