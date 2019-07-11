const { MessageEmbed } = require('discord.js');
const { Command } = require('discord-akairo');
const { colors, embeds } = require('../../utils');

class LinkInfoCommand extends Command {

    constructor() {
        super('link-info', {
            aliases: ['link-info', 'linkinfo'],
            description: 'Displays link info for the guild channel.',
            category: 'linking'
        });
    }

    async exec(message) {
        if (!message.channel.linkData) {
            try {
                await this.client.linkManager.cacheChannelLinkData(message.channel);
            } catch (error) {
                console.error(error.stack);
                return message.channel.send(embeds.unexpectedError);
            }
        }

        if (!message.channel.linkData.linked) return message.util.send('this channel is currently not linked with another channel');

        const { linkedTo } = message.channel.linkData;

        const embed = new MessageEmbed()
            .setColor(colors.blue)
            .setTitle(`#${message.channel.name} | Link info`)
            .addField('Linked with', [
                `**Guild:** ${linkedTo.guild.name}`,
                `**Channel:** #${linkedTo.name}`
            ])
            .addField('Discord IDs', [
                `**Guild:** ${linkedTo.guild.id}`,
                `**Channel:** ${linkedTo.id}`
            ]);

        message.util.send(embed);
    }

}

module.exports = LinkInfoCommand;
