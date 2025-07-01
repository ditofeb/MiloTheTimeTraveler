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
    // Background - garage floor (concrete)
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 0, 1000, 600);

    // Add concrete texture with slight variations
    ctx.fillStyle = '#B8B8B8';
    for (let i = 0; i < 20; i++) {
        ctx.fillRect(Math.random() * 1000, Math.random() * 600, 10, 10);
    }

    // Back wall
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(0, 0, 1000, 200);

    // Wall texture (wood paneling lines)
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 100, 0);
        ctx.lineTo(i * 100, 200);
        ctx.stroke();
    }

    // Garage door tracks
    ctx.fillStyle = '#696969';
    ctx.fillRect(0, 180, 1000, 20);
    ctx.fillRect(0, 200, 20, 400);
    ctx.fillRect(980, 200, 20, 400);

    // Workbench (left side)
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(50, 350, 200, 100);
    ctx.fillStyle = '#654321';
    ctx.fillRect(50, 350, 200, 20); // top surface

    // Workbench legs
    ctx.fillStyle = '#654321';
    ctx.fillRect(60, 450, 15, 100);
    ctx.fillRect(225, 450, 15, 100);
    ctx.fillRect(60, 350, 15, 100);
    ctx.fillRect(225, 350, 15, 100);

    // Tools on workbench
    ctx.fillStyle = '#FF4500';
    ctx.fillRect(70, 340, 30, 8); // screwdriver
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(110, 335, 40, 15); // wrench
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(160, 330, 25, 20); // hammer head
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(170, 350, 5, 30); // hammer handle

    // Toolbox
    ctx.fillStyle = '#DC143C';
    ctx.fillRect(200, 320, 80, 30);
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(200, 320, 80, 5); // toolbox lid
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(230, 325, 5, 20); // handle

    // Storage shelves (right side)
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(700, 250, 250, 20); // shelf 1
    ctx.fillRect(700, 350, 250, 20); // shelf 2
    ctx.fillRect(700, 450, 250, 20); // shelf 3

    // Shelf supports
    ctx.fillRect(720, 200, 15, 250);
    ctx.fillRect(920, 200, 15, 250);

    // Boxes on shelves
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(730, 220, 40, 30); // box 1
    ctx.fillRect(800, 215, 35, 35); // box 2
    ctx.fillStyle = '#654321';
    ctx.fillRect(860, 225, 50, 25); // box 3

    // Items on lower shelves
    ctx.fillStyle = '#32CD32';
    ctx.fillRect(720, 320, 60, 30); // paint can
    ctx.fillStyle = '#FF6347';
    ctx.fillRect(800, 325, 45, 25); // another can

    // Garden tools leaning against wall
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(600, 200);
    ctx.lineTo(600, 500);
    ctx.stroke(); // shovel handle

    ctx.fillStyle = '#696969';
    ctx.fillRect(590, 480, 20, 40); // shovel blade

    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(630, 210);
    ctx.lineTo(630, 480);
    ctx.stroke(); // rake handle

    // Rake head
    ctx.strokeStyle = '#696969';
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(615 + i * 4, 470);
        ctx.lineTo(615 + i * 4, 490);
        ctx.stroke();
    }

    // Bicycle (background)
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(450, 480, 30, 0, Math.PI * 2); // rear wheel
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(550, 480, 30, 0, Math.PI * 2); // front wheel
    ctx.stroke();

    // Bike frame
    ctx.strokeStyle = '#0000FF';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(450, 450);
    ctx.lineTo(500, 400);
    ctx.lineTo(550, 450);
    ctx.lineTo(500, 480);
    ctx.lineTo(450, 450);
    ctx.stroke();

    // Oil stains on floor
    ctx.fillStyle = 'rgba(64, 64, 64, 0.6)';
    ctx.beginPath();
    ctx.ellipse(300, 520, 40, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(500, 480, 25, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cardboard boxes scattered around
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(350, 480, 60, 50);
    ctx.fillRect(420, 500, 45, 40);

    // Box tape
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(350, 505);
    ctx.lineTo(410, 505);
    ctx.stroke();

    // Window with light streaming in
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(800, 50, 120, 80);
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 4;
    ctx.strokeRect(800, 50, 120, 80);

    // Window cross
    ctx.beginPath();
    ctx.moveTo(860, 50);
    ctx.lineTo(860, 130);
    ctx.moveTo(800, 90);
    ctx.lineTo(920, 90);
    ctx.stroke();

    // Light beam effect
    ctx.fillStyle = 'rgba(255, 255, 200, 0.3)';
    ctx.beginPath();
    ctx.moveTo(800, 130);
    ctx.lineTo(920, 130);
    ctx.lineTo(950, 300);
    ctx.lineTo(770, 300);
    ctx.closePath();
    ctx.fill();

    // Hanging light bulb
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 0);
    ctx.lineTo(150, 80);
    ctx.stroke();

    ctx.fillStyle = '#FFFF99';
    ctx.beginPath();
    ctx.arc(150, 100, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#E6E6FA';
    ctx.lineWidth = 2;
    ctx.stroke();

    // The mysterious pocket watch (enhanced)
    ctx.fillStyle = '#4A4A4A'; // darker shadow base
    ctx.beginPath();
    ctx.arc(155, 385, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(150, 380, 22, 0, Math.PI * 2);
    ctx.fill();

    // Watch details
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Watch face
    ctx.fillStyle = '#FFFAF0';
    ctx.beginPath();
    ctx.arc(150, 380, 18, 0, Math.PI * 2);
    ctx.fill();

    // Clock hands (broken/twisted)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 380);
    ctx.lineTo(145, 370);
    ctx.moveTo(150, 380);
    ctx.lineTo(160, 375);
    ctx.stroke();

    // Mystical glow effect around the watch
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(150, 380, 30, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Interaction prompt
    if (Math.abs(gameState.miloPosition.x - 150) < 50 && Math.abs(gameState.miloPosition.y - 380) < 50) {
        // Prompt background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(250, 30, 300, 40);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.strokeRect(250, 30, 300, 40);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Press E to examine the pocket watch', 260, 55);

        if (gameState.keys['e']) {
            fadeOutIn(() => {
                startLevel1();
            });
        }
    }

    // Chair near workbench (stepping stone for cat)
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(280, 420, 40, 80); // chair back
    ctx.fillRect(280, 480, 50, 20); // chair seat

    // Chair legs
    ctx.fillStyle = '#654321';
    ctx.fillRect(285, 500, 6, 50);
    ctx.fillRect(315, 500, 6, 50);
    ctx.fillRect(285, 420, 6, 60);
    ctx.fillRect(315, 420, 6, 60);

    // Small wooden crate (another stepping option)
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(320, 480, 35, 30);
    ctx.strokeStyle = '#8B7355';
    ctx.lineWidth = 2;
    ctx.strokeRect(320, 480, 35, 30);

    // Crate wooden slats
    ctx.beginPath();
    ctx.moveTo(320, 490);
    ctx.lineTo(355, 490);
    ctx.moveTo(320, 500);
    ctx.lineTo(355, 500);
    ctx.stroke();

    // Stack of books on floor (additional step)
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(250, 520, 60, 8);
    ctx.fillStyle = '#006400';
    ctx.fillRect(252, 512, 56, 8);
    ctx.fillStyle = '#4B0082';
    ctx.fillRect(254, 504, 52, 8);

    // Small bucket turned upside down (makeshift step)
    ctx.fillStyle = '#696969';
    ctx.beginPath();
    ctx.arc(200, 530, 25, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#2F4F4F';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Bucket handle
    ctx.strokeStyle = '#2F4F4F';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(200, 525, 15, Math.PI, 0);
    ctx.stroke();

    // Dust particles in the light
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 15; i++) {
        ctx.beginPath();
        ctx.arc(820 + Math.random() * 100, 150 + Math.random() * 150, 1, 0, Math.PI * 2);
        ctx.fill();
    }
}