const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
    host: "SMP_8Green.aternos.me", // Replace with your Aternos server IP
    port: 34118, // Default Minecraft port
    username: "SMP_8Green" // Replace with a bot name
});

// Prevent AFK kicks by moving randomly
function antiAfk() {
    setInterval(() => {
        const yaw = Math.random() * Math.PI * 2; // Random direction
        const pitch = (Math.random() - 0.5) * Math.PI; // Random up/down look
        bot.look(yaw, pitch, true); // Move head
        bot.setControlState('jump', true); // Jump randomly
        setTimeout(() => bot.setControlState('jump', false), 500); // Stop jumping
    }, 30000); // Every 30 seconds
}

bot.on('login', () => {
    console.log("Bot has joined the server!");
    antiAfk(); // Start Anti-AFK function
});

bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    bot.chat(`Hello ${username}, you said: '${message}'`);
});

bot.on('spawn', () => {
    console.log("Bot is now active!");
});

bot.on('end', () => {
    console.log("Bot has been disconnected! Reconnecting...");
    setTimeout(() => process.exit(1), 5000); // Restart bot after 5 seconds
});
