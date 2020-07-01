import { Schema, Document, model } from 'mongoose';

const postSchema = new Schema({

    created: {
        type: Date,
    },
    mensaje: {
        type: String
    },
    img: [{
        type: String
    }],
    coords: {
        type: String
    },
    reaccion:{
        type: Number,
        default: 0
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [ true, 'Debe existir una referencia a un usuario' ]
    }
});

postSchema.pre<IPost>('save', function( next ){
    this.created = new Date();
    next();
});

interface IPost extends Document{
    created: Date;
    mensaje: String;
    img: String[];
    coords: string;
    usuario: String;
}

export const Post = model<IPost>('Post', postSchema);
