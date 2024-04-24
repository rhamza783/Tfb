const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const ownerId = process.env.OWNER_ID; // Bot owner's Telegram ID
let userFeedbackMap = new Map(); // Map to track user IDs and their feedback message IDs

// ... other command definitions (help, about, ping)

// Function to handle messages from the admin
bot.on('text', (ctx) => {
  if (ctx.from.id.toString() === ownerId) {
    // Check if the message starts with a username followed by a colon
    if (ctx.message.text.startsWith('@') && ctx.message.text.includes(':')) {
      const parts = ctx.message.text.split(':');
      const username = parts[0].slice(1); // Extract username without "@" symbol
      const message = parts[1].trim(); // Extract the message content

      // Find the user ID using username (implement username lookup logic here)
      const targetUserId = findUserIdByUsername(username);

      if (targetUserId) {
        ctx.telegram.sendMessage(targetUserId, message)
          .then(() => console.log(`Message sent to user ID: ${targetUserId}`))
          .catch((error) => {
            console.error('Error sending message:', error);
            ctx.reply('There was an error sending your message. Please try again later.');
          });
      } else {
        ctx.reply('User not found.');
      }
    } else {
      // Handle other messages from the admin (e.g., broadcast messages)
      // ...
    }
  } else {
    // Forward messages from users to the owner
    // ... (existing logic)
  }
});

// Implement logic to find user ID by username (replace with your method)
function findUserIdByUsername(username) {
  // Replace this with your actual username lookup logic using Telegram API
  console.warn('Username lookup not implemented. Add your username lookup logic here.');
  return null;
}

// Start polling
bot.launch();
