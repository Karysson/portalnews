const mongoose = require('mongoose');
const slugify = require('slugify');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
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
    },
    autor: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    }
});

// Middleware para gerar slug antes de salvar
PostSchema.pre('validate', function (next) {
    if (!this.slug && this.titulo) {
        this.slug = slugify(this.titulo, {
            lower: true,
            strict: true, 
            locale: 'pt'  
        });
    }
    next();
});

module.exports = mongoose.model('Post', PostSchema);
