const chalk = require('chalk'),
    util = require('minecraft-server-util'),
    Discord = require('discord.js'),
    at = Discord.ActivityType,
    db = require('quick.db'),
    ms = require('ms'),
    gr = chalk.green.bold,
    bold = chalk.bold,
    bl = chalk.blue.bold,
    blu = chalk.blue.bold.underline,
    warn = chalk.keyword('yellow').bold;

module.exports = async (bot) => {
    const { server, config, info, settings } = bot;
    const guild = config.bot.guildID ? await bot.guilds.cache.get(config.bot.guildID) : null;
    const debug = config.settings.debug;
    var warns = config.settings.warns;

    if (bot.pres) {
        let presence = config.bot.presence,
            status = config.bot.status.toLowerCase(),
            activity = config.bot.activity.charAt(0).toUpperCase() + config.bot.activity.slice(1).toLowerCase();
        if (bot.pres.includes("{onlinePlayers}") | bot.pres.includes("{maxPlayers}")) {
            async function autoUpdatingPresence() { //autoUpdatingPresence-Schleife zum Aktualisieren der Botpräsenz und des Bot-Status
                let errored = false,
                    result = undefined;

                if (server.type === 'java') {
                    try {
                        result = await util.status(server.ip, server.port);
                    } catch (err) {
                        if (debug) console.log(err);
                        errored = true;
                    }
                } else {
                    try {
                        result = await util.statusBedrock(server.ip, server.port);
                    } catch (err) {
                        if (debug) console.log(err);
                        errored = true;
                    }
                };

                if (!errored) {
                    if (presence.includes("{onlinePlayers}")) {
                        presence = presence.replaceAll("{onlinePlayers}", result.players.online);
                    };

                    if (presence.includes("{maxPlayers}")) {
                        presence = presence.replaceAll("{maxPlayers}", result.players.max);
                    };

                    try {
                        await bot.user.setPresence({ activities: [{ name: presence, type: at[activity] }], status: status, afk: false }); //Legt die Bot-Aktivität fest
                        if (debug) console.log(`${bot.emotes.success} Anwesenheitsinformationen erfolgreich festlegen auf ` + gr(`${activity} ${presence}`));
                    } catch (e) {
                        if (debug) console.log(e);
                    }
                } else {
                    const presence = config.autoStatus.offline;
                    try {
                        await bot.user.setPresence({ activities: [{ name: presence, type: at[activity] }], status: status, afk: false }); //Legt die Bot-Aktivität fest
                        if (debug) console.log(`${bot.emotes.warn} ` + warn('Server wurde nicht gefunden! Anwesenheitsfunktion auf ') + gr(`${activity} ${presence}`));
                    } catch (e) {
                        if (debug) console.log(e);
                    }
                }
                presence = config.bot.presence;
                setTimeout(autoUpdatingPresence, ms(config.autoStatus.time));
            }
            autoUpdatingPresence();
        } else {
            try {
                bot.user.setPresence({ activities: [{ name: presence, type: activity }], status: status, afk: false }); //Legt die Bot-Aktivität fest
                if (debug) console.log(`${bot.emotes.success} Anwesenheitsinformationen erfolgreich festlegen auf ` + gr(`${bot.activity.toLowerCase()} ${bot.pres}`));
            } catch (e) {
                console.log();
            }
        }
    }

    if (config.settings.countingCH) {
        async function countingCH() { //countingCH-Schleife zum Aktualisieren des Sprachkanalnamens
            let name = config.countingCH.name,
                errored = false,
                result = undefined;

            if (server.type === 'java') {
                try {
                    result = await util.status(server.ip, server.port);
                } catch (err) {
                    if (debug) console.log(err);
                    errored = true;
                }
            } else {
                try {
                    result = await util.statusBedrock(server.ip, server.port);
                } catch (err) {
                    if (debug) console.log(err);
                    errored = true;
                }
            };

            if (!errored) {
                name = name
                    .replaceAll("{onlinePlayers}", result.players.online)
                    .replaceAll("{maxPlayers}", result.players.max);

                try {
                    channel = await bot.channels.cache.get(config.countingCH.channelID);
                    await channel.setName(name); //Legt den Kanalnamen fest
                    if (debug) console.log(`${bot.emotes.success} Kanalname erfolgreich auf ` + gr(name));
                } catch (e) {
                    if (debug) console.log(e);
                }
            } else {
                name = config.countingCH.offline;
                try {
                    channel = await bot.channels.cache.get(config.countingCH.channelID);
                    await channel.setName(name); //Legt den Kanalnamen fest
                    if (debug) console.log(`${bot.emotes.warn} ` + warn('Server wurde nicht gefunden! Der Kanalname wurde auf ') + gr(name));
                } catch (e) {
                    if (debug) console.log(e);
                }
            }
            setTimeout(countingCH, ms(config.countingCH.time));
        }
        countingCH();
    }

    if (config.settings.votingCH) {
        const channel = bot.channels.cache.get(config.votingCH.channelID);
        console.log(`${bot.emotes.success} Kanal ${gr(channel.name)} ist nun als Abstimmungskanal eingestellt!`);
    }

    if (config.settings.statusCH && server.work) {
        const channel = bot.channels.cache.get(info.channelID);
        const icon = server.icon ? server.icon : guild.iconURL();

        if (!db.get('statusCHMsgID')) {
            let msg;
            try {
                const serverEmbed = new Discord.EmbedBuilder()
                    .setAuthor({ name: config.server.name ? config.server.name : guild.name, iconURL: icon })
                    .setDescription(`🔄 **EINSTELLUNG...**`)
                    .addFields([
                        { name: "SPIELER", value: `�/�`, inline: false },
                        { name: "INFO", value: `${config.server.type.charAt(0).toUpperCase() + config.server.type.slice(1)} �\n\`${server.ip}\`:\`${server.port}\``, inline: true }
                    ])
                    .setColor(config.embeds.color);
                msg = await channel.send({ embeds: [serverEmbed] });
            } catch (err) { if (debug) console.log(err); }

            console.log(`${bot.emotes.success} Statusmeldung erfolgreich gesendet an ${gr(channel.name)}!`);
            db.set('statusCHMsgID', msg.id);
        }

        msg = await channel.messages.fetch(db.get('statusCHMsgID'));
        let
            ip1 = server.ip,
            port1 = server.port;

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

                    const trueList = result.players.sample ? "\n\`\`\`" + result.players.sample.map(p => ` ${p.name} `).join('\r\n') + "\`\`\`" : "";

                    const serverEmbed = new Discord.EmbedBuilder()
                        .setAuthor({ name: config.server.name ? config.server.name : guild.name, iconURL: icon })
                        .setDescription(maintenceStatus ? ":construction_worker: **Wartungsarbeiten**" : ":white_check_mark: **ONLINE**")
                        .addFields(
                            { name: "SPIELER", value: `${result.players.online}/${result.players.max}` + trueList, inline: false },
                            { name: "INFO", value: `${server.type.toUpperCase()} ${version}\n\`${server.ip}\`:\`${server.port}\``, inline: true }
                        )
                        .setColor(config.embeds.color)
                        .setFooter({ text: 'Updated' })
                        .setTimestamp();
                    msg.edit({ embeds: [serverEmbed] });
                })
                .catch((error) => {
                    const errorEmbed = new Discord.EmbedBuilder()
                        .setAuthor({ name: config.server.name ? config.server.name : guild.name, iconURL: icon })
                        .setDescription(':x: **OFFLINE**')
                        .setColor(config.embeds.error)
                        .setFooter({ text: 'Updated' })
                        .setTimestamp();
                    msg.edit({ embeds: [errorEmbed] });

                    if (warns) console.log(`${bot.emotes.warn} ` + warn(`Fehler beim Posten der Statusmeldung! Fehler:\n`) + error);
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

                    const serverEmbed = new Discord.EmbedBuilder()
                        .setAuthor({ name: config.server.name ? config.server.name : guild.name, iconURL: icon })
                        .setDescription(maintenceStatus ? ":construction_worker: **Wartungsarbeiten**" : ":white_check_mark: **ONLINE**")
                        .addFields(
                            { name: "SPIELER", value: `${result.players.online}/${result.players.max}`, inline: false },
                            { name: "INFO", value: `${server.type.toUpperCase()} ${version}\n\`${server.ip}\`:\`${server.port}\``, inline: true }
                        )
                        .setColor(config.embeds.color)
                        .setFooter({ text: 'Updated' })
                        .setTimestamp();
                    msg.edit({ embeds: [serverEmbed] });
                })
                .catch((error) => {
                    const errorEmbed = new Discord.EmbedBuilder()
                        .setAuthor({ name: config.server.name ? config.server.name : guild.name, iconURL: icon })
                        .setDescription(':x: **OFFLINE**')
                        .setColor(config.embeds.error)
                        .setFooter({ text: 'Updated' })
                        .setTimestamp();
                    msg.edit({ embeds: [errorEmbed] });

                    if (warns) console.log(`${bot.emotes.warn} ` + warn(`Fehler beim Posten der Statusmeldung! Fehler:\n`) + error);
                });
        }

        if (debug) console.log(`${bot.emotes.success} Die Statusmeldung wurde erfolgreich aktualisiert in ${gr(channel.name)}!`);

        if (server.type === 'java') {
            setInterval(() =>
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

                        const trueList = result.players.sample ? "\n\`\`\`" + result.players.sample.map(p => ` ${p.name} `).join('\r\n') + "\`\`\`" : "";

                        const serverEmbed = new Discord.EmbedBuilder()
                            .setAuthor({ name: config.server.name ? config.server.name : guild.name, iconURL: icon })
                            .setDescription(maintenceStatus ? ":construction_worker: **Wartungsarbeiten**" : ":white_check_mark: **ONLINE**")
                            .addFields(
                                { name: "SPIELER", value: `${result.players.online}/${result.players.max}` + trueList, inline: false },
                                { name: "INFO", value: `${server.type.toUpperCase()} ${version}\n\`${server.ip}\`:\`${server.port}\``, inline: true }
                            )
                            .setColor(config.embeds.color)
                            .setFooter({ text: 'Updated' })
                            .setTimestamp();
                        msg.edit({ embeds: [serverEmbed] });
                    })
                    .catch((error) => {
                        const errorEmbed = new Discord.EmbedBuilder()
                            .setAuthor({ name: config.server.name ? config.server.name : guild.name, iconURL: icon })
                            .setDescription(':x: **OFFLINE**')
                            .setColor(config.embeds.error)
                            .setFooter({ text: 'Updated' })
                            .setTimestamp();
                        msg.edit({ embeds: [errorEmbed] });

                        if (warns) console.log(`${bot.emotes.warn} ` + warn(`Fehler beim Posten der Statusmeldung! Fehler:\n`) + error);
                    }), ms(info.time));
        } else {
            setInterval(() =>
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

                        const serverEmbed = new Discord.EmbedBuilder()
                            .setAuthor({ name: config.server.name ? config.server.name : guild.name, iconURL: icon })
                            .setDescription(maintenceStatus ? ":construction_worker: **Wartungsarbeiten**" : ":white_check_mark: **ONLINE**")
                            .addFields(
                                { name: "SPIELER", value: `${result.players.online}/${result.players.max}`, inline: false },
                                { name: "INFO", value: `${server.type.toUpperCase()} ${version}\n\`${server.ip}\`:\`${server.port}\``, inline: true }
                            )
                            .setColor(config.embeds.color)
                            .setFooter({ text: 'Updated' })
                            .setTimestamp();
                        msg.edit({ embeds: [serverEmbed] });
                    })
                    .catch((error) => {
                        const errorEmbed = new Discord.EmbedBuilder()
                            .setAuthor({ name: config.server.name ? config.server.name : guild.name, iconURL: icon })
                            .setDescription(':x: **OFFLINE**')
                            .setColor(config.embeds.error)
                            .setFooter({ text: 'Updated' })
                            .setTimestamp();
                        msg.edit({ embeds: [errorEmbed] });

                        if (warns) console.log(`${bot.emotes.warn} ` + warn(`Fehler beim Posten der Statusmeldung! Fehler:\n`) + error);
                    }), ms(info.time));
        }

    }

    if (bot.readyScan && server.work) {
        if (server.type === 'java') {
            util.status(server.ip, server.port)
                .then((result) => {
                    console.log(`${bot.emotes.success} Erfolgreich lokalisiert ${gr(server.type.toUpperCase())} Server ${gr(server.ip)}!\n` + "   " + gr('Server Info:\n')
                        + "   " + bold('IP:	    ') + bl(`${server.ip}:${result.port ? result.port : server.port}\n`)
                        + "   " + bold('VERSION: ') + bl(`${result.version.name ? result.version.name : 'unknown'}\n`)
                        + "   " + bold('SPIELER: ') + bl(`${result.players.online ? result.players.online : '0'}` + '/' + `${result.players.max ? result.players.max : '0'}`)
                    );
                })
                .catch((error) => {
                    console.log(`${bot.emotes.warn} ` + warn(`Konnte nicht gefunden werden ${server.type} Server ${server.ip} mit Port ${server.port}! Fehler:\n`) + error);
                });
        } else if (server.type === 'bedrock') {
            util.statusBedrock(server.ip, server.port)
                .then((result) => {
                    console.log(`${bot.emotes.success} Erfolgreich lokalisiert ${gr(server.type.toUpperCase())} Server ${gr(server.ip)}!\n` + "   " + gr('Server info:\n')
                        + "   " + bold('IP:	    ') + bl(`${server.ip}:${result.port ? result.port : server.port}\n`)
                        + "   " + bold('VERSION: ') + bl(`${result.version.name ? result.version.name : 'unknown'}\n`)
                        + "   " + bold('PLAYERS: ') + bl(`${result.players.online ? result.players.online : '0'}` + '/' + `${result.players.max ? result.players.max : '0'}`)
                    );
                })
                .catch((error) => {
                    console.log(`${bot.emotes.warn} ` + (`Konnte nicht gefunden werden ${server.type} Server ${server.ip} mit Port ${server.port}! Fehler:\n`) + error);
                });
        }
    }

    console.log(`${bot.emotes.success} ` + gr(bot.user.username) + " arbeitet jetzt mit Präfix " + gr(bot.prefix));
    if (settings.inviteLink) console.log(`${bot.emotes.info} ` + "Einladen " + bl(bot.user.username) + " mit " + blu(`https://discord.com/oauth2/authorize?client_id=${bot.user.id}&permissions=274877918272&scope=bot%20applications.commands`));
};