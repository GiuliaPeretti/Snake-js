const gameCanvas = document.querySelector("#gameCanvas");
const ctx = gameCanvas.getContext("2d");
const scoreText = document.querySelector("#score");
const startButton = document.querySelector("#startButton");

// var c = document.getElementById("color");

const gameWidth = gameCanvas.width;
const gameHeight = gameCanvas.height;
const canvasBackground1 = "#dbf9db";
const canvasBackground2 = "#cce8cc";
const snakeColor="#f7c9fc";
const headColor="#b6b6f9"
const snakeColors1=["#ccccff","#d9ccff","#e6ccff","#f2ccff", "#ffccff" ,"#f2ccff","#e6ccff","#d9ccff","#ccccff"]
const snakeColors2=["#e89b94","#f9c693","#f9ea93","#d6f993","#b3f2d8","#b3cef2","#d4b3f2","#f2b3ea"]
let snakeColors=[];
const snakeBorder="#d08ad8";
const foodColor="#db304f";
let uniSize=50;
const velocity=125
let running = false;
let xVelocity = uniSize;
let yVelocity =  0;
let foods = []
let foodQuantity=5;
let notValid = [];
let score = 0;
let snake = []

//TODO: quando la perdi la testa del serpente se tonda meglio
//TODO: serpente se piu snello meglio 
//TODO: fai pop up per impostazioni, oppure metti in row dei dropdown menu con la casella grande
//TDOD: rendere modificabile grandezza quadratini, mele alla volta, colore serpente 
//TODO: mi pare che la frutta la prima volta si generi anche sotto il serpente, il resto del tempo no
//TODO: vedi se riesci a mettere la mela



window.addEventListener("keydown", changeDirection);
startButton.addEventListener("click", gameStart);

clearBoard();
drawSnake();



function gameStart(){
    running = true;
    scoreText.textContent = score;
    clearBoard();
    firstSnake();
    pickDifficuly();
    pickColorSnake();
    pickFoodQuantity();
    drawSnake();
    createFood();
    drawFood();
    nextTick();
};
function nextTick(){
    if(running){
        setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            nextTick(); 
        }, velocity)
    }else{
        displayGameOver();
    }
};
function clearBoard(){
    // ctx.fillStyle=canvasBackground1;
    // ctx.fillRect(0,0,gameWidth,gameHeight);


    //TODO: questo e il problema

    for(let i=0; i<gameWidth/uniSize; i++){
        for(let j=0; j<gameHeight/uniSize; j++){
            if(i%2==0){
                if(j%2==0){
                    ctx.fillStyle=canvasBackground1
                }else{
                    ctx.fillStyle=canvasBackground2
                }
            }else{
                if(j%2==0){
                    ctx.fillStyle=canvasBackground2
                }else{
                    ctx.fillStyle=canvasBackground1
                }
            }
            ctx.fillRect(i*uniSize,j*uniSize,uniSize,uniSize)
        }
    }

};
function createFood(){

    function randomFood(min,max){
        const randNum = Math.round((Math.random()*(max-min)+min)/uniSize)*uniSize
        return randNum;
    }

    //non funzioa
    while(foods.length<foodQuantity){
        let valid;
        let x;
        let y;
        
        do {
            x = randomFood(0, gameWidth - uniSize);
            y = randomFood(0, gameWidth - uniSize);
            valid = checkIfValidFood(x,y);
        }while(!valid);
        foods.push({x:randomFood(0, gameWidth - uniSize), y:randomFood(0, gameWidth - uniSize)})
    }

    //foodX=randomFood(0, gameWidth - uniSize);
    //foodY=randomFood(0, gameWidth - uniSize);
};

function drawFood(){
    ctx.fillStyle = foodColor;
    foods.forEach((food) => ctx.fillRect(food.x,food.y,uniSize,uniSize))
    //ctx.fillRect(foodX,foodY,uniSize,uniSize);

    // let img = document.createElement("img");
    // img.src = "apple.jpg";
    // img.width = 25;
    // img.height = 25;

    // show_image("apple.jpg",300, 200,"gfg logo");
}

