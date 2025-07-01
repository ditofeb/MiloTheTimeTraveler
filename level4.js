function startLevel4() {
    // Reset state level1
    if (gameState.level1Platforms) {
        delete gameState.level1Platforms;
    }
    if (gameState.level1Objects) {
        delete gameState.level1Objects;
    }

    gameState.currentScene = 'level4';
    playMusic('level4');
    gameState.timeLimit = 45;
    gameState.gameStartTime = Date.now();
    gameState.miloPosition = { x: 100, y: 500 };
    gameState.level4Stones = [];

    updateUI();
    showStory(
        "Great Wall of China - The Final Challenge",
        "Milo must climb to the top of the Great Wall while avoiding falling stones. This is his final test!",
        () => { }
    );
}

function drawLevel4() {
    const gradient = ctx.createLinearGradient(0, 600, 0, 0);
    gradient.addColorStop(0, '#8B4513');
    gradient.addColorStop(1, '#87CEEB');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1000, 600);

    ctx.fillStyle = '#696969';
    for (let i = 0; i < 1000; i += 50) {
        ctx.fillRect(i, 550, 40, 50);
        ctx.fillRect(i, 400, 40, 30);
        ctx.fillRect(i, 250, 40, 30);
        ctx.fillRect(i, 100, 40, 30);
    }

    if (Math.random() < 0.02) {
        gameState.level4Stones.push({
            x: Math.random() * 1000,
            y: 0,
            speed: 3 + Math.random() * 3
        });
    }

    gameState.level4Stones = gameState.level4Stones.filter(stone => {
        stone.y += stone.speed;

        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(stone.x, stone.y, 15, 0, Math.PI * 2);
        ctx.fill();

        if (Math.abs(gameState.miloPosition.x - stone.x) < 25 &&
            Math.abs(gameState.miloPosition.y - stone.y) < 25) {
            startLevel4();
            return false;
        }

        return stone.y < 650;
    });

    if (gameState.miloPosition.y < 150) {
        drawPocketWatch(500, 100);
        if (Math.abs(gameState.miloPosition.x - 500) < 50 && Math.abs(gameState.miloPosition.y - 100) < 50) {
            ctx.fillStyle = 'white';
            ctx.font = '14px Arial';
            ctx.fillText('Press E to collect the final pocket watch part', 300, 50);

            if (gameState.keys['e']) {
                playCollectSound();
                gameState.watchParts++;
                completeGame();
            }
        }
    }
}