function initLobby() {
    gameState.currentScene = 'lobby';
    updateUI();
    playMusic('lobby');
    showStory(
        "Milo's Discovery",
        "Milo finds a mysterious broken pocket watch in the garage. His curiosity gets the better of him as he approaches the strange device...",
        () => { }
    );
}

function drawLobby() {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, 1000, 600);

    ctx.fillStyle = '#654321';
    ctx.fillRect(50, 400, 200, 150);

    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(150, 380, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 3;
    ctx.stroke();

    if (Math.abs(gameState.miloPosition.x - 150) < 50 && Math.abs(gameState.miloPosition.y - 380) < 50) {
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.fillText('Press E to interact with the pocket watch', 300, 50);

        if (gameState.keys['e']) {
            fadeOutIn(() => {
                startLevel1();
            });
        }
    }
}