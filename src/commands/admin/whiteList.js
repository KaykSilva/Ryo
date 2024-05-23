const { SlashCommandBuilder } = require("discord.js");
const writeId = require("../../controllers/saveWhiteList");
const fs = require('fs');
const path = require('path');

const idPath = path.join(__dirname, "../../database/usersWhiteList/usersId.json");

function loadWhiteUsers() {
    try {
        if (!fs.existsSync(idPath)) {
            return [];
        }
        const rawdata = fs.readFileSync(idPath, 'utf-8');
        const data = JSON.parse(rawdata);
        return data.whiteUsers || [];
    } catch (err) {
        console.error("Erro ao carregar whiteUsers:", err);
        return [];
    }
}

const ownerId = "783914991006253087";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("whitelist")
        .setDescription("Adiciona administrador ao servidor do mine")
        .addUserOption(option => 
            option
                .setName("mencionar")
                .setDescription("Mencione o membro")
                .setRequired(true)
        ),
    async execute(interaction) {
        const whiteUsers = loadWhiteUsers();
        
        if (whiteUsers.includes(interaction.user.id) || interaction.user.id === ownerId) {
            const user = interaction.options.getUser('mencionar');
            const userId = user.id;
            const username = user.username;

            console.log(username);
            writeId(userId);
            await interaction.reply({ content: `${user.username} foi adicionado como admin do server` });
        } else {
            await interaction.reply(`<@${interaction.user.id}> Você tem permissão para isso? Não. Então para de me fazer perder tempo!`);
        }
    }
};
