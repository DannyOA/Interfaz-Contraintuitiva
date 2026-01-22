const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = {
    x: canvas.width / 2,
    y: canvas.height - 80,
    width: 40,
    height: 40,
    speed: 5,
    moveLeft: false,
    moveRight: false
};

let score = 0;
let gameRunning = true;
let stars = [];
let obstacles = [];
let gameSpeed = 2;

// Generar estrellas y obstáculos
function spawnStar() {
    stars.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        size: 25
    });
}

function spawnObstacle() {
    obstacles.push({
        x: Math.random() * (canvas.width - 40),
        y: -40,
        width: 40,
        height: 40
    });
}

// Controles contraintuitivos
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        player.moveRight = true; // ¡Opuesto!
        player.moveLeft = false;
    }
    if (e.key === 'ArrowRight') {
        player.moveLeft = true; // ¡Opuesto!
        player.moveRight = false;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        player.moveRight = false;
    }
    if (e.key === 'ArrowRight') {
        player.moveLeft = false;
    }
});

function drawPlayer() {
    // Cuerpo del jugador
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(player.x + player.width/2, player.y + player.height/2, player.width/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Ojos
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(player.x + 15, player.y + 15, 4, 0, Math.PI * 2);
    ctx.arc(player.x + 25, player.y + 15, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Sonrisa
    ctx.beginPath();
    ctx.arc(player.x + 20, player.y + 20, 8, 0, Math.PI);
    ctx.stroke();
}

function drawStars() {
    ctx.fillStyle = '#FFD700';
    stars.forEach((star, index) => {
        ctx.font = `${star.size}px Arial`;
        ctx.fillText('⭐', star.x, star.y);
        
        star.y += gameSpeed;
        
        // Colisión con jugador
        if (star.x < player.x + player.width &&
            star.x + star.size > player.x &&
            star.y < player.y + player.height &&
            star.y + star.size > player.y) {
            score += 10;
            document.getElementById('score').textContent = score;
            stars.splice(index, 1);
            gameSpeed += 0.1;
        }
        
        // Eliminar si sale de la pantalla
        if (star.y > canvas.height) {
            stars.splice(index, 1);
        }
    });
}

function drawObstacles() {
    ctx.fillStyle = '#ff4444';
    obstacles.forEach((obs, index) => {
        ctx.font = '35px Arial';
        ctx.fillText('💀', obs.x, obs.y);
        
        obs.y += gameSpeed;
        
        // Colisión con jugador
        if (obs.x < player.x + player.width &&
            obs.x + obs.width > player.x &&
            obs.y < player.y + player.height &&
            obs.y + obs.height > player.y) {
            endGame();
        }
        
        // Eliminar si sale de la pantalla
        if (obs.y > canvas.height) {
            obstacles.splice(index, 1);
        }
    });
}

function updatePlayer() {
    if (player.moveLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (player.moveRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
}

function endGame() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').style.display = 'block';
}

function resetGame() {
    gameRunning = true;
    score = 0;
    gameSpeed = 2;
    stars = [];
    obstacles = [];
    player.x = canvas.width / 2;
    document.getElementById('score').textContent = score;
    document.getElementById('gameOver').style.display = 'none';
    gameLoop();
}

function gameLoop() {
    if (!gameRunning) return;
    
    // Limpiar canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar estrellas de fondo
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 50; i++) {
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }
    
    updatePlayer();
    drawPlayer();
    drawStars();
    drawObstacles();
    
    requestAnimationFrame(gameLoop);
}

// Generar elementos periódicamente
setInterval(() => {
    if (gameRunning) {
        if (Math.random() > 0.5) {
            spawnStar();
        } else {
            spawnObstacle();
        }
    }
}, 1500);

// Iniciar juego
gameLoop();