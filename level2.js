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

    gameState.level2Sequence = [];
    gameState.level2PlayerSequence = [];
    gameState.activeStone = null;
    gameState.puzzleFailed = false;
    gameState.fallingRocks = [{ x: 450, y: -50, speed: 0, active: false }];
    gameState.fireParticles = [];

    updateUI();
    showStory(
        "Pyramid Chamber - Sound of the Pharaoh",
        "Milo finds himself in a mysterious pyramid chamber. The sacred stones glow with ancient power. He must repeat the sequence they show!",
        () => { setTimeout(() => startLevel2Sequence(), 1000); }
    );
    }

    // === SIMON SAYS LOGIC ===
    function startLevel2Sequence() {
    const sequenceLength = 3 + gameState.watchParts;
    gameState.level2Sequence = [];
    for (let i = 0; i < sequenceLength; i++) {
        gameState.level2Sequence.push(Math.floor(Math.random() * 4));
    }
    gameState.level2PlayerSequence = [];
    playSequence();
    }

    function playSequence() {
    let index = 0;
    const interval = setInterval(() => {
        if (index >= gameState.level2Sequence.length) {
        clearInterval(interval);
        gameState.activeStone = null;
        return;
        }
        const stoneIndex = gameState.level2Sequence[index];
        gameState.activeStone = stoneIndex;
        playStoneSound(stoneIndex);
        setTimeout(() => { gameState.activeStone = null; }, 400);
        index++;
    }, 800);
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

    function checkLevel2Sequence() {
    if (gameState.level2PlayerSequence.length === gameState.level2Sequence.length) {
        let correct = true;
        for (let i = 0; i < gameState.level2Sequence.length; i++) {
        if (gameState.level2PlayerSequence[i] !== gameState.level2Sequence[i]) {
            correct = false; break;
        }
        }
        if (!correct) {
        gameState.puzzleFailed = true;
        const buzz = new Audio('music/buzz.mp3');
        buzz.play();
        setTimeout(() => {
            gameState.puzzleFailed = false;
            startLevel2Sequence();
        }, 1000);
        }
    }
    }

    function handleMouseDownLevel2() {
    const stones = [
        { x: 300, y: 400 }, { x: 400, y: 400 },
        { x: 500, y: 400 }, { x: 600, y: 400 }
    ];
    stones.forEach((stone, index) => {
        if (Math.abs(gameState.mouse.x - stone.x) < 30 &&
            Math.abs(gameState.mouse.y - stone.y) < 30) {
        gameState.level2PlayerSequence.push(index);
        playStoneSound(index);
        checkLevel2Sequence();
        }
    });
    }

    // === UPDATE MILO ===
    function updateMilo_Level2() {
    const moveSpeed = 2, jumpPower = -13, gravity = 0.5;
    const miloWidth = 30, miloHeight = 55;

    if (!gameState.keys['e']) gameState.interactionPressed = false;

    if (gameState.keys['a'] || gameState.keys['arrowleft']) gameState.miloVelocity.x = -moveSpeed;
    else if (gameState.keys['d'] || gameState.keys['arrowright']) gameState.miloVelocity.x = moveSpeed;
    else gameState.miloVelocity.x *= 0.85;

    if ((gameState.keys[' '] || gameState.keys['w']) && gameState.canJump) {
        gameState.miloVelocity.y = jumpPower;
        gameState.canJump = false; gameState.onGround = false;
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
            gameState.onGround = true; gameState.canJump = true; onSurface = true;
        }
        }
    }
    if (!onSurface && gameState.miloPosition.y >= 550) {
        gameState.miloPosition.y = 550;
        gameState.miloVelocity.y = 0;
        gameState.onGround = true; gameState.canJump = true;
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
            rock.y = -50; rock.speed = 0; rock.active = false;
        }
        }
    });

    // === Fire particles obor ===
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

