const express = require('express');
const router = express.Router();
const Posts = require('../posts.js');

// Rota principal (home com carrossel)
router.get('/', async (req, res, next) => {
    try {
        if (!req.query.busca || req.query.busca.trim() === '') {
            const posts = await Posts.find()
                .sort({ createdAt: 1 }) // Ordena por data de criação
                .limit(5); // Limita a 5 notícias para o carrossel
            res.render('home', { posts });
        } else {
            res.redirect('/busca');
        }
    } catch (err) {
        next(err); // Passa o erro para o middleware de erro
    }
});

// Rota de busca
router.get('/busca', async (req, res, next) => {
    const busca = req.query.busca;
    try {
        const posts = await Posts.find({
            $or: [
                { titulo: { $regex: busca, $options: 'i' } },
                { conteudo: { $regex: busca, $options: 'i' } },
            ],
        }).limit(10);
        res.render('busca', { posts, busca });
    } catch (err) {
        next(err);
    }
});

// Rota de post individual
router.get('/:slug', async (req, res, next) => {
    try {
        const post = await Posts.findOne({ slug: req.params.slug });
        if (post) {
            res.render('single', { post });
        } else {
            res.status(404).render('404', { mensagem: 'Notícia não encontrada' });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;