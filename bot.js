const mineflayer = require('mineflayer');

function createBot() {
    const bot = mineflayer.createBot({
        host: 'SMP_8Green.aternos.me', // Replace with your Aternos server IP
        port: 34118, // Replace with the correct port (default: 25565)
        username: 'SMP_8Green' // Change this to your bot's username
    });

    // Log when the bot joins the server
    bot.on('spawn', () => {
        console.log('✅ Bot has joined the server!');
        moveRandomly(); // Start moving to avoid AFK kicks
    });

    // Reconnect when kicked or disconnected
    bot.on('kicked', (reason) => {
        console.log(`❌ Bot was kicked: ${reason}`);
        reconnect();
    });

    bot.on('error', (err) => {
        console.log(`⚠️ Bot error: ${err}`);
        reconnect();
    });

    bot.on('end', () => {
        console.log('🔄 Bot disconnected. Reconnecting in 5 seconds...');
        reconnect();
    });

    // Function to make the bot move randomly
    function moveRandomly() {
        setInterval(() => {
            const x = Math.random() * 10 - 5; // Move randomly within 10 blocks
            const z = Math.random() * 10 - 5;
            bot.setControlState('forward', true);
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 200);
            bot.lookAt(bot.entity.position.offset(x, 0, z));
        }, 5000); // Move every 5 seconds
    }

    // Function to reconnect the bot
    function reconnect() {
        setTimeout(() => {
            console.log('🔄 Reconnecting bot...');
            createBot();
        }, 30000);
    }
}

// Start the bot
createBot();
