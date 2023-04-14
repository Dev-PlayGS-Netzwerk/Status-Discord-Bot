const util = require('minecraft-server-util'),
    Discord = require('discord.js'),
    c = require('chalk'),
    fs = require('fs'),
    { commands } = require(fs.existsSync(__dirname + '/../dev-config.js') ? '../dev-config' : '../config');

module.exports.config = {
    name: "test", //Name des Befehls - BENENNEN SIE DIE DATEI AUCH UM!!!
    description: "Test-Befehl", //Beschreibung des Befehls - Sie können ihn ändern :)
    aliases: commands.test.aliases //Aliasnamen des Befehls - setzen Sie sie in config.js
};

module.exports.run = async (bot, message, args) => {
    let { server, config } = bot,
        text = commands.test.text,
        warn = c.keyword('yellow').bold,
        warns = config.settings.warns,
        icon = server.icon ? server.icon : message.guild.iconURL(),
        serverName = config.server.name ? config.server.name : message.guild.name;
    //action
};