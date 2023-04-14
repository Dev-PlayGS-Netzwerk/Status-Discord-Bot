const { SlashCommandBuilder } = require('@discordjs/builders'),
    util = require('minecraft-server-util'),
    Discord = require('discord.js'),
    c = require('chalk'),
    fs = require('fs'),
    { commands } = require(fs.existsSync(__dirname + '/../dev-config.js') ? '../dev-config' : '../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status') //Name des Befehls - BENENNEN SIE DIE DATEI AUCH UM!!!
        .setDescription(`Sendet jetzt die einfache Statusmeldung über den Server`) //Beschreibung des Befehls - Sie können ihn ändern :)
};

module.exports.run = async (bot, interaction) => {
    let { server, config } = bot,
        text = commands.status.text,
        settings = config.settings,
        warn = c.keyword('yellow').bold,
        warns = config.settings.warns;

    if (!server.work) return;

    let
        ip1 = server.ip,
        port1 = server.port,
        icon = server.icon ? server.icon : interaction.guild.iconURL();

    if (server.type === 'java') {
        util.status(ip1, port1)
            .then((result) => {
                const versionOriginal = result.version.name;
                let versionAdvanced = false;

                let maintenceStatus = false,
                    lowCaseMotdClean = result.motd.clean.toLocaleLowerCase();
                if (lowCaseMotdClean.includes("maintenance")) maintenceStatus = true;

                if (settings.split) {
                    versionAdvanced = versionOriginal.toLocaleLowerCase()
                        .replace("bukkit ", "")
                        .replace("craftbukkit ", "")
                        .replace("spigot ", "")
                        .replace("forge ", "")
                        .replace("fabric ", "")
                        .replace("paper ", "")
                        .replace("purpur ", "")
                        .replace("tacospigot ", "")
                        .replace("glowstone ", "")
                        .replace("bungecord ", "")
                        .replace("waterfall ", "")
                        .replace("flexpipe ", "")
                        .replace("hexacord ", "")
                        .replace("velocity ", "")
                        .replace("airplane ", "")
                        .replace("sonarlint ", "")
                        .replace("geyser ", "")
                        .replace("cuberite ", "")
                        .replace("yatopia ", "")
                        .replace("mohist ", "")
                        .replace("leafish ", "")
                        .replace("cardboard ", "")
                        .replace("magma ", "")
                        .replace("empirecraft ", "");
                }

                const version = versionAdvanced ? versionAdvanced.charAt(0).toUpperCase() + versionAdvanced.slice(1) : versionOriginal;

                if (text.title === "" || text.description === "") {
                    const serverEmbed = new Discord.EmbedBuilder()
                        .setAuthor({ name: config.server.name ? config.server.name : interaction.guild.name, iconURL: icon })
                        .setTitle("Serverstatus:")
                        .setDescription(`${maintenceStatus ? ":construction_worker: **Wartungsarbeiten**" : ":white_check_mark: **ONLINE**"}

                        **Beschreibung**
                        ${result.motd.clean}

                        **IP Addresse**
                        \`${server.ip}\`:\`${server.port}\`

                        **Version**
                        ${config.server.type.charAt(0).toUpperCase() + config.server.type.slice(1)} ${version}

                        **Spieler**
                        **${result.players.online}**/**${result.players.max}**`)
                        .setColor(config.embeds.color);
                    interaction.reply({ embeds: [serverEmbed] });
                } else {
                    text.title = text.title.replaceAll('{serverIp}', server.ip);
                    text.title = text.title.replaceAll('{serverPort}', server.port);
                    text.title = text.title.replaceAll('{serverName}', config.server.name ? config.server.name : interaction.guild.name);
                    text.title = text.title.replaceAll('{voteLink}', config.server.vote);
                    text.title = text.title.replaceAll('{serverType}', config.server.type.charAt(0).toUpperCase() + config.server.type.slice(1));
                    text.title = text.title.replaceAll('{playersOnline}', result.players.online);
                    text.title = text.title.replaceAll('{playersMax}', result.players.max);
                    text.title = text.title.replaceAll('{motd}', result.motd.clean);
                    text.title = text.title.replaceAll('{serverVersion}', version);
                    text.title = text.title.replaceAll('{status}', maintenceStatus ? ":construction_worker: **Wartungsarbeiten**" : ":white_check_mark: **ONLINE**");

                    text.description = text.description.replaceAll('{serverIp}', server.ip);
                    text.description = text.description.replaceAll('{serverPort}', server.port);
                    text.description = text.description.replaceAll('{serverName}', config.server.name ? config.server.name : interaction.guild.name);
                    text.description = text.description.replaceAll('{voteLink}', config.server.vote);
                    text.description = text.description.replaceAll('{serverType}', config.server.type.charAt(0).toUpperCase() + config.server.type.slice(1));
                    text.description = text.description.replaceAll('{playersOnline}', result.players.online);
                    text.description = text.description.replaceAll('{playersMax}', result.players.max);
                    text.description = text.description.replaceAll('{motd}', result.motd.clean);
                    text.description = text.description.replaceAll('{serverVersion}', version);
                    text.description = text.description.replaceAll('{status}', maintenceStatus ? ":construction_worker: **Wartungsarbeiten**" : ":white_check_mark: **ONLINE**");

                    const serverEmbed = new Discord.EmbedBuilder()
                        .setAuthor({ name: config.server.name ? config.server.name : interaction.guild.name, iconURL: icon })
                        .setTitle(text.title)
                        .setDescription(text.description)
                        .setColor(config.embeds.color);
                    interaction.reply({ embeds: [serverEmbed] });
                }
            })
            .catch((error) => {
                const errorEmbed = new Discord.EmbedBuilder()
                    .setAuthor({ name: config.server.name ? config.server.name : interaction.guild.name, iconURL: icon })
                    .setTitle("Serverstatus:")
                    .setDescription(`:x: **OFFLINE**\n\n:information_source: \`${server.ip}\`:\`${server.port}\``)
                    .setColor(config.embeds.error);
                interaction.reply({ embeds: [errorEmbed] });

                if (warns) console.log(`${bot.emotes.warn} ` + warn(`Fehler bei der Verwendung des Befehls ${module.exports.data.name}! Fehler:\n`) + error);
            });
    } else {
        util.statusBedrock(ip1, port1)
            .then((result) => {
                const versionOriginal = result.version.name;
                let versionAdvanced = false;

                let maintenceStatus = false,
                    lowCaseMotdClean = result.motd.clean.toLocaleLowerCase();
                if (lowCaseMotdClean.includes("maintenance")) maintenceStatus = true;

                if (settings.split) {
                    versionAdvanced = versionOriginal.toLocaleLowerCase()
                        .replace("bukkit ", "")
                        .replace("craftbukkit ", "")
                        .replace("spigot ", "")
                        .replace("forge ", "")
                        .replace("fabric ", "")
                        .replace("paper ", "")
                        .replace("purpur ", "")
                        .replace("tacospigot ", "")
                        .replace("glowstone ", "")
                        .replace("bungecord ", "")
                        .replace("waterfall ", "")
                        .replace("flexpipe ", "")
                        .replace("hexacord ", "")
                        .replace("velocity ", "")
                        .replace("airplane ", "")
                        .replace("sonarlint ", "")
                        .replace("geyser ", "")
                        .replace("cuberite ", "")
                        .replace("yatopia ", "")
                        .replace("mohist ", "")
                        .replace("leafish ", "")
                        .replace("cardboard ", "")
                        .replace("magma ", "")
                        .replace("empirecraft ", "");
                }

                const version = versionAdvanced ? versionAdvanced.charAt(0).toUpperCase() + versionAdvanced.slice(1) : versionOriginal;

                if (text.title === "" || text.description === "") {
                    const serverEmbed = new Discord.EmbedBuilder()
                        .setAuthor({ name: config.server.name ? config.server.name : interaction.guild.name, iconURL: icon })
                        .setTitle("Server status:")
                        .setDescription(`${maintenceStatus ? ":construction_worker: **Wartungsarbeiten**" : ":white_check_mark: **ONLINE**"}

                        **Beschreibung**
                        ${result.motd.clean}

                        **IP Addresse**
                        \`${server.ip}\`:\`${server.port}\`

                        **Version**
                        ${config.server.type.charAt(0).toUpperCase() + config.server.type.slice(1)} ${version}

                        **Spieler**
                        **${result.players.online}**/**${result.players.max}**`)
                        .setColor(config.embeds.color);
                    interaction.reply({ embeds: [serverEmbed] });
                } else {
                    text.title = text.title.replaceAll('{serverIp}', server.ip);
                    text.title = text.title.replaceAll('{serverPort}', server.port);
                    text.title = text.title.replaceAll('{serverName}', config.server.name ? config.server.name : interaction.guild.name);
                    text.title = text.title.replaceAll('{voteLink}', config.server.vote);
                    text.title = text.title.replaceAll('{serverType}', config.server.type.charAt(0).toUpperCase() + config.server.type.slice(1));
                    text.title = text.title.replaceAll('{playersOnline}', result.players.online);
                    text.title = text.title.replaceAll('{playersMax}', result.players.max);
                    text.title = text.title.replaceAll('{motd}', result.motd.clean);
                    text.title = text.title.replaceAll('{serverVersion}', version);
                    text.title = text.title.replaceAll('{status}', maintenceStatus ? ":construction_worker: **Wartungsarbeiten**" : ":white_check_mark: **ONLINE**");

                    text.description = text.description.replaceAll('{serverIp}', server.ip);
                    text.description = text.description.replaceAll('{serverPort}', server.port);
                    text.description = text.description.replaceAll('{serverName}', config.server.name ? config.server.name : interaction.guild.name);
                    text.description = text.description.replaceAll('{voteLink}', config.server.vote);
                    text.description = text.description.replaceAll('{serverType}', config.server.type.charAt(0).toUpperCase() + config.server.type.slice(1));
                    text.description = text.description.replaceAll('{playersOnline}', result.players.online);
                    text.description = text.description.replaceAll('{playersMax}', result.players.max);
                    text.description = text.description.replaceAll('{motd}', result.motd.clean);
                    text.description = text.description.replaceAll('{serverVersion}', version);
                    text.description = text.description.replaceAll('{status}', maintenceStatus ? ":construction_worker: **Wartungsarbeiten**" : ":white_check_mark: **ONLINE**");

                    const serverEmbed = new Discord.EmbedBuilder()
                        .setAuthor({ name: config.server.name ? config.server.name : interaction.guild.name, iconURL: icon })
                        .setTitle(text.title)
                        .setDescription(text.description)
                        .setColor(config.embeds.color);
                    interaction.reply({ embeds: [serverEmbed] });
                }
            })
            .catch((error) => {
                const errorEmbed = new Discord.EmbedBuilder()
                    .setAuthor({ name: config.server.name ? config.server.name : interaction.guild.name, iconURL: icon })
                    .setTitle("Serverstatus:")
                    .setDescription(`:x: **OFFLINE**\n\n:information_source: \`${server.ip}\`:\`${server.port}\``)
                    .setColor(config.embeds.error);
                interaction.reply({ embeds: [errorEmbed] });

                if (warns) console.log(`${bot.emotes.warn} ` + warn(`Fehler bei der Verwendung des Befehls ${module.exports.data.name}! Fehler:\n`) + error);
            });
    }

};