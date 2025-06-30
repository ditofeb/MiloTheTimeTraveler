// Initialize gameState if it doesn't exist
if (typeof gameState === 'undefined') {
    gameState = {
        keys: {},
        miloVelocity: { x: 0, y: 0 },
        onGround: false,
        watchParts: 0
        // Other properties can be added as needed
    };
}

// Fungsi untuk menghasilkan angka acak dalam rentang
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startLevel1() {
    // Reset state level1 jika sudah ada
    if (gameState.level1Platforms) {
        delete gameState.level1Platforms;
    }
    if (gameState.level1Objects) {
        delete gameState.level1Objects;
    }

    gameState.currentScene = 'level1';
    playMusic('level1');
    gameState.timeLimit = 90;
    gameState.gameStartTime = Date.now();
    gameState.miloPosition = { x: 100, y: 500 };
    gameState.draggedObject = null;
    gameState.canJump = true;
    gameState.interactionPressed = false;

    // Definisikan rentang untuk platform agar tetap dapat dijangkau
    const platformRanges = [
        { xMin: 150, xMax: 250, yMin: 480, yMax: 510, width: 120, height: 20 },
        { xMin: 300, xMax: 400, yMin: 430, yMax: 460, width: 140, height: 20 },
        { xMin: 480, xMax: 560, yMin: 400, yMax: 430, width: 100, height: 15 },
        { xMin: 620, xMax: 720, yMin: 380, yMax: 410, width: 160, height: 20 },
        { xMin: 780, xMax: 860, yMin: 330, yMax: 360, width: 120, height: 20 }
    ];

    // Randomisasi posisi platform
    gameState.level1Platforms = platformRanges.map(range => ({
        x: getRandomInt(range.xMin, range.xMax),
        y: getRandomInt(range.yMin, range.yMax),
        width: range.width,
        height: range.height,
        fillColor: range === platformRanges[0] ? '#A0522D' :
                   range === platformRanges[1] ? '#CD853F' :
                   range === platformRanges[2] ? '#DEB887' :
                   range === platformRanges[3] ? '#D2691E' : '#B8860B',
        strokeColor: range === platformRanges[0] ? '#D2B48C' :
                     range === platformRanges[1] ? '#DAA520' :
                     range === platformRanges[2] ? '#F4A460' :
                     range === platformRanges[3] ? '#F4A460' : '#FFD700'
    }));

    // Randomisasi posisi target di platform (kecuali final platform)
    const possibleTargetLocations = gameState.level1Platforms.slice(0, 3).map(platform => ({
        x: getRandomInt(platform.x, platform.x + platform.width - 30),
        y: platform.y - 15
    }));

    // Acak target locations
    for (let i = possibleTargetLocations.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [possibleTargetLocations[i], possibleTargetLocations[j]] = [possibleTargetLocations[j], possibleTargetLocations[i]];
    }

    // Randomisasi posisi awal objek di ground atau platform yang dapat dijangkau
    const objectStartLocations = [
        { x: getRandomInt(50, 950), y: 540 },
        { x: getRandomInt(gameState.level1Platforms[0].x, gameState.level1Platforms[0].x + gameState.level1Platforms[0].width - 30), y: gameState.level1Platforms[0].y - 15 },
        { x: getRandomInt(gameState.level1Platforms[1].x, gameState.level1Platforms[1].x + gameState.level1Platforms[1].width - 30), y: gameState.level1Platforms[1].y - 15 }
    ];

    // Acak object start locations
    for (let i = objectStartLocations.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [objectStartLocations[i], objectStartLocations[j]] = [objectStartLocations[j], objectStartLocations[i]];
    }

    // Inisialisasi objek dengan posisi dan target yang diacak
    gameState.level1Objects = [
        { x: objectStartLocations[0].x, y: objectStartLocations[0].y, shape: 'triangle', placed: false, carrying: false, targetX: possibleTargetLocations[0].x, targetY: possibleTargetLocations[0].y },
        { x: objectStartLocations[1].x, y: objectStartLocations[1].y, shape: 'circle', placed: false, carrying: false, targetX: possibleTargetLocations[1].x, targetY: possibleTargetLocations[1].y },
        { x: objectStartLocations[2].x, y: objectStartLocations[2].y, shape: 'square', placed: false, carrying: false, targetX: possibleTargetLocations[2].x, targetY: possibleTargetLocations[2].y }
    ];

    updateUI();
    showStory(
        "Machu Picchu - The Ancient Puzzle",
        "Milo arrives at the mystical ruins of Machu Picchu! Navigate the ancient terraces by placing stone blocks correctly. Pick up stones with E, jump between platforms with SPACE, and place stones on the glowing outlines with E. Use WASD to move around.",
        () => { }
    );
}

