const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const ownerId = process.env.OWNER_ID; // Bot owner's Telegram ID
let userFeedbackMap = new Map(); // Map to track user IDs and their feedback message IDs
const punycode = require('punycode.js');

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
