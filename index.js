// Entry point for the Discord bot
import { Client, GatewayIntentBits, Events, REST, Routes, SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;

const MEME_REPO_API = 'https://api.github.com/repos/katcipis/memes/contents/';
const MEME_REPO_RAW = 'https://raw.githubusercontent.com/katcipis/memes/master/';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages] });

async function registerCommands() {
  const commands = [
    new SlashCommandBuilder()
      .setName('katz-meme')
      .setDescription('Send a meme from the Katcipis Golden Meme Repository')
      .addStringOption(option =>
        option.setName('name')
          .setDescription('The name of the meme (filename without extension)')
          .setRequired(true)
      )
      .toJSON()
  ];
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
}

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'katz-meme') return;

  const memeName = interaction.options.getString('name');
  try {
    const res = await fetch(MEME_REPO_API);
    const files = await res.json();
    const memeFile = files.find(f => f.name.split('.')[0].toLowerCase() === memeName.toLowerCase());
    if (!memeFile) {
      await interaction.reply({ content: `Meme "${memeName}" not found.`, ephemeral: true });
      return;
    }
    const memeUrl = MEME_REPO_RAW + memeFile.name;
    await interaction.reply({ files: [memeUrl] });
  } catch (err) {
    await interaction.reply({ content: 'Error fetching meme.', ephemeral: true });
  }
});

registerCommands().then(() => client.login(TOKEN));
