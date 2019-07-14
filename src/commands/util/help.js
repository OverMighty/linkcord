const { MessageEmbed } = require('discord.js');
const { Command } = require('discord-akairo');

const { colors } = require('../../utils');

class HelpCommand extends Command {

    constructor() {
        super('help', {
            aliases: ['help'],
            description: 'How do I describe a help command?',
            category: 'util',
            args: [{
                id: 'command',
                type: 'commandAlias'
            }]
        });
    }

    exec(message, { command }) {
        const embed = new MessageEmbed().setColor(colors.blue);

        if (command) {
            embed.setTitle(`Linkcord help | \`${command.id}\``)
                .addField('Aliases', command.aliases.map(alias => `\`${alias}\``).join(' '))
                .addField('Description', command.description);

            if (command.clientPermissions) {
                embed.addField('Permissions that I need', command.clientPermissions);
            }

            if (command.userPermissions) {
                embed.addField('Permissions that you need', command.userPermissions);
            }

            return message.util.send(embed);
        }

        embed.setTitle('Linkcord help')
            .setDescription([
                `My command prefix is \`${this.client.commandHandler.prefix}\`.`,
                'You can also mention me instead of typing my command prefix.',
                '',
                'Below is a list of my commands, grouped by category.',
                `Type \`${this.handler.prefix}help <command>\` for details.`
            ]);

        for (const category of this.handler.categories.values()) {
            const commands = [];

            for (const commandID of category.keys()) {
                commands.push(commandID);
            }

            embed.addField(category.id, commands.map(id => `\`${id}\``).join(' '));
        }

        message.util.send(embed);
    }

}

module.exports = HelpCommand;
