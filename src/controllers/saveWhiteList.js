const fs = require('fs');
const path = require('path');

const idPath = path.join(__dirname, "../database/usersWhiteList/usersId.json");

function loadFile() {
    try {
        if (!fs.existsSync(idPath)) {
            fs.writeFileSync(idPath, JSON.stringify({ whiteUsers: [] }, null, 2));
            console.log("Arquivo criado com sucesso");
        }

        const rawdata = fs.readFileSync(idPath, 'utf-8');
        if (rawdata.trim() === '') {
            console.log("Arquivo vazio. Estrutura inicial criada");
            return { whiteUsers: [] };
        }

        return JSON.parse(rawdata);
    } catch (err) {
        console.error("Erro ao carregar ids:", err);
        return { whiteUsers: [] };
    }
}

function saveFile(data) {
    try {
        console.log('Salvando dados no arquivo:', idPath);
        fs.writeFileSync(idPath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`Erro ao salvar dados no arquivo ${idPath}:`, err);
    }
}

function writeId(userId) {
    if (!userId) {
        console.error("ID de usuário inválido");
        return;
    }
    const data = loadFile();
    if (!data.whiteUsers.includes(userId)) {
        data.whiteUsers.push(userId);
        saveFile(data);
        console.log(`Usuário adicionado à lista de gerente do server: ${userId}`);
    } else {
        console.log(`Usuário ${userId} já está na lista`);
    }
}

module.exports = writeId;
