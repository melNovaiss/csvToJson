const fs = require('fs');
const csv = require('csv-parser');

function processCSV(filePath) {
    const results = [];

    // Ler o arquivo CSV e processar cada linha
    fs.createReadStream(filePath)
        .pipe(csv({ headers: false }))
        .on('data', (row) => {
            try {
                const jsonString = row[0]; // Assume que todo o conteúdo JSON está na primeira coluna
                const data = JSON.parse(jsonString);

                // Verificar se o cliente é null
                if (data.pedido.cliente === null) {
                    console.log(`Linha ignorada: cliente é null.`);
                    return;
                }

                // Nome do arquivo JSON
                const fileName = `${data.id}.json`;

                // Escrever o arquivo JSON
                fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
                console.log(`Arquivo ${fileName} criado com sucesso.`);
            } catch (error) {
                console.error(`Erro ao processar a linha:`, error);
            }
        })
        .on('end', () => {
            console.log('Processamento do CSV concluído.');
        });
}

// Chamar a função com o caminho do arquivo CSV
processCSV('vendas.csv');
