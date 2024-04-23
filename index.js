const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const ownerId = process.env.OWNER_ID; // Bot owner's Telegram ID
let userFeedbackMap = new Map(); // Map to track user IDs and their feedback message IDs

bot.start((ctx) => ctx.reply('Welcome! Send me any feedback or message and I will forward it.'));
bot.help((ctx) => ctx.reply('You can use this bot to send messages. Just type your message and send it to me.'));
bot.command('about', (ctx) => ctx.reply('Feedback Bot v1.0. Created to collect user feedback and improve our services.'));

// Forward messages to the owner and store the mapping
bot.on('text', (ctx) => {
  if (ctx.from.id.toString() !== ownerId) {
    ctx.telegram.forwardMessage(ownerId, ctx.from.id, ctx.message.message_id)
      .then((forwardedMessage) => {
        userFeedbackMap.set(forwardedMessage.message_id, ctx.from.id);
      })
      .catch((error) => {
        console.error('Error forwarding message:', error);
        ctx.reply('There was an error sending your message. Please try again later.');
      });
  }
});

// Listen for the owner's reply to the forwarded message
bot.on('text', (ctx) => {
  if (ctx.from.id.toString() === ownerId && 'reply_to_message' in ctx.message) {
    const originalMessageId = ctx.message.reply_to_message.message_id;
    if (userFeedbackMap.has(originalMessageId)) {
      const userId = userFeedbackMap.get(originalMessageId);
      ctx.telegram.sendMessage(userId, ctx.message.text)
        .then(() => {
          userFeedbackMap.delete(originalMessageId); // Remove the entry after replying
        });
    }
  }
});

bot.launch();
