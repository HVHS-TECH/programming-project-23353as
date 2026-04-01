let ballGroup;
let loseLineY = 120;
let dangerStartTime = null;
let dangerDuration = 2000;
let score = 0;
let lastClickTime;
let clickCooldown = 700;
let gameState;
let nextBallSize;

const RANDOM_SIZE = [50, 70, 90];

//Preloads images
function preload() {
    title = loadImage('Images/TITLE.png');
    start = loadImage('Images/START.png');
    controls = loadImage('Images/CONTROLS.png');
    gameOver = loadImage('Images/GAME OVER.png');

    back = loadImage('Images/BACK.png');
    home = loadImage('Images/HOME.png');
    restart = loadImage('Images/RESTART.png');

    mercury = loadImage('Images/MERCURY.png');
    venus = loadImage('Images/VENUS.png');
    earth = loadImage('Images/EARTH.png');
    mars = loadImage('Images/MARS.png');
    jupiter = loadImage('Images/JUPITER.png');
    saturn = loadImage('Images/SATURN.png');
    uranus = loadImage('Images/URANUS.png');
    neptune = loadImage('Images/NEPTUNE.png');
    sun = loadImage('Images/SUN.png');

    BGimg = loadImage('Images/SPACE.png');
}




function setup() {


    //Creates canvas
    cnv = createCanvas(windowWidth, windowHeight);
    cnv.position((windowWidth / 2) - (width / 2), (windowHeight / 2) - (height / 2));

    //Runs funtion for Start button
    startRun();

    //Control Button
    controlButton = new Sprite(width / 2, height / 1.2, width / 2.24, height / 2.8, 'static');
    controlButton.img = controls;
    controlButton.scale = 0.3;

    //Runs the Title Text
    titleText = new Sprite(width / 2.1, height / 3.5, width / 1.5, height / 5, 'static');
    titleText.img = title;
    titleText.scale = 0.3;

    //Gravity
    world.gravity.y = 12;

    gameState = "start";

    ballGroup = new Group();

    nextBallSize = random(RANDOM_SIZE);

    lastClickTime = 0;
}




//creates walls
function createWalls() {
    //Left wall
    wallLH = new Sprite((width / 2) - (width / 5), height / 2, 8, height, 'k');
    wallLH.color = "#cd86db"
    wallLH.opacity = 0.5;

    //Right wall
    wallRH = new Sprite((width / 2) + (width / 5), height / 2, 8, height, 'k');
    wallRH.color = "#cd86db"
    wallRH.opacity = 0.5;

    //Top wall
    wallTop = new Sprite(width / 2, 0, width / 2.5, 8, 'k');
    wallTop.color = "#cd86db"
    wallTop.opacity = 0.5;

    //Bottom wall
    wallBottom = new Sprite(width / 2, height, width / 2.5, 8, 'k');
    wallBottom.color = "#cd86db"
    wallBottom.opacity = 0.5;

    //Split wall
    wallSplit = new Sprite(width - (width / 2.6), height / 2, 8, height, 'k');
    wallSplit.color = "#cd86db"
    wallSplit.opacity = 0.5;
}




//creates the ball
function createNewBall(x, y, size) {
    let ball = new Sprite(x, y, size, 'dynamic');

    ball.img = getBallImage(size);
    ball.img.scale = size / ball.img.width
    ball.colider = 'circle';

    //Resizes the hitbox for saturn due to rings
    if (size === 170) {
        ball.img.scale = (size * 1.7) / ball.image.width;
    }
    //Resizes the hitbox for the sun due to flames
    else if (size === 210) {
        ball.img.scale = (size * 1.5) / ball.image.width;
    } else {
        ball.img.scale = size / ball.img.width
    }

    ball.bounciness = 0.5;
    ball.friction = 5;
    ball.drag = 1;

    ballGroup.add(ball);
}

//ball merging
function mergeBalls(ballA, ballB) {

    //removes balls of the same size
    if (ballA.diameter === ballB.diameter) {

        let newSize = ballA.diameter + 20;

        //averages the ball X and Y
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

        //removes previous balls
        ballA.remove();
        ballB.remove();

        if (newSize > 210) {
            return;
        }

        createNewBall(newX, newY, newSize);
    }
}

//Decides the image that the ball gets depending on the size
function getBallImage(size) {
    if (size === 50) return mercury; //mercury
    if (size === 70) return mars; //mars
    if (size === 90) return venus; //venus
    if (size === 110) return earth; //earth
    if (size === 130) return neptune; //neptune
    if (size === 150) return uranus; //uranus
    if (size === 170) return saturn; //saturn
    if (size === 190) return jupiter; //jupiter
    if (size === 210) return sun; //sun

    return 'white';
}


//function for start button
function startRun() {
    startButton = new Sprite(width / 2, height / 1.6, width / 2.24, height / 2.5, 'static');
    startButton.img = start;
    startButton.scale = 0.3;
}

//function for controls button
function controlButtonRun() {
    controlButton = new Sprite(width / 2, height / 1.2, width / 2.24, height / 2.8, 'static');
    controlButton.img = controls;
    controlButton.scale = 0.3;
}

//function for home button
function homeRun() {
    homeButton = new Sprite(homeLocationX, homeLocationY, width / 2.24, height / 2.5, 'static');
    homeButton.img = home;
    homeButton.scale = 0.2;
}

//function for title text
function titleRun() {
    titleText = new Sprite(width / 2.1, height / 3.5, width / 1.5, height / 5, 'static');
    titleText.img = title;
    titleText.scale = 0.3;
}





