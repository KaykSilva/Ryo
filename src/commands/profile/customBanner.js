const { SlashCommandBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder } = require("discord.js");
const bannerManager = require("../../controllers/handlers/banners/bannerManager");
const colorManager = require("../../controllers/handlers/banners/colorManager");
const defaultBanner = "https://i.pinimg.com/564x/00/44/de/0044de6a836273e0a51376bc5c1c7488.jpg";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('personalizar')
        .setDescription("🎨 Central de personalização do perfil."),
    async execute(interaction) {
        try {
            const target = interaction.user.id;
            let bannerNumber = 0;
            let bannerLink = bannerManager.getBannerLink(target, bannerNumber) || defaultBanner;
            console.log('Banner Link:', bannerLink);

            const changeBanner = new ButtonBuilder()
                .setCustomId("changeBannerButton")
                .setLabel("🔁 Mudar Banner")
                .setStyle(ButtonStyle.Primary);

            const changeColor = new ButtonBuilder()
                .setCustomId("changeColor")
                .setLabel("🎨 Esquema de cores")
                .setStyle(ButtonStyle.Secondary);

            const viewProfile = new ButtonBuilder()
                .setCustomId("viewProfile")
                .setLabel(`✨ Veja seu lindo perfil`)
                .setStyle(ButtonStyle.Secondary);

            const row = new ActionRowBuilder()
                .addComponents(viewProfile, changeBanner, changeColor);

            const nextButton = new ButtonBuilder()
                .setCustomId("nextButton")
                .setLabel("▶️")
                .setStyle(ButtonStyle.Secondary);

            const backButton = new ButtonBuilder()
                .setCustomId("backButton")
                .setLabel("◀️")
                .setStyle(ButtonStyle.Secondary);

            const setBanner = new ButtonBuilder()
                .setCustomId("setBanner")
                .setLabel("✔️ Definir banner.")
                .setStyle(ButtonStyle.Secondary);

            const navigateButtons = new ActionRowBuilder()
                .addComponents(backButton, nextButton, setBanner);

            const colors = new StringSelectMenuBuilder()
                .setCustomId('colorMenu')
                .setPlaceholder('Selecione uma cor')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Azul')
                        .setDescription('Deixe seu perfil azul')
                        .setValue("1"),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Vermelho')
                        .setDescription('Deixe seu perfil vermelho')
                        .setValue("2"),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Roxo')
                        .setDescription('Deixe seu perfil roxo')
                        .setValue("3"),
                );

            const selectColors = new ActionRowBuilder()
                .addComponents(colors);

            const embed = new EmbedBuilder()
                .setDescription(`Olá <@${target}>, esse é o menu de customização. Escolha sua opção abaixo.`)
                .setImage(bannerLink);

            await interaction.reply({
                embeds: [embed],
                components: [row]
            });

            const collectorFilter = i => i.user.id === target;
            const collector = interaction.channel.createMessageComponentCollector({ filter: collectorFilter, time: 60000 });

            collector.on('collect', async i => {
                try {
                    if (i.customId === 'changeBannerButton') {
                        const embed = new EmbedBuilder()
                            .setDescription("Estes são seus banners")
                            .setImage(bannerLink);

                        await i.update({ embeds: [embed], components: [navigateButtons] });

                    } else if (i.customId === 'nextButton') {
                        const embed = new EmbedBuilder()
                            .setDescription("Estes são seus banners")
                            .setImage(bannerLink);
                            
                        if (nextBanner()){
                            await i.update({ embeds: [embed], components: [navigateButtons] });
                        } else {
                                await i.update({ content:"*<:ryo2:1269695982963003492> Você não possui banners. Utlize /Loja para comprar mais.*"});
                        }
                        

                    } else if (i.customId === 'backButton') {
                        backBanner();
                        const embed = new EmbedBuilder()
                            .setDescription("Estes são seus banners")
                            .setImage(bannerLink);

                        await i.update({ embeds: [embed], components: [navigateButtons] });

                    } else if (i.customId === 'setBanner') {
                        setNewBanner();
                        await i.update({ content: `Banner definido para o número ${bannerNumber}.`, components: [] });

                    } else if (i.customId === 'changeColor') {
                        await i.update({ content: `Escolha uma cor para seu perfil 🙂`, components: [selectColors] });

                    } else if (i.customId === 'colorMenu') {
                        const selectedColor = parseInt(i.values[0], 10);
                        bannerManager.writeColorNumber(target, selectedColor);
                        await i.update({ content: `Cor atualizada com sucesso <:ryo:1269693780194496542> `, components: [navigateButtons], files: [] });
                    }
                } catch (error) {
                    console.error('Erro ao processar interação:', error);
                    await i.followUp({ content: 'Houve um erro ao processar sua solicitação.', ephemeral: true });
                }
            });

            collector.on('end', collected => {
                console.log(`Coletor terminado. ${collected.size} interações coletadas.`);
            });

            function nextBanner() {
                bannerNumber += 1;
                bannerLink = bannerManager.getBannerLink(target, bannerNumber);
                
                if(bannerLink === '') {
                    return false;
                }
                return true;
            }

            function backBanner() {
                bannerNumber -= 1;
                bannerLink = bannerManager.getBannerLink(target, bannerNumber);
            }

            function setNewBanner() {
                bannerManager.writeBannerNumber(target, bannerNumber);
            }
        } catch (error) {
            console.error('Erro ao processar interação:', error);
            await interaction.followUp({ content: 'Houve um erro ao processar sua solicitação.', ephemeral: true });
        }
    }
};
