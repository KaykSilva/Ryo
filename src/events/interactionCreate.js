const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Verifica se a interação é um comando de chat
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'Erro ao executar o comando!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'Erro ao executar o comando!', ephemeral: true });
                }
            }
        }

        // Verifica se a interação é um botão
        else if (interaction.isButton()) {
            if (interaction.customId === 'viewProfile') {
                const profileCommand = interaction.client.commands.get('perfil');
                if (profileCommand) {
                    try {
                        await profileCommand.execute(interaction);
                    } catch (error) {
                        console.error('Erro ao executar o comando de perfil pelo botão:', error);
                        if (interaction.replied || interaction.deferred) {
                            await interaction.followUp({ content: 'Erro ao processar sua solicitação!', ephemeral: true });
                        } else {
                            await interaction.reply({ content: 'Erro ao processar sua solicitação!', ephemeral: true });
                        }
                    }
                } else {
                    console.error('Comando de perfil não encontrado.');
                }
            }
			
            if (interaction.customId === 'changeBannerButton') {
                const profileCommand = interaction.client.commands.get('personalizar');
                if (profileCommand) {
                    try {
                        await profileCommand.execute(interaction);
                    } catch (error) {
                        console.error('Erro ao executar o comando de perfil pelo botão:', error);
                        if (interaction.replied || interaction.deferred) {
                            await interaction.followUp({ content: 'Erro ao processar sua solicitação!', ephemeral: true });
                        } else {
                            await interaction.reply({ content: 'Erro ao processar sua solicitação!', ephemeral: true });
                        }
                    }
                } else {
                    console.error('Comando de perfil não encontrado.');
                }
            }
        }
    },
};
