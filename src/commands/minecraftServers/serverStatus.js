const { SlashCommandBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const api = require('../../services/minecraftApi');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("status")
        .setDescription("Mostra o status do nosso servidor de mine"),

    async execute(interaction) {
        try {
            // Busca informações do servidor
            const serverInfo = await api.get();
            
            // Verifica se os dados esperados estão presentes
            const status = serverInfo.data.online === true ? '*Online*' : '*Offline*';
            const ip = serverInfo.data.ip || 'aftergang.cloud';
            const version = serverInfo.data.server.name || 'Servidor offline';
            const playerOnline = serverInfo.data.online ? "Jogadores online" : "Servidor Offline";
            const playersOnline = serverInfo.data.players?.now ?? 'Desconhecido';
            const playersMax = serverInfo.data.players?.max ?? 'Desconhecido';
            const userIcon = interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
            const embedColor = serverInfo.data.online === true ? "#00ff22" : "#eb0004";

            let playerList = '';
            if (serverInfo.data.players.sample && serverInfo.data.players.sample.length > 0) {
                playerList = serverInfo.data.players.sample.map(player => `${player.name}`).join('\n');
            } else {
                playerList = 'Nenhum jogador conectado';
            }

            const viewerPlayerList = new ButtonBuilder()
                .setCustomId("playerList")
                .setLabel("Listar jogadores")
                .setStyle(ButtonStyle.Secondary);

            // Cria um embed com informações dinâmicas do servidor
            const serverEmbed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle(`Olá ${interaction.user.tag}`)
                .setDescription(`Status do servidor: *${status}*`)
                .setThumbnail(userIcon)
                .addFields(
                    { name: 'Ip do servidor', value: ip, inline: true },
                    { name: 'Versão', value: version, inline: true },
                    { name: playerOnline, value: `${playersOnline}/${playersMax}`, inline: true },
                    { name: 'Lista de Jogadores Online', value: `*${playerList}*` }
                )
                .setTimestamp();

            // Envia o embed como resposta à interação
            await interaction.reply({ embeds: [serverEmbed]});

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Ocorreu um erro ao buscar as informações do servidor. Por favor, tente novamente mais tarde.', ephemeral: true });
        }
    }
}
