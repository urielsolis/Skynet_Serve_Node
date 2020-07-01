import { Router, Request, Response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { Post } from '../models/post.model';
import { FileUpload } from '../intefaces/file-upload';
import FileSystem from '../clases/file-system';


const postRoutes = Router();
const fileSystem = new FileSystem();

//Crear Post
postRoutes.post('/create', [ verificaToken ] , ( req:any, res: Response ) => {

    const body = req.body;
    body.usuario = req.usuario._id;

    const imagenes = fileSystem.imagenesDeTempHaciaPost( req.usuario._id );

    body.img = imagenes;

    Post.create( body ).then( async PostDB =>{

        await PostDB.populate('usuario', '-password').execPopulate();

        res.json({
            ok:true,
            body: PostDB
        });
    }).catch( err =>{
        res.json( err );
    });

    
});

//Obtener Post
postRoutes.get('/index', [ verificaToken ] , async ( req:any, res: Response ) => {

    const body = req.body;

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;

    const post = await Post.find()
                           .sort({ _id: -1 })
                           .skip( skip )
                           .limit( 10 )
                           .populate('usuario','-password')
                           .exec();
    res.json({
        ok:true,
        pagina,
        post
    })
});

//Subir Archivos
postRoutes.post('/upload', [ verificaToken ] ,async ( req: any, res: Response )  => {

    if( !req.files ){
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }

    const file: FileUpload =  req.files.image;

    if( !file ){
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo -image'
        });
    }

    if( !file.mimetype.includes('image') ){
        return res.status(400).json({
            ok: false,
            mensaje: 'Lo que subio no es una imagen'
        });
    }

    await fileSystem.guardarImagenTemporal( file, req.usuario._id );

    res.json({
        ok: true,
        file: file.mimetype
    });

});

//Traer Imagen
postRoutes.get('/imagen/:img', [ verificaToken ] ,async ( req: any, res: Response )  => {
    const userId = req.usuario._id;
    const img = req.params.img;

    const pathphoto = fileSystem.getFotoUrl( userId, img );

    res.sendFile( pathphoto );
});




export default postRoutes;