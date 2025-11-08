const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/artigos.json');

function lerArtigos() {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

function salvarArtigos(artigos) {
  fs.writeFileSync(filePath, JSON.stringify(artigos, null, 2));
}

module.exports = {
  lerArtigos,
  salvarArtigos
};