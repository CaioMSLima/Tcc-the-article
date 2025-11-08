const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const controller = require('../controllers/artigoController');

// Rota para obter informações sobre
router.get('/info/sobre',controller.sobre);
// Listar todos
router.get('/', controller.listarArtigos);

// Buscar por ID
router.get('/:id', controller.buscarArtigo);

// Criar novo artigo
router.post('/', controller.criarArtigo);

// 🔹 Atualizar artigo existente
router.put('/:id', controller.atualizarArtigo);

// Deletar artigo
router.delete('/:id', controller.deletarArtigo);

//like no artigo
router.put('/:id/like', controller.curtirArtigo);

//comertar artigo
router.post('/:id/comentarios', controller.adicionarComentario);

module.exports = router;
