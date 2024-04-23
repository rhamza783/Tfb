#!/bin/bash
# Custom Telegram Bot Setup Script
clear

# ASCII art header
echo -e "\033[1;94m"
echo "████████╗ ██████╗ ██████╗  █████╗ "
echo "╚══██╔══╝██╔════╝ ██╔══██╗██╔══██╗"
echo "   ██║   ██║  ███╗██████╔╝███████║"
echo "   ██║   ██║   ██║██╔══██╗██╔══██║"
echo "   ██║   ╚██████╔╝██║  ██║██║  ██║"
echo "   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝"
echo -e "\033[0m"
echo "Setup Script for Telegram Bot"
echo "GitHub: github.com/7ife"
echo "E-mail: 7ife@pm.me"

# Install NodeJS and Telegraf
echo "Installing NodeJS and Telegraf..."
apt install nodejs -y
apt update -y
npm install -g telegraf

# Prompt for bot token
read -p "Enter your bot token from @BotFather: " botToken
if [[ $botToken != "" ]]; then
  echo "BOT_TOKEN=$botToken" > .env
fi

# Prompt for owner ID
read -p "Enter your Telegram ID (use @userinfobot to find it): " adminId
if [[ $adminId != "" ]]; then
  echo "OWNER_ID=$adminId" >> .env
fi

# Install dependencies and start the bot
echo "Installing dependencies..."
npm i
echo "Starting the bot..."
npm start

# Keep the script running
while true; do sleep 5; done
