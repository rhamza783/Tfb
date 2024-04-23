const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const ownerId = process.env.OWNER_ID; // Bot owner's Telegram ID

// Helper function to send a reply from the owner
const sendOwnerReply = (ctx, originalMessageId, text) => {
  ctx.telegram.sendMessage(ctx.chat.id, text, {
    reply_to_message_id: originalMessageId,
  });
};

bot.start((ctx) => ctx.reply('Welcome! Send me any feedback or message and I will forward it.'));
bot.help((ctx) => ctx.reply('You can use this bot to send messages. Just type your message and send it to me.'));

// Forward messages to the owner and wait for a reply
bot.on('text', (ctx) => {
  const feedback = ctx.message.text;
  ctx.telegram.forwardMessage(ownerId, ctx.from.id, ctx.message.message_id)
    .then((forwardedMessage) => {
      // Listen for the owner's reply to the forwarded message
      bot.on('message', (replyCtx) => {
        if (replyCtx.message.reply_to_message && replyCtx.message.reply_to_message.message_id === forwardedMessage.message_id) {
          sendOwnerReply(ctx, ctx.message.message_id, replyCtx.message.text);
        }
      });
    })
    .catch((error) => {
      console.error('Error forwarding message:', error);
      ctx.reply('There was an error sending your message. Please try again later.');
    });
});

bot.launch();
