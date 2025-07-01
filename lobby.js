const lobbyObjects = {
    // Objek-objek utama yang bisa dipanjat
    workbench: {
        x: 50, y: 350, width: 200, height: 100,
        topSurface: { x: 50, y: 350, width: 200, height: 5 },
        climbable: true
    },
    toolbox: {
        x: 200, y: 320, width: 80, height: 30,
        topSurface: { x: 200, y: 320, width: 80, height: 5 },
        climbable: true
    },
    chair: {
        x: 280, y: 470, width: 50, height: 20,
        topSurface: { x: 280, y: 470, width: 50, height: 5 },
        climbable: true
    },
    shelf1: {
        x: 700, y: 250, width: 250, height: 20,
        topSurface: { x: 700, y: 250, width: 250, height: 5 },
        climbable: true
    },
    shelf2: {
        x: 700, y: 350, width: 250, height: 20,
        topSurface: { x: 700, y: 350, width: 250, height: 5 },
        climbable: true
    },
    shelf3: {
        x: 700, y: 450, width: 250, height: 20,
        topSurface: { x: 700, y: 450, width: 250, height: 5 },
        climbable: true
    },
    // Objek lantai yang dirapikan
    woodenCrate: {
        x: 340, y: 515, width: 40, height: 35,
        topSurface: { x: 340, y: 515, width: 40, height: 5 },
        climbable: true
    },
    cardboxBox1: {
        x: 390, y: 500, width: 65, height: 50,
        topSurface: { x: 390, y: 500, width: 65, height: 5 },
        climbable: true
    },
    cardboxBox2: {
        x: 460, y: 515, width: 50, height: 35,
        topSurface: { x: 460, y: 515, width: 50, height: 5 },
        climbable: true
    },
    bookStack: {
        x: 290, y: 524, width: 60, height: 26,
        topSurface: { x: 290, y: 524, width: 60, height: 5 },
        climbable: true
    },
    bucket: {
        x: 10, y: 525, width: 50, height: 25,
        topSurface: { x: 10, y: 525, width: 50, height: 5 },
        climbable: true
    },
    bikeFrame: {
        x: 520, y: 470, width: 60, height: 80,
        topSurface: { x: 520, y: 470, width: 60, height: 5 },
        climbable: true
    },
    // Fisik untuk item-item di rak
    paintCan1: { x: 720, y: 220, width: 35, height: 30, topSurface: { x: 720, y: 220, width: 35, height: 5 }, climbable: true },
    paintCan2: { x: 770, y: 215, width: 35, height: 35, topSurface: { x: 770, y: 215, width: 35, height: 5 }, climbable: true },
    paintCan3: { x: 820, y: 220, width: 35, height: 30, topSurface: { x: 820, y: 220, width: 35, height: 5 }, climbable: true },
    // paintCan4 dihapus agar ada tempat untuk jam
    shelfBox1: { x: 720, y: 320, width: 50, height: 30, topSurface: { x: 720, y: 320, width: 50, height: 5 }, climbable: true },
    shelfBox2: { x: 780, y: 315, width: 60, height: 35, topSurface: { x: 780, y: 315, width: 60, height: 5 }, climbable: true },
    shelfBox3: { x: 850, y: 325, width: 40, height: 25, topSurface: { x: 850, y: 325, width: 40, height: 5 }, climbable: true },
    largeItem1: { x: 720, y: 420, width: 80, height: 30, topSurface: { x: 720, y: 420, width: 80, height: 5 }, climbable: true },
    largeItem2: { x: 820, y: 415, width: 70, height: 35, topSurface: { x: 820, y: 415, width: 70, height: 5 }, climbable: true }
};

// Function to check if character can stand on an object (TIDAK BERUBAH)
function checkObjectCollision(characterX, characterY, characterWidth, characterHeight) {
    const standingObjects = [];
    const charBottom = characterY + characterHeight;
    const charLeft = characterX;
    const charRight = characterX + characterWidth;
    for (const [key, obj] of Object.entries(lobbyObjects)) {
        if (obj.climbable) {
            const objTop = obj.topSurface.y; const objLeft = obj.topSurface.x;
            const objRight = obj.topSurface.x + obj.topSurface.width;
            const objBottom = obj.topSurface.y + obj.topSurface.height;
            if (charBottom >= objTop && charBottom <= objBottom + 5 && charRight > objLeft && charLeft < objRight) {
                standingObjects.push({ name: key, object: obj, surfaceY: objTop });
            }
        }
    }
    return standingObjects;
}

