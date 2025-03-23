const mineflayer = require('mineflayer');

function createBot() {
    const bot = mineflayer.createBot({
        host: 'SMP_8Green.aternos.me', // Replace with your Aternos server IP
        port: 34118, // Replace with the correct port (default: 25565)
        username: 'SMP_8Green' // Change this to your bot's username
    });

    // ✅ Make sure all bot events are inside createBot
    bot.on('spawn', () => {
        console.log('✅ Bot has joined the server!');
        moveRandomly(); // Start moving to avoid AFK kicks
    });

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

    bot.on('message', (message) => {
        console.log(`💬 Chat: ${message}`);
    });

    bot.on('login', () => {
        console.log('🔓 Bot logged in successfully!');
    });

    bot.on('disconnect', (reason) => {
        console.log(`⚠️ Bot disconnected: ${reason}`);
        reconnect();
    });

    bot.on('error', (err) => {
        if (err.code === 'ECONNRESET') {
            console.log('⚠️ Connection reset by server. Reconnecting...');
        } else {
            console.log(`⚠️ Bot error: ${err.message}`);
        }
        reconnect();
    });

    // Function to make the bot move randomly
    function moveRandomly() {
        setInterval(() => {
            if (!bot.entity) return;
            const x = Math.random() * 10 - 5;
            const z = Math.random() * 10 - 5;
            bot.setControlState('forward', true);
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 200);
            bot.lookAt(bot.entity.position.offset(x, 0, z));
        }, 5000);
    }

    // Function to reconnect the bot
    function reconnect() {
        setTimeout(() => {
            console.log('🔄 Reconnecting bot...');
            createBot();
        }, 30000);
    }
}

// ✅ Start the bot
createBot();


// ✅ Start the bot
createBot();
