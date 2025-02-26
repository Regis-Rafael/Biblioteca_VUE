const express = require("express");
const router = express.Router();
const { adicionarLivro, removerLivro, buscarLivro, listarLivros } = require("./controllers");

router.post("/livros", adicionarLivro);
router.delete("/livros/:codigo", removerLivro);
router.get("/livros/:codigo", buscarLivro);
router.get("/livros", listarLivros);

module.exports = router;
