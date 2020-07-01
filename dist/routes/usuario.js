"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_model_1 = require("../models/usuario.model");
const bcrypt_1 = require("bcrypt");
const token_1 = __importDefault(require("../clases/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const userRoutes = express_1.Router();
//login usuario
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    usuario_model_1.Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos'
            });
        }
        if (userDB.compararpassword(body.password)) {
            const tokenuser = token_1.default.getJwtToken({
                _id: userDB._id,
                nombre_usuario: userDB.nombre_usuario,
                email: userDB.email,
                avatar: userDB.avatar,
                nombres: userDB.nombres,
                apellidos: userDB.apellidos
            });
            return res.json({
                ok: true,
                mensage: 'Login exitoso',
                token: tokenuser,
                user: userDB
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos *** '
            });
        }
    });
});
//crear usuario
userRoutes.post('/create', (req, res) => {
    const body = req.body;
    const user = {
        nombre_usuario: body.nombre_usuario,
        nombres: body.nombres,
        apellidos: body.apellidos,
        avatar: body.avatar,
        email: body.email,
        password: bcrypt_1.hashSync(req.body.password, 10)
    };
    usuario_model_1.Usuario.create(user).then(userDB => {
        const tokenuser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre_usuario: userDB.nombre_usuario,
            email: userDB.email,
            avatar: userDB.avatar,
            nombres: userDB.nombres,
            apellidos: userDB.apellidos
        });
        return res.json({
            ok: true,
            mensage: 'Usuario Creado exitosamente',
            token: tokenuser,
            user: userDB
        });
    }).catch(err => {
        res.json({
            ok: false,
            mensage: 'error',
            err
        });
    });
});
//Actualizar usuario
userRoutes.post('/update', autenticacion_1.verificaToken, (req, res) => {
    const body = req.body;
    const uss = req.usuario;
    const user = {
        nombre_usuario: body.nombre_usuario || uss.nombre_usuario,
        email: body.email || uss.email,
        avatar: body.avatar || uss.avatar,
        nombres: body.nombres || uss.nombres,
        apellidos: body.apellidos || uss.apellidos
    };
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con este token'
            });
        }
        const tokenuser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre_usuario: userDB.nombre_usuario,
            email: userDB.email,
            avatar: userDB.avatar,
            nombres: userDB.nombres,
            apellidos: userDB.apellidos
        });
        return res.json({
            ok: true,
            token: tokenuser,
            user: userDB
        });
    });
});
//Comprobar Token
userRoutes.get('/', [autenticacion_1.verificaToken], (req, res) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    });
});
exports.default = userRoutes;