function drawLevel1() {
    const skyGradient = ctx.createLinearGradient(0, 0, 0, 600);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(0.3, '#B0E0E6');
    skyGradient.addColorStop(0.7, '#98FB98');
    skyGradient.addColorStop(1, '#228B22');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, 1000, 600);

    ctx.fillStyle = '#4682B4';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(0, 300);
    ctx.lineTo(200, 150);
    ctx.lineTo(400, 200);
    ctx.lineTo(600, 100);
    ctx.lineTo(800, 180);
    ctx.lineTo(1000, 120);
    ctx.lineTo(1000, 600);
    ctx.lineTo(0, 600);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    ctx.fillStyle = '#8B4513';
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, 400);
    ctx.lineTo(150, 250);
    ctx.lineTo(300, 320);
    ctx.lineTo(500, 200);
    ctx.lineTo(700, 280);
    ctx.lineTo(900, 220);
    ctx.lineTo(1000, 350);
    ctx.lineTo(1000, 600);
    ctx.lineTo(0, 600);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    const groundGradient = ctx.createLinearGradient(0, 550, 0, 600);
    groundGradient.addColorStop(0, '#8B5A2B');
    groundGradient.addColorStop(1, '#5C4033');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, 550, 1000, 50);

    ctx.strokeStyle = '#6B4423';
    ctx.lineWidth = 1;
    for (let i = 0; i < 1000; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 550);
        ctx.lineTo(i, 600);
        ctx.stroke();
    }

    gameState.level1Platforms.forEach(platform => {
        drawPlatform(platform.x, platform.y, platform.width, platform.height, platform.fillColor, platform.strokeColor);
    });

    drawIncanDecorations();

    gameState.level1Objects.forEach(obj => {
        if (!obj.placed) {
            ctx.save();
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 15;
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 4]);
            drawShapeOutline(obj.targetX, obj.targetY, obj.shape);
            ctx.restore();
            ctx.setLineDash([]);
        } else {
            ctx.save();
            ctx.shadowColor = '#00FF00';
            ctx.shadowBlur = 10;
            ctx.strokeStyle = '#00FF00';
            ctx.lineWidth = 3;
            drawShapeOutline(obj.targetX, obj.targetY, obj.shape);
            ctx.restore();
        }
    });

    gameState.level1Objects.forEach(obj => {
        if (!obj.placed) {
            let x = obj.carrying ? gameState.miloPosition.x : obj.x;
            let y = obj.carrying ? gameState.miloPosition.y - 35 : obj.y;
            drawEnhancedShape(x, y, obj.shape, obj.carrying);
        }
    });

    if (gameState.level1Objects.every(obj => obj.placed)) {
        const finalPlatform = gameState.level1Platforms[4];
        ctx.save();
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 25;
        drawPocketWatch(finalPlatform.x + 60, finalPlatform.y - 10);
        ctx.restore();

        if (Math.abs(gameState.miloPosition.x - (finalPlatform.x + 60)) < 60 &&
            Math.abs(gameState.miloPosition.y - (finalPlatform.y - 10)) < 80) {
            ctx.save();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillRect(320, 30, 360, 40);
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.strokeRect(320, 30, 360, 40);
            ctx.fillStyle = '#000';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Press E to collect the ancient timepiece!', 500, 55);
            ctx.restore();

            if (gameState.keys['e'] && !gameState.interactionPressed) {
                gameState.interactionPressed = true;
                playCollectSound();
                gameState.watchParts++;
                fadeOutIn(() => {
                    startLevel2();
                });
            }
        }
    }

    drawHelpIndicators();
}

function drawPlatform(x, y, width, height, fillColor, strokeColor) {
    const platformGradient = ctx.createLinearGradient(x, y, x, y + height);
    platformGradient.addColorStop(0, fillColor);
    platformGradient.addColorStop(1, strokeColor);
    ctx.fillStyle = platformGradient;
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1;
    for (let i = x; i < x + width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, y);
        ctx.lineTo(i, y + height);
        ctx.stroke();
    }
}

function drawIncanDecorations() {
    ctx.fillStyle = '#8B4513';
    ctx.globalAlpha = 0.7;
    ctx.fillRect(50, 450, 20, 100);
    ctx.fillRect(900, 400, 25, 150);
    ctx.fillRect(800, 300, 15, 50);
    ctx.globalAlpha = 1.0;
}

function drawShapeOutline(x, y, shape) {
    if (shape === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(x, y - 15);
        ctx.lineTo(x - 15, y + 15);
        ctx.lineTo(x + 15, y + 15);
        ctx.closePath();
        ctx.stroke();
    } else if (shape === 'circle') {
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.stroke();
    } else if (shape === 'square') {
        ctx.strokeRect(x - 15, y - 15, 30, 30);
    }
}

function drawEnhancedShape(x, y, shape, isCarrying) {
    ctx.save();
    if (isCarrying) {
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 15;
    }
    let gradient;
    if (shape === 'triangle') {
        gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
        gradient.addColorStop(0, '#FF8E8E');
        gradient.addColorStop(1, '#FF6B6B');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(x, y - 15);
        ctx.lineTo(x - 15, y + 15);
        ctx.lineTo(x + 15, y + 15);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#FFB3B3';
        ctx.lineWidth = 2;
        ctx.stroke();
    } else if (shape === 'circle') {
        gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
        gradient.addColorStop(0, '#6EEEE4');
        gradient.addColorStop(1, '#4ECDC4');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#B3F5F1';
        ctx.lineWidth = 2;
        ctx.stroke();
    } else if (shape === 'square') {
        gradient = ctx.createLinearGradient(x - 15, y - 15, x + 15, y + 15);
        gradient.addColorStop(0, '#67C7F1');
        gradient.addColorStop(1, '#45B7D1');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - 15, y - 15, 30, 30);
        ctx.strokeStyle = '#A3D7F1';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 15, y - 15, 30, 30);
    }
    ctx.restore();
}

