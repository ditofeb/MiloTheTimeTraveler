// === LEVEL 2 OBJECTS ===
const level2Objects = {
    bigStatue: {
        x: 200, y: 300, width: 150, height: 200,
        topSurface: { x: 200, y: 300, width: 150, height: 5 },
        climbable: true
    },
    altar: {
        x: 600, y: 500, width: 200, height: 50,
        topSurface: { x: 600, y: 500, width: 200, height: 5 },
        climbable: true
    },
    brokenPillar1: {
        x: 400, y: 400, width: 50, height: 120,
        topSurface: { x: 400, y: 400, width: 50, height: 5 },
        climbable: true
    },
    brokenPillar2: {
        x: 500, y: 420, width: 50, height: 100,
        topSurface: { x: 500, y: 420, width: 50, height: 5 },
        climbable: true
    },
    sarcophagus: {
        x: 750, y: 470, width: 100, height: 80,
        topSurface: { x: 750, y: 470, width: 100, height: 5 },
        climbable: true
    }
};

// === COLLISION LOGIC ===
function checkLevel2Collision(x, y, width, height) {
    const standingObjects = [];
    const charBottom = y + height;
    const charLeft = x;
    const charRight = x + width;

    for (const [key, obj] of Object.entries(level2Objects)) {
        if (obj.climbable) {
            const objTop = obj.topSurface.y;
            const objLeft = obj.topSurface.x;
            const objRight = obj.topSurface.x + obj.topSurface.width;
            if (
                charBottom >= objTop && charBottom <= objTop + 5 &&
                charRight > objLeft && charLeft < objRight
            ) {
                standingObjects.push({ name: key, surfaceY: objTop });
            }
        }
    }
    return standingObjects;
}

function getLevel2GroundLevel(x, y, width, height) {
    const objects = checkLevel2Collision(x, y, width, height);
    if (objects.length > 0) {
        const highestPlatform = objects.reduce((h, c) => c.surfaceY < h.surfaceY ? c : h);
        return highestPlatform.surfaceY;
    }
    return 550; // default ground
}

// === START LEVEL 2 ===
function startLevel2() {
    if (gameState.level1Platforms) delete gameState.level1Platforms;
    if (gameState.level1Objects) delete gameState.level1Objects;

    gameState.currentScene = 'level2';
    playMusic('level2');
    if (!gameState.ambience) {
        gameState.ambience = new Audio('music/pyramid_ambience.mp3');
        gameState.ambience.loop = true;
        gameState.ambience.volume = 0.2;
        gameState.ambience.play();
    }

    gameState.timeLimit = 45;
    gameState.gameStartTime = Date.now();
    gameState.miloPosition = { x: 100, y: 500 };
    gameState.miloVelocity = { x: 0, y: 0 };
    gameState.canJump = true;

    // Simon Says variables
    gameState.level2Sequence = [];
    gameState.level2PlayerSequence = [];
    gameState.currentSequenceStep = 0; // Untuk tracking langkah saat ini
    gameState.sequenceLength = 1; // Mulai dengan 1 lampu
    gameState.showingSequence = false;
    gameState.activeStone = null;
    gameState.puzzleFailed = false;
    gameState.puzzleCompleted = false;
    gameState.canInteract = false;
    
    gameState.fallingRocks = [{ x: 450, y: -50, speed: 0, active: false }];
    gameState.fireParticles = [];

    updateUI();
    showStory(
        "Pyramid Chamber - Sound of the Pharaoh",
        "Milo finds himself in a mysterious pyramid chamber. The floating lights will show a sequence - he must press the corresponding buttons on the ground in the same order!",
        () => { setTimeout(() => startLevel2Sequence(), 1000); }
    );
}

// === SIMON SAYS LOGIC ===
function startLevel2Sequence() {
    // Generate sequence berdasarkan panjang saat ini
    gameState.level2Sequence = [];
    for (let i = 0; i < gameState.sequenceLength; i++) {
        gameState.level2Sequence.push(Math.floor(Math.random() * 4));
    }
    gameState.level2PlayerSequence = [];
    gameState.currentSequenceStep = 0;
    gameState.showingSequence = true;
    gameState.canInteract = false;
    playSequence();
}

