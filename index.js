const Discord = require('discord.js'),
    fs = require('fs'),
    c = require('chalk'),
    ms = require('ms'),
    { REST } = require('@discordjs/rest'),
    { Routes } = require('discord-api-types/v9');

//Discord-Client - Ich mag "Bot" mehr, dann "Client"
const bot = new Discord.Client({ intents: 34321 });
//https://discord-intents-calculator.vercel.app/

let dev;
try { if (fs.existsSync('./dev-config.js')) { dev = true; } }
catch (err) { console.error(err); }
const config = require(dev ? './dev-config' : './config'),
    { commands } = config,
    activites = ['PLAYING', 'WATCHING', 'COMPETING', 'LISTENING'], //Unterstützte Aktivitäten, Zwietracht.js unterstützt mehr (aber das ist mir egal)
    statuses = ['online', 'idle', 'dnd', 'invisible'], //Unterstützte Status
    error = c.keyword('red').bold,
    kill = '\nTötungsprozess...',
    warn = c.keyword('yellow').bold,
    warns = config.settings.warns,
    server = Array;

let info = config.statusCH;

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.slashes = new Discord.Collection();
bot.token = config.bot.token;
bot.prefix = config.bot.prefix;
bot.status = config.bot.status;
bot.pres = config.bot.presence;
bot.warns = warns;
bot.readyScan = config.settings.readyScan;
bot.server = Boolean;
bot.activity = config.bot.activity.toUpperCase();
server.type = config.server.type.toLowerCase();
server.ip = config.server.ip.toLowerCase();
server.port = parseInt(config.server.port);
server.work = true;
server.vote = config.server.vote;

//Config check
let emojis = config.console.emojis;
if (!emojis.success) emojis.success = '💚';
if (!emojis.info) emojis.info = '💙';
if (!emojis.warn) emojis.warn = '💛';
if (!emojis.error) emojis.error = '🛑';
bot.emotes = emojis;

if (bot.token === '') { //Überprüft, ob Sie das Bot-Token für die Konfiguration eingegeben haben.
    console.log(`${bot.emotes.error} ` + error('Bot-Token in der Konfiguration ist leer!') + kill);
    return process.exit(1);
} else if (bot.prefix === '') { //Überprüft, ob Sie das Bot-Präfix für config eingegeben haben.
    console.log(`${bot.emotes.error} ` + error('Bot-Token in der Konfiguration ist leer!') + kill);
    return process.exit(1);
};

if (bot.pres === '') { //Überprüft, ob Sie eine benutzerdefinierte Anwesenheits-Textnachricht eingegeben haben, damit der Bot konfiguriert werden kann.
    if (warns) console.log(`${bot.emotes.warn} ` + warn('Bot-Status in der Konfiguration war leer! Die Botpräsenz wurde deaktiviert.'));
    bot.pres = false;
}

if (!bot.activity) { //Prüft, ob Sie den Status Aktivitätstyp für die Konfiguration eingegeben haben.
    if (bot.pres) {
        if (warns) console.log(`${bot.emotes.warn} ` + warn('Der Bot-Aktivitätstyp in der Konfiguration war leer! Der Aktivitätstyp ist jetzt "Spielen"'));
        bot.activity = 'PLAYING';
    };
};

if (!new Set(activites).has(bot.activity.toUpperCase())) { //Überprüft, ob Sie eine unterstützte Aktivität eingegeben haben.
    if (bot.pres) {
        if (warns) console.log(`${bot.emotes.warn} ` + warn(`"${bot.activity}" Aktivität wird nicht unterstützt. Bot-Präsenz wurde deaktiviert.`));
        bot.pres = false;
    };
};

if (!bot.status) { //Prüft, ob Sie den Status Aktivitätstyp für die Konfiguration eingegeben haben.
    if (bot.pres) {
        if (warns) console.log(`${bot.emotes.warn} ` + warn('Der Bot-Statustyp in der Konfiguration war leer! Bot-Präsenz ist jetzt auf "online" gesetzt'));
        bot.status = 'ONLINE';
    };
};

