# Telegram Feedback Bot

This bot allows users to send anonymous feedback via Telegram.

## Setup

1. Install Node.js and npm.
2. Clone this repository.
3. Run `npm install` to install dependencies.
4. Set the `BOT_TOKEN` and `OWNER_ID` in the `.env` file.
5. Create a `start_bot.sh` script to set environment variables and start the bot.
6. Run `npm start` to start the bot.

## Usage

- `/start` to begin interaction with the bot.
- `/help` for information on how to use the bot.
- `/about` to get details about the bot.
- `/ping` to check the bot's response time.
- Send any text to provide feedback which will be forwarded to the bot owner.

## Deployment

To deploy this bot on Termux:
1. Install Termux and its Node.js package.
2. Set up your environment variables in a `start_bot.sh` script (do not upload this to GitHub).
3. Run the bot using the script.

## Contributing

Feel free to fork this repository and contribute by submitting a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
