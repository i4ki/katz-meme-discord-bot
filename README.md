# katz-meme-discord-bot

A simple Discord bot that responds to the `/katz-meme <name>` command by checking if the
requested meme exists in the [Katcipis Golden Meme Repository](https://github.com/katcipis/memes).

If the meme is found, the bot sends the corresponding image to the channel or direct message where
the command was used.

## Setup

1. Copy `.env.example` to `.env` and fill in your Discord bot token and client ID.
2. Run `npm install` to install dependencies.
3. Run `npm start` to start the bot.

## Usage

Use the `/katz-meme <name>` command in any server or DM where the bot is present. If the meme exists, the bot will send the image.