function playSequence() {
    let index = 0;
    const interval = setInterval(() => {
        if (index >= gameState.level2Sequence.length) {
            clearInterval(interval);
            gameState.activeStone = null;
            gameState.showingSequence = false;
            gameState.canInteract = true;
            return;
        }
        const stoneIndex = gameState.level2Sequence[index];
        gameState.activeStone = stoneIndex;
        playStoneSound(stoneIndex);
        setTimeout(() => { gameState.activeStone = null; }, 600);
        index++;
    }, 1000);
}

function playStoneSound(stoneIndex) {
    const sounds = [
        'music/stone0.mp3',
        'music/stone1.mp3',
        'music/stone2.mp3',
        'music/stone3.mp3'
    ];
    const audio = new Audio(sounds[stoneIndex]);
    audio.play();
}

function playCollectSound() {
    const audio = new Audio('music/collect.mp3');
    audio.play();
}

// Fungsi untuk mengecek apakah Milo dekat dengan button tertentu
function getNearbyStone() {
    const groundButtons = [
        { x: 300, y: 530, index: 0 }, // Sesuaikan y position agar pas dengan gem
        { x: 400, y: 530, index: 1 },
        { x: 500, y: 530, index: 2 },
        { x: 600, y: 530, index: 3 }
    ];
    
    for (let button of groundButtons) {
        if (Math.abs(gameState.miloPosition.x - button.x) < 40 &&
            Math.abs(gameState.miloPosition.y - button.y) < 40) {
            return button.index;
        }
    }
    return -1;
}

function handleStoneInteraction() {
    if (!gameState.canInteract || gameState.showingSequence) return;
    
    const nearbyStone = getNearbyStone();
    if (nearbyStone === -1) return;
    
    // Tambahkan input pemain
    gameState.level2PlayerSequence.push(nearbyStone);
    playStoneSound(nearbyStone);
    
    // Flash stone untuk feedback visual
    gameState.activeStone = nearbyStone;
    setTimeout(() => { gameState.activeStone = null; }, 300);
    
    checkLevel2Sequence();
}

function checkLevel2Sequence() {
    const currentStep = gameState.level2PlayerSequence.length - 1;
    
    // Cek apakah input saat ini benar
    if (gameState.level2PlayerSequence[currentStep] !== gameState.level2Sequence[currentStep]) {
        // Salah - reset sequence
        gameState.puzzleFailed = true;
        const buzz = new Audio('music/buzz.mp3');
        buzz.play();
        setTimeout(() => {
            gameState.puzzleFailed = false;
            startLevel2Sequence(); // Ulangi sequence yang sama
        }, 1500);
        return;
    }
    
    // Cek apakah sequence lengkap sudah benar
    if (gameState.level2PlayerSequence.length === gameState.level2Sequence.length) {
        // Sequence benar, lanjut ke level berikutnya
        gameState.sequenceLength++;
        
        if (gameState.sequenceLength > 4) {
            // Puzzle selesai!
            gameState.puzzleCompleted = true;
            gameState.canInteract = false;
            playCollectSound();
        } else {
            // Lanjut ke sequence yang lebih panjang
            setTimeout(() => {
                startLevel2Sequence();
            }, 1000);
        }
    }
}

