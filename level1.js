// === LEVEL 1 BARU DENGAN LEBIH BANYAK PLATFORM DAN TARGET RANDOM ===

// Initialize gameState if it doesn't exist
if (typeof gameState === 'undefined') {
    gameState = {
        keys: {},
        miloVelocity: { x: 0, y: 0 },
        onGround: false,
        watchParts: 0
    };
}

// Fungsi untuk menghasilkan angka acak dalam rentang
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fungsi untuk mengacak array (Fisher-Yates shuffle)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function startLevel1() {
    if (gameState.level1Platforms) {
        delete gameState.level1Platforms;
    }
    if (gameState.level1Objects) {
        delete gameState.level1Objects;
    }

    gameState.currentScene = 'level1';
    playMusic('level1');
    gameState.timeLimit = 120; // Waktu ditambah untuk menikmati pemandangan
    gameState.gameStartTime = Date.now();
    gameState.miloPosition = { x: 100, y: 500 };
    gameState.draggedObject = null;
    gameState.canJump = true;
    gameState.interactionPressed = false;

    // *** PENAMBAHAN PLATFORM BARU DI SINI ***
    const platformRanges = [
        { xMin: 150, xMax: 220, yMin: 470, yMax: 490, width: 130, height: 25 },
        { xMin: 300, xMax: 400, yMin: 420, yMax: 440, width: 150, height: 25 },
        { xMin: 480, xMax: 560, yMin: 370, yMax: 390, width: 120, height: 20 },
        { xMin: 620, xMax: 720, yMin: 320, yMax: 340, width: 160, height: 25 },
        { xMin: 780, xMax: 860, yMin: 270, yMax: 290, width: 130, height: 20 },
        // Platform tambahan untuk lebih banyak variasi
        { xMin: 80, xMax: 120, yMin: 400, yMax: 420, width: 110, height: 20 },  // Platform rendah di kiri
        { xMin: 250, xMax: 310, yMin: 300, yMax: 320, width: 140, height: 20 }, // Platform tengah
        { xMin: 700, xMax: 750, yMin: 200, yMax: 220, width: 120, height: 20 }  // Platform tinggi di kanan
    ];

    gameState.level1Platforms = platformRanges.map(range => ({
        x: getRandomInt(range.xMin, range.xMax),
        y: getRandomInt(range.yMin, range.yMax),
        width: range.width,
        height: range.height,
    }));

    // Semua permukaan yang bisa dijadikan tempat spawn objek (termasuk tanah dan platform)
    const allSpawnSurfaces = [
        { x: 0, y: 540, width: 1000 }, // Tanah dasar
        ...gameState.level1Platforms
    ];

    // Acak urutan permukaan untuk spawn objek
    const shuffledSpawnSurfaces = shuffleArray(allSpawnSurfaces);

    // Ambil 3 permukaan pertama untuk spawn objek
    const objectStartLocations = shuffledSpawnSurfaces.slice(0, 3).map(surface => ({
        x: getRandomInt(surface.x + 10, surface.x + surface.width - 40), // Margin dari tepi
        y: surface.y - 18
    }));

    // *** MODIFIKASI UTAMA: TARGET OBJEK RANDOM DI SEMUA PLATFORM ***
    // Semua permukaan yang bisa dijadikan tempat target (hanya platform, tidak termasuk tanah)
    const allTargetSurfaces = [...gameState.level1Platforms];
    
    // Acak urutan permukaan untuk target
    const shuffledTargetSurfaces = shuffleArray(allTargetSurfaces);

    // Buat lokasi target random di platform yang berbeda
    const targetLocations = [];
    for (let i = 0; i < 3 && i < shuffledTargetSurfaces.length; i++) {
        const surface = shuffledTargetSurfaces[i];
        targetLocations.push({
            x: getRandomInt(surface.x + 10, surface.x + surface.width - 40), // Margin dari tepi
            y: surface.y - 18
        });
    }

    // Jika tidak ada cukup platform untuk target, gunakan platform yang sama dengan posisi berbeda
    while (targetLocations.length < 3) {
        const randomPlatform = gameState.level1Platforms[getRandomInt(0, gameState.level1Platforms.length - 1)];
        targetLocations.push({
            x: getRandomInt(randomPlatform.x + 10, randomPlatform.x + randomPlatform.width - 40),
            y: randomPlatform.y - 18
        });
    }

    // Buat objek dengan lokasi spawn dan target yang sudah diacak
    gameState.level1Objects = [
        { 
            x: objectStartLocations[0].x, 
            y: objectStartLocations[0].y, 
            shape: 'triangle', 
            placed: false, 
            carrying: false, 
            targetX: targetLocations[0].x, 
            targetY: targetLocations[0].y 
        },
        { 
            x: objectStartLocations[1].x, 
            y: objectStartLocations[1].y, 
            shape: 'circle', 
            placed: false, 
            carrying: false, 
            targetX: targetLocations[1].x, 
            targetY: targetLocations[1].y 
        },
        { 
            x: objectStartLocations[2].x, 
            y: objectStartLocations[2].y, 
            shape: 'square', 
            placed: false, 
            carrying: false, 
            targetX: targetLocations[2].x, 
            targetY: targetLocations[2].y 
        }
    ];

    updateUI();
    showStory(
        "Machu Picchu - The Ancient Puzzle",
        "Milo arrives at the mystical ruins of Machu Picchu! Navigate the ancient terraces by placing stone blocks correctly. Pick up stones with E, jump between platforms with SPACE, and place stones on the glowing outlines with E. Use WASD to move around. Each playthrough has randomized locations!",
        () => { }
    );
}

