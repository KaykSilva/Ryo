const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");
const storeManager = require("../../controllers/handlers/store/storeManager");
const bannerManager = require("../../controllers/handlers/banners/bannerManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loja")
        .setDescription("🏪 Loja, veja os novos items para comprar"),
    async execute(interaction) {
        const userId = interaction.user.id;
        let bannerNumber = 0;
        let bannerLink = storeManager.getBannerLink(bannerNumber);
        let bannerName = storeManager.getBannerName(bannerNumber);
        let bannerValue = storeManager.getBannerValue(bannerNumber);
        
        //temporary
        const ryoCoins = 1000;

        const nextButton = new ButtonBuilder()
            .setCustomId("nextButton")
            .setLabel("▶️")
            .setStyle(ButtonStyle.Secondary);

        const backButton = new ButtonBuilder()
            .setCustomId("backButton")
            .setLabel("◀️")
            .setStyle(ButtonStyle.Secondary);

        const buyButton = new ButtonBuilder()
            .setCustomId("buyBanner")
            .setLabel("💸 Comprar banner.")
            .setStyle(ButtonStyle.Secondary);

        const navigateButtons = new ActionRowBuilder()
            .addComponents(backButton, nextButton, buyButton);
        
        const storeEmbed = new EmbedBuilder()
            .setDescription(`**<@${userId}> Bem vindo a loja de banners <:ryo3:1270146490018304004>**`)
            .setImage(bannerLink)
            .setColor("#a70094")
            .addFields(
                { name: ' Nome:', value: bannerName, inline: true },
                { name: ' Valor:', value: bannerValue, inline: true },
            );
            
        await interaction.reply({
            embeds: [storeEmbed],
            components: [navigateButtons],
        });

        const collectorFilter = i => i.user.id === userId;
        const collector = interaction.channel.createMessageComponentCollector({ filter: collectorFilter, time: 60000 });

        collector.on('collect', async i => {
            try {
                if (i.customId === 'nextButton') {
                    if (nextBanner()) {
                        await updateStoreEmbed(i);
                    } else {
                        await i.update({ content: "Não há mais banners disponíveis", components: [navigateButtons] });
                    }
                } else if (i.customId === 'backButton') {
                    if (backBanner()) {
                        await updateStoreEmbed(i);
                    }
                } else if (i.customId === 'buyBanner') {
                    if (buyBanner()) {
                        await i.update({ content: `<@${userId}> Banner comprado com sucesso. <:ryo:1269693780194496542>`, components: [] });
                    } else {
                        await i.update({ content: `<@${userId}> Você não possui Ryo coins suficientes <:sad:1270177365074382941>`, components: [] });
                    }
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
            bannerLink = storeManager.getBannerLink(bannerNumber);
            if (!bannerLink) {
                bannerNumber -= 1;
                return false;
            }
            bannerName = storeManager.getBannerName(bannerNumber);
            bannerValue = storeManager.getBannerValue(bannerNumber);
            return true;
        }

        function backBanner() {
            if (bannerNumber > 0) {
                bannerNumber -= 1;
                bannerLink = storeManager.getBannerLink(bannerNumber);
                bannerName = storeManager.getBannerName(bannerNumber);
                bannerValue = storeManager.getBannerValue(bannerNumber);
                return true;
            }
            return false;
        }

        function buyBanner() {
            if (ryoCoins >= parseInt(bannerValue) || bannerValue === "Free") {
                bannerManager.writeBanner(userId, bannerLink);
                return true;
            } else {
                return false;
            }
        }

        async function updateStoreEmbed(interaction) {
            const embed = new EmbedBuilder()
                .setDescription(`**<@${userId}> Bem vindo a loja de banners <:ryo3:1270146490018304004>**`)
                .setImage(bannerLink)
                .setColor("#a70094")
                .addFields(
                    { name: ' Nome:', value: bannerName, inline: true },
                    { name: ' Valor:', value: bannerValue, inline: true },
                );
            await interaction.update({ embeds: [embed], components: [navigateButtons] });
        }
    }
};
