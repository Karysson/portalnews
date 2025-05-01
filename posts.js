var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PostSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    imagem: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'posts'
});

var Post = mongoose.model('Post', PostSchema);
module.exports = Post;