// === UPDATE MILO ===
function updateMilo_Level2() {
    const moveSpeed = 2, jumpPower = -13, gravity = 0.5;
    const miloWidth = 30, miloHeight = 55;

    // Handle E key press for interaksi
    if (gameState.keys['e'] && !gameState.interactionPressed) {
        gameState.interactionPressed = true;

        if (gameState.puzzleCompleted) {
            const watchX = 700; // Posisi X jam di atas altar
            const watchY = 480; // Posisi Y jam di atas altar
            // Cek jika Milo dekat jam untuk mengambilnya
            if (Math.abs(gameState.miloPosition.x - watchX) < 50 && Math.abs(gameState.miloPosition.y - (watchY + 20)) < 50) {
                playCollectSound();
                gameState.watchParts++;
                fadeOutIn(() => completeGame()); // Transisi ke layar ending
            }
        } else {
            // Jika puzzle belum selesai, proses interaksi batu
            handleStoneInteraction();
        }
    }
    if (!gameState.keys['e']) {
        gameState.interactionPressed = false;
    }


    // Movement
    if (gameState.keys['a'] || gameState.keys['arrowleft']) gameState.miloVelocity.x = -moveSpeed;
    else if (gameState.keys['d'] || gameState.keys['arrowright']) gameState.miloVelocity.x = moveSpeed;
    else gameState.miloVelocity.x *= 0.85;

    if ((gameState.keys[' '] || gameState.keys['w']) && gameState.canJump) {
        gameState.miloVelocity.y = jumpPower;
        gameState.canJump = false; 
        gameState.onGround = false;
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
        const objects = checkLevel2Collision(
            gameState.miloPosition.x - (miloWidth / 2),
            collisionBoxY, miloWidth, miloHeight
        );
        if (objects.length > 0) {
            const highestPlatform = objects.reduce((h, c) => c.surfaceY < h.surfaceY ? c : h);
            if (prevY <= highestPlatform.surfaceY) {
                gameState.miloPosition.y = highestPlatform.surfaceY;
                gameState.miloVelocity.y = 0;
                gameState.onGround = true; 
                gameState.canJump = true; 
                onSurface = true;
            }
        }
    }
    if (!onSurface && gameState.miloPosition.y >= 550) {
        gameState.miloPosition.y = 550;
        gameState.miloVelocity.y = 0;
        gameState.onGround = true; 
        gameState.canJump = true;
    }
    if (!onSurface) gameState.onGround = false;

    // === Update Falling Rock Trap ===
    gameState.fallingRocks.forEach(rock => {
        if (!rock.active && Math.abs(gameState.miloPosition.x - rock.x) < 50) {
            rock.active = true;
        }
        if (rock.active) {
            rock.speed += 0.2;
            rock.y += rock.speed;
            if (Math.abs(rock.x - gameState.miloPosition.x) < 20 &&
                Math.abs(rock.y - gameState.miloPosition.y) < 20) {
                console.log("Hit by rock!");
                gameState.miloPosition = { x: 100, y: 500 };
                rock.y = -50; 
                rock.speed = 0; 
                rock.active = false;
            }
        }
    });

    // === Fire particles ===
    const torchPositions = [{ x: 220, y: 290 }, { x: 630, y: 490 }];
    torchPositions.forEach(pos => {
        gameState.fireParticles.push({
            x: pos.x,
            y: pos.y - 20,
            life: 1,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -0.5 - Math.random()
        });
    });
    gameState.fireParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
    });
    gameState.fireParticles = gameState.fireParticles.filter(p => p.life > 0);
}

