console.log("game.js is loaded");

const gameState = {
    currentScene: 'lobby',
    watchParts: 0,
    timeLimit: 0,
    gameStartTime: 0,
    keys: {},
    miloPosition: { x: 100, y: 500 },
    miloVelocity: { x: 0, y: 0 },
    onGround: true,
    gameCompleted: false,
    level1Objects: [],
    level2Sequence: [],
    level2PlayerSequence: [],
    level3SafeSands: [],
    level4Stones: [],
    selectedObjectIndex: -1,
    volume: 50
};

function initGameState() {
    try {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            console.log("Loading game state from localStorage");
            Object.assign(gameState, JSON.parse(savedState));
        } else {
            console.log("No saved game state found");
        }
    } catch (e) {
        console.error("Error parsing game state from localStorage:", e);
        localStorage.removeItem('gameState');
    }
}

function saveGameState() {
    try {
        localStorage.setItem('gameState', JSON.stringify(gameState));
        console.log("Game state saved");
    } catch (e) {
        console.error("Error saving game state to localStorage:", e);
    }
}

function drawMilo(ctx) {
    console.log("Drawing Milo at", gameState.miloPosition);
    const { x, y } = gameState.miloPosition;

    ctx.fillStyle = '#FFA500';
    ctx.fillRect(x - 15, y - 30, 30, 25);

    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.arc(x, y - 40, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FF8C00';
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 50);
    ctx.lineTo(x - 15, y - 35);
    ctx.lineTo(x - 5, y - 35);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + 10, y - 50);
    ctx.lineTo(x + 15, y - 35);
    ctx.lineTo(x + 5, y - 35);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x - 5, y - 42, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 5, y - 42, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(x + 20, y - 15, 15, 0, Math.PI);
    ctx.stroke();
}

function updateMilo() {
    if (gameState.keys['a']) {
        gameState.miloVelocity.x = -3;
    } else if (gameState.keys['d']) {
        gameState.miloVelocity.x = 3;
    } else {
        gameState.miloVelocity.x *= 0.85;
    }

    if ((gameState.keys[' '] || gameState.keys['w']) && gameState.onGround) {
        gameState.miloVelocity.y = -15;
        gameState.onGround = false;
    }

    gameState.miloVelocity.y += 0.8;
    gameState.miloPosition.x += gameState.miloVelocity.x;
    gameState.miloPosition.y += gameState.miloVelocity.y;

    if (gameState.miloPosition.x < 20) gameState.miloPosition.x = 20;
    if (gameState.miloPosition.x > 980) gameState.miloPosition.x = 980;

    if (gameState.miloPosition.y > 550) {
        gameState.miloPosition.y = 550;
        gameState.miloVelocity.y = 0;
        gameState.onGround = true;
    }
}

function drawPocketWatch(ctx, x, y) {
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
}

function updateUI() {
    document.getElementById('currentScene').textContent =
        gameState.currentScene === 'lobby' ? 'Lobby' :
            gameState.currentScene === 'level1' ? 'Level 1 - Machu Picchu' :
                gameState.currentScene === 'level2' ? 'Level 2 - Pyramid' :
                    gameState.currentScene === 'level3' ? 'Level 3 - Amazon' :
                        gameState.currentScene === 'level4' ? 'Level 4 - Great Wall' :
                            'Game Complete';

    document.getElementById('watchParts').textContent = `${gameState.watchParts}/4`;

    if (gameState.timeLimit > 0 && !gameState.gameCompleted) {
        const elapsed = (Date.now() - gameState.gameStartTime) / 1000;
        const remaining = Math.max(0, gameState.timeLimit - elapsed);
        document.getElementById('timer').textContent = Math.ceil(remaining) + 's';
        return remaining;
    } else {
        document.getElementById('timer').textContent = '--';
        return null;
    }
}

function showStory(title, content, callback) {
    document.getElementById('storyTitle').textContent = title;
    document.getElementById('storyContent').textContent = content;
    document.getElementById('storyText').classList.remove('hidden');
    window.storyCallback = callback;
}

function continueStory() {
    document.getElementById('storyText').classList.add('hidden');
    if (window.storyCallback) {
        window.storyCallback();
        window.storyCallback = null;
    }
}

function toggleSettings() {
    const settingsDiv = document.getElementById('settings');
    settingsDiv.classList.toggle('hidden');
    document.getElementById('settingsBtn').disabled = !settingsDiv.classList.contains('hidden');
}

function adjustVolume(change) {
    gameState.volume = Math.max(0, Math.min(100, gameState.volume + change));
    document.getElementById('volumeLevel').textContent = gameState.volume;
}