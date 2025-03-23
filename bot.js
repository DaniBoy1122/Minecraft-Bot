const mineflayer = require('mineflayer');

function createBot() {
    const bot = mineflayer.createBot({
        host: 'SMP_8Green.aternos.me', // Your server IP
        port: 34118, // Your server port (default is 25565)
        username: 'SMP_8Green', // Your bot's username
        uuid: '2A00B8AF-7C67-309E-89FF-6F8C709FB038' // Fixed UUID
    });

    // Log when the bot joins the server
    bot.on('spawn', () => {
        console.log('✅ Bot has joined the server!');
        moveRandomly(); // Start moving to avoid AFK kicks
    });

    // Prevent duplicate logins
    bot.on('kicked', (reason) => {
        console.log(`❌ Bot was kicked: ${reason}`);
        reconnect();
    });

    bot.on('error', (err) => {
        console.log(`⚠️ Bot error: ${err}`);
        reconnect();
    });

    bot.on('end', () => {
        console.log('🔄 Bot disconnected. Reconnecting in 120 seconds...');
        reconnect();
    });

    // Move bot randomly to prevent AFK kicks
    function moveRandomly() {
        setInterval(() => {
            const x = Math.random() * 10 - 5;
            const z = Math.random() * 10 - 5;
            bot.setControlState('forward', true);
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 200);
            bot.lookAt(bot.entity.position.offset(x, 0, z));
        }, 5000);
    }

    // Function to reconnect the bot after 2 minutes
    function reconnect() {
        setTimeout(() => {
            console.log('🔄 Reconnecting bot...');
            createBot();
        }, 120000); // 2 minutes delay to avoid throttling
    }
}

// Start the bot
createBot();

