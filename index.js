const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome to the Feedback Bot! Send me any feedback and I\'ll forward it. Type /help for more commands.'));
bot.help((ctx) => ctx.reply('You can use this bot to send anonymous feedback. Just type your message and send it to me. Use /about to learn more about this bot.'));
bot.command('about', (ctx) => ctx.reply('Feedback Bot v1.0. Created to collect user feedback and improve our services.'));
bot.command('ping', (ctx) => {
  const start = new Date();
  ctx.reply('Pong!').then(() => {
    const end = new Date();
    ctx.reply(`Response time: ${end - start} ms`);
  });
});
bot.on('text', (ctx) => {
  const feedback = ctx.message.text;
  const ownerId = process.env.OWNER_ID;
  let replyMessage = 'Thank you for your feedback!';
  if (feedback.includes('bug')) {
    replyMessage += ' We will look into the issue.';
  } else if (feedback.includes('feature')) {
    replyMessage += ' Feature requests are always welcome!';
  }
  ctx.telegram.forwardMessage(ownerId, ctx.from.id, ctx.message.message_id)
    .then(() => {
      ctx.reply(replyMessage);
    })
    .catch((error) => {
      console.error('Error forwarding message:', error);
      ctx.reply('There was an error sending your feedback. Please try again later.');
    });
});

bot.launch();
