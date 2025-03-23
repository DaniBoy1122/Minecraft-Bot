const { createBot } = require('mineflayer');
const { pathfinder, goals: { GoalBlock } } = require('mineflayer-pathfinder');
const crypto = require('crypto');

// Function to generate a fixed UUID in offline mode
function getOfflineUUID(username) {
    const hash = crypto.createHash('md5').update("OfflinePlayer:" + username).digest('hex');
    return hash.substr(0, 8) + '-' + hash.substr(8, 4) + '-' + hash.substr(12, 4) + '-' +
           hash.substr(16, 4) + '-' + hash.substr(20);
}

// Set bot username and UUID
const botUsername = 'SMP_8Green_B0T'; // Change this to your bot's name
const botUUID = '259FA7C3-49B2-483B-8A26-8B7A716B04E7'; // Fixed UUID
const offlineUUID = getOfflineUUID(botUsername); // If using offline mode

// Function to create and connect the bot
function createAndConnectBot() {
    const bot = createBot({
        host: 'SMP_8Green.aternos.me', // Replace with your server IP
        port: 34118, // Change if using a custom port
        username: botUsername,
        auth: 'auth', // Use 'microsoft' for official accounts
        profiles: {
            mojang: {
                uuid: botUUID, // Use fixed UUID
            }
        }
    });

    bot.loadPlugin(pathfinder);

    // Handle bot connection
    bot.on('login', () => {
        console.log(`✅ Bot ${botUsername} logged in with UUID: ${botUUID}`);
    });

    // Handle errors and reconnection
    bot.on('error', (err) => {
        console.log(`⚠️ Bot error: ${err.message}`);
        if (err.code === 'ECONNRESET') {
            console.log('🔄 Connection lost, reconnecting...');
            setTimeout(createAndConnectBot, 5000); // Reconnect bot
        }
    });

    // Handle bot kicks
    bot.on('kicked', (reason) => {
        console.log(`❌ Bot was kicked: ${reason}`);
        console.log('🔄 Reconnecting bot in 60 seconds...');
        setTimeout(createAndConnectBot, 60000); // Reconnect bot
    });

    // Handle movement
    bot.on('spawn', () => {
        console.log('🟢 Bot spawned in the world!');

        function moveRandomly() {
            const x = bot.entity.position.x + (Math.random() * 10 - 5);
            const z = bot.entity.position.z + (Math.random() * 10 - 5);
            bot.pathfinder.setGoal(new GoalBlock(x, bot.entity.position.y, z));
        }

        setInterval(moveRandomly, 5000); // Move every 5 seconds
    });

    // Keep bot alive
    bot.on('end', () => {
        console.log('🔄 Bot disconnected. Restarting in 10 seconds...');
        setTimeout(createAndConnectBot, 10000); // Restart bot
    });
}

// Start the bot
createAndConnectBot();
