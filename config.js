module.exports = {
    //Ihre Bot-Daten
    bot: {
        token: "Ihr Bot-Token", //Ihr Bot-Token
        prefix: "+", //Ihr benutzerdefiniertes Präfix des Bots, z.B. "!" oder "."
        presence: "Online: {onlinePlayers}", //Benutzerdefinierter Aktivitäts-/Statustext
        status: "ONLINE",  //Sie können wählen: ONLINE, IDLE, DND (Bitte nicht stören), INVISIBLE
        activity: "LISTENING", //Sie können wählen: PLAYING, LISTENING, WATCHING, COMPETING
        guildID: "Deine Discord-Server-Gilden-ID", //Deine Discord-Server-Gilden-ID
    },

    //Deine Minecraft-Serverdaten
    server: {
        name: "Ihr Servername", //Ihr Servername
        type: "java oder bedrock", //"java" oder "bedrock"
        ip: "IP-Adresse Ihres Servers", //IP-Adresse Ihres Servers - keinen Port angeben - z.B. "playgs.de"
        port: "PORT ihres Servers", //PORT ihres Servers - leer => Standardport (JA 25565, BE 19132)
        icon: "", //Link zum Symbol - wie "https://website.com/icon.png"
        version: "Minecraft-Version des Servers", //Minecraft-Version des Servers
        vote: "" //Abstimmungslink
    },

    //Grundlegende Code-Einstellungen
    //Alle Einstellungen sind boolesch erwünscht - Verwenden Sie "true" zum Aktivieren, "false" zum Deaktivieren der Einstellung.
    settings: {
        warns: true, //Warnung anzeigen?
        debug: true, //Protokollieren Sie die meisten Änderungen und Aktualisierungen (ziemlicher Spam)?
        inviteLink: false, //Bot-Einladungslink beim Bot-Start anzeigen?
        readyScan: true, //Senden Sie beim Start des Bots grundlegende Informationen an den Konsolenserver.?
        split: false, //Erweitert - Extrahieren Sie nur die Version wie "1.17" oder "1.12" usw.
        randomColor: true, //Zufälliger Hexadezimal-Farbgenerator für Einbettungen aktivieren? Überschreibt Einbettungseinstellungen!
        statusCH: false, //Automatische Änderung der Statusmeldung aktivieren?
        votingCH: true, //Abstimmungskanal aktivieren?
        countingCH: true //Zählkanal aktivieren?
    },

    //Zeitraum der automatischen Statusänderung, wenn Sie {onlinePlayers} oder {maxPlayers} in Anwesenheit des Bots verwenden
    autoStatus: {
        time: "20s", //Zeitraum der automatischen Statusänderung - wie "3min", "20s" oder "1min" usw.
        offline: "Netzwerk offline" //Ändert die Anwesenheit des Bots in diesen Text, wenn der Server offline ist / nicht gefunden wird
    },

    //Statusmeldung zum automatischen Ändern
    statusCH: {
        channelID: "",
        time: "30s" //Period of updating status message - like "3min", "20s" or "1min" etc.
    },

    //Abstimmungskanal
    votingCH: {
        channelID: "",
        time: "30s", //Zeit, wie lange die Abbruchreaktion gelöscht werden soll.
        threads: {
            enable: false, //Erstellen Sie Diskussions-Threads für jede votingCH-Nachricht
            nameSyntax: "Voting {ID}", //Thread-Name ("{ID}" = ID der Abstimmung/des Vorschlags)
            idSyntax: "001", //ID-Syntax - wählen Sie, wie viele Nullen IDs anzeigen sollen (ENTFERNEN SIE NICHT DIE GANZZAHL "1")
            archiveTime: 1440 //Minuten, nach denen der Thread archiviert werden sollte, falls keine aktuelle Aktivität vorliegt
        },
        reactions: {
            first: "👍", //Erste hinzugefügte Reaktion (die positive)
            second: "👎", //Zweite hinzugefügte Reaktion (die negative)
            cancel: "❌" //Dritte hinzugefügte Reaktion (Schaltfläche "Abbrechen/Entfernen")
        }
    },

    //Zählkanal - Kanalname automatisch aktualisieren
    countingCH: {
        channelID: "",
        time: "20s", //Zeitraum der Aktualisierung des Kanalnamens - wie "3min", "20s" oder "1min" usw.
        name: "Online: {onlinePlayers}", //Name des Kanals
        offline: "Netzwerk offline!" //Name des Kanals, wenn der Server offline / nicht gefunden ist
    },

    //Einbettungseinstellungen
    embeds: {
        colors: {
            normal: "",  //Haupt-/Erfolgsfarbe der Einbettungen - wählen Sie hier die HEX-Farbe: https://htmlcolorcodes.com
            error: "", //Fehler/fehlgeschlagene Farbe der Einbettungen - wählen Sie hier die HEX-Farbe: https://htmlcolorcodes.com
        }
    },

    //Protokollierung der Programmprozesskonsole
    console: {
        emojis: {
            success: "💚",
            info: "💙",
            warn: "💛",
            error: "🛑"
        }
    },

    //Einstellungen für alle Befehle
    commands: {
        enableSlashes: false, //Wenn Sie nur bestimmte Schrägstriche deaktivieren möchten, lassen Sie dies unverändert und gehen Sie nach unten
        //Liste aller Befehle:
        help: {
            enableNormal: true, //Aktiviert den normalen Befehl
            enableSlash: false, //Aktiviert den Schrägstrichbefehl
            aliases: [ //Nur für normale Befehle
                "commands", "menu"
            ],
            text: { //Benutzerdefinierte Texteinstellungen (zum Übersetzen oder Anpassen)
                title: "{serverName} Bot-Befehle:",
                description: "> **Prefix:** \`{prefix}\`\n> **Befehle:**\n{commands}",
                errorTitle: "Fehler! Befehl \"{arg0}\" existiert nicht.",
                errorDescription: "Befehl `{arg0}` wurde nicht gefunden.\nSie geben den falschen Alias ein oder der Befehl ist deaktiviert."
            }
        },
        ip: {
            enableNormal: true, //Aktiviert den normalen Befehl
            enableSlash: false, //Aktiviert den Schrägstrichbefehl
            aliases: [ //Nur für normale Befehle
                "i", "ip-address", "address", "connect", "join"
            ],
            text: { //Benutzerdefinierte Texteinstellungen (zum Übersetzen oder Anpassen)
                title: "IP Addresse:",
                description: "\`{serverIp}\`:\`{serverPort}\`"
            }
        },
        list: {
            enableNormal: true, //Aktiviert den normalen Befehl
            enableSlash: false, //Aktiviert den Schrägstrichbefehl
            aliases: [ //Nur für normale Befehle
                "l", "players", "plist"
            ],
            text: { //Benutzerdefinierte Texteinstellungen (zum Übersetzen oder Anpassen)
                title: "Online-Spielerliste:",
                description: "**{playersOnline}**/**{playersMax}**",
                listFormat: "```{playersList}```"
            }
        },
        status: {
            enableNormal: true, //Aktiviert den normalen Befehl
            enableSlash: false, //Aktiviert den Schrägstrichbefehl
            aliases: [ //Nur für normale Befehle
                "s", "info", "server", "overview", "ov"
            ],
            text: { //Benutzerdefinierte Texteinstellungen (zum Übersetzen oder Anpassen)
                title: "Server status:",
                description:
                    `{status}
                    
                    **Beschreibung**
                    {motd}
                    
                    **IP Addresse**
                    \`{serverIp}\`:\`{serverPort}\`
                    
                    **Version**
                    {serverType} {serverVersion}
                    
                    **Spieler**
                    **{playersOnline}**/**{playersMax}**`,
            }
        },
        test: {
            enableNormal: true, //Aktiviert den normalen Befehl
            //Der Befehl "Test" hat keinen Schrägstrich. Ist das wirklich nötig?
            aliases: [ //Nur für normale Befehle
                "t", "try", "testing"
            ],
            text: { //Benutzerdefinierte Texteinstellungen (zum Übersetzen oder Anpassen)
                content: "Test message reply."
            }
        },
        version: {
            enableNormal: true, //Aktiviert den normalen Befehl
            enableSlash: false, //Aktiviert den Schrägstrichbefehl
            aliases: [ //Nur für normale Befehle
                "v", "ver"
            ],
            text: { //Benutzerdefinierte Texteinstellungen (zum Übersetzen oder Anpassen)
                title: "Minecraft version:",
                description: "{serverType} {serverVersion}"
            }
        },
        vote: {
            enableNormal: true, //Aktiviert den normalen Befehl
            enableSlash: false, //Aktiviert den Schrägstrichbefehl
            aliases: [ //Nur für normale Befehle
                "votelink"
            ],
            text: { //Benutzerdefinierte Texteinstellungen (zum Übersetzen oder Anpassen)
                title: "Link zur Abstimmung über die Serverliste:",
                description: "[Hier]({voteLink}) Sie können abstimmen für: {serverName}."
            }
        },
    }
};