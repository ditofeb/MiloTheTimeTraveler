const gameState = {
    currentScene: 'lobby',
    watchParts: 0,
    timeLimit: 0,
    gameStartTime: 0,
    keys: {},
    mouse: { x: 0, y: 0, isDown: false },
    draggedObject: null,
    level1Objects: [],
    level2Sequence: [],
    level2PlayerSequence: [],
    level3SafeSands: [],
    level4Stones: [],
    miloPosition: { x: 100, y: 500 },
    miloVelocity: { x: 0, y: 0 },
    onGround: true,
    gameCompleted: false,
    interactionPressed: false,
};

let isPaused = false;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

document.addEventListener('keydown', (e) => {
    gameState.keys[e.key.toLowerCase()] = true;
    if (e.key === ' ') e.preventDefault();
    if (e.key === 'Escape') {
        if (!isPaused) {
            pauseGame();
        } else {
            resumeGame();
        }
    }
});

document.addEventListener('keyup', (e) => {
    gameState.keys[e.key.toLowerCase()] = false;
});

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    gameState.mouse.x = e.clientX - rect.left;
    gameState.mouse.y = e.clientY - rect.top;
    gameState.mouse.isDown = true;
    handleMouseDown();
});

canvas.addEventListener('mouseup', (e) => {
    gameState.mouse.isDown = false;
    if (gameState.draggedObject) {
        handleObjectDrop();
    }
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    gameState.mouse.x = e.clientX - rect.left;
    gameState.mouse.y = e.clientY - rect.top;
});

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

function drawMilo() {
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

    const tailOffset = Math.sin(Date.now() / 150) * 5;
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(x + 20, y - 15 + tailOffset, 15, 0, Math.PI);
    ctx.stroke();
}

function playCollectSound() {
    const audio = document.getElementById('collectSound');
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(err => {
            console.warn('Autoplay blocked or error:', err);
        });
    }
}

function drawPocketWatch(x, y) {
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

        if (remaining <= 0) {
            if (gameState.currentScene === 'level1') startLevel1();
            else if (gameState.currentScene === 'level2') startLevel2();
            else if (gameState.currentScene === 'level3') startLevel3();
            else if (gameState.currentScene === 'level4') startLevel4();
        }
    } else {
        document.getElementById('timer').textContent = '--';
    }
}

function fadeOutIn(callback) {
    const overlay = document.getElementById('fadeOverlay');
    overlay.style.transition = 'opacity 0.8s';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';

    setTimeout(() => {
        if (callback) callback();
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.pointerEvents = 'none';
        }, 800);
    }, 800);
}

function stopAllMusic() {
    const tracks = ['lobby', 'level1', 'level2', 'level3', 'level4', 'ending'];
    tracks.forEach(id => {
        const audio = document.getElementById(`music-${id}`);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
}

function playMusic(id) {
    stopAllMusic();
    const audio = document.getElementById(`music-${id}`);
    if (audio) {
        audio.volume = 0.9;
        audio.play().catch(e => console.warn("Autoplay blocked:", e));
    }
}

function startGame() {
    fadeOutIn(() => {
        document.getElementById('mainMenu').style.display = 'none';
        initLobby();
        gameLoop();
    });
}

function pauseGame() {
    isPaused = true;
    document.getElementById('pauseMenu').style.display = 'flex';
}

function resumeGame() {
    isPaused = false;
    document.getElementById('pauseMenu').style.display = 'none';
    requestAnimationFrame(gameLoop);
}

function showInstructions() {
    const modal = document.getElementById('instructionsModal');
    const menu = document.getElementById('mainMenu');
    modal.classList.remove('hidden');
    menu.style.display = 'none';  // Sembunyikan Main Menu
}

function closeInstructions() {
    const modal = document.getElementById('instructionsModal');
    const menu = document.getElementById('mainMenu');
    modal.classList.add('hidden');
    menu.style.display = 'flex';  // Munculkan Main Menu lagi
}


