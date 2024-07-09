const fs = require('fs');
const path = require('path');

// Função para formatar a data no padrão brasileiro
function formatarData(dataArray) {
    if (!dataArray || dataArray.length < 3) {
        return 'Data inválida';
    }
    const ano = dataArray[0];
    const mes = String(dataArray[1]).padStart(2, '0');
    const dia = String(dataArray[2]).padStart(2, '0');
    return `${dia}/${mes}/${ano}`;
}

// Diretório onde estão os arquivos JSON
const pasta = './json'; // Altere para o caminho correto da sua pasta

// Lê o diretório e processa cada arquivo JSON
fs.readdir(pasta, (err, files) => {
    if (err) {
        console.error('Erro ao ler o diretório:', err);
        return;
    }

    const resultados = files
        .filter(file => path.extname(file) === '.json')
        .map(file => {
            const filePath = path.join(pasta, file);
            try {
                const data = fs.readFileSync(filePath, 'utf8');
                const json = JSON.parse(data);
                const nomeCliente = json.pedido.cliente.nome || 'Nome não disponível';
                const dataPedido = formatarData(json.data);
                const valorTotal = json.pedido.vlrTotal || 'Valor não disponível';
                return `${nomeCliente}, ${dataPedido}, ${valorTotal}`;
            } catch (e) {
                console.error(`Erro ao processar o arquivo ${file}:`, e);
                return `Erro ao processar o arquivo ${file}`;
            }
        });

    // Salva os resultados em um arquivo TXT
    const resultadoTxt = resultados.join('\n');
    fs.writeFileSync('resultados.txt', resultadoTxt, 'utf8');

    console.log('Dados extraídos e salvos em resultados.txt');
});
