function handleMouseDown() {
    if (gameState.currentScene === 'level1') {
        handleMouseDownLevel1();
    } else if (gameState.currentScene === 'level2') {
        handleMouseDownLevel2();
    }
}

function handleObjectDrop() {
    if (gameState.currentScene === 'level1') {
        handleObjectDropLevel1();
    }
}

function gameLoop() {
    if (isPaused) return;

    ctx.clearRect(0, 0, 1000, 600);

    updateMilo();
    updateUI();

    if (gameState.currentScene === 'lobby') {
        drawLobby();
    } else if (gameState.currentScene === 'level1') {
        drawLevel1();
    } else if (gameState.currentScene === 'level2') {
        drawLevel2();
    } else if (gameState.currentScene === 'level3') {
        drawLevel3();
    } else if (gameState.currentScene === 'level4') {
        drawLevel4();
    } else if (gameState.currentScene === 'ending') {
        drawEnding();
    }

    if (gameState.currentScene !== 'ending') {
        drawMilo();
    }

    requestAnimationFrame(gameLoop);
}