function draw() {

    clear();

    //background image
    imageMode(CORNER);
    image(BGimg, 0, 0, width, height);

    //game is on the start screen
    if (gameState == "start") {

        if (startButton.mouse.presses()) {
            gameState = "game";
            createWalls();
            startButton.remove();
            controlButton.remove();
            titleText.remove();

            homeLocationX = width / 1.52;
            homeLocationY = height / 1.35
            homeRun();

            restartButton = new Sprite(width / 1.52, height / 1.17, width / 2.24, height / 2.5, 'static');
            restartButton.img = restart;
            restartButton.scale = 0.2;
        }

        if (controlButton.mouse.presses()) {
            gameState = "controls";

            allSprites.deleteAll(); // cleaner

            controlBox = new Sprite(width / 2, height / 2, width / 3, width / 3, 'static');
            controlBox.color = "#a688ff";

            backButton = new Sprite(width / 2.67, height / 4.5, width / 2.24, height / 2.5, 'static');
            backButton.img = back;
            backButton.scale = 0.3;
        }
    }

    //game is on the controls screen
    if (gameState == "controls") {

        allSprites.draw();

        textAlign(CENTER, CENTER);

        drawingContext.shadowBlur = 15;
        drawingContext.shadowColour = "#ffffff";

        fill("#000000")
        textSize(80);
        text("Controls", controlBox.x, controlBox.y - controlBox.h / 3);

        textSize(40);

        let controlsText =
            "•Click above the red line to drop planets\n\n" +
            "•Merge same sizes\n\n" +
            "•Don't let them cross the line!";

        text(controlsText, controlBox.x / 1.42, controlBox.y / 2, controlBox.w - 40, controlBox.h - 40);

        if (backButton.mouse.presses()) {
            gameState = "start";
            allSprites.deleteAll();

            startRun();

            controlButtonRun();

            titleRun();
        }

    }

    //game is on the game screen
    if (gameState == "game") {
        //Draws the loose line
        stroke(255, 0, 0, 200);
        line(width / 3.35, loseLineY, width / 1.63, loseLineY);
        noStroke();

        ballGroup.collides(ballGroup, mergeBalls);

        let ballAboveLine = false;

        //For every ball that exists it check whether the balls are above the lose line
        for (let ball of ballGroup) {
            if (ball.y - ball.diameter / 2 < loseLineY) {
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
                gameState = "end";
                allSprites.deleteAll();

                //Creates the game over text
                gameOverText = new Sprite(width / 2, height / 3, width / 1.5, height / 5, 'static');
                gameOverText.img = gameOver;
                gameOverText.scale = 0.4;

                homeLocationX = width / 2.2
                homeLocationY = height / 1.35
                homeRun();

                //Creates a restart button
                restartButton = new Sprite(width / 1.9, height / 1.35, width / 2.24, height / 2.5, 'static');
                restartButton.img = restart;
                restartButton.scale = 0.2;

            }

        }

        //Resets the timer
        else {
            dangerStartTime = null;
        }


        //Creates ball at mouse
        if (mouse.presses() && mouseY < loseLineY && millis() - lastClickTime >= clickCooldown && mouseX > (width / 2) - (width / 5) + 5 && mouseX < width - (width / 2.6) - 5) {

            alterBallX = random(-1, 1);
            createNewBall(mouseX + alterBallX, mouseY, nextBallSize);

            lastClickTime = millis();

            nextBallSize = random(RANDOM_SIZE);
        }

        //Preview ball
        let previewIMG = getBallImage(nextBallSize);

        imageMode(CENTER);
        image(previewIMG, width / 1.52, height / 7, nextBallSize, nextBallSize);

        fill('white');
        textSize(width / 60);
        textAlign(LEFT, BASELINE);
        text("Ball:", width / 1.57, height / 13);
        text("Score: ", width / 1.6, height / 3.6);
        text(score, width / 1.57, height / 2.9)

        //Takes player to Start screen
        if (homeButton.mouse.presses()) {
            gameState = "start";
            allSprites.deleteAll();

            score = 0;

            dangerStartTime = null;

            lastClickTime = millis();

            nextBallSize = random(RANDOM_SIZE);

            startRun();

            controlButtonRun();

            titleRun();
        }

        //Restarts the game
        if (restartButton.mouse.presses()) {

            score = 0;
            dangerStartTime = null;
            lastClickTime = millis();
            nextBallSize = random(RANDOM_SIZE);


            ballGroup.deleteAll();

            homeLocationX = width / 1.52;
            homeLocationY = height / 1.35;
            homeRun();


            restartButton = new Sprite(width / 1.52, height / 1.17, width / 2.24, height / 2.5, 'static');
            restartButton.img = restart;
            restartButton.scale = 0.2;
        }


    }

    //game is on the end screen
    if (gameState == "end") {
        fill('white');
        textSize(width / 30);

        text("Score: ", width / 2.5, height / 1.5);
        text(score, width / 2, height / 1.5);

        //Takes user to Start Screen
        if (homeButton.mouse.presses()) {
            gameState = "start";
            allSprites.deleteAll();

            startRun();

            controlButtonRun();

            titleRun();
        }

        //Restarts Game
        if (restartButton.mouse.presses()) {
            allSprites.deleteAll();

            gameState = "game";

            score = 0;
            dangerStartTime = null;
            lastClickTime = millis();
            nextBallSize = random(RANDOM_SIZE);

            createWalls();


            homeLocationX = width / 1.52;
            homeLocationY = height / 1.35;
            homeRun();


            restartButton = new Sprite(width / 1.52, height / 1.17, width / 2.24, height / 2.5, 'static');
            restartButton.img = restart;
            restartButton.scale = 0.2;
        }
    }
}