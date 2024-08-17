// Board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

//player
let playerWidth = 80;
let playerHeight = 10;
let playerVelocityX = 10;

let player = {
    x : boardWidth/2 - playerWidth/2,
    y : boardHeight - playerHeight - 5,
    width : playerWidth,
    height : playerHeight,
    velocityX : playerVelocityX
}

// ball
let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3;
let ballVelocityY = 2;

let ball = {
    x : boardWidth/2,
    y : boardHeight/2,
    width : ballWidth,
    height : ballHeight,
    velocityX : ballVelocityX,
    velocityY : ballVelocityY
}

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // desenho da tela

    //A tela inicial do jogador
    context.fillStyle = "lightgreen";
    context.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    //player
    context.fillStyle = "lightgreen";
    context.fillRect(player.x, player.y, player.width, player.height);

    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    //Bater na nola contra parede
    if (ball.y <= 0) {
        //se a bola tocar o topo da tela
        ball.velocityY *= -1;
    }
    else if (ball.x <= 0 || (ball.x + ball.width) >= boardWidth) {
        // Se a bola tocar a esquerda ou direita do canvas 
        ball.velocityX *= -1; // direcção inversa 
    }
}

function outOfBounds(xPosition) {
    return (xPosition < 0 || xPosition + playerWidth > boardWidth);
}

function movePlayer(e) {

    if (e.code == "ArrowLeft") {
        //player.x -= player.velocityX;
        let nextPlayeX = player.x - player.velocityX;
        if (!outOfBounds(nextPlayeX)) {
            player.x = nextPlayeX;
        }
    }
    else if (e.code == "ArrowRight") {
        //player.x += player.velocityX;
        let nextPlayerX = player.x + player.velocityX
        if (!outOfBounds(nextPlayerX)) {
            player.x = nextPlayerX;
        }
    }
}