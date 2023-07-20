var canvas = document.getElementById("snakeCanvas");
var ctx = canvas.getContext("2d");

let boardBorder = "black";
let boardBackground = "grey";
let snakeColor = "green";
let snakeBorder = "darkgreen";

const img = new Image();
img.src = "img/snake.png";

window.onload = function () {
    canvas.width = screen.width * 0.95;
    canvas.height = screen.height * 0.7;
    console.log(screen.width);
    clearBoard();
    ctx.drawImage(img, 50, 0, 290, 410);
}

var start = true;

let snake = [
    { x: 50, y: 200 },
    { x: 40, y: 200 },
    { x: 30, y: 200 },
    { x: 20, y: 200 },
    { x: 10, y: 200 }
]

let appleX;
let appleY;

let touchdistance;
let dir;
let changingDirection = false;
let dx = 10;
let dy = 0;

let score = 0;
let highscore = localStorage.getItem("highscore");
if (highscore == null) highscore = 0;

clearBoard();

document.addEventListener("keydown", changeDirection);
window.addEventListener("keydown", function (e) {
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false)
document.getElementById("highscore").innerHTML = "Highscore: " + highscore;


function main() {
    if (hasGameEnded()) {
        document.getElementById("button").value = "Restart";
        document.getElementById("score").innerHTML = "Game Over! Score: " + score;
        return;
    }

    changingDirection = false;
    setTimeout(function onTick() {
        clearBoard();
        drawApple();
        moveSnake();
        drawSnake();
        main();
    }, 100)
}

function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.strokeStyle = boardBorder;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    const hasEatenApple = snake[0].x === appleX && snake[0].y === appleY;
    if (hasEatenApple) {
        score = score + 1;
        if (score > highscore) {
            highscore = score;
            localStorage.setItem("highscore", highscore.toString());
        }
        document.getElementById("score").innerHTML = score;
        document.getElementById("highscore").innerHTML = "Highscore: " + highscore;
        generateApple();
    } else {
        snake.pop();
    }
}

function hasGameEnded() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvas.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > canvas.height - 10;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

/*
function touchStarted() {  //EXPERIMENTAL
    console.log("touchstarted");
    touchDist = createVector(mouseX, mouseY);
}
function touchEnded() {
    touchDist.sub(createVector(mouseX, mouseY));

    if (abs(touchDist.x) > abs(touchDist.y)) { // hor
        dir = touchDist.x < 0 ? 'right' : 'left';
    }
    else { // vert
        dir = touchDist.y < 0 ? 'down' : 'up';
    }
}
*/

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;


    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY & !goingUp) {
        dx = 0;
        dy = 10;
    }
}

function randomApple(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function generateApple() {
    appleX = randomApple(0, canvas.width - 10);
    appleY = randomApple(0, canvas.height - 10);
    snake.forEach(function hasSnakeEatenFood(part) {
        const hasEaten = part.x == appleX && part.y == appleY;
        if (hasEaten) generateApple();
    });
}

function drawApple() {
    ctx.fillStyle = "red";
    ctx.strokeStyle = "darkred";
    ctx.fillRect(appleX, appleY, 10, 10);
    ctx.strokeRect(appleX, appleY, 10, 10);
}

function startSnake() {
    snake = [
        { x: 50, y: 200 },
        { x: 40, y: 200 },
        { x: 30, y: 200 },
        { x: 20, y: 200 },
        { x: 10, y: 200 }
    ]
    main();
    generateApple();
    changingDirection = false;
    dx = 10;
    dy = 0;
    score = 0;
    document.getElementById("score").innerHTML = score;
}

function restart() {
    if (hasGameEnded() || score == 0) {
        if (start == true) {
            startSnake();
        }
        document.getElementById("button").value = "Start";
    }
    start = true;
}

var myElement = document.body;
// create a simple instance
// by default, it only adds horizontal recognizers
var mc = new Hammer(myElement);

// let the pan gesture support all directions.
// this will block the vertical scrolling on a touch-device while on the element
mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

// listen to events...
mc.on("panleft panright panup pandown tap press", function (ev) {   //ev.type 
    if (changingDirection) return;
    changingDirection = true;

    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    const pan = ev.type;


    if (pan == "panleft" && !goingRight) {
        dx = -10;
        dy = 0;
    }

    if (pan == "panup" && !goingDown) {
        dx = 0;
        dy = -10;
    }

    if (pan == "panright" && !goingLeft) {
        dx = 10;
        dy = 0;
    }

    if (pan == "pandown" & !goingUp) {
        dx = 0;
        dy = 10;
    }
});
