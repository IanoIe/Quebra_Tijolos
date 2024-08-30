// Board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

//player
let playerWidth = 80; // 500 para testar, 80 é velocidade normal
let playerHeight = 10;
let playerVelocityX = 10; // velocidade de 10 pixes por tempo

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
let ballVelocityX = 3; // 15 para testar, 3 é vel normal
let ballVelocityY = 2; // 10 para testar, 2 é vel normal

let ball = {
    x : boardWidth/2,
    y : boardHeight/2,
    width : ballWidth,
    height : ballHeight,
    velocityX : ballVelocityX,
    velocityY : ballVelocityY
}

//blocks 
let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 8;
let blockRows = 3; //addicionar mais conformo o jogo começa
let blockMaxRows = 10; // limitar linhas
let blockCount = 0;

// Canto do bloco inicial no canto superior esquerdo
let blockX = 15;
let blockY = 45;

let score = 0;
let gameOver = false;


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

    // crear blocos
    createBlocks();
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //player
    context.fillStyle = "lightgreen";
    context.fillRect(player.x, player.y, player.width, player.height);

    // ball
    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    
    // Girar a bola do remo do jogador 
    if(topCollision(ball, player) || bottomCollision(ball, player)) {
        ball.velocityY *= -1; // Mudar direção para cima ou para baixo
    }
    else if (leftCollision(ball, player) || rightCollision(ball, player)) {
        ball.velocityX *= -1; // Mudar direção de esquerda a direita
    }

    if (ball.y <= 0) {
        //se a bola tocar o topo da tela
        ball.velocityY *= -1;
    }
    else if (ball.x <= 0 || (ball.x + ball.width) >= boardWidth) {
        // Se a bola tocar a esquerda ou direita do canvas 
        ball.velocityX *= -1; // direcção inversa 
    }
    else if (ball.y + ball.height >= boardHeight) {
        // Se a bola tocar o fundo da canvas
        // Fim do Jogo
        context.font = "20px sans-serif";
        context.fillText("Game Over: Press 'Space' to Restart", 80, 400);
        gameOver = true;
    }

    //blocos
    context.fillStyle = "skyblue";
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];
        if (!block.break) {
            if (topCollision(ball, block) || bottomCollision(ball, block)){
                block.break = true;
                ball.velocityY *= -1; //Mudar de direção de cima ou para baixo
                blockCount -= 1;
                score += 100;
            }
            else if (leftCollision(ball, block) || rightCollision(ball, block)){
                block.break = true;
                ball.velocityX *= -1; //Mudar de direção de esquerda pou para diretita
                blockCount -= 1;
                score +=100;
            }
            context.fillRect(block.x, block.y, block.width, block.height)
        }
    }

    //next level
    if (blockCount == 0) {
        score += 100*blockRows*blockColumns; // ponto de bonus :)
        blockRows = Math.min(blockRows + 1, blockMaxRows);
        createBlocks();
    }

    //Score
    context.font = "20px sans-serif";
    context.fillText(score, 10, 25);
}

function outOfBounds(xPosition) {
    return (xPosition < 0 || xPosition + playerWidth > boardWidth);
}

function movePlayer(e) {
    if (gameOver) {
        if (e.code == "Space") {
            resetGame();
        }
        return;
    }

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

function detectCollision(a, b) {
    return a.x < b.x + b.width && //O canto superior esquerdo de a não alcança o canto superior direito de b
           a.x + a.width > b.x && //O canto superior direito de a passa pelo canto superior esquerdo de b
           a.y < b.y + b.height && //O canto superior esquerdo de a não alcança o canto inferior esquerdo de b
           a.y + a.height > b.y; //O canto inferior esquerdo de a passa pelo canto superior esquerdo de b
}

function topCollision(ball, block) { //A está acima de B (a bola está acima do bloco)
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
}

function bottomCollision(ball, block) { //A está abaixo de B (a bola está abaixo do bloco)
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y;
}

function leftCollision(ball, block) {//A está à esquerda de B (a bola está à esquerda do bloco)
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}

function rightCollision(ball, block) {
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x;
}

function createBlocks() {
    blockArray = []; // limpar blocos de array
    for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
            let block = {
                x : blockX + c*blockWidth + c*10,
                y : blockY + r*blockHeight + r*10,
                width : blockWidth,
                height : blockHeight,
                break : false
            }
            blockArray.push(block);
        }
    }
    blockCount = blockArray.length;
}

function resetGame() {
    gameOver = false;
    player = {
        x : boardWidth/2 - playerWidth/2,
        y : boardHeight - playerHeight - 5,
        width : playerWidth,
        height : playerHeight,
        velocityX : playerVelocityX
    }
    ball = {
        x : boardWidth/2,
        y : boardHeight/2,
        width : ballWidth,
        height : ballHeight,
        velocityX : ballVelocityX,
        velocityY : ballVelocityY
    }
    blockArray = [];
    blockRows = 3;
    score = 0;
    createBlocks();
}