if (!new Set(statuses).has(bot.status.toLowerCase())) { //Überprüft, ob Sie eine unterstützte Aktivität eingegeben haben.
    if (bot.pres) {
        if (bot.status.toLowerCase() === "Bitte nicht stören") {
            bot.status = "dnd";
        } else {
            if (warns) console.log(`${bot.emotes.warn} ` + warn(`"${bot.status}" Status wird nicht unterstützt. Bot-Präsenz wurde deaktiviert.`));
            bot.pres = false;
        }
    };
};


if (!server.ip) {
    if (warns) console.log(`${bot.emotes.error} ` + error("Sie haben die IP-Adresse des Servers nicht angegeben!") + c.white('\nMinecraft-Server deaktiviert.'));
    bot.server.work = false;
} else {
    bot.server.work = true;
}

if (server.type !== 'java' && server.type !== 'bedrock') {
    if (bot.server) {
        if (!server.type) {
            if (warns) console.log(`${bot.emotes.warn} ` + warn(`Sie haben die Edition des Servers nicht angegeben und auf Java gesetzt.`));
            server.type = 'java';
        } else {
            console.log(`${bot.emotes.error} ` + error('Unbekannte Server-Edition') + kill);
            return process.exit(1);
        }
    }
}

if (!server.port) {
    if (bot.server) {
        if (warns) console.log(`${bot.emotes.warn} ` + warn(`Sie haben keinen Serverport angegeben, sondern ihn auf den Standardport festgelegt.`));
        if (server.type === 'bedrock') {
            server.port = 19132;
        } else {
            server.port = 25565;
        }
    }
}

if (config.server.name === '' || !config.server.name) {
    if (warns) console.log(`${bot.emotes.warn} ` + warn(`Sie haben keinen Servernamen angegeben, sondern ihn auf den Discord-Servernamen festgelegt.`));
    bot.server.name = false;
}

config.embeds.error = config.embeds.colors.error ? config.embeds.colors.error : '#f53636';
config.embeds.color = config.embeds.colors.normal ? config.embeds.colors.normal : '#77fc03';

if (!config.autoStatus.time) {
    if (warns) console.log(`${bot.emotes.warn} ` + warn("Sie haben keinen Aktualisierungszeitraum für den Status des Bots angegeben. Stellen Sie es auf 10 Minuten ein."));
    config.autoStatus.time = "10min";
}

if (config.settings.statusCH) {
    const dis = c.white('\nStatusmeldung zum automatischen Ändern deaktiviert.');
    if (!info.channelID) {
        console.log(`${bot.emotes.error} ` + error("Sie haben in den statusCH-Einstellungen keine Kanal-ID angegeben!") + dis);
        config.settings.statusCH = false;
    }

    if (config.settings.statusCH) {
        if (!info.time) {
            if (warns) console.log(`${bot.emotes.warn} ` + warn("Sie haben keinen Aktualisierungszeitraum von statusCH angegeben. Einstellen auf 30 Sekunden."));
            info.time = "30s";
        }
    }
}

if (config.settings.votingCH) {
    const dis = c.white('\nAbstimmungskanal deaktiviert.');
    if (!config.votingCH.channelID) {
        console.log(`${bot.emotes.error} ` + error("Sie haben die Sender-ID nicht in den Abstimmungseinstellungen angegeben!") + dis);
        config.settings.votingCH = false;
    }

    if (config.votingCH) {
        if (!config.votingCH.time) {
            console.log(`${bot.emotes.warn} ` + warn("Sie haben in den Abstimmungseinstellungen keine Uhrzeit angegeben! Einstellen auf 30 Sekunden."));
            config.votingCH.time = "30s";
        }

        if (!config.votingCH.reactions.first) {
            config.votingCH.reactions.first = "👍";
        }
        if (!config.votingCH.reactions.second) {
            console.log(`${bot.emotes.warn} ` + warn("Sie haben kein zweites Reaktions-Emoji angegeben! Zweite Reaktion deaktiviert."));
            config.votingCH.reactions.second = false;
        }
        if (!config.votingCH.reactions.cancel) {
            config.votingCH.reactions.cancel = "❌";
        }
    }
}