// *** FUNGSI GAMBAR BARU UNTUK TEMA MACHU PICCHU ***
function drawLevel1() {
    // 1. Latar Belakang Langit Andes dengan Matahari Terbenam
    const skyGradient = ctx.createLinearGradient(0, 0, 0, 600);
    skyGradient.addColorStop(0, '#4A708B'); // Biru tua di atas
    skyGradient.addColorStop(0.5, '#87CEEB'); // Biru langit
    skyGradient.addColorStop(0.8, '#FFB6C1'); // Merah muda
    skyGradient.addColorStop(1, '#FFA07A');   // Oranye terang di cakrawala
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, 1000, 600);

    // Gambar matahari
    ctx.fillStyle = 'rgba(255, 255, 180, 0.8)';
    ctx.beginPath();
    ctx.arc(850, 150, 60, 0, Math.PI * 2);
    ctx.fill();

    // 2. Siluet Pegunungan Berlapis untuk Efek Kedalaman
    drawMountainRange(400, '#2F4F4F', 0.8); // Pegunungan terjauh (paling gelap)
    drawMountainRange(450, '#556B2F', 0.6); // Pegunungan tengah
    drawMountainRange(500, '#8FBC8F', 0.4); // Pegunungan terdekat (paling terang)

    // 3. Menggambar Tanah dan Terasering
    const groundGradient = ctx.createLinearGradient(0, 550, 0, 600);
    groundGradient.addColorStop(0, '#556B2F'); // Hijau tua rumput
    groundGradient.addColorStop(1, '#8B4513'); // Coklat tanah
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, 550, 1000, 50);

    // 4. Menggambar Platform Batu Khas Inka
    gameState.level1Platforms.forEach(platform => {
        drawStonePlatform(platform.x, platform.y, platform.width, platform.height);
    });

    // 5. Dekorasi Khas Inka dan Vegetasi
    drawIncanDecorations();

    // 6. Menggambar Target Objek dengan Gaya Kuno
    gameState.level1Objects.forEach(obj => {
        if (!obj.placed) {
            ctx.save();
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 20;
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.9)';
            ctx.lineWidth = 3;
            ctx.setLineDash([10, 5]);
            drawShapeOutline(obj.targetX, obj.targetY, obj.shape);
            ctx.restore();
            ctx.setLineDash([]);
        } else {
            ctx.save();
            ctx.shadowColor = '#32CD32';
            ctx.shadowBlur = 15;
            ctx.strokeStyle = 'rgba(0, 255, 127, 0.9)';
            ctx.lineWidth = 4;
            drawShapeOutline(obj.targetX, obj.targetY, obj.shape);
            ctx.restore();
        }
    });

    // 7. Menggambar Objek Puzzle Bergaya Artefak Batu
    gameState.level1Objects.forEach(obj => {
        if (!obj.placed) {
            let x = obj.carrying ? gameState.miloPosition.x : obj.x;
            let y = obj.carrying ? gameState.miloPosition.y - 40 : obj.y;
            drawEnhancedShape(x, y, obj.shape, obj.carrying);
        }
    });

    // Logika untuk menyelesaikan level
    if (gameState.level1Objects.every(obj => obj.placed)) {
        // Pilih platform tertinggi secara dinamis untuk pocket watch
        const highestPlatform = gameState.level1Platforms.reduce((highest, current) => 
            current.y < highest.y ? current : highest
        );
        
        ctx.save();
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 30;
        drawPocketWatch(highestPlatform.x + highestPlatform.width / 2, highestPlatform.y - 20);
        ctx.restore();

        if (Math.abs(gameState.miloPosition.x - (highestPlatform.x + highestPlatform.width / 2)) < 60 &&
            Math.abs(gameState.miloPosition.y - (highestPlatform.y - 20)) < 80) {
            ctx.save();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.roundRect(320, 30, 360, 40, 15);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Press E to collect the ancient timepiece!', 500, 55);
            ctx.restore();

            if (gameState.keys['e'] && !gameState.interactionPressed) {
                gameState.interactionPressed = true;
                playCollectSound();
                gameState.watchParts++;
                fadeOutIn(() => {
                    startLevel2(); // Baris ini sekarang aktif
                });
            }
        }
    }

    drawHelpIndicators();
}

