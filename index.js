const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const ownerId = process.env.OWNER_ID; // Bot owner's Telegram ID
let userFeedbackMap = new Map(); // Map to track user IDs and their feedback message IDs

// Register the /help command
bot.command('help', (ctx) => {
  ctx.reply('Hey, I am Hamza Younis. How can I assist you? Feel free and chat with me.');
});

// Register the /about command
bot.command('about', (ctx) => {
  ctx.reply('This is a Telegram bot created using Telegraf by Hamza Younis.');
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
    console.log(`Forwarding message from ${ctx.from.id} to owner.`);
    ctx.telegram.forwardMessage(ownerId, ctx.from.id, ctx.message.message_id)
      .then((forwardedMessage) => {
        console.log(`Message forwarded to owner with message ID: ${forwardedMessage.message_id}`);
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
  // Check if the message is a reply from the owner
  if (ctx.from.id.toString() === ownerId && ctx.message.reply_to_message) {
    console.log(`Owner is replying to message ID: ${ctx.message.reply_to_message.message_id}`);
    // Retrieve the original message ID from the forwarded message
    const forwardedMessageId = ctx.message.reply_to_message.message_id;
    // Check if the original message ID is stored in the map
    if (userFeedbackMap.has(forwardedMessageId)) {
      // Retrieve the original user's ID
      const originalUserId = userFeedbackMap.get(forwardedMessageId);
      console.log(`Attempting to send reply to original user ID: ${originalUserId}`);
      // Send the owner's reply to the original user
      ctx.telegram.sendMessage(originalUserId, ctx.message.text)
        .then(() => {
          console.log(`Reply successfully sent to user ID: ${originalUserId}`);
          // Optionally, remove the mapping once the reply is sent
          userFeedbackMap.delete(forwardedMessageId);
        })
        .catch((error) => {
          console.error(`Error sending reply to user ID: ${originalUserId}`, error);
        });
    } else {
      console.log(`No mapping found for forwarded message ID: ${forwardedMessageId}`);
    }
  }
});

// Start polling
bot.launch();
