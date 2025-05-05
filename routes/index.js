const express = require('express');
const router = express.Router();
const Posts = require('../posts.js');

// ROTA PRINCIPAL - Home
router.get('/', async (req, res, next) => {
    try {
        const busca = req.query.busca;


        if (!busca || busca.trim() === '') {
            const posts = await Posts.find()
                .sort({ createdAt: -1 }) 
                .limit(5); 

            res.render('home', { posts });
        } else {
           
            res.redirect(`/busca?busca=${encodeURIComponent(busca)}`);
        }
    } catch (err) {
        next(err);
    }
});

//ROTA DE BUSCA - /busca

router.get('/busca', async (req, res, next) => {
    const busca = req.query.busca || '';
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

//ROTA DE POST ÚNICO - /:slug
router.get('/:slug', async (req, res, next) => {
    try {
        const slugParam = req.params.slug;

        //Faz a busca de forma case-insensitive
        const post = await Posts.findOne({ slug: new RegExp(`^${slugParam}$`, 'i') });

        if (post) {
            res.render('pages/single', { post });
        } else {
            res.status(404).render('404', { mensagem: 'Notícia não encontrada' });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;
