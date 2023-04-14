const util = require('minecraft-server-util'),
    fs = require('fs'),
    { commands } = require(fs.existsSync(__dirname + '/../dev-config.js') ? '../dev-config' : '../config');

module.exports.config = {
    name: "test", //Name des Befehls - BENENNEN SIE DIE DATEI AUCH UM!!!
    description: "Test-Befehl", //Beschreibung des Befehls - Sie können ihn ändern :)
    aliases: commands.test.aliases //Aliasnamen des Befehls - setzen Sie sie in config.js
};

module.exports.run = async (bot, message) => {
    let { server, config } = bot,
        text = commands.test.text,
        icon = server.icon ? server.icon : message.guild.iconURL();

    if (!text.content) {
        message.reply({ content: 'Antwort auf Testnachricht.' });
    } else {
        message.reply({ content: text.content });
    }
};