const fs = require('fs');
const path = require('path');

// Define the path to the bannersData.json file
const bannerFile = path.resolve(__dirname, '../../../database/banners/bannersData.json');
const bannerDir = path.dirname(bannerFile);

function loadBannerData() {
    try {
        if (!fs.existsSync(bannerFile)) {
            fs.writeFileSync(bannerFile, '{}');
            console.log('Arquivo criado com sucesso:', bannerFile);
        }
        
        const rawdata = fs.readFileSync(bannerFile, 'utf-8');
        if (rawdata.trim() === '') {
            console.log('Arquivo banner.json vazio. Conteúdo inicial adicionado.');
            return {};
        }
        
        return JSON.parse(rawdata);
    } catch (error) {
        console.error('Erro ao carregar dados de banner:', error);
        return {};
    }
}

function saveBanner(bannerData) {
    try {
        console.log('Salvando dados de banner no arquivo:', bannerFile);
        fs.writeFileSync(bannerFile, JSON.stringify(bannerData, null, 2));
        console.log('Dados salvos com sucesso:', bannerFile);
    } catch (error) {
        console.error(`Erro ao salvar dados no arquivo ${bannerFile}:`, error);
    }
}

function addBio(userId, value) {
    const bannerData = loadBannerData();
    if (!bannerData[userId]) {
        bannerData[userId] = { bannerConfig: {} };
    }
    bannerData[userId].bannerConfig.bio = value;
    saveBanner(bannerData);
    console.log(`bio adicionada para o usuário ${userId}`);
}

function writeBannerNumber(userId, bannerNumber) {
    const bannerData = loadBannerData();
    if (!bannerData[userId]) {
        bannerData[userId] = { bannerConfig: {} };
    }
    bannerData[userId].bannerConfig.bannerNumber = bannerNumber;
    saveBanner(bannerData);
    console.log(`banner adicionado para o usuário ${userId}`);
}
function writeColorNumber(userId, colorNumber) {
    const bannerData = loadBannerData();
    if (!bannerData[userId]) {
        bannerData[userId] = { bannerConfig: {} };
    }
    bannerData[userId].bannerConfig.colorNumber = colorNumber;
    saveBanner(bannerData);
    console.log(`banner adicionado para o usuário ${userId}`);
}

function writeBanner(userId, bannerLink) {
    const bannerData = loadBannerData();
    if (!bannerData[userId]) {
        bannerData[userId] = { bannerConfig: {} };
    }
    
    // Find the next available banner link ID
    let linkId = 0;
    while (bannerData[userId].bannerConfig[`bannerLink${linkId}`]) {
        linkId++;
    }
    
    // Assign the banner link to the next available ID
    bannerData[userId].bannerConfig[`bannerLink${linkId}`] = bannerLink;
    
    saveBanner(bannerData);
    console.log(`banner adicionado para o usuário ${userId}`);
}

function getBannerConfig(userId) {
    const bannerData = loadBannerData();
    return bannerData[userId]?.bannerConfig || {};
}

function getBio(userId) {
    const bannerConfig = getBannerConfig(userId);
    return bannerConfig.bio || '';
}

function getBannerLink(userId, bannerCount) {
    const bannerConfig = getBannerConfig(userId);
    return bannerConfig[`bannerLink${bannerCount}`] || '';
}

function getBannerNumber(userId) {
    const bannerConfig = getBannerConfig(userId);
    return bannerConfig.bannerNumber || 0;
}
function getColorNumber(userId) {
    const bannerConfig = getBannerConfig(userId);
    return bannerConfig.colorNumber || 0;
}

module.exports = {
    saveBanner,
    addBio,
    writeBannerNumber,
    writeBanner,
    getBannerLink,
    getBio,
    writeColorNumber,
    getBannerNumber,
    getColorNumber
};
