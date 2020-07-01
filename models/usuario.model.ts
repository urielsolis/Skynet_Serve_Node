
import { Schema, model, Document } from 'mongoose';
import { compareSync } from 'bcrypt';


const usuarioSchema = new Schema({
    nombre_usuario:{
        type: String,
        required: [ true, 'El nombre de usuario es necesario' ]
    },
    nombres:{
        type: String,
        required: [ true, 'Los nombres son necesarios' ]
    },
    apellidos:{
        type: String,
        required: [ true, 'Los apellidos son necesarios' ]
    },
    avatar:{
        type: String,
        default: 'av-1.png'
    },
    email:{
        type: String,
        unique: true,
        required: [ true, 'El correo es necesario' ]
    },
    password:{
        type: String,
        required: [ true, 'La contraseña es necesaria' ]
    }
});

usuarioSchema.method('compararpassword', function( password: string = ''): boolean{
    if( compareSync(password, this.password) ){
        return true;
    } else {
        return false;
    }
});

interface Iusuario extends Document{
    nombre_usuario: string,
    nombres: string,
    apellidos: string,
    avatar: string,
    email: string,
    password: string

    compararpassword( password:string ): boolean;
}

export const Usuario = model<Iusuario>( 'Usuario', usuarioSchema );