function startLevel1() {
    gameState.currentScene = 'level1';
    playMusic('level1');
    gameState.timeLimit = 60;
    gameState.gameStartTime = Date.now();
    gameState.miloPosition = { x: 100, y: 500 };

    gameState.level1Objects = [
        { x: 200, y: 500, targetX: 700, targetY: 400, shape: 'triangle', placed: false, dragging: false },
        { x: 300, y: 500, targetX: 750, targetY: 400, shape: 'circle', placed: false, dragging: false },
        { x: 400, y: 500, targetX: 800, targetY: 400, shape: 'square', placed: false, dragging: false }
    ];

    updateUI();
    showStory(
        "Machu Picchu - The Ancient Puzzle",
        "Milo arrives at the mystical Machu Picchu! He must place the ancient stones in their correct positions before time runs out.",
        () => { }
    );
}

function drawLevel1() {
    const gradient = ctx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#90EE90');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1000, 600);

    ctx.fillStyle = '#696969';
    ctx.beginPath();
    ctx.moveTo(0, 300);
    ctx.lineTo(200, 100);
    ctx.lineTo(400, 250);
    ctx.lineTo(600, 80);
    ctx.lineTo(800, 200);
    ctx.lineTo(1000, 150);
    ctx.lineTo(1000, 600);
    ctx.lineTo(0, 600);
    ctx.fill();

    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 550, 1000, 50);

    gameState.level1Objects.forEach(obj => {
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        if (obj.shape === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(obj.targetX, obj.targetY);
            ctx.lineTo(obj.targetX - 15, obj.targetY + 20);
            ctx.lineTo(obj.targetX + 15, obj.targetY + 20);
            ctx.closePath();
            ctx.stroke();
        } else if (obj.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(obj.targetX, obj.targetY, 15, 0, Math.PI * 2);
            ctx.stroke();
        } else if (obj.shape === 'square') {
            ctx.strokeRect(obj.targetX - 15, obj.targetY - 15, 30, 30);
        }
    });
    ctx.setLineDash([]);

    gameState.level1Objects.forEach(obj => {
        if (!obj.placed) {
            let x = obj.dragging ? gameState.mouse.x : obj.x;
            let y = obj.dragging ? gameState.mouse.y : obj.y;

            ctx.fillStyle = obj.shape === 'triangle' ? '#FF6B6B' :
                obj.shape === 'circle' ? '#4ECDC4' : '#45B7D1';

            if (obj.shape === 'triangle') {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x - 15, y + 20);
                ctx.lineTo(x + 15, y + 20);
                ctx.closePath();
                ctx.fill();
            } else if (obj.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(x, y, 15, 0, Math.PI * 2);
                ctx.fill();
            } else if (obj.shape === 'square') {
                ctx.fillRect(x - 15, y - 15, 30, 30);
            }
        }
    });

    if (gameState.level1Objects.every(obj => obj.placed)) {
        drawPocketWatch(500, 300);
        if (Math.abs(gameState.miloPosition.x - 500) < 50 && Math.abs(gameState.miloPosition.y - 300) < 100) {
            ctx.fillStyle = 'white';
            ctx.font = '14px Arial';
            ctx.fillText('Press E to collect pocket watch part', 350, 50);

            if (gameState.keys['e']) {
                playCollectSound();
                gameState.watchParts++;
                fadeOutIn(() => {
                    startLevel2();
                });
            }
        }
    }
}

function handleMouseDownLevel1() {
    gameState.level1Objects.forEach(obj => {
        if (!obj.placed &&
            Math.abs(gameState.mouse.x - obj.x) < 20 &&
            Math.abs(gameState.mouse.y - obj.y) < 20) {
            obj.dragging = true;
            gameState.draggedObject = obj;
        }
    });
}

function handleObjectDropLevel1() {
    if (gameState.draggedObject) {
        const obj = gameState.draggedObject;
        if (Math.abs(gameState.mouse.x - obj.targetX) < 30 &&
            Math.abs(gameState.mouse.y - obj.targetY) < 30) {
            obj.placed = true;
            obj.x = obj.targetX;
            obj.y = obj.targetY;
        }
        obj.dragging = false;
        gameState.draggedObject = null;
    }
}