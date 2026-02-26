function setup() {
    console.log("setup");
    cnv = createCanvas(windowWidth/4, windowHeight);
    world.gravity.y = 10;

    createWalls();
}

function createWalls() {
    wallLH = new Sprite(0, height/2, 8, height, 'k');
    wallLH.color = "black"

    wallRH = new Sprite(width, height/2, 8, height, 'k');
    wallRH.color = "black"
    
    wallTop = new Sprite(width/2, 0, width, 8, 'k');
    wallTop.color = "black"

    wallBottom = new Sprite(width/2, height, width, 8, 'k');
    wallBottom.color = "black"
}

function createNewBall(x, y, size = 50) {
    let ball = new Sprite(x, y, size, 'd');

    ball.bounciness = 0;
    ball.friction = 5;
    ball.drag = 1;
}


function draw() {
    background('gray');
}