// Function to get the ground level below the character (TIDAK BERUBAH)
function getGroundLevel(x, y, width, height) {
    const objects = checkObjectCollision(x, y, width, height);
    if (objects.length > 0) {
        const highestPlatform = objects.reduce((highest, current) => current.surfaceY < highest.surfaceY ? current : highest);
        return highestPlatform.surfaceY;
    }
    return 550;
}

// Export the fixed lobby data and collision logic (TIDAK BERUBAH)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { lobbyObjects, checkObjectCollision, getGroundLevel };
}

function initLobby() {
    gameState.currentScene = 'lobby';
    updateUI();
    playMusic('lobby');
    showStory("Milo's Discovery", "Milo finds a mysterious broken pocket watch in the garage. His curiosity gets the better of him as he approaches the strange device...", () => { });
}

function updateMilo_Lobby() {
    const moveSpeed = 2; const jumpPower = -12; const gravity = 0.5;
    const miloWidth = 30; const miloHeight = 55;

    if (gameState.keys['a'] || gameState.keys['arrowleft']) { gameState.miloVelocity.x = -moveSpeed; }
    else if (gameState.keys['d'] || gameState.keys['arrowright']) { gameState.miloVelocity.x = moveSpeed; }
    else { gameState.miloVelocity.x *= 0.85; }

    if ((gameState.keys[' '] || gameState.keys['w']) && gameState.canJump) {
        gameState.miloVelocity.y = jumpPower; gameState.canJump = false; gameState.onGround = false;
    }

    gameState.miloVelocity.y += gravity;
    const prevY = gameState.miloPosition.y;
    gameState.miloPosition.x += gameState.miloVelocity.x;
    gameState.miloPosition.y += gameState.miloVelocity.y;

    if (gameState.miloPosition.x < 20) gameState.miloPosition.x = 20;
    if (gameState.miloPosition.x > 980) gameState.miloPosition.x = 980;

    let onSurface = false;
    if (gameState.miloVelocity.y >= 0) {
        const collisionBoxY = gameState.miloPosition.y - miloHeight;
        const objects = checkObjectCollision(gameState.miloPosition.x - (miloWidth / 2), collisionBoxY, miloWidth, miloHeight);
        if (objects.length > 0) {
            const highestPlatform = objects.reduce((highest, current) => current.surfaceY < highest.surfaceY ? current : highest);
            if (prevY <= highestPlatform.surfaceY) {
                gameState.miloPosition.y = highestPlatform.surfaceY; gameState.miloVelocity.y = 0;
                gameState.onGround = true; gameState.canJump = true; onSurface = true;
            }
        }
    }
    if (!onSurface && gameState.miloPosition.y >= 550) {
        gameState.miloPosition.y = 550; gameState.miloVelocity.y = 0;
        gameState.onGround = true; gameState.canJump = true; onSurface = true;
    }
    if (!onSurface) { gameState.onGround = false; }

    // --- DIUBAH: Interaksi jam sekarang di atas rak paling atas ---
    const watchPosition = { x: 880, y: 228 }; // Posisi baru jam
    if (gameState.keys['e'] && !gameState.interactionPressed &&
        Math.abs(gameState.miloPosition.x - watchPosition.x) < 50 &&
        Math.abs(gameState.miloPosition.y - watchPosition.y) < 50) {
        gameState.interactionPressed = true;
        fadeOutIn(() => {
            startLevel1();
        });
    }

    if (!gameState.keys['e']) { gameState.interactionPressed = false; }
}

