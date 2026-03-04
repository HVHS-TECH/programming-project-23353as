let ballGroup;
let loseLineY = 120;
let gameOver = false;
let dangerStartTime = null;
let dangerDuration = 2000;
let score = 0;
let randomSize
const RANDOM_SIZE = [50, 70, 90];

function setup() {
    console.log("setup");
    cnv = createCanvas(windowWidth/4, windowHeight);
    world.gravity.y = 10;

    createWalls();

    ballGroup = new Group();
}

//creates walls
function createWalls() {
    //Left wall
    wallLH = new Sprite(0, height/2, 8, height, 'k');
    wallLH.color = "black"

    //Right wall
    wallRH = new Sprite(width, height/2, 8, height, 'k');
    wallRH.color = "black"
    
    //Top wall
    wallTop = new Sprite(width/2, 0, width, 8, 'k');
    wallTop.color = "black"

    //Bottom wall
    wallBottom = new Sprite(width/2, height, width, 8, 'k');
    wallBottom.color = "black"
}

//creates the ball
function createNewBall(x, y, size = 50) {
    let ball = new Sprite(x, y, size, 'd');

    ball.color = getBallColour(size);
    ball.bounciness = 0;
    ball.friction = 5;
    ball.drag = 1;

    ball.diameter = size;

    ballGroup.add(ball);
}

//ball merging
function mergeBalls(ballA, ballB) {

    //removes balls of the same size
    if (ballA.diameter === ballB.diameter) {

        let newSize = ballA.diameter + 20;

        let newX = (ballA.x + ballB.x) / 2;
        let newY = (ballA.y + ballB.y) / 2;

        //Adds score depending on the merge size
        if (ballA.diameter === 50) score += 10; //mercury
        if (ballA.diameter === 70) score += 20; //mars
        if (ballA.diameter === 90) score += 30; //venus
        if (ballA.diameter === 110) score += 40; //earth
        if (ballA.diameter === 130) score += 50; //neptune
        if (ballA.diameter === 150) score += 60; //uranus
        if (ballA.diameter === 170) score += 70; //saturn
        if (ballA.diameter === 190) score += 80; //jupiter
        if (ballA.diameter === 210) score += 90; //sun

        ballA.remove();
        ballB.remove();

        if (newSize > 210) {
            return;
        }

        createNewBall (newX, newY, newSize);
    }
}

function getBallColour(size) {
    if (size === 50) return '#b1adad'; //mercury
    if (size === 70) return '#c1440e'; //mars
    if (size === 90) return '#e3bb76 '; //venus
    if (size === 110) return '#9fc164'; //earth
    if (size === 130) return '#274687'; //neptune
    if (size === 150) return '#c6d3e3'; //uranus
    if (size === 170) return '#ead6b8'; //saturn
    if (size === 190) return '#c99039'; //jupiter
    if (size === 210) return '#ffff70'; //sun

    return 'white';
}

function draw() {
    background('gray');

    //Lose line
    stroke('red');
    line(0, loseLineY, width, loseLineY);
    noStroke();


    if (!gameOver) {
        ballGroup.collides(ballGroup, mergeBalls);

	    let ballAboveLine = false;

	    for (let ball of ballGroup) {
		    if (ball.y - ball.diameter/2 < loseLineY) {
			    ballAboveLine = true;
			    break;
            }
        }

        //Starts timer if ball is above the line
        if (ballAboveLine) {

            if (dangerStartTime === null) {
                dangerStartTime = millis();
            }

            //Ends the game when ball stays over the line for over 2 secs
            if (millis() - dangerStartTime > dangerDuration) {
                gameOver = true;
            }

        } 
        
        else{
            dangerStartTime = null;
        }

    
        //creating ball at mouse
        if (mouse.presses() && mouseY < loseLineY) {
            createNewBall(mouseX, mouseY)

            randomSize = random(RANDOM_SIZE);
            size = randomSize
            
        }
    }

    //gameOver=true
    if (gameOver) {
    fill('black');
	textAlign(CENTER);
	textSize(50);
	text("GAME OVER", width/2, height/2);
	noLoop();
    }

    //displays score
    fill('white');
    textSize(30);
    textAlign(LEFT, TOP);
    text("Score: " + score, 20, 20);
}