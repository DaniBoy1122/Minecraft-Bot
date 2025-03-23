const mineflayer = require('mineflayer');
const { v4: uuidv4 } = require('uuid'); // Import UUID generator

function createBot() {
    const bot = mineflayer.createBot({
        host: 'SMP_8Green.aternos.me', // Your server IP
        port: 34118, // Your server port (default: 25565)
        username: 'SMP_8Green', // Change to your bot's name
        auth: 'offline', // Offline mode login
        fakeUUID: uuidv4() // Assign a unique UUID to prevent duplicate login issues
    });

    // Log when the bot joins the server
    bot.on('spawn', () => {
        console.log('✅ Bot has joined the server!');
        moveRandomly(); // Prevent AFK kicks
    });

    // Handle kicked events
    bot.on('kicked', (reason) => {
        console.log(`❌ Bot was kicked: ${reason}`);
        reconnect();
    });

    // Handle errors
    bot.on('error', (err) => {
        console.log(`⚠️ Bot error: ${err}`);
        reconnect();
    });

    // Handle disconnection
    bot.on('end', () => {
        console.log('🔄 Bot disconnected. Reconnecting in 30 seconds...');
        reconnect();
    });

    // Function to move randomly and prevent AFK kicks
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

    // Function to kill other bot instances before reconnecting
    function killOtherInstances() {
        const { exec } = require('child_process');
        exec('taskkill /F /IM node.exe', (err, stdout, stderr) => {
            if (err) {
                console.error(`⚠️ Error killing other instances: ${err.message}`);
                return;
            }
            console.log('✅ Killed all other bot instances.');
        });
    }

    // Function to reconnect the bot
    function reconnect() {
        setTimeout(() => {
            console.log('🔄 Reconnecting bot...');
            killOtherInstances(); // Kill duplicate instances before reconnecting
            createBot();
        }, 30000);
    }
}

// Force garbage collection every 1 minute to optimize memory
setInterval(() => {
    if (global.gc) {
        global.gc();
        console.log("🗑️ Forced garbage collection.");
    }
}, 60000);

createBot();
