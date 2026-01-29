const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Pantalla completa
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let backgroundObjects = [];

function createBackgroundObject() {
    const types = ['star', 'planet', 'asteroid'];
    const type = types[Math.floor(Math.random() * types.length)];

    return {
        type,
        x: Math.random() * canvas.width,
        y: -50,
        size: type === 'planet'
            ? Math.random() * 40 + 30
            : Math.random() * 15 + 5,
        speed: Math.random() * 0.5 + 0.2,
        alpha: Math.random() * 0.15 + 0.05
    };
}

for (let i = 0; i < 60; i++) {
    const obj = createBackgroundObject();
    obj.y = Math.random() * canvas.height;
    backgroundObjects.push(obj);
}

function drawBackground() {
    backgroundObjects.forEach(obj => {
        ctx.globalAlpha = obj.alpha;

        if (obj.type === 'star') {
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.size / 4, 0, Math.PI * 2);
            ctx.fill();
        }

        if (obj.type === 'planet') {
            ctx.fillStyle = '#6b6ef9';
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.size, 0, Math.PI * 2);
            ctx.fill();
        }

        if (obj.type === 'asteroid') {
            ctx.font = `${obj.size}px Arial`;
            ctx.fillText('☄️', obj.x, obj.y);
        }

        obj.y += obj.speed;

        if (obj.y > canvas.height + 50) {
            obj.y = -50;
            obj.x = Math.random() * canvas.width;
        }
    });

    ctx.globalAlpha = 1;
}

let player = {
    x: canvas.width / 2,
    y: canvas.height - 80,
    width: 40,
    height: 40,
    speed: 6,
    moveLeft: false,
    moveRight: false
};

let score = 0;
let gameRunning = true;
let stars = [];
let obstacles = [];
let gameSpeed = 2;

function spawnStar() {
    stars.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        size: 28
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

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') player.moveRight = true;
    if (e.key === 'ArrowRight') player.moveLeft = true;
});

document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft') player.moveRight = false;
    if (e.key === 'ArrowRight') player.moveLeft = false;
});

function drawPlayer() {
    ctx.font = '40px Arial';
    ctx.fillText('🚀', player.x, player.y);
}

function drawStars() {
    stars.forEach((star, i) => {
        ctx.font = `${star.size}px Arial`;
        ctx.fillText('⭐', star.x, star.y);
        star.y += gameSpeed;

        if (
            star.x < player.x + player.width &&
            star.x + star.size > player.x &&
            star.y < player.y + player.height &&
            star.y + star.size > player.y
        ) {
            score += 10;
            stars.splice(i, 1);
            gameSpeed += 0.1;
        }

        if (star.y > canvas.height) stars.splice(i, 1);
    });
}

function drawObstacles() {
    obstacles.forEach((obs, i) => {
        ctx.font = '40px Arial';
        ctx.fillText('☄️', obs.x, obs.y);
        obs.y += gameSpeed;

        if (
            obs.x < player.x + player.width &&
            obs.x + obs.width > player.x &&
            obs.y < player.y + player.height &&
            obs.y + obs.height > player.y
        ) {
            endGame();
        }

        if (obs.y > canvas.height) obstacles.splice(i, 1);
    });
}

function updatePlayer() {
    if (player.moveLeft && player.x > 0) player.x -= player.speed;
    if (player.moveRight && player.x < canvas.width - player.width) player.x += player.speed;
}

function drawUI() {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(20, 20, 420, 120);

    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    ctx.fillText('¡CONTROLES INVERTIDOS!', 40, 50);
    ctx.fillText('⬅️  va a la DERECHA', 40, 75);
    ctx.fillText('➡️  va a la IZQUIERDA', 40, 100);

    ctx.font = '20px Arial';
    ctx.fillText(`⭐ Puntos: ${score}`, canvas.width - 180, 50);
}

function endGame() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').style.display = 'block';
}

function resetGame() {
    score = 0;
    gameSpeed = 2;
    stars = [];
    obstacles = [];
    player.x = canvas.width / 2;
    gameRunning = true;
    document.getElementById('gameOver').style.display = 'none';
    gameLoop();
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.fillStyle = '#0b0d24';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    updatePlayer();
    drawPlayer();
    drawStars();
    drawObstacles();
    drawUI();

    requestAnimationFrame(gameLoop);
}

setInterval(() => {
    if (gameRunning) {
        Math.random() > 0.5 ? spawnStar() : spawnObstacle();
    }
}, 1300);

gameLoop();