// Fungsi pembantu untuk menggambar pegunungan
function drawMountainRange(baseY, color, alpha) {
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    ctx.lineTo(100, baseY - 150);
    ctx.lineTo(250, baseY - 50);
    ctx.lineTo(400, baseY - 200);
    ctx.lineTo(550, baseY - 80);
    ctx.lineTo(700, baseY - 180);
    ctx.lineTo(850, baseY - 100);
    ctx.lineTo(1000, baseY - 220);
    ctx.lineTo(1000, 600);
    ctx.lineTo(0, 600);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1.0;
}

// Fungsi pembantu untuk menggambar platform batu
function drawStonePlatform(x, y, width, height) {
    // Gradien dasar untuk memberi kesan 3D
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, '#B0C4DE'); // Permukaan atas lebih terang
    gradient.addColorStop(1, '#778899'); // Bagian bawah lebih gelap
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);

    // Tambahkan tekstur batu
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    for (let i = 0; i < width / 5; i++) {
        ctx.beginPath();
        ctx.arc(x + Math.random() * width, y + Math.random() * height, Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Garis retakan untuk detail
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 5);
    ctx.lineTo(x + width - 10, y + height - 5);
    ctx.stroke();

    // Border
    ctx.strokeStyle = '#2F4F4F';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
}

