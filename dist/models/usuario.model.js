"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = require("bcrypt");
const usuarioSchema = new mongoose_1.Schema({
    nombre_usuario: {
        type: String,
        required: [true, 'El nombre de usuario es necesario']
    },
    nombres: {
        type: String,
        required: [true, 'Los nombres son necesarios']
    },
    apellidos: {
        type: String,
        required: [true, 'Los apellidos son necesarios']
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    }
});
usuarioSchema.method('compararpassword', function (password = '') {
    if (bcrypt_1.compareSync(password, this.password)) {
        return true;
    }
    else {
        return false;
    }
});
exports.Usuario = mongoose_1.model('Usuario', usuarioSchema);
