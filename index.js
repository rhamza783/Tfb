const { Telegraf } = require('telegraf');
require('dotenv').config();
const fs = require('fs');

const bot = new Telegraf(process.env.BOT_TOKEN);
const ownerId = process.env.OWNER_ID; // Bot owner's Telegram ID
const userIDsFile = 'user_ids.txt'; // File to store user IDs

// Load existing user IDs from the file (if any)
let userIDs = [];
if (fs.existsSync(userIDsFile)) {
  const data = fs.readFileSync(userIDsFile, 'utf8');
  userIDs = data.split('\n').filter((id) => id.trim() !== '');
}

// Register the /help command
bot.command('help', (ctx) => {
  ctx.reply('Hey, I am Hamza Younis. How can I assist you? Feel free to chat with me.');
});

// Handle user messages
bot.on('text', (ctx) => {
  const userId = ctx.from.id;
  const userMessage = ctx.message.text;

  // Process the user's message (e.g., analyze it, determine the appropriate response)

  // Example: If the user sends "image", reply with an image
  if (userMessage.toLowerCase() === 'image') {
    ctx.replyWithPhoto({ source: 'path/to/your/image.jpg' });
  }
  // Example: If the user sends "video", reply with a video
  else if (userMessage.toLowerCase() === 'video') {
    ctx.replyWithVideo({ source: 'path/to/your/video.mp4' });
  }
  // Example: If the user sends "audio", reply with an audio file
  else if (userMessage.toLowerCase() === 'audio') {
    ctx.replyWithAudio({ source: 'path/to/your/audio.mp3' });
  }
  // Default response for other messages
  else {
    // Customize this response based on your requirements
    ctx.reply('Thank you for your message! Feel free to send any type of content.');
  }

  // Forward the message to the owner
  if (userId.toString() !== ownerId) {
    console.log(`Forwarding message from ${userId} to owner.`);
    ctx.telegram.forwardMessage(ownerId, userId, ctx.message.message_id)
      .then((forwardedMessage) => {
        console.log(`Message forwarded to owner with message ID: ${forwardedMessage.message_id}`);
        // Store the mapping of the forwarded message to the original sender's ID
        userIDs.push(userId.toString());
        fs.writeFileSync(userIDsFile, userIDs.join('\n'));
      })
      .catch((error) => {
        console.error('Error forwarding message:', error);
        ctx.reply('There was an error sending your message. Please try again later.');
      });
  }
});

// Register the /broadcast command
bot.command('broadcast', (ctx) => {
  const broadcastMessage = 'Hello, this is a broadcast message from your bot!'; // Set your desired broadcast message
  userIDs.forEach((userID) => {
    ctx.telegram.sendMessage(userID, broadcastMessage)
      .catch((error) => {
        console.error(`Error sending broadcast message to user ID: ${userID}`, error);
      });
  });
  ctx.reply('Broadcast sent to all users.');
});

// Start polling
bot.launch();

// Start polling
bot.launch();
