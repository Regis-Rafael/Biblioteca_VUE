let livros = require("./database");

exports.adicionarLivro = (req, res) => {
  let { titulo, autor, anoPublicacao, codigo, disponibilidade } = req.body;

  // Validações básicas
  if (!titulo || !autor || !anoPublicacao || codigo === undefined) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
  }

  codigo = Number(codigo);
  anoPublicacao = Number(anoPublicacao);

  if (isNaN(codigo) || isNaN(anoPublicacao)) {
    return res.status(400).json({ erro: "Código e ano de publicação devem ser numéricos" });
  }

  if (livros.some(l => l.codigo === codigo)) {
    return res.status(400).json({ erro: "Código já existente" });
  }

  disponibilidade = disponibilidade === true || disponibilidade === "true"; // Garante booleano

  livros.push({ titulo: titulo.trim(), autor: autor.trim(), anoPublicacao, codigo, disponibilidade });
  
  res.status(201).json({ mensagem: "Livro adicionado com sucesso" });
};

exports.removerLivro = (req, res) => {
  const codigo = parseInt(req.params.codigo);
  const index = livros.findIndex(l => l.codigo === codigo);

  if (index === -1) {
    return res.status(404).json({ erro: "Livro não encontrado" });
  }

  livros.splice(index, 1);
  res.status(200).json({ mensagem: "Livro removido com sucesso" });
};

exports.buscarLivro = (req, res) => {
  const codigo = parseInt(req.params.codigo);
  const livro = livros.find(l => l.codigo === codigo);

  if (!livro) {
    return res.status(404).json({ erro: "Livro não encontrado" });
  }

  res.json(livro);
};

exports.listarLivros = (req, res) => {
  const { disponivel } = req.query;

  const filtroDisponibilidade = disponivel === "true" ? true : disponivel === "false" ? false : null;

  let resultado = livros;

  if (filtroDisponibilidade !== null) {
    resultado = livros.filter(l => l.disponibilidade === filtroDisponibilidade);
  }

  res.json(resultado);
};
