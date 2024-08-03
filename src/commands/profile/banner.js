const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("perfil")
        .setDescription("🙂 Veja seu lindo perfil"),
    async execute(interaction) {
        try {
             //default
            let color = "#070803";
            let bannerImage = "https://i.pinimg.com/564x/00/44/de/0044de6a836273e0a51376bc5c1c7488.jpg";
            let badge1 = "https://risibank.fr/cache/medias/0/31/3143/314349/full.png";

            const canvas = createCanvas(500, 450); // Aumentar a altura do canvas
            const context = canvas.getContext('2d');

            const profileImageUrl = interaction.user.displayAvatarURL({ extension: 'png', size: 512 });
            console.log('Profile image URL:', profileImageUrl);

            // Carregar a imagem de perfil
            const avatar = await loadImage(profileImageUrl);

            // Adicionar a segunda imagem
            const secondImageUrl = bannerImage;
            const secondImage = await loadImage(secondImageUrl);
            const secondImageX = 0;
            const secondImageY = 0; // Posição da segunda imagem
            const secondImageWidth = 500; // Largura da segunda imagem
            const secondImageHeight = 250; // Altura da segunda imagem

            // Desenhar a borda interna
            const innerBorderWidth = 10; // Largura da borda interna
            context.drawImage(secondImage, secondImageX, secondImageY, secondImageWidth, secondImageHeight);

            context.save();
            context.strokeStyle = color;
            context.lineWidth = innerBorderWidth;
            context.strokeRect(secondImageX + innerBorderWidth / 2, secondImageY + innerBorderWidth / 2, secondImageWidth - innerBorderWidth, secondImageHeight - innerBorderWidth);
            context.restore();

            // Desenhar a barra de progresso
            const progressBarWidth = 500; // Ajuste a largura da barra de progresso
            const progressBarHeight = 300; // Ajuste a altura da barra de progresso
            const progressBarX = (canvas.width - progressBarWidth) / 2; // Centraliza a barra no eixo X
            const progressBarY = 170; // Posição no eixo Y
            context.fillStyle = color;
            context.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
            
            // Desenhar a barra de badges
            const badgeWidth = 100; // Ajuste a largura da barra de progresso
            const badgeHeight = 30; // Ajuste a altura da barra de progresso
            const badgeX = 380; // Centraliza a barra no eixo X
            const badgeY = 180; // Posição no eixo Y
            context.fillStyle = '#161616';
            context.fillRect(badgeX, badgeY, badgeWidth, badgeHeight);

             // Adicionar as badges
            const badgemageUrl = badge1;
            const badgemage = await loadImage(badgemageUrl);
            const badgemageX = 390;
            const badgemageY = 180; // Posição da segunda imagem
            const badgemageWidth = 35; // Largura da segunda imagem
            const badgemageHeight = 30; // Altura da segunda imagem

            context.drawImage(badgemage, badgemageX, badgemageY, badgemageWidth, badgemageHeight);

            // Desenhar uma máscara circular
            const maskRadius = 60; // Raio da máscara circular (imagem de perfil)
            const maskX = 20; // Posições X e Y para centralizar a imagem circular
            const maskY = 100;
            const borderWidth = 10; // Largura da borda
            const borderRadius = maskRadius + borderWidth; // Raio da borda

            // Desenhar a borda circular
            context.save(); 
            context.beginPath();
            context.arc(maskX + borderRadius, maskY + borderRadius, borderRadius, 0, Math.PI * 2, true);
            context.fillStyle = color; // Cor da borda (pode ser ajustada)
            context.fill();
            context.restore();

            // Desenhar a imagem de perfil usando a máscara
            context.save();
            context.beginPath();
            context.arc(maskX + borderRadius, maskY + borderRadius, maskRadius, 0, Math.PI * 2, true);
            context.clip();
            context.drawImage(avatar, maskX + borderWidth, maskY + borderWidth, maskRadius * 2, maskRadius * 2);
            context.restore();

            // Adicionar texto ao canvas
            const userName = interaction.member.displayName;
            context.fillStyle = "white"; // Cor do texto
            context.font = "bold 30px Nunito"; // Fonte do texto
            context.fillText(userName, 160, 200); // Desenha o texto
            
            const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'profile-image.png' });

            await interaction.reply({ files: [attachment] });
        } catch (error) {
            console.error('Erro ao gerar a imagem de perfil:', error);
            await interaction.reply({ content: 'Ocorreu um erro ao gerar seu perfil. Por favor, tente novamente mais tarde.', ephemeral: true });
        }
    }
};