function drawLobby() {
    const gradient = ctx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, '#8B7355'); gradient.addColorStop(0.35, '#A0956B'); gradient.addColorStop(1, '#BEBEBE');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1000, 600);
    ctx.fillStyle = '#C5C5C5'; ctx.fillRect(0, 500, 1000, 100);
    ctx.strokeStyle = '#A0A0A0'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(150, 500); ctx.lineTo(350, 600); ctx.moveTo(600, 520); ctx.lineTo(800, 580); ctx.stroke();
    ctx.fillStyle = '#8B7355'; ctx.fillRect(0, 0, 1000, 220);
    ctx.strokeStyle = '#654321'; ctx.lineWidth = 2;
    for (let i = 0; i <= 10; i++) {
        ctx.beginPath(); ctx.moveTo(i * 100, 0); ctx.lineTo(i * 100, 220); ctx.stroke();
    }
    for (let i = 0; i <= 4; i++) {
        ctx.beginPath(); ctx.moveTo(0, i * 55); ctx.lineTo(1000, i * 55); ctx.stroke();
    }
    ctx.fillStyle = '#696969';
    ctx.fillRect(0, 200, 1000, 25); ctx.fillRect(0, 225, 25, 275); ctx.fillRect(975, 225, 25, 275);
    ctx.fillStyle = '#87CEEB'; ctx.fillRect(50, 30, 140, 100);
    ctx.strokeStyle = '#654321'; ctx.lineWidth = 6; ctx.strokeRect(50, 30, 140, 100);
    ctx.beginPath(); ctx.moveTo(120, 30); ctx.lineTo(120, 130); ctx.moveTo(50, 80); ctx.lineTo(190, 80); ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 180, 0.2)';
    ctx.beginPath(); ctx.moveTo(50, 130); ctx.lineTo(190, 130); ctx.lineTo(250, 350); ctx.lineTo(100, 350); ctx.closePath(); ctx.fill();

    const workbench = lobbyObjects.workbench;
    ctx.fillStyle = '#8B4513'; ctx.fillRect(workbench.x, workbench.y, workbench.width, workbench.height);
    ctx.fillStyle = '#654321'; ctx.fillRect(workbench.topSurface.x, workbench.topSurface.y, workbench.topSurface.width, workbench.topSurface.height);
    ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
        ctx.beginPath(); ctx.moveTo(workbench.x + i * 25, workbench.y); ctx.lineTo(workbench.x + i * 25, workbench.y + workbench.height); ctx.stroke();
    }
    ctx.fillStyle = '#654321';
    ctx.fillRect(60, 450, 20, 100); ctx.fillRect(220, 450, 20, 100); ctx.fillRect(60, 350, 20, 100); ctx.fillRect(220, 350, 20, 100);
    ctx.fillStyle = '#FF4500'; ctx.fillRect(70, 340, 35, 8);
    ctx.fillStyle = '#FFD700'; ctx.fillRect(115, 335, 15, 15);
    ctx.fillStyle = '#8B4513'; ctx.fillRect(122, 350, 6, 25);
    ctx.fillStyle = '#C0C0C0'; ctx.fillRect(145, 338, 45, 12);
    ctx.fillStyle = '#4682B4'; ctx.fillRect(200, 342, 25, 8);

    const toolbox = lobbyObjects.toolbox;
    ctx.fillStyle = '#DC143C'; ctx.fillRect(toolbox.x, toolbox.y, toolbox.width, toolbox.height);
    ctx.fillStyle = '#8B0000'; ctx.fillRect(toolbox.topSurface.x, toolbox.topSurface.y, toolbox.topSurface.width, 5);
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(230, 325, 8, 15); ctx.fillRect(210, 332, 60, 3); ctx.fillRect(215, 340, 10, 8);
    
    const shelf1 = lobbyObjects.shelf1; const shelf2 = lobbyObjects.shelf2; const shelf3 = lobbyObjects.shelf3;
    ctx.fillStyle = '#8B4513'; ctx.fillRect(710, 180, 20, 300); ctx.fillRect(910, 180, 20, 300);
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(shelf1.x, shelf1.y, shelf1.width, shelf1.height); ctx.fillRect(shelf2.x, shelf2.y, shelf2.width, shelf2.height); ctx.fillRect(shelf3.x, shelf3.y, shelf3.width, shelf3.height);
    
    ctx.fillStyle = '#32CD32'; ctx.fillRect(720, 220, 35, 30);
    ctx.fillStyle = '#FF6347'; ctx.fillRect(770, 215, 35, 35);
    ctx.fillStyle = '#4169E1'; ctx.fillRect(820, 220, 35, 30);
    
    ctx.fillStyle = '#DEB887'; ctx.fillRect(720, 320, 50, 30);
    ctx.fillStyle = '#8B4513'; ctx.fillRect(780, 315, 60, 35);
    ctx.fillStyle = '#696969'; ctx.fillRect(850, 325, 40, 25);
    ctx.fillStyle = '#654321'; ctx.fillRect(720, 420, 80, 30);
    ctx.fillStyle = '#2F4F4F'; ctx.fillRect(820, 415, 70, 35);

    const chair = lobbyObjects.chair;
    ctx.fillStyle = '#8B4513'; ctx.fillRect(280, 400, 50, 70); ctx.fillRect(chair.x, chair.y, chair.width, chair.height);
    ctx.fillStyle = '#654321';
    ctx.fillRect(285, 490, 8, 60); ctx.fillRect(317, 490, 8, 60); ctx.fillRect(285, 400, 8, 60); ctx.fillRect(317, 400, 8, 60);
    
    const woodenCrate = lobbyObjects.woodenCrate;
    ctx.fillStyle = '#DEB887'; ctx.fillRect(woodenCrate.x, woodenCrate.y, woodenCrate.width, woodenCrate.height);
    ctx.strokeStyle = '#8B7355'; ctx.lineWidth = 2; ctx.strokeRect(woodenCrate.x, woodenCrate.y, woodenCrate.width, woodenCrate.height);
    ctx.beginPath(); ctx.moveTo(340, 525); ctx.lineTo(380, 525); ctx.moveTo(340, 535); ctx.lineTo(380, 535); ctx.stroke();

    const bookStack = lobbyObjects.bookStack;
    ctx.fillStyle = '#8B0000'; ctx.fillRect(bookStack.x, bookStack.y + 18, bookStack.width, 8);
    ctx.fillStyle = '#006400'; ctx.fillRect(bookStack.x + 2, bookStack.y + 9, bookStack.width - 4, 9);
    ctx.fillStyle = '#4B0082'; ctx.fillRect(bookStack.x + 4, bookStack.y, bookStack.width - 8, 9);

    const bucket = lobbyObjects.bucket;
    ctx.fillStyle = '#696969'; ctx.beginPath(); ctx.arc(bucket.x + bucket.width/2, bucket.y + bucket.height - 3, bucket.width/2 - 2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#2F4F4F'; ctx.lineWidth = 3; ctx.stroke();
    ctx.strokeStyle = '#2F4F4F'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(bucket.x + bucket.width/2, bucket.y + 10, 18, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke();
    
    const cardboxBox1 = lobbyObjects.cardboxBox1; const cardboxBox2 = lobbyObjects.cardboxBox2;
    ctx.fillStyle = '#DEB887'; ctx.fillRect(cardboxBox1.x, cardboxBox1.y, cardboxBox1.width, cardboxBox1.height); ctx.fillRect(cardboxBox2.x, cardboxBox2.y, cardboxBox2.width, cardboxBox2.height);
    ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(390, 525); ctx.lineTo(455, 525); ctx.moveTo(460, 530); ctx.lineTo(510, 530); ctx.stroke();
    
    ctx.strokeStyle = '#FF0000'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(520, 480, 35, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(600, 480, 35, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#C0C0C0'; ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        ctx.beginPath(); ctx.moveTo(520, 480); ctx.lineTo(520 + Math.cos(angle) * 30, 480 + Math.sin(angle) * 30);
        ctx.moveTo(600, 480); ctx.lineTo(600 + Math.cos(angle) * 30, 480 + Math.sin(angle) * 30); ctx.stroke();
    }
    const bikeFrame = lobbyObjects.bikeFrame; ctx.strokeStyle = '#0000FF'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(520, 445); ctx.lineTo(560, 400); ctx.lineTo(600, 445); ctx.lineTo(560, 480); ctx.lineTo(520, 445); ctx.stroke();
    ctx.fillStyle = '#000000'; ctx.fillRect(545, 395, 30, 8); ctx.fillRect(590, 395, 20, 8);
    
    ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(620, 200); ctx.lineTo(620, 520); ctx.stroke();
    ctx.fillStyle = '#696969'; ctx.fillRect(610, 500, 20, 50);
    ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(650, 210); ctx.lineTo(650, 500); ctx.stroke();
    ctx.strokeStyle = '#696969'; ctx.lineWidth = 3;
    for (let i = 0; i < 10; i++) {
        ctx.beginPath(); ctx.moveTo(635 + i * 3, 485); ctx.lineTo(635 + i * 3, 510); ctx.stroke();
    }
    
    ctx.strokeStyle = '#654321'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(500, 0); ctx.lineTo(500, 60); ctx.stroke();
    ctx.fillStyle = '#2F4F4F'; ctx.fillRect(470, 60, 60, 20);
    ctx.fillStyle = '#FFFF99'; ctx.beginPath(); ctx.arc(500, 90, 25, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#E6E6FA'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 200, 0.1)'; ctx.beginPath(); ctx.arc(500, 300, 200, 0, Math.PI * 2); ctx.fill();
    
    // --- DIUBAH: Menggambar Jam Saku di atas rak ---
    const watchPosition = { x: 880, y: 228 };
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; ctx.beginPath(); ctx.arc(watchPosition.x + 5, watchPosition.y + 5, 28, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#B8860B'; ctx.beginPath(); ctx.arc(watchPosition.x, watchPosition.y, 25, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = '#FFFAF0'; ctx.beginPath(); ctx.arc(watchPosition.x, watchPosition.y, 20, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000000';
    for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12;
        const x = watchPosition.x + Math.cos(angle) * 16; const y = watchPosition.y + Math.sin(angle) * 16;
        ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#000000'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(watchPosition.x, watchPosition.y); ctx.lineTo(watchPosition.x - 5, watchPosition.y - 12); ctx.moveTo(watchPosition.x, watchPosition.y); ctx.lineTo(watchPosition.x + 12, watchPosition.y - 5); ctx.stroke();
    ctx.shadowBlur = 15; ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
    ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(watchPosition.x, watchPosition.y, 35, 0, Math.PI * 2); ctx.stroke();
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = 'rgba(64, 64, 64, 0.4)';
    ctx.beginPath(); ctx.ellipse(400, 530, 35, 18, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(600, 525, 25, 12, 0, 0, Math.PI * 2); ctx.fill();
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    for (let i = 0; i < 20; i++) {
        const x = 100 + Math.random() * 150; const y = 150 + Math.random() * 200;
        ctx.beginPath(); ctx.arc(x, y, 0.5 + Math.random() * 1, 0, Math.PI * 2); ctx.fill();
    }
    
    // --- DIUBAH: Prompt Interaksi untuk jam di lokasi baru ---
    if (Math.abs(gameState.miloPosition.x - watchPosition.x) < 50 && Math.abs(gameState.miloPosition.y - watchPosition.y) < 50) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'; ctx.fillRect(watchPosition.x - 220, watchPosition.y - 70, 400, 50);
        ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 3; ctx.strokeRect(watchPosition.x - 220, watchPosition.y - 70, 400, 50);
        ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 18px Arial'; ctx.textAlign = 'center';
        ctx.fillText('Press E to examine the mysterious pocket watch', watchPosition.x - 20, watchPosition.y - 40);
        ctx.textAlign = 'left';
    }
    
    if (gameState.showPlatformIndicators) {
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)'; ctx.lineWidth = 2;
        for (const [key, obj] of Object.entries(lobbyObjects)) {
            if (obj.climbable) {
                ctx.strokeRect(obj.topSurface.x, obj.topSurface.y, obj.topSurface.width, obj.topSurface.height);
            }
        }
    }
}

// Export the objects for use in the main game logic
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { lobbyObjects, checkObjectCollision, getGroundLevel, initLobby, drawLobby, updateMilo_Lobby };
}