function drawIncanDecorations() {
    // Pola geometris di latar belakang
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = '#FFD700';
    for (let i = 0; i < 5; i++) {
        let x = 100 + i * 200;
        ctx.strokeRect(x, 150, 50, 50);
        ctx.beginPath();
        ctx.moveTo(x, 150);
        ctx.lineTo(x + 50, 200);
        ctx.moveTo(x + 50, 150);
        ctx.lineTo(x, 200);
        ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Vegetasi rumput di tanah
    for (let i = 0; i < 100; i++) {
        let x = Math.random() * 1000;
        let y = 550 + Math.random() * 50;
        ctx.fillStyle = `rgba(46, 139, 87, ${Math.random() * 0.5 + 0.3})`;
        ctx.fillRect(x, y - 10, 2, 10);
    }
}

// Fungsi pembantu untuk menggambar outline artefak
function drawShapeOutline(x, y, shape) {
    ctx.beginPath();
    if (shape === 'triangle') {
        ctx.moveTo(x, y - 20);
        ctx.lineTo(x - 20, y + 20);
        ctx.lineTo(x + 20, y + 20);
        ctx.closePath();
    } else if (shape === 'circle') {
        ctx.arc(x, y, 20, 0, Math.PI * 2);
    } else if (shape === 'square') {
        ctx.rect(x - 20, y - 20, 40, 40);
    }
    ctx.stroke();
}

// Fungsi pembantu untuk menggambar artefak batu
function drawEnhancedShape(x, y, shape, isCarrying) {
    ctx.save();
    if (isCarrying) {
        ctx.shadowColor = '#FFFF00';
        ctx.shadowBlur = 20;
    }

    let primaryColor, secondaryColor, tertiaryColor;

    if (shape === 'triangle') { // Artefak Matahari
        primaryColor = '#FFC300'; secondaryColor = '#DAA520'; tertiaryColor = '#FFD700';
    } else if (shape === 'circle') { // Artefak Bulan
        primaryColor = '#E0FFFF'; secondaryColor = '#B0C4DE'; tertiaryColor = '#FFFFFF';
    } else { // Artefak Gunung
        primaryColor = '#6B8E23'; secondaryColor = '#556B2F'; tertiaryColor = '#8FBC8F';
    }

    // Gambar dasar artefak
    const gradient = ctx.createRadialGradient(x, y, 5, x, y, 22);
    gradient.addColorStop(0, tertiaryColor);
    gradient.addColorStop(0.5, primaryColor);
    gradient.addColorStop(1, secondaryColor);
    ctx.fillStyle = gradient;

    ctx.beginPath();
    if (shape === 'triangle') {
        ctx.moveTo(x, y - 18); ctx.lineTo(x - 18, y + 18); ctx.lineTo(x + 18, y + 18); ctx.closePath();
    } else if (shape === 'circle') {
        ctx.arc(x, y, 18, 0, Math.PI * 2);
    } else {
        ctx.rect(x - 18, y - 18, 36, 36);
    }
    ctx.fill();
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Tambahkan ukiran Inka
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (shape === 'triangle') {
        ctx.arc(x, y + 10, 8, 0, Math.PI, true);
        ctx.moveTo(x - 5, y - 5); ctx.lineTo(x + 5, y - 5);
    } else if (shape === 'circle') {
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.moveTo(x, y - 10); ctx.lineTo(x, y + 10);
    } else {
        ctx.moveTo(x - 10, y - 10); ctx.lineTo(x + 10, y - 10);
        ctx.moveTo(x - 10, y); ctx.lineTo(x + 10, y);
        ctx.moveTo(x - 10, y + 10); ctx.lineTo(x + 10, y + 10);
    }
    ctx.stroke();
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
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 2;
        ctx.roundRect(10, 10, 400, 30, 10);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
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
                ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Press E', obj.x, obj.y - 35);
                ctx.restore();
            }
        });
    } else {
        const obj = gameState.draggedObject;
        if (Math.abs(gameState.miloPosition.x - obj.targetX) < 40 &&
            Math.abs(gameState.miloPosition.y - obj.targetY) < 40) {
            ctx.save();
            ctx.fillStyle = 'rgba(0, 255, 0, 0.9)';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Press E to Place', obj.targetX, obj.targetY - 35);
            ctx.restore();
        }
    }
}

function updateMilo_Level1() {
    const moveSpeed = 2;
    const jumpPower = -13;
    const gravity = 0.5;

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

    if (gameState.miloPosition.y >= 550) {
        gameState.miloPosition.y = 550;
        gameState.miloVelocity.y = 0;
        gameState.onGround = true;
        gameState.canJump = true;
        onPlatform = true;
    }

    if (gameState.currentScene === 'level1' && gameState.level1Platforms && Array.isArray(gameState.level1Platforms)) {
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

    let objects = [];
    if (gameState.currentScene === 'level1' && gameState.level1Objects && Array.isArray(gameState.level1Objects)) {
        objects = gameState.level1Objects;
    } else if (gameState.currentScene === 'level2' && gameState.level2Objects && Array.isArray(gameState.level2Objects)) {
        objects = gameState.level2Objects;
    } else if (gameState.currentScene === 'level3' && gameState.level3Objects && Array.isArray(gameState.level3Objects)) {
        objects = gameState.level3Objects;
    } else if (gameState.currentScene === 'level4' && gameState.level4Objects && Array.isArray(gameState.level4Objects)) {
        objects = gameState.level4Objects;
    }

    if (!gameState.draggedObject) {
        objects.forEach(obj => {
            if (!obj.placed && !obj.carrying &&
                Math.abs(gameState.miloPosition.x - obj.x) < 50 &&
                Math.abs(gameState.miloPosition.y - obj.y) < 50) {
                obj.carrying = true;
                gameState.draggedObject = obj;
                gameState.interactionPressed = true;
                playCollectSound();
                console.log(`Picked up ${obj.shape || 'object'} in ${gameState.currentScene}`);
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
            console.log(`Placed ${obj.shape || 'object'} at target in ${gameState.currentScene}`);
        }
    }
}