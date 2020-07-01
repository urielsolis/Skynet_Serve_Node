import { Router, Request, Response, response } from "express";
import { Usuario } from '../models/usuario.model';
import { hashSync } from 'bcrypt';
import Token from '../clases/token';
import { verificaToken } from '../middlewares/autenticacion';


const userRoutes = Router();

//login usuario
userRoutes.post('/login', ( req: Request, res: Response) => {
    const body = req.body;

    Usuario.findOne({ email: body.email }, ( err, userDB ) =>{
        if( err ) throw err;

        if( !userDB ){
            return res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos'
            });
        }

        if( userDB.compararpassword( body.password ) ){
            const tokenuser = Token.getJwtToken( { 
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
        }else{
            return res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos *** '
            });
        }
    });
});

//crear usuario
userRoutes.post('/create', ( req: Request, res: Response ) => {
    const body = req.body;
    const user = {
        nombre_usuario: body.nombre_usuario,
        nombres: body.nombres,
        apellidos: body.apellidos,
        avatar: body.avatar,
        email: body.email,
        password: hashSync( req.body.password, 10)
    }

    Usuario.create( user ).then( userDB => {
        const tokenuser = Token.getJwtToken( { 
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
    }).catch( err => {
        res.json({
            ok: false,
            mensage: 'error',
            err
        })
    });
});

//Actualizar usuario
userRoutes.post('/update', verificaToken, ( req: any, res: Response ) => {
    const body = req.body;
    const uss = req.usuario;
    const user = {
        nombre_usuario: body.nombre_usuario || uss.nombre_usuario,
        email: body.email || uss.email,
        avatar: body.avatar || uss.avatar,
        nombres: body.nombres || uss.nombres,
        apellidos: body.apellidos || uss.apellidos
    }

    Usuario.findByIdAndUpdate( req.usuario._id, user, {new: true}, ( err, userDB ) =>{
        if( err ) throw err;
        if( !userDB ){
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con este token'
            });
        }
        const tokenuser = Token.getJwtToken( { 
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
userRoutes.get('/', [ verificaToken ], ( req: any, res: Response ) => {

    const usuario = req.usuario;


    res.json({
        ok: true,
        usuario
    });

});


export default userRoutes;