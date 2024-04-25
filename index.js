// index.js
// Required modules
const Telegraf = require('telegraf');
const fs = require('fs'); // For logging to a file

// General settings
let config = {
    "token": process.env.BOT_TOKEN, // Use environment variable for the bot token
    "admin": process.env.OWNER_ID // Use environment variable for the admin ID
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

// Function to forward messages to the admin
let forwardToAdmin = (ctx) => {
    if (isAdmin(ctx.message.from.id)) {
        ctx.reply(replyText.replyWrong);
    } else {
        ctx.forwardMessage(config.admin, ctx.from.id, ctx.message.id);
        logMessage(`Message from ${ctx.from.id}: ${ctx.message.text}`);
    }
};

// Function to add a user ID to the file
function addUser(userId) {
    fs.appendFileSync('user_ids.txt', userId + '\n');
}

// Function to get all user IDs
function getAllUserIds() {
    try {
        return fs.readFileSync('user_ids.txt', 'utf8').split('\n').filter(Boolean);
    } catch (error) {
        console.error('Error reading user IDs:', error);
        return [];
    }
}

// Function to broadcast a message to all users
function broadcastMessage(message) {
    let allUserIds = getAllUserIds();
    allUserIds.forEach(userId => {
        bot.telegram.sendMessage(userId, message).catch(error => {
            console.error(`Failed to send message to ${userId}:`, error);
        });
    });
}

// Bot command and message handlers
const bot = new Telegraf(config.token);

bot.start((ctx) => {
    addUser(ctx.from.id.toString());
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

bot.command('broadcast', (ctx) => {
    if (isAdmin(ctx.from.id)) {
        let message = ctx.message.text.split(' ').slice(1).join(' ');
        broadcastMessage(message);
        ctx.reply('Broadcast sent.');
    } else {
        ctx.reply('You do not have permission to use this command.');
    }
});

bot.on('message', (ctx) => {
    forwardToAdmin(ctx);
});

// Launching the bot
bot.launch()
    .then(() => console.log("Bot Launched"))
    .catch(console.error);

// Graceful stop handling
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
