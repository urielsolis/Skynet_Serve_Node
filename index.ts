import Server from './clases/server';
import mongoose from 'mongoose';

import cors from 'cors';

import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

import userRoutes from './routes/usuario';
import postRoutes from './routes/post';


const server = new Server();

//body Parser
server.app.use( bodyParser.urlencoded({ extended: true }));
server.app.use( bodyParser.json());

//FileUpload
server.app.use( fileUpload({ useTempFiles: true }) );

//Configurar Cors
// server.app.use( cors({ origin: true, credentials: true }) );
server.app.use( cors({ origin: '*'}) );

//Rutas de mi app 
server.app.use('/user', userRoutes);
server.app.use('/post', postRoutes);

//Conectar a la DB
mongoose.connect('mongodb://localhost:27017/skynet',
                { useNewUrlParser: true, useCreateIndex: true}, ( err ) => {
    if( err ) throw err;
    console.log('base de datos online');
})

//Levantar Express
server.start( () =>{
    console.log(`servidor corriendo en el puerto ${ server.port }`);
});