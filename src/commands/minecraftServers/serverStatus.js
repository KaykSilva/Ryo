const { SlashCommandBuilder } = require('discord.js');
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
            const status = serverInfo.status ? '*Online*' : '*Offline*';
            const ip = serverInfo.data.ip || 'Desconhecido';
            const version = serverInfo.data.server.name || 'Desconhecida';
            const playersOnline = serverInfo.data.players?.now ?? 'Desconhecido';
            const playersMax = serverInfo.data.players?.max ?? 'Desconhecido';
            const icon = serverInfo.data.icon || 'https://i.imgur.com/AfFp7pu.png';
            const userIcon = interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });

            console.log()
            let playerList = '';
            if (serverInfo.data.players.sample && serverInfo.data.players.sample.length > 0) {
                playerList = serverInfo.data.players.sample.map(player => `${player.name}`).join('\n');
                console.log(playerList)
            } else {
                playerList = 'Nenhum jogador online';
            }
            

            // Cria um embed com informações dinâmicas do servidor
            const serverEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`Olá ${interaction.user.tag}`)
                .setDescription(`Status do servidor: *${status}*`)
                .setThumbnail(userIcon)
                .addFields(
                    { name: 'Ip do servidor', value: ip, inline: true },
                    { name: 'Versão', value: version, inline: true },
                    { name: 'Jogadores Online', value: `${playersOnline}/${playersMax}`, inline: true },
                    { name: 'Lista de Jogadores Online', value: playerList }
                )
                .setTimestamp()


            // Envia o embed como resposta à interação
            await interaction.reply({ embeds: [serverEmbed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Ocorreu um erro ao buscar as informações do servidor. Por favor, tente novamente mais tarde.', ephemeral: true });
        }
    }
}
