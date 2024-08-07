const fs = require('fs');
const path = require('path');

// Define the path to the colorSchema.json file
const colorFile = path.resolve(__dirname, '../../../database/banners/colorSchema.json');

function loadColorData() {
    try {
        if (!fs.existsSync(colorFile)) {
            const initialData = {
                //azul
                "color1": {
                    "colorConfig": {
                        "colorNumber": 1,
                        "generalColor": "#004fb0",
                        "badgeColor": "#1c60c3"
                    }
                },
                //vermelho
                "color2": {
                    "colorConfig": {
                        "colorNumber": 2,
                        "generalColor": "#a80012",
                        "badgeColor": "#be1121"
                    }
                },
                //roxo
                "color3": {
                    "colorConfig": {
                        "colorNumber": 3,
                        "generalColor": "#a70094",
                        "badgeColor": "#bc01a7"
                    }
                },
                //preto
                "color4": {
                    "colorConfig": {
                        "colorNumber": 3,
                        "generalColor": "#070803",
                        "badgeColor": "#161616"
                    }
                },
                //verde
                "color5": {
                    "colorConfig": {
                        "colorNumber": 3,
                        "generalColor": "#008740",
                        "badgeColor": "#009a51"
                    }
                }
            };
            fs.writeFileSync(colorFile, JSON.stringify(initialData, null, 2));
            console.log('Arquivo criado com sucesso:', colorFile);
        }
        
        const rawdata = fs.readFileSync(colorFile, 'utf-8');
        if (rawdata.trim() === '') {
            console.log('Arquivo colorSchema.json vazio. Conteúdo inicial adicionado.');
            return {};
        }
        
        return JSON.parse(rawdata);
    } catch (error) {
        console.error('Erro ao carregar dados de cor:', error);
        return {};
    }
}

function saveColor(colorData) {
    try {
        console.log('Salvando dados de cor no arquivo:', colorFile);
        fs.writeFileSync(colorFile, JSON.stringify(colorData, null, 2));
        console.log('Dados salvos com sucesso:', colorFile);
    } catch (error) {
        console.error(`Erro ao salvar dados no arquivo ${colorFile}:`, error);
    }
}

function colorNumber(userId, bannerNumber) {
    const colorData = loadColorData();
    if (!colorData[userId]) {
        colorData[userId] = { colorConfig: {} };
    }
    colorData[userId].colorConfig.bannerNumber = bannerNumber;
    saveColor(colorData);
    console.log(`Banner adicionado para o usuário ${userId}`);
}

function getColorConfig(userId) {
    const colorData = loadColorData();
    return colorData[userId]?.colorConfig || {};
}


module.exports = {
    saveColor,
    colorNumber,
    getColorConfig,
};
