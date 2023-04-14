const { SlashCommandBuilder } = require('@discordjs/builders'),
    Discord = require('discord.js'),
    fs = require('fs'),
    { commands } = require(fs.existsSync(__dirname + '/../dev-config.js') ? '../dev-config' : '../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote') //Name des Befehls - BENENNEN SIE DIE DATEI AUCH UM!!!
        .setDescription('Sendet den Link zur Abstimmung auf der Minecraft-Serverliste') //Beschreibung des Befehls - Sie können ihn ändern :)
};

module.exports.run = async (bot, interaction) => {
    let { server, config } = bot,
        text = commands.vote.text,
        icon = server.icon ? server.icon : message.guild.iconURL(),
        serverName = config.server.name ? config.server.name : interaction.guild.name;

    if (text.title === "" || text.description === "") {
        const voteEmbed = new Discord.EmbedBuilder()
            .setAuthor({ name: config.server.name ? config.server.name : interaction.guild.name, iconURL: icon })
            .setTitle("Link zur Abstimmung über die Serverliste:")
            .setDescription(server.vote ? `[Hier](${server.vote}) Sie können abstimmen für: ${serverName}!` : "DER ABSTIMMUNGSLINK IST IN DER KONFIGURATION NICHT DEFINIERT!")
            .setColor(config.embeds.color);
        interaction.reply({ embeds: [voteEmbed] });
    } else {
        text.title = text.title.replaceAll('{serverIp}', server.ip);
        text.title = text.title.replaceAll('{serverPort}', server.port);
        text.title = text.title.replaceAll('{serverName}', config.server.name ? config.server.name : interaction.guild.name);
        text.title = text.title.replaceAll('{voteLink}', config.server.vote);
        text.title = text.title.replaceAll('{serverType}', config.server.type.charAt(0).toUpperCase() + config.server.type.slice(1));

        text.description = text.description.replaceAll('{serverIp}', server.ip);
        text.description = text.description.replaceAll('{serverPort}', server.port);
        text.description = text.description.replaceAll('{serverName}', config.server.name ? config.server.name : interaction.guild.name);
        text.description = text.description.replaceAll('{voteLink}', config.server.vote);
        text.description = text.description.replaceAll('{serverType}', config.server.type.charAt(0).toUpperCase() + config.server.type.slice(1));

        const voteEmbed = new Discord.EmbedBuilder()
            .setAuthor({ name: config.server.name ? config.server.name : interaction.guild.name, iconURL: icon })
            .setTitle(text.title)
            .setDescription(text.description)
            .setColor(config.embeds.color);
        interaction.reply({ embeds: [voteEmbed] });
    }
};