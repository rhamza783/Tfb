const Telegraf = require('telegraf');
const fs = require('fs');
const punycode = require('punycode.js');
const moment = require('moment');

// General settings
let config = {
    "token": "YOUR_BOT_TOKEN", // Replace with your actual bot token
    "admin": 123456789 // Replace with the actual Telegram user ID of the bot owner
};

// Text settings for replies
let replyText = {
    "helloAdmin": "Now share your bot and wait for messages.",
    "helloUser": "Greetings, send me a message. I will try to answer as soon as possible.",
    "replyWrong": "Please use the Reply function to reply to the user's message directly.",
    "help": "Here are the commands you can use: /feedback, /report, /help",
    "feedback": "Thank you for your feedback!",
    "report": "Your report has been recorded. We will look into it shortly."
};

// Function to check if a user is an admin
let isAdmin = (userId) => {
    return userId == config.admin;
};

// Function to log messages
function logMessage(message) {
    fs.appendFile('bot.log', message + '\n', (err) => {
        if (err) throw err;
    });
}

// Function to calculate uptime
let startTime = moment();
function getUptime() {
    const now = moment();
    const uptime = moment.duration(now.diff(startTime));
    return uptime.format('d [days], h [hours], m [minutes], s [seconds]');
}

// Function to forward messages to the admin
let forwardToAdmin = (ctx) => {
    if (isAdmin(ctx.message.from.id)) {
        ctx.reply(replyText.replyWrong);
    } else {
        ctx.forwardMessage(config.admin, ctx.from.id, ctx.message.id);
        logMessage(`Message from ${ctx.from.id}: ${ctx.message.text}`);
    }
};

// Bot command and message handlers
const bot = new Telegraf(config.token);

bot.start((ctx) => {
    ctx.reply(isAdmin(ctx.message.from.id) ? replyText.helloAdmin : replyText.helloUser);
    logMessage(`Start command used by ${ctx.from.id}`);
});

bot.command('help', (ctx) => ctx.reply(replyText.help));
bot.command('feedback', (ctx) => {
    ctx.reply(replyText.feedback);
    logMessage(`Feedback from ${ctx.from.id}: ${ctx.message.text}`);
});
bot.command('report', (ctx) => {
    ctx.reply(replyText.report);
    logMessage(`Report from ${ctx.from.id}: ${ctx.message.text}`);
});

bot.command('ping', async (ctx) => {
    const startTimestamp = Date.now();
    try {
        await bot.telegram.sendMessage(ctx.chat.id, 'Pong!');
        const endTimestamp = Date.now();
        const ping = endTimestamp - startTimestamp;
        ctx.reply(`Bot response time: ${ping} ms`);
    } catch (error) {
        console.error('Error sending message:', error);
        ctx.reply('An error occurred while checking ping. Please try again later.');
    }
});

bot.on('message', (ctx) => {
    if (ctx.message.reply_to_message && ctx.message.reply_to_message.forward_from && isAdmin(ctx.message.from.id)) {
        ctx.telegram.sendCopy(ctx.message.reply_to_message.forward_from.id, ctx.message);
    } else {
        forwardToAdmin(ctx);
    }
});

// Launching the bot
bot.launch()
    .then(() => console.log("Bot Launched"))
    .catch(console.error);

// Graceful stop handling
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
