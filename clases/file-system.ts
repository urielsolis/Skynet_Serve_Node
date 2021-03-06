import { FileUpload } from '../intefaces/file-upload';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {

    constructor(){ };

    guardarImagenTemporal( file: FileUpload, userId: string ) {

        return new Promise( ( resolve, reject ) =>{
            //Crear carpetas 
            const path = this.crearCarpetaUsuario(userId);

            //Nombre archivo
            const nombreArchivo = this.generarNombreUnico( file.name );

            //Mover el archivo del Temp a nuestra carpeta Temp
            file.mv( `${ path }/${ nombreArchivo }`, ( err: any ) => {
                if( err ){
                    reject( err );
                } else {
                    resolve();
                }
            });
        });
    }

    private generarNombreUnico( nombreoriginal: string ){
        const nombreArr = nombreoriginal.split('.');
        const extension = nombreArr[ nombreArr.length - 1 ];

        const idUnico = uniqid();


        return `${ idUnico }.${ extension }`;
    }

    private crearCarpetaUsuario( userId: string ) {

        const pathUser = path.resolve(  __dirname, '../uploads/', userId );
        const pathUserTemp = pathUser + '/temp';

        const existe = fs.existsSync( pathUser );

        if( !existe ) {
            fs.mkdirSync( pathUser );
            fs.mkdirSync( pathUserTemp );
        }

        return pathUserTemp;
    }

    public imagenesDeTempHaciaPost( userId: string ){
        const pathTemp = path.resolve(  __dirname, '../uploads/', userId, 'temp' );
        const pathPosts = path.resolve(  __dirname, '../uploads/', userId, 'posts' );

        if( !fs.existsSync( pathTemp ) ){
            return [];
        }

        if( !fs.existsSync( pathPosts ) ){
            fs.mkdirSync( pathPosts );
        }

        const imagenesTemp = this.obtenerImagenesEnTemp( userId );

        imagenesTemp.forEach( imagen => {
            fs.renameSync( `${ pathTemp }/${ imagen }`, `${ pathPosts }/${ imagen }` );
        });

        return imagenesTemp;

    }

    private obtenerImagenesEnTemp( userId: string ){

        const pathTemp = path.resolve(  __dirname, '../uploads/', userId, 'temp' );

        return fs.readdirSync( pathTemp ) || [];

    }

    getFotoUrl( userId: string, img: string ){
        const pathImg = path.resolve(  __dirname, '../uploads/', userId, 'posts', img );
        if( !fs.existsSync(pathImg) ){
            return path.resolve( __dirname, '../assets/original.jpg' )
        }
        return pathImg;
    }

}