function drawHelpIndicators() {
    let objectiveText = "";
    const unplacedObjects = gameState.level1Objects.filter(obj => !obj.placed);
    if (unplacedObjects.length > 0) {
        if (!gameState.draggedObject) {
            objectiveText = `Pick up the ${unplacedObjects[0].shape} stone with E`;
        } else {
            objectiveText = `Place the ${gameState.draggedObject.shape} on its glowing outline with E`;
        }
    }
    if (objectiveText) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 400, 30);
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(objectiveText, 20, 30);
        ctx.restore();
    }
    if (!gameState.draggedObject) {
        gameState.level1Objects.forEach(obj => {
            if (!obj.placed && !obj.carrying &&
                Math.abs(gameState.miloPosition.x - obj.x) < 50 &&
                Math.abs(gameState.miloPosition.y - obj.y) < 50) {
                ctx.save();
                ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Press E', obj.x, obj.y - 25);
                ctx.restore();
            }
        });
    } else {
        const obj = gameState.draggedObject;
        if (Math.abs(gameState.miloPosition.x - obj.targetX) < 40 &&
            Math.abs(gameState.miloPosition.y - obj.targetY) < 40) {
            ctx.save();
            ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Press E to Place', obj.targetX, obj.targetY - 25);
            ctx.restore();
        }
    }
}

function updateMilo() {
    const moveSpeed = 3;
    const jumpPower = -15;
    const gravity = 0.7;
    
    if (!gameState.keys['e']) {
        gameState.interactionPressed = false;
    }
    
    if (gameState.keys['a'] || gameState.keys['arrowleft']) {
        gameState.miloVelocity.x = -moveSpeed;
    } else if (gameState.keys['d'] || gameState.keys['arrowright']) {
        gameState.miloVelocity.x = moveSpeed;
    } else {
        gameState.miloVelocity.x *= 0.85;
    }

    if ((gameState.keys[' '] || gameState.keys['w']) && gameState.canJump) {
        gameState.miloVelocity.y = jumpPower;
        gameState.canJump = false;
        gameState.onGround = false;
    }

    gameState.miloVelocity.y += gravity;
    gameState.miloPosition.x += gameState.miloVelocity.x;
    gameState.miloPosition.y += gameState.miloVelocity.y;

    if (gameState.miloPosition.x < 20) gameState.miloPosition.x = 20;
    if (gameState.miloPosition.x > 980) gameState.miloPosition.x = 980;

    let onPlatform = false;

    // Ground platform
    if (gameState.miloPosition.y >= 550) {
        gameState.miloPosition.y = 550;
        gameState.miloVelocity.y = 0;
        gameState.onGround = true;
        gameState.canJump = true;
        onPlatform = true;
    }

    // Deteksi kolisi dengan platform yang diacak, dengan pengecekan keberadaan
    if (gameState.level1Platforms && Array.isArray(gameState.level1Platforms)) {
        gameState.level1Platforms.forEach(platform => {
            if (gameState.miloPosition.y >= platform.y && gameState.miloPosition.y <= platform.y + platform.height &&
                gameState.miloPosition.x >= platform.x && gameState.miloPosition.x <= platform.x + platform.width &&
                gameState.miloVelocity.y >= 0) {
                gameState.miloPosition.y = platform.y;
                gameState.miloVelocity.y = 0;
                gameState.onGround = true;
                gameState.canJump = true;
                onPlatform = true;
            }
        });
    }

    if (!onPlatform && gameState.miloPosition.y < 550) {
        gameState.onGround = false;
    }

    handleInteraction();
}

function handleInteraction() {
    if (!gameState.keys['e'] || gameState.interactionPressed) {
        return;
    }

    if (!gameState.draggedObject) {
        gameState.level1Objects.forEach(obj => {
            if (!obj.placed && !obj.carrying &&
                Math.abs(gameState.miloPosition.x - obj.x) < 50 &&
                Math.abs(gameState.miloPosition.y - obj.y) < 50) {
                obj.carrying = true;
                gameState.draggedObject = obj;
                gameState.interactionPressed = true;
                playCollectSound();
                console.log(`Picked up ${obj.shape}`);
            }
        });
    } else {
        const obj = gameState.draggedObject;
        if (Math.abs(gameState.miloPosition.x - obj.targetX) < 40 &&
            Math.abs(gameState.miloPosition.y - obj.targetY) < 40) {
            obj.placed = true;
            obj.x = obj.targetX;
            obj.y = obj.targetY;
            obj.carrying = false;
            gameState.draggedObject = null;
            gameState.interactionPressed = true;
            playCollectSound();
            console.log(`Placed ${obj.shape} at target`);
        }
    }
}