if (config.settings.countingCH) {
    const dis = c.white('\nAutomatisches Ändern des Kanalnamens deaktiviert.');
    if (!config.countingCH.channelID) {
        console.log(`${bot.emotes.error} ` + error("Sie haben in den countingCH-Einstellungen keine Kanal-ID angegeben!") + dis);
        config.countingCH.channelID = false;
    } else if (!config.countingCH.time) {
        if (warns) console.log(`${bot.emotes.warn} ` + warn("Sie haben keine zeitliche Aktualisierungsperiode von countingCH angegeben. Einstellen auf 30 Sekunden."));
        config.countingCH.time = "30s";
    } else if (!config.countingCH.name) {
        if (warns) console.log(`${bot.emotes.warn} ` + warn("Sie haben den Kanalnamen von countingCH nicht angegeben. Festlegen auf \"{onlinePlayers} Spieler online!\"."));
        config.countingCH.name = "{onlinePlayers} Spieler online!";
    } else if (!config.countingCH.offline) {
        if (warns) console.log(`${bot.emotes.warn} ` + warn("Sie haben keinen Offline-Text von countingCH angegeben. Festlegen auf \"Der Server ist offline!\"."));
        config.countingCH.offline = "Der Server ist offline!";
    }

    if (config.settings.statusCH) {
        if (!info.time) {
            if (warns) console.log(`${bot.emotes.warn} ` + warn("Sie haben keinen Aktualisierungszeitraum von statusCH angegeben. Festlegen auf 30 seconds."));
            info.time = "30s";
        }
    }
}

const iconLINK = config.server.icon;
if (!iconLINK) {
    server.icon = false;
} else if (!iconLINK.includes("png" || "jpg" || "webp" || "gif")) {
    if (warns) console.log(`${bot.emotes.warn} ` + warn("Unbekanntes Dateiformat für Serversymbole. Festlegen auf undefined."));
    server.icon = "https://media.minecraftforum.net/attachments/300/619/636977108000120237.png";
} else if (!iconLINK.includes("https://" || "http://")) {
    if (warns) console.log(`${bot.emotes.warn} ` + warn("Der Link zum Serversymbol enthielt https oder http. Festlegen auf undefined."));
    server.icon = "https://media.minecraftforum.net/attachments/300/619/636977108000120237.png";
} else {
    server.icon = iconLINK;
}

bot.settings = config.settings;
bot.settings.split = bot.settings.readyScan;
bot.server = server;
bot.config = config;
bot.info = info;

//Ereignisbehandler
const eventsFolder = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventsFolder) {
    const eventFile = require(`./events/${file}`);
    const event = file.split(".")[0];
    bot.on(event, eventFile.bind(null, bot));
};

//Befehlshandler
const commandsFolder = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandsFolder) {
    const commandFile = require(`./commands/${file}`);
    const command = file.split(".")[0];
    if (!!commands[command] && !!commands[command].enableNormal || !!commandFile.config.enable) {
        bot.commands.set(command, commandFile);
        commandFile.config.aliases.forEach(alias => {
            bot.aliases.set(alias, command);
        });
    }
};

//Schrägstrich-Befehlshandler
if (commands.enableSlashes) {
    let slashCommands = [];
    const slashCommandsFolder = fs.readdirSync('./slashes').filter(file => file.endsWith('.js'));
    for (const file of slashCommandsFolder) {
        const commandFile = require(`./slashes/${file}`);
        const slashCommand = file.split(".")[0];
        if (!!commands[slashCommand] && !!commands[slashCommand].enableSlash) {
            bot.slashes.set(slashCommand, commandFile);
            slashCommands.push(commandFile.data.toJSON());
        }
    };

    bot.once('ready', async (bot) => {
        const rest = new REST({ version: '9' }).setToken(bot.token);

        try {
            await rest.put(
                Routes.applicationCommands(bot.user.id),
                { body: slashCommands },
            );
        } catch (err) {
            console.log(err);
        };
    });
}

//Bot-Login
bot.login(bot.token);