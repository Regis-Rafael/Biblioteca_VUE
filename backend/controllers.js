let livros = require("./database");

//Adicionar livro
exports.adicionarLivro = (req, res) => {
  let { titulo, autor, anoPublicacao, codigo, disponibilidade } = req.body;

  // Obrigando a preencher todos os campos
  if (!titulo || !autor || !anoPublicacao || codigo === undefined) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
  }

  codigo = Number(codigo);
  anoPublicacao = Number(anoPublicacao);
  disponibilidade = disponibilidade === true || disponibilidade === "true";

  // Adiciona o novo livro a lista
  livros.push({ titulo: titulo.trim(), autor: autor.trim(), anoPublicacao, codigo, disponibilidade });
  
  res.status(201).json({ mensagem: "Livro adicionado com sucesso" });
};

// Remover o livro pelo codigo
exports.removerLivro = (req, res) => {
  const codigo = parseInt(req.params.codigo);
  const index = livros.findIndex(l => l.codigo === codigo);

  // Ve se o livro existe
  if (index === -1) {
    return res.status(404).json({ erro: "Livro não encontrado" });
  }

  // Remove o livro
  livros.splice(index, 1);
  res.status(200).json({ mensagem: "Livro removido com sucesso" });
};

// Buscar o livro pelo código
exports.buscarLivro = (req, res) => {
  const codigo = parseInt(req.params.codigo);
  const livro = livros.find(l => l.codigo === codigo);

  if (!livro) {
    return res.status(404).json({ erro: "Livro não encontrado" });
  }

  res.json(livro);
};

// Listar todos os livros
exports.listarLivros = (req, res) => {
  const { disponivel } = req.query;

  const filtroDisponibilidade = disponivel === "true" ? true : disponivel === "false" ? false : null;

  let resultado = livros;

  if (filtroDisponibilidade !== null) {
    resultado = livros.filter(l => l.disponibilidade === filtroDisponibilidade);
  }

  res.json(resultado);
};