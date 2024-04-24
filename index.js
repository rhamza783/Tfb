const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const ownerId = process.env.OWNER_ID; // Bot owner's Telegram ID
let userFeedbackMap = new Map(); // Map to track user IDs and their feedback message IDs

// Register the /help command
bot.command('help', (ctx) => {
  ctx.reply('How can I assist you?');
});

// Register the /about command
bot.command('about', (ctx) => {
  ctx.reply('This is a Telegram bot created using Telegraf.');
});

// Register the /ping command with response time
bot.command('ping', (ctx) => {
  const startTime = Date.now(); // Record the start time
  const args = ctx.message.text.split(' ').slice(1); // Split the message text and remove the first element (/ping)
  const responseTime = Date.now() - startTime; // Calculate the response time
  let response = `Pong!\nResponse time: ${responseTime} ms`;
  if (args.length > 0) {
    response += `\nReceived parameters: ${args.join(', ')}`;
  }
  ctx.reply(response);
});

// Function to forward messages from users to the owner
bot.on('text', (ctx) => {
  if (ctx.from.id.toString() !== ownerId) {
    ctx.telegram.forwardMessage(ownerId, ctx.from.id, ctx.message.message_id)
      .then((forwardedMessage) => {
        // Store the mapping of the forwarded message to the original sender's ID
        userFeedbackMap.set(forwardedMessage.message_id, ctx.from.id);
      })
      .catch((error) => {
        console.error('Error forwarding message:', error);
        ctx.reply('There was an error sending your message. Please try again later.');
      });
  }
});

// Function to handle replies from the owner and forward them to the original sender
bot.on('text', (ctx) => {
  if (ctx.from.id.toString() === ownerId && ctx.message.reply_to_message) {
    const originalMessageId = ctx.message.reply_to_message.message_id;
    if (userFeedbackMap.has(originalMessageId)) {
      const targetUserId = userFeedbackMap.get(originalMessageId);
      ctx.telegram.sendMessage(targetUserId, ctx.message.text)
        .then(() => {
          // Optionally, remove the mapping once the reply is sent
          userFeedbackMap.delete(originalMessageId);
        })
        .catch((error) => {
          console.error('Error sending reply:', error);
        });
    }
  }
});

bot.launch();
