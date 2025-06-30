function completeGame() {
    gameState.currentScene = 'ending';
    gameState.gameCompleted = true;
    playMusic('ending');
    updateUI();
    showStory(
        "Journey Complete!",
        "Milo has collected all the pocket watch parts! The device is now complete and glowing with magical energy. Time to return home!",
        () => {
            showStory(
                "Home Sweet Home",
                "With a bright flash, Milo finds himself back in the garage. The pocket watch crumbles to dust, but the memories of his incredible time-traveling adventure will last forever!",
                () => { }
            );
        }
    );
}

function drawEnding() {
    const gradient = ctx.createRadialGradient(500, 300, 0, 500, 300, 400);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(1, '#FFA500');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1000, 600);

    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(500, 300, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(500, 300);
    ctx.lineTo(500, 250);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(500, 300);
    ctx.lineTo(530, 280);
    ctx.stroke();

    for (let i = 0; i < 20; i++) {
        ctx.fillStyle = `hsl(${Date.now() / 10 + i * 18}, 100%, 80%)`;
        ctx.beginPath();
        const angle = (Date.now() / 1000 + i) % (Math.PI * 2);
        const radius = 100 + Math.sin(Date.now() / 500 + i) * 30;
        const x = 500 + Math.cos(angle) * radius;
        const y = 300 + Math.sin(angle) * radius;
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.fillStyle = '#8B4513';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ADVENTURE COMPLETE!', 500, 150);
    ctx.font = '18px Arial';
    ctx.fillText('Milo the Time Traveler has returned home safely!', 500, 450);
    ctx.textAlign = 'left';
}