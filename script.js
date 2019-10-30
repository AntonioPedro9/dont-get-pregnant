let width = window.innerWidth;
let height = window.innerHeight;

let warning = document.getElementById("warning");
let scoreBoard = document.getElementById("scoreBoard");

// global variables
let diameter, ovule, spermatozoom, sperm, pontuation, chronometer, tutorial;

// reload the page if the window size change
window.addEventListener("resize", () => location.reload());

// reload the page if the orientation change
window.addEventListener("orientationchange", () => location.reload());

// show a warning if the orientation is portrait otherwise start the game
if (window.orientation == 0 || window.orientation == 180) { warning.style.display = "block" } else {



    function setup() {
        createCanvas(width, height).parent("container");

        // create a spermatozoom array
        sperm = new Group();

        // create a ovule
        createOvule();

        // display tutorial
        showTutorial();

        // start the score
        score();
    }



    function draw() {
        background(233, 30, 99);
        
        // check game rules every frame
        gameRules();

        // create a new spermatozoom based on the frame cout
        if (frameCount % 16 == 0) {
            createSpermatozoom();
        }

        // draw all sprites
        drawSprites();
    }



    function createOvule() {

        // the diameter is based on the screen height
        diameter = height/8;

        ovule = createSprite(height/8, height/2, diameter, diameter);

        ovule.draw = () => {
            fill(255, 128);
            stroke(255);
            strokeWeight(diameter/8);

            ellipse(0, 0, random(diameter, diameter + 4));
            ellipse(0, 0, random(diameter/8, diameter/8 + 4));
        }

        // set a circular collision zone
        ovule.setCollider("circle", 0, 0, diameter/2);
    }



    function createSpermatozoom() {

        let diameterX = height/16;
        let diameterY = height/32;

        spermatozoom = createSprite(width, random(height), diameterX, diameterY);

        spermatozoom.draw = () => {

            // spermatozoom body
            fill(255);
            noStroke();
            ellipse(0, 0, random(diameterX, diameterX + 4), random(diameterY, diameterY + 4));

            // spermatozoom tail
            fill(255, 128);
            ellipse(height/16, 0, random(diameterX * 2, diameterX * 2 + 4), random(diameterY/16, diameterY/16 + 4));
        }

        // spermatozoom speed is based on the screen width
        let speed = random(-width/256, -width/128);
        spermatozoom.velocity.x = speed;

        // delete spermatozoom after some time
        spermatozoom.life = 256;

        // add spermatozoom to sperm array
        sperm.add(spermatozoom);
    }



    function showTutorial() {

        // tutorial is a object
        tutorial = createSprite();

        let message1, message2;

        // if orientation is undefined its a computer
        if (typeof window.orientation == 'undefined') { 
            message1 = "Arrow up";
            message2 =  "Arrow down";
        }
        // otherwise its a mobile device
        else {
            message1 = "Up";
            message2 =  "Down";
        }

        tutorial.draw = () => {
            stroke(255);
            line(0, height/2, width, height/2);

            fill(255);
            noStroke();
            textSize(16);
            textAlign(CENTER, CENTER);
            
            text(message1, width/2, height/4);
            text(message2, width/2, height/4 * 3);
        }

        // hide tutorial after some time
        tutorial.life = 128;
    }



    function score() {
        pontuation = 0;
        scoreBoard.innerHTML = pontuation;

        // pontuation is based on how many seconds you survive
        chronometer = setInterval( () => { 
            pontuation += 1; 
            scoreBoard.innerHTML = pontuation;
        }, 1000);
    }



    function gameRules() {

        // define screen limits
        if (ovule.position.y > height - diameter/2 - 4) {
            ovule.position.y = height - diameter/2 - 4;
            ovule.velocity.y = 0;
        }
        else if (ovule.position.y < 0 + diameter/2 + 4) {
            ovule.position.y = 0 + diameter/2 + 4;
            ovule.velocity.y = 0;
        }

        let speed = height/128;

        // move ovule wuth keyboard
        if (keyIsDown(UP_ARROW)) {
            ovule.velocity.y = 0;
            ovule.velocity.y -= speed;
        }
        else if (keyIsDown(DOWN_ARROW)) {
            ovule.velocity.y = 0;
            ovule.velocity.y += speed;
        }

        // move ovule with clicks
        if (mouseIsPressed) {
            if (mouseY <= height/2) {
                ovule.velocity.y = 0;
                ovule.velocity.y -= speed;
            }
            else {
                ovule.velocity.y = 0;
                ovule.velocity.y += speed;
            }
        }

        // calls gameover if a spermatozoom collide with the ovule
        sperm.overlap(ovule, gameOver);
    }



    function gameOver() {

        alert(`YOU ARE PREGNANT\nscore: ${pontuation}`);
        
        // remove all sprites
        ovule.remove();
        sperm.removeSprites();

        // reset the score
        pontuation = 0;
        clearInterval(chronometer);
        
        // restart the game
        setup();
    }
}