function moveSnake(){
    const head = {x: snake[0].x + xVelocity, y: snake[0].y + yVelocity}

    snake.unshift(head);
    checkGameOver();
    if(!running){
        snake.shift();
        return;
    }
    //if food is eaten

    let found=false

    for(let i=0; i<foods.length; i++){
        if (foods[i].x == snake[0].x && foods[i].y == snake[0].y){
            found=true;
            score+=1
            scoreText.textContent = score;
            foods.splice(i,1);
            createFood();
            break;
        }
    }
    if (!found){
        snake.pop()
    }

    // if(foods.includes(h)){
    //     score+=1
    //     scoreText.textContent = score;
    //     createFood();
    // }else{
    //     snake.pop();
        
    // }
};
function drawSnake(){
    ctx.fillStyle=snakeColor;
    //ctx.strokeStyle=snakeBorder;
    for(let i = 0; i<snake.length;i++){
        if (i==0){
            ctx.fillStyle=headColor;
        }else{
            ctx.fillStyle=snakeColors[i%9];
        }
        ctx.fillRect(snake[i].x, snake[i].y, uniSize, uniSize)
        //ctx.strokeRect(snake[i].x, snake[i].y, uniSize, uniSize)
    }
    /*
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, uniSize, uniSize)
        ctx.strokeRect(snakePart.x, snakePart.y, uniSize, uniSize)

    })
        */
};
function changeDirection(event){
    if (running==false){
        resetGame();
        return;
        //TODO: quando inizia va solo a destra, vedi se togliere return
    }
    const keyPresssed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const A = 65;
    const W = 87;
    const D = 68;
    const S = 83;

    const goingUp = (yVelocity == -uniSize)
    const goingDown = (yVelocity == uniSize)
    const goingRight = (xVelocity == uniSize)
    const goingLeft = (xVelocity == -uniSize)

    switch(true){

        case((keyPresssed==LEFT || keyPresssed==A) && !goingLeft):
            console.log("Sinistra")
            if (goingRight){
                return;
            }
            xVelocity = -uniSize;
            yVelocity = 0;
            break;
        case((keyPresssed==UP || keyPresssed==W) && !goingUp):
        console.log("Su")
            if (goingDown){
                return;
            }
            xVelocity = 0;
            yVelocity = -uniSize;
            break;
        case((keyPresssed==RIGHT || keyPresssed==D) && !goingRight):
        console.log("Destra")
            if (goingLeft){
                return;
            }
            xVelocity = uniSize;
            yVelocity = 0;
            break;
        case((keyPresssed==DOWN || keyPresssed==S) && !goingDown):
        console.log("Giu")
            if (goingUp){
                return;
            }
            xVelocity = 0;
            yVelocity = uniSize;
            break;
    }
};
function checkGameOver(){
    if(snake[0].x < 0 || snake[0].y < 0 || snake[0].x>=gameWidth || snake[0].y >= gameHeight){
        running=false;
    }
    for(let i = 1; i< snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running=false;
            break;
        }
    }

};
function displayGameOver(){
    drawSnake();
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "#6a316b";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", gameWidth / 2, gameHeight /2);
    running = false;
}


function resetGame(){
    score = 0;
    xVelocity = uniSize;
    yVelocity =  0; 
    snake = [
        {x:uniSize*5,y:uniSize*9},
        {x:uniSize*4,y:uniSize*9},
        {x:uniSize*3,y:uniSize*9},
        {x:uniSize*2,y:uniSize*9},
        {x:uniSize*1,y:uniSize*9}
    ]
    foods=[];
    gameStart();
}

function checkIfValidFood(x,y){
    for(let i=0; i<notValid.length;i++){
        if(notValid[i][0] == y && notValid[i][0] == x){
            notValid.push([y,x]);
            return false;
        }
    }
    for(let i=0; i<snake.length;i++){
        if(snake[i].y == y && snake[i].x== x){
            notValid.push([y,x]);
            return false;
        }
    }
    for(let i=0; i<foods.length;i++){
        if(foods[i].y == y && foods[i].x== x){
            notValid.push([y,x]);
            return false;
        }
    }
    return true;
}


function pickColorSnake(){
    var c = document.getElementById("color");
    var value = c.value;
    var colorChoice = c.options[c.selectedIndex].text;
    switch(colorChoice){
        case("1"):
            snakeColors=snakeColors1
            break;
        default:
            snakeColors=snakeColors2
    }
}

function pickFoodQuantity(){
    var f = document.getElementById("selectFood");
    var value = f.value;
    foodQuantity = f.options[f.selectedIndex].text;
}

function firstSnake(){
    snake = []

    for(let i=5; i>0; i--){
        snake.push({x:uniSize*i, y:uniSize*(Math.floor(gameWidth/uniSize/2))})
    }

    console.log(gameWidth/uniSize/2)
    console.log(snake)
}

function pickDifficuly(){
    var d = document.getElementById("difficulty");
    var difficulty = d.options[d.selectedIndex].text;
    switch(difficulty){
        case("easy"):
            uniSize=50;
            break;
        case("medium"):
            uniSize=25;
            break;
        case("hard"):
            uniSize=10;
            break;
    }
}

function showSettings(){
    document.getElementById("Settings").style.display = "block"; 
}