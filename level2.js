function startLevel2() {
    gameState.currentScene = 'level2';
    playMusic('level2');
    gameState.timeLimit = 45;
    gameState.gameStartTime = Date.now();
    gameState.miloPosition = { x: 100, y: 500 };
    gameState.level2Sequence = [];
    gameState.level2PlayerSequence = [];

    updateUI();
    showStory(
        "Pyramid Chamber - Sound of the Pharaoh",
        "Milo finds himself in a mysterious pyramid chamber. The sacred stones glow with ancient power. He must repeat the sequence they show!",
        () => {
            setTimeout(() => startLevel2Sequence(), 1000);
        }
    );
}

function startLevel2Sequence() {
    const sequenceLength = 3 + gameState.watchParts;
    gameState.level2Sequence = [];
    for (let i = 0; i < sequenceLength; i++) {
        gameState.level2Sequence.push(Math.floor(Math.random() * 4));
    }
    gameState.level2PlayerSequence = [];
    playSequence();
}

function playSequence() {
    let index = 0;
    const interval = setInterval(() => {
        if (index >= gameState.level2Sequence.length) {
            clearInterval(interval);
            return;
        }

        const stoneIndex = gameState.level2Sequence[index];
        playStoneSound(stoneIndex);
        index++;
    }, 800);
}

function playStoneSound(stoneIndex) {
    setTimeout(() => { }, 100);
}

function checkLevel2Sequence() {
    if (gameState.level2PlayerSequence.length === gameState.level2Sequence.length) {
        let correct = true;
        for (let i = 0; i < gameState.level2Sequence.length; i++) {
            if (gameState.level2PlayerSequence[i] !== gameState.level2Sequence[i]) {
                correct = false;
                break;
            }
        }

        if (correct) {
            setTimeout(() => {
                drawPocketWatch(500, 300);
            }, 1000);
        } else {
            setTimeout(() => {
                startLevel2Sequence();
            }, 1000);
        }
    }
}

function drawLevel2() {
    const gradient = ctx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, '#8B4513');
    gradient.addColorStop(1, '#CD853F');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1000, 600);

    ctx.fillStyle = '#696969';
    ctx.fillRect(0, 550, 1000, 50);

    const stones = [
        { x: 300, y: 400, color: '#FF6B6B' },
        { x: 400, y: 400, color: '#4ECDC4' },
        { x: 500, y: 400, color: '#45B7D1' },
        { x: 600, y: 400, color: '#96CEB4' }
    ];

    stones.forEach((stone, index) => {
        ctx.fillStyle = stone.color;
        ctx.beginPath();
        ctx.arc(stone.x, stone.y, 25, 0, Math.PI * 2);
        ctx.fill();

        const currentTime = Date.now();
        if (gameState.level2PlayerSequence.length < gameState.level2Sequence.length) {
            const expectedIndex = gameState.level2Sequence[gameState.level2PlayerSequence.length];
            if (index === expectedIndex && Math.sin(currentTime / 200) > 0) {
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 4;
                ctx.stroke();
            }
        }
    });

    if (gameState.level2PlayerSequence.length === gameState.level2Sequence.length &&
        gameState.level2PlayerSequence.every((val, i) => val === gameState.level2Sequence[i])) {
        drawPocketWatch(500, 300);
        if (Math.abs(gameState.miloPosition.x - 500) < 50 && Math.abs(gameState.miloPosition.y - 300) < 100) {
            ctx.fillStyle = 'white';
            ctx.font = '14px Arial';
            ctx.fillText('Press E to collect pocket watch part', 350, 50);

            if (gameState.keys['e']) {
                playCollectSound();
                gameState.watchParts++;
                fadeOutIn(() => {
                    startLevel3();
                });
            }
        }
    }
}

function handleMouseDownLevel2() {
    const stones = [
        { x: 300, y: 400 },
        { x: 400, y: 400 },
        { x: 500, y: 400 },
        { x: 600, y: 400 }
    ];

    stones.forEach((stone, index) => {
        if (Math.abs(gameState.mouse.x - stone.x) < 30 &&
            Math.abs(gameState.mouse.y - stone.y) < 30) {
            gameState.level2PlayerSequence.push(index);
            playStoneSound(index);
            checkLevel2Sequence();
        }
    });
}