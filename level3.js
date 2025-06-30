function startLevel3() {
    gameState.currentScene = 'level3';
    playMusic('level3');
    gameState.timeLimit = 30;
    gameState.gameStartTime = Date.now();
    gameState.miloPosition = { x: 100, y: 500 };

    gameState.level3SafeSands = [];
    for (let i = 0; i < 8; i++) {
        gameState.level3SafeSands.push({
            x: 150 + i * 100,
            y: 500,
            safe: Math.random() > 0.6
        });
    }

    updateUI();
    showStory(
        "Amazon Forest - The Treacherous Sands",
        "In the Amazon, Milo must cross dangerous quicksand. Watch carefully which sands light up - those are safe to step on!",
        () => {
            showSafeSands();
        }
    );
}

function showSafeSands() {
    let showTime = 3000;
    setTimeout(() => { }, showTime);
}

function drawLevel3() {
    const gradient = ctx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, '#228B22');
    gradient.addColorStop(1, '#006400');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1000, 600);

    for (let i = 0; i < 10; i++) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(i * 100 + 20, 300, 20, 200);
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(i * 100 + 30, 320, 30, 0, Math.PI * 2);
        ctx.fill();
    }

    const currentTime = Date.now();
    const showingSafeSands = (currentTime - gameState.gameStartTime) < 3000;

    gameState.level3SafeSands.forEach(sand => {
        if (showingSafeSands && sand.safe) {
            ctx.fillStyle = '#FFD700';
        } else {
            ctx.fillStyle = '#F4A460';
        }
        ctx.fillRect(sand.x - 30, sand.y - 10, 60, 20);

        if (Math.abs(gameState.miloPosition.x - sand.x) < 40 &&
            Math.abs(gameState.miloPosition.y - sand.y) < 20) {
            if (!sand.safe) {
                startLevel3();
                return;
            }
        }
    });

    if (gameState.miloPosition.x > 900) {
        drawPocketWatch(950, 300);
        if (Math.abs(gameState.miloPosition.x - 950) < 50) {
            ctx.fillStyle = 'white';
            ctx.font = '14px Arial';
            ctx.fillText('Press E to collect pocket watch part', 750, 50);

            if (gameState.keys['e']) {
                playCollectSound();
                gameState.watchParts++;
                fadeOutIn(() => {
                    startLevel4();
                });
            }
        }
    }
}