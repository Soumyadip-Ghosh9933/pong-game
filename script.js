const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 400;

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

const player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 5,
    score: 0,
};

const ai = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    score: 0,
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: ballSize,
    dx: 4 * (Math.random() < 0.5 ? 1 : -1),
    dy: 4 * (Math.random() < 0.5 ? 1 : -1),
};

function drawRect(x, y, width, height, color = 'white') {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawBall(x, y, size, color = 'white') {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, size, 0, Math.PI * 2);
    context.fill();
}

function drawText(text, x, y, color = 'white', font = '20px Arial') {
    context.fillStyle = color;
    context.font = font;
    context.fillText(text, x, y);
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 4 * (Math.random() < 0.5 ? 1 : -1);
    ball.dy = 4 * (Math.random() < 0.5 ? 1 : -1);
}

function update() {
    // Move player paddle
    player.y += player.dy;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;

    // Move AI paddle
    if (ball.y < ai.y + ai.height / 2) ai.y -= 3;
    if (ball.y > ai.y + ai.height / 2) ai.y += 3;
    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > canvas.height) ai.y = canvas.height - ai.height;

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y < 0 || ball.y + ball.size > canvas.height) {
        ball.dy *= -1;
    }

    // Ball collision with paddles
    if (
        ball.x < player.x + player.width &&
        ball.x + ball.size > player.x &&
        ball.y < player.y + player.height &&
        ball.y + ball.size > player.y
    ) {
        ball.dx *= -1.1; // Increase speed
        ball.dy *= 1.1;
    }

    if (
        ball.x < ai.x + ai.width &&
        ball.x + ball.size > ai.x &&
        ball.y < ai.y + ai.height &&
        ball.y + ball.size > ai.y
    ) {
        ball.dx *= -1.1; // Increase speed
        ball.dy *= 1.1;
    }

    // Ball out of bounds
    if (ball.x < 0) {
        ai.score++;
        resetBall();
    } else if (ball.x > canvas.width) {
        player.score++;
        resetBall();
    }
}

function draw() {
    // Set the background color to black
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw paddles and ball
    drawRect(player.x, player.y, player.width, player.height, 'cyan');
    drawRect(ai.x, ai.y, ai.width, ai.height, 'red');
    drawBall(ball.x, ball.y, ball.size, 'yellow');

    // Draw scores
    drawText(`Player: ${player.score}`, 20, 30);
    drawText(`AI: ${ai.score}`, canvas.width - 120, 30);

    // Draw your name
    drawText("Made with ❤ by Soumyadip Ghosh", 248, canvas.height / 1.03, 'white', '20px Arial');
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') player.dy = -player.speed;
    if (e.key === 'ArrowDown') player.dy = player.speed;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') player.dy = 0;
});

// Touch controls
canvas.addEventListener('touchstart', (e) => {
    const touchY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
    if (touchY < player.y + player.height / 2) player.dy = -player.speed;
    else player.dy = player.speed;
});

canvas.addEventListener('touchend', () => {
    player.dy = 0;
});

loop();
