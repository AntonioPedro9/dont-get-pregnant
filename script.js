// global variables
let width = window.innerWidth;
let height = window.innerHeight;
let move_sound, hit_sound, diameter, ovule, spermatozoom, sperm, pontuation = 0, chronometer;

// reload the page if the orientation changes
window.addEventListener("orientationchange", () => location.reload());

function preload() {
    move_sound = loadSound("sounds/move_sound.wav");
    hit_sound = loadSound("sounds/hit_sound.wav");
}



function setup() {
    createCanvas(width, height);

    // move sound effect restarts after triggered
    move_sound.playMode("restart");

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

    // draw all objects
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
    let tutorial = createSprite();

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
    
    let score = createSprite();

    // pontuation is based on how many seconds you survive
    chronometer = setInterval( () => { 
        pontuation += 1; 
    }, 1000);

    score.draw = () => {
        fill(255);
        stroke(255);
        textSize(height/16);
        textAlign(CENTER, CENTER);
        text(pontuation, width/2, height/16);
    }
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

    // calls gameover if a spermatozoom collide with the ovule
    if (sperm.overlap(ovule)) {
        hit_sound.play();
        gameOver();
    }
}



let speed = height/128;

// move ovule with clicks
function mouseClicked() {
    move_sound.play();

    if (mouseY <= height/2) {
        ovule.velocity.y = 0;
        ovule.velocity.y -= speed;
    }
    else {
        ovule.velocity.y = 0;
        ovule.velocity.y += speed;
    }
}



// move ovule with keyboard
function keyPressed() {
    if (keyCode === UP_ARROW) {
        move_sound.play();

        ovule.velocity.y = 0;
        ovule.velocity.y -= speed;
    }
    else if (keyCode === DOWN_ARROW) {
        move_sound.play();

        ovule.velocity.y = 0;
        ovule.velocity.y += speed;
    }
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