// === HELPER FUNCTION TO DRAW GEMSTONE ===
function drawGemstone(ctx, x, y, size, color, isGlowing) {
    const hexRadius = size / 2;
    // Mendefinisikan titik-titik poligon untuk membuat bentuk permata
    const points = [];
    for (let i = 0; i < 6; i++) {
        points.push({
            x: x + hexRadius * Math.cos(Math.PI / 3 * i),
            y: y + hexRadius * Math.sin(Math.PI / 3 * i)
        });
    }

    // Efek cahaya saat aktif
    if (isGlowing) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 40;
    } else {
        ctx.shadowBlur = 0;
    }

    // Mengurai warna dasar
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    // Menggambar sisi-sisi (facets) dengan bayangan berbeda untuk efek 3D
    // Facet 1 (Paling terang)
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.closePath();
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`;
    ctx.fill();

    // Facet 2
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.closePath();
    ctx.fillStyle = `rgba(${r * 0.9}, ${g * 0.9}, ${b * 0.9}, 1)`;
    ctx.fill();

    // Facet 3
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.closePath();
    ctx.fillStyle = `rgba(${r * 0.7}, ${g * 0.7}, ${b * 0.7}, 1)`;
    ctx.fill();

    // Facet lainnya...
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.lineTo(points[4].x, points[4].y);
    ctx.closePath();
    ctx.fillStyle = `rgba(${r * 0.8}, ${g * 0.8}, ${b * 0.8}, 1)`;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(points[4].x, points[4].y);
    ctx.lineTo(points[5].x, points[5].y);
    ctx.closePath();
    ctx.fillStyle = `rgba(${r * 0.95}, ${g * 0.95}, ${b * 0.95}, 1)`;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(points[5].x, points[5].y);
    ctx.lineTo(points[0].x, points[0].y);
    ctx.closePath();
    ctx.fillStyle = `rgba(${r * 0.85}, ${g * 0.85}, ${b * 0.85}, 1)`;
    ctx.fill();

    // Reset shadow setelah menggambar
    ctx.shadowBlur = 0;
}


function drawLevel2() {
    // === Background gradient pyramid ===
    const gradient = ctx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, '#D2B48C'); // light sand
    gradient.addColorStop(1, '#8B4513'); // dark sand
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1000, 600);

    // === Silhouette pillars/statues ===
    ctx.fillStyle = 'rgba(80, 50, 20, 0.2)';
    ctx.fillRect(100, 100, 60, 400);
    ctx.fillRect(800, 50, 40, 500);

    // === Ground ===
    ctx.fillStyle = '#5C4033'; // dark stone
    ctx.fillRect(0, 550, 1000, 50);

    // === Platform blocks with stone pattern ===
    Object.entries(level2Objects).forEach(([key, obj]) => {
        // Base brick
        ctx.fillStyle = '#A0522D'; // brown brick
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        // Block line pattern
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        for (let x = obj.x; x < obj.x + obj.width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, obj.y);
            ctx.lineTo(x, obj.y + obj.height);
            ctx.stroke();
        }
        for (let y = obj.y; y < obj.y + obj.height; y += 20) {
            ctx.beginPath();
            ctx.moveTo(obj.x, y);
            ctx.lineTo(obj.x + obj.width, y);
            ctx.stroke();
        }
    });

    // === Animated torches ===
    const torches = [{ x: 220, y: 290 }, { x: 630, y: 490 }];
    torches.forEach(pos => {
        // Glow light
        ctx.fillStyle = 'rgba(255, 140, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y - 20, 25 + Math.sin(Date.now() / 100) * 3, 0, Math.PI * 2);
        ctx.fill();
        // Fire
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y - 20);
        ctx.lineTo(pos.x - 5, pos.y);
        ctx.lineTo(pos.x + 5, pos.y);
        ctx.closePath();
        ctx.fill();
    });

    // === Fire particles ===
    gameState.fireParticles.forEach(p => {
        ctx.fillStyle = `rgba(255,140,0,${p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // === FLOATING SEQUENCE GEMS (New Design) ===
    const floatingGems = [
        { x: 300, y: 200, color: '#FF6B6B' },
        { x: 400, y: 200, color: '#4ECDC4' },
        { x: 500, y: 200, color: '#45B7D1' },
        { x: 600, y: 200, color: '#96CEB4' }
    ];

    floatingGems.forEach((gem, index) => {
        const floating = Math.sin(Date.now() / 1000 + index) * 5;
        const gemY = gem.y + floating;
        
        drawGemstone(ctx, gem.x, gemY, 40, gem.color, gameState.activeStone === index);
        
        // Light beam
        ctx.strokeStyle = `${gem.color}40`; // transparent color
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(gem.x, gemY + 20);
        ctx.lineTo(gem.x, 500);
        ctx.stroke();
    });


    // === GROUND BUTTONS (New Gemstone Design) ===
    const groundButtons = [
        { x: 300, y: 530, color: '#FF6B6B' },
        { x: 400, y: 530, color: '#4ECDC4' },
        { x: 500, y: 530, color: '#45B7D1' },
        { x: 600, y: 530, color: '#96CEB4' }
    ];

    groundButtons.forEach((button, index) => {
        const isNearby = getNearbyStone() === index;
        const gemSize = 50;
        const pressDepth = isNearby ? 3 : 0;
        
        // Socket (lubang di lantai)
        ctx.fillStyle = '#302820';
        ctx.beginPath();
        ctx.arc(button.x, button.y, gemSize / 2 + 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Gambar gemstone sebagai tombol
        const gemY = button.y + pressDepth;
        drawGemstone(ctx, button.x, gemY, gemSize, button.color, false);

        // Feedback visual saat didekati
        if (isNearby) {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.2)';
            ctx.beginPath();
            ctx.arc(button.x, button.y, gemSize / 2 + 5, 0, Math.PI * 2);
            ctx.fill();
        }
    });


    // === Show interaction prompt ===
    const nearbyButton = getNearbyStone();
    if (nearbyButton !== -1 && gameState.canInteract && !gameState.showingSequence) {
        const buttonX = [300, 400, 500, 600][nearbyButton];
        ctx.fillStyle = '#FFF';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press E to Activate Gem', buttonX, 485);
        
        // Floating indicator
        const bounce = Math.sin(Date.now() / 200) * 5;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 20px Arial';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 5;
        ctx.fillText('E', buttonX, 470 + bounce);
        ctx.shadowBlur = 0;
    }

    // === Milo shadow ===
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(gameState.miloPosition.x, gameState.miloPosition.y + 10, 15, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // === Fine dust ===
    for (let i = 0; i < 30; i++) {
        const x = (i * 35 + Date.now() / 20) % 1000;
        const y = 100 + (i * 15) % 300;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(x, y, 2, 2);
    }

    // === Progress panel ===
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(15, 10, 250, 90);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    
    if (gameState.showingSequence) {
        ctx.fillText(`Watch the sequence...`, 25, 30);
    } else if (gameState.canInteract) {
        ctx.fillText(`Walk to a gem and press E`, 25, 30);
    }
    
    ctx.fillText(`Sequence length: ${gameState.sequenceLength}`, 25, 50);
    ctx.fillText(`Progress: ${gameState.level2PlayerSequence.length} / ${gameState.level2Sequence.length}`, 25, 70);
    ctx.fillText(`Completed rounds: ${gameState.sequenceLength - 1}/4`, 25, 90);

    // === Puzzle failed overlay ===
    if (gameState.puzzleFailed) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.fillRect(0, 0, 1000, 600);
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Wrong sequence! Try again...', 500, 300);
    }

    // === Pocket Watch when puzzle completed ===
    if (gameState.puzzleCompleted) {
        const watchX = 700; // Posisi X jam di atas altar
        const watchY = 480; // Posisi Y jam di atas altar
        drawPocketWatch(watchX, watchY);
        // Tampilkan prompt interaksi jika Milo dekat
        if (Math.abs(gameState.miloPosition.x - watchX) < 50 && Math.abs(gameState.miloPosition.y - (watchY + 20)) < 50) {
            ctx.fillStyle = '#FFF';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Press E to collect pocket watch part', watchX, watchY - 40);
        }
    }


    // === Falling rock trap ===
    ctx.fillStyle = '#808080';
    gameState.fallingRocks.forEach(rock => {
        ctx.beginPath();
        ctx.arc(rock.x, rock.y, 10, 0, Math.PI * 2);
        ctx.fill();
    });

    // === Lighting vignette ===
    const radial = ctx.createRadialGradient(500, 300, 200, 500, 300, 500);
    radial.addColorStop(0, 'rgba(0,0,0,0)');
    radial.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 1000, 600);
}