function drawLevel2() {
  // === Background gradien piramid ===
  const gradient = ctx.createLinearGradient(0, 0, 0, 600);
  gradient.addColorStop(0, '#D2B48C'); // light sand
  gradient.addColorStop(1, '#8B4513'); // dark sand
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1000, 600);

  // === Layer siluet pilar / patung ===
  ctx.fillStyle = 'rgba(80, 50, 20, 0.2)';
  ctx.fillRect(100, 100, 60, 400);
  ctx.fillRect(800, 50, 40, 500);

  // === Ground ===
  ctx.fillStyle = '#5C4033'; // dark stone
  ctx.fillRect(0, 550, 1000, 50);

  // === Platform block dengan pola batu ===
  Object.entries(level2Objects).forEach(([key, obj]) => {
    // Bata dasar
    ctx.fillStyle = '#A0522D'; // brown brick
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    // Pola garis blok
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

  // === Obor animasi ===
  const torches = [{ x: 220, y: 290 }, { x: 630, y: 490 }];
  torches.forEach(pos => {
    // Cahaya glow
    ctx.fillStyle = 'rgba(255, 140, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y - 20, 25 + Math.sin(Date.now() / 100) * 3, 0, Math.PI * 2);
    ctx.fill();
    // Api
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y - 20);
    ctx.lineTo(pos.x - 5, pos.y);
    ctx.lineTo(pos.x + 5, pos.y);
    ctx.closePath();
    ctx.fill();
  });

  // === Particle obor ===
gameState.fireParticles.forEach(p => {
  ctx.fillStyle = `rgba(255,140,0,${p.life})`;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
  ctx.fill();
});


  // === Batu puzzle dengan rune & glow ===
  const stones = [
    { x: 300, y: 400, color: '#FF6B6B' },
    { x: 400, y: 400, color: '#4ECDC4' },
    { x: 500, y: 400, color: '#45B7D1' },
    { x: 600, y: 400, color: '#96CEB4' }
  ];

  stones.forEach((stone, index) => {
    let radius = 25;
    if (gameState.activeStone === index) {
      radius = 35;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#FFD700';
    }
    ctx.fillStyle = stone.color;
    ctx.beginPath();
    ctx.arc(stone.x, stone.y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Rune di atas batu
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px Papyrus';
    ctx.fillText('Ⲙ', stone.x - 5, stone.y + 4);

    ctx.shadowBlur = 0;
  });

  // === Milo bayangan (shadow di tanah) ===
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(gameState.miloPosition.x, gameState.miloPosition.y + 10, 15, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // === Debu halus ===
  for (let i = 0; i < 30; i++) {
    const x = (i * 35 + Date.now() / 20) % 1000;
    const y = 100 + (i * 15) % 300;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(x, y, 2, 2);
  }

  // === Panel progress puzzle ===
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(15, 10, 180, 50);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '14px Arial';
  ctx.fillText(`Repeat the sequence`, 25, 30);
  ctx.fillText(`Input: ${gameState.level2PlayerSequence.length} / ${gameState.level2Sequence.length}`, 25, 50);

  // === Puzzle gagal? Overlay merah ===
  if (gameState.puzzleFailed) {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.fillRect(0, 0, 1000, 600);
  }

  // === Pocket Watch jika puzzle benar ===
  if (
    gameState.level2PlayerSequence.length === gameState.level2Sequence.length &&
    gameState.level2PlayerSequence.every((val, i) => val === gameState.level2Sequence[i])
  ) {
    drawPocketWatch(500, 300);
    if (
      Math.abs(gameState.miloPosition.x - 500) < 50 &&
      Math.abs(gameState.miloPosition.y - 300) < 100
    ) {
      ctx.fillStyle = '#FFF';
      ctx.font = '14px Arial';
      ctx.fillText('Press E to collect pocket watch part', 350, 50);
      if (gameState.keys['e']) {
        playCollectSound();
        gameState.watchParts++;
        fadeOutIn(() => startLevel3());
      }
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

