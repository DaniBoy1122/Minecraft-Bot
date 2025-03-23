const mineflayer = require('mineflayer');

function createBot() {
    const bot = mineflayer.createBot({
        host: 'SMP_8Green.aternos.me', // Replace with your Aternos server IP
        port: 34118, // Replace with the correct port (default: 25565)
        username: 'SMP_8Green', // Bot username
        auth: 'offline', // Set to 'microsoft' if using online mode
        uuid: '2A00B8AF-7C67-309E-89FF-6F8C709FB038' // Fixed UUID
    });

    bot.on('spawn', () => {
        console.log('✅ Bot has joined the server!');
        moveRandomly(); // Start anti-AFK movement
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
        console.log('🔄 Bot disconnected. Reconnecting in 60 seconds...');
        reconnect();
    });

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

    function reconnect() {
        setTimeout(() => {
            console.log('🔄 Reconnecting bot...');
            createBot();
        }, 60000); // Wait 60 seconds to avoid throttling
    }
}

createBot();
