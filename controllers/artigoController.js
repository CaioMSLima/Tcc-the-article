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
  const artigo = artigos.find(a => a.id == req.params.id);
  if (!artigo) return res.status(404).json({ mensagem: 'Artigo não encontrado' });

  artigo.likes = (artigo.likes || 0) + 1;
  salvarArtigos(artigos);

  res.json({ mensagem: 'Like adicionado', totalLikes: artigo.likes });
};


exports.criarArtigo = (req, res) => {
  const artigos = lerArtigos();
  let { titulo, conteudo } = req.body;

  if (!titulo) {
    return res.status(400).json({ mensagem: 'Título é obrigatório' });
  }

  if (typeof conteudo === 'string') {
    conteudo = conteudo.split(/\r?\n+/).filter(p => p.trim() !== '');
  }

  const novoArtigo = {
    id: artigos.length ? artigos[artigos.length - 1].id + 1 : 1,
    titulo,
    conteudo: Array.isArray(conteudo) ? conteudo : [],
    dataPublicacao: new Date().toLocaleDateString('pt-BR'),
    views: 0,
    likes: 0,
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
  let { titulo, conteudo } = req.body;

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

  // Salva o JSON atualizado
  fs.writeFileSync(filePath, JSON.stringify(artigos, null, 2));

  res.json({
    mensagem: 'Artigo atualizado com sucesso',
    artigo: artigos[index]
  });
};

exports.adicionarComentario = (req, res) => {
  const artigos = lerArtigos();
  const artigo = artigos.find(a => a.id == req.params.id);
  if (!artigo) return res.status(404).json({ mensagem: 'Artigo não encontrado' });

  const { autor, texto } = req.body;
  if (!texto) return res.status(400).json({ mensagem: 'Comentário vazio'});

  const comentario = {
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
