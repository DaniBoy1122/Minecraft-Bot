const mineflayer = require('mineflayer');

function createBot() {
    const bot = mineflayer.createBot({
        host: 'SMP_8Green.aternos.me', // Replace with your server IP
        port: 34118, // Replace with your port (default: 25565)
        username: 'SMP_8Green' // Change this to your bot's username
    });

    // Log when the bot joins
    bot.on('spawn', () => {
        console.log('✅ Bot has joined the server!');
        moveRandomly(); // Start moving to avoid AFK kicks
    });

    // Handle kicks (Fixed logging)
    bot.on('kicked', (reason) => {
        console.log(`❌ Bot was kicked: ${JSON.stringify(reason, null, 2)}`);
        reconnect();
    });

    // Handle errors (Prints detailed error info)
    bot.on('error', (err) => {
        console.error(`⚠️ Bot error:`, err);
        reconnect();
    });

    // Handle disconnections
    bot.on('end', () => {
        console.log('🔄 Bot disconnected. Reconnecting...');
        reconnect();
    });

    // Function to make the bot move randomly
    function moveRandomly() {
        setInterval(() => {
            if (!bot.entity) return; // Ensure bot is still active
            const x = Math.random() * 10 - 5;
            const z = Math.random() * 10 - 5;
            bot.setControlState('forward', true);
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 200);
            bot.lookAt(bot.entity.position.offset(x, 0, z));
        }, 5000);
    }

    // Function to reconnect the bot after a delay
    function reconnect() {
        const delay = 120000; // 2 minutes (to avoid connection throttling)
        console.log(`🔄 Reconnecting bot in ${delay / 1000} seconds...`);
        setTimeout(createBot, delay);
    }
}

// Start the bot
createBot();

// Optional garbage collection (only if Node.js is run with --expose-gc)
setInterval(() => {
    if (global.gc) {
        global.gc();
        console.log("🗑️ Forced garbage collection.");
    }
}, 60000);
