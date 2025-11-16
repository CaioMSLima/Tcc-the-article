const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/artigos.json');

// 🔹 Função auxiliar pra ler o arquivo
function lerArtigos() {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

// 🔹 Função auxiliar pra salvar (se quiser usar POST/DELETE)
function salvarArtigos(artigos) {
  fs.writeFileSync(filePath, JSON.stringify(artigos, null, 2));
}


exports.listarArtigos = (req, res) => {
  const artigos = lerArtigos();
  res.json(artigos);
};


exports.buscarArtigo = (req, res) => {
  const artigos = lerArtigos();
  const artigo = artigos.find(a => a.id == req.params.id);
  if (!artigo) return res.status(404).json({ mensagem: 'Artigo não encontrado' });

  artigo.views = (artigo.views || 0) + 1;
  salvarArtigos(artigos);

  res.json(artigo);
};


exports.curtirArtigo = (req, res) => {
  const artigos = lerArtigos();
  const artigo = artigos.find(a => a.id == Number(req.params.id));
  artigo.likes++;
  salvarArtigos(artigos);
  res.json({ likes: artigo.likes, curtido: true });
};

exports.removerLike = (req, res) => {
  const artigos = lerArtigos();
  const artigo = artigos.find(a => a.id == req.params.id);
  artigo.likes = Math.max(0, artigo.likes - 1);
  salvarArtigos(artigos);
  res.json({ likes: artigo.likes, curtido: false });
};


exports.criarArtigo = (req, res) => {
  const artigos = lerArtigos();
  let { titulo, conteudo, categoria } = req.body;

  if (!titulo) {
    return res.status(400).json({ mensagem: 'Título é obrigatório' });
  }

  if (typeof conteudo === 'string') {
    conteudo = conteudo.split(/\r?\n+/).filter(p => p.trim() !== '');
  }
  const dataAtual = new Date();
const dataFormatada = dataAtual.toLocaleDateString('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});

  const novoArtigo = {
    id: artigos.length ? artigos[artigos.length - 1].id + 1 : 1,
    titulo,
    conteudo: Array.isArray(conteudo) ? conteudo : [],
    dataPublicacao: new Date().toLocaleDateString('pt-BR'),
    views: 0,
    likes: 0,
    categoria: categoria || 'Geral',
    comentarios: []
  };

  artigos.push(novoArtigo);
  salvarArtigos(artigos);

  res.status(201).json({ mensagem: 'Artigo criado com sucesso', artigo: novoArtigo });
};



exports.deletarArtigo = (req, res) => {
  let artigos = lerArtigos();
  artigos = artigos.filter(a => a.id != req.params.id);
  salvarArtigos(artigos);
  res.json({ mensagem: 'Artigo removido com sucesso' });
};


exports.sobre = (req, res) => {
  const filePath = path.join(__dirname, '../data/sobre.json');
  const data = fs.readFileSync(filePath, 'utf8');
  const sobre = JSON.parse(data);
  res.json(sobre);
}

exports.atualizarArtigo = (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(__dirname, '../data/artigos.json');

  // Lê os artigos existentes
  const data = fs.readFileSync(filePath, 'utf8');
  const artigos = JSON.parse(data);

  const { id } = req.params;
  let { titulo, conteudo, categoria } = req.body;

  const index = artigos.findIndex(a => a.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ mensagem: 'Artigo não encontrado' });
  }

  // Atualiza título
  if (titulo) artigos[index].titulo = titulo;

  // 🔹 converte string para array de parágrafos, se necessário
  if (typeof conteudo === 'string') {
    conteudo = conteudo.split(/\r?\n+/).filter(p => p.trim() !== '');
  }

  if (Array.isArray(conteudo)) {
    artigos[index].conteudo = conteudo;
  }

 if (categoria) artigos[index].categoria = categoria;


  // Salva o JSON atualizado
  fs.writeFileSync(filePath, JSON.stringify(artigos, null, 2));

  res.json({
    mensagem: 'Artigo atualizado com sucesso',
    artigo: artigos[index]
  });
};

exports.adicionarComentario = (req, res) => {
  let artigos = lerArtigos();
  let artigo = artigos.find(a => a.id == req.params.id);
  if (!artigo) return res.status(404).json({ mensagem: 'Artigo não encontrado' });
  artigo.comentarios;
  const { autor, texto } = req.body;
  if (!texto) return res.status(400).json({ mensagem: 'Comentário vazio'});

  const comentario = {
    id: artigo.comentarios && artigo.comentarios.length ? artigo.comentarios[artigo.comentarios.length - 1].id + 1 : 1,
    autor: autor || 'Anônimo',
    texto: texto,
    data: new Date().toLocaleString('pt-BR')
  };

  if (artigo.comentarios) {
    artigo.comentarios.push(comentario);
  } else {
    artigo.comentarios = [comentario];
  }
 
  salvarArtigos(artigos);

  res.status(201).json({ mensagem: 'Comentário adicionado', comentario });
};

exports.deletarComentario = (req, res) => {
  let artigos = lerArtigos();

  const idArtigo = req.params.id;
  const idComentario = req.body.idComentario;

  let artigo = artigos.find(a => a.id == idArtigo);
  if (!artigo) {
    return res.status(404).json({ erro: 'Não foi possível, deletar o comentário'});
  }

  const comentarioExiste = artigo.comentarios.some(c => c.id == idComentario);
  if (!comentarioExiste) {
    return res.status(404).json({ erro: 'Comentário não encontrado' });
  }

  artigo.comentarios = artigo.comentarios.filter(c => c.id != idComentario);

  salvarArtigos(artigos);

  res.json({ mensagem: 'Comentário removido com sucesso',comentarios: artigo.comentarios});
};
