const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const config = require("../config.js");

const queueNames = [];
const requesters = new Map();

async function play(client, interaction) {
    try {
        const query = interaction.options.getString('name');

        if (!interaction.member.voice.channelId) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Voice Channel Required')
                .setDescription('❌ You need to be in a voice channel to use this command.');

            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const player = client.riffy.createConnection({
            guildId: interaction.guildId,
            voiceChannel: interaction.member.voice.channelId,
            textChannel: interaction.channelId,
            deaf: true
        });

        await interaction.deferReply();

        const resolve = await client.riffy.resolve({ query: query, requester: interaction.user.username });

        if (!resolve || typeof resolve !== 'object') {
            throw new TypeError('Resolve response is not an object');
        }

        const { loadType, tracks } = resolve;

        if (!Array.isArray(tracks)) {
            console.error('Expected tracks to be an array:', tracks);
            throw new TypeError('Expected tracks to be an array');
        }

        let trackInfo;

        if (loadType === 'PLAYLIST_LOADED') {
            for (const track of tracks) {
                track.info.requester = interaction.user.username;
                player.queue.add(track);
                queueNames.push(`[${track.info.title} - ${track.info.author}](${track.info.uri})`);
                requesters.set(track.info.uri, interaction.user.username);
            }
            if (!player.playing && !player.paused) player.play();

        } else if (loadType === 'SEARCH_RESULT' || loadType === 'TRACK_LOADED') {
            const track = tracks.shift();
            track.info.requester = interaction.user.username;
            player.queue.add(track);
            queueNames.push(`[${track.info.title} - ${track.info.author}](${track.info.uri})`);
            requesters.set(track.info.uri, interaction.user.username);
            if (!player.playing && !player.paused) player.play();

            trackInfo = track.info;
        } else {
            const errorEmbed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setTitle('Error')
                .setDescription('❌ No results found.');

            await interaction.editReply({ embeds: [errorEmbed] });
            return;
        }


        if (tracks.length > 0) {
            const track = tracks[0];
            if (track && track.info) {
                trackInfo = track.info;
            }
        }

        const embeds = [
            new EmbedBuilder()
                .setColor(config.embedColor)
                .setAuthor({
                    name: 'Request Update',
                    iconURL: config.CheckmarkIcon,
                    url: config.SupportServer
                })
                .setDescription('**➡️ Your request has been successfully processed.**\n**➡️ Please use buttons to control playback**')
                .addFields(
                    { name: 'Request by', iconURL: interaction.user.displayAvatarUrl, value: interaction.user.username, inline: true },
                    { name: 'Title', value: trackInfo?.title || 'Unknown', inline: true },
                    { name: 'Artist', value: trackInfo?.author || 'Unknown', inline: true }
                )
                .setTimestamp(),

            new EmbedBuilder()
                .setColor(config.embedColor)
                .setAuthor({
                    name: 'Request Update',
                    iconURL: config.CheckmarkIcon,
                    url: config.SupportServer
                })
                .setDescription('**➡️ Your request has been successfully processed.**\n**➡️ Please use buttons to control playback**')
                .addFields(
                    { name: 'Request by', iconURL: interaction.user.displayAvatarUrl, value: interaction.user.username, inline: true },
                    { name: 'Title', value: trackInfo?.title || 'Unknown', inline: true },
                    { name: 'Artist', value: trackInfo?.author || 'Unknown', inline: true }
                )
                .setTimestamp(),

            new EmbedBuilder()
                .setColor(config.embedColor)
                .setAuthor({
                    name: 'Request Update',
                    iconURL: config.CheckmarkIcon,
                    url: config.SupportServer
                })
                .setDescription('**➡️ Your request has been successfully processed.**\n**➡️ Please use buttons to control playback**')
                .addFields(
                    { name: 'Request by', iconURL: interaction.user.displayAvatarUrl, value: interaction.user.username, inline: true },
                    { name: 'Title', value: trackInfo?.title || 'Unknown', inline: true },
                    { name: 'Artist', value: trackInfo?.author || 'Unknown', inline: true }
                )
                .setTimestamp(),
        ];

        const randomIndex = Math.floor(Math.random() * embeds.length);
        await interaction.followUp({ embeds: [embeds[randomIndex]] });

    } catch (error) {
        console.error('Error processing play command:', error);
        const errorEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('Error')
            .setDescription('❌ An error occurred while processing your request.');

        await interaction.editReply({ embeds: [errorEmbed] });
    }
}

module.exports = {
    name: "play",
    description: "Play a song from a name or link",
    permissions: "0x0000000000000800",
    options: [{
        name: 'name',
        description: 'Enter song name / link or playlist',
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    run: play,
    queueNames: queueNames,
    requesters: requesters 
};
