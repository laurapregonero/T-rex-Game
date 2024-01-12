var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudImage;
var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var obstaclesGroup;
var cloudsGroup;
var play = 1;
var end = 0;
var gameState = play;
var score = 0; 
var restart, restartImage;
var gameOver, GameOverImage;
var dieSound, jumpSound, checkpointSound;


function preload() {
trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
trex_collided = loadAnimation("trex_collided.png");
groundImage = loadImage("ground2.png");
cloudImage = loadImage("cloud.png");
obstacle1 = loadImage('obstacle1.png');
obstacle2 = loadImage('obstacle2.png');
obstacle3 = loadImage('obstacle3.png');
obstacle4 = loadImage('obstacle4.png');
obstacle5 = loadImage('obstacle5.png');
obstacle6 = loadImage('obstacle6.png');
restartImage = loadImage('restart.png');
GameOverImage = loadImage('gameOver.png');
dieSound = loadSound('die.mp3');
jumpSound = loadSound('jump.mp3');
checkpointSound = loadSound('checkPoint.mp3');

}

function setup() {
createCanvas(windowWidth, windowHeight);

//create a trex sprite
trex = createSprite(50,160,20,50)
trex.addAnimation("running", trex_running);
trex.addAnimation("collided", trex_collided);
trex.scale = 0.5;

//create a ground sprite
ground = createSprite(width/2,height-20,width,10);
ground.addImage("ground",groundImage); 
ground.x = ground.width /2;
invisibleGround = createSprite(width/2,height-20,width,10); 
invisibleGround.visible = false;

trex.debug = false;
trex.setCollider('circle', 0, 0, 30);
obstaclesGroup = createGroup();
cloudsGroup = createGroup();

restart = createSprite(width/2,height/2,100,100);
restart.addImage('restart', restartImage);
restart.scale = 0.5;
restart.visible = false;

gameOver = createSprite(width/2,height/2 -40,100,100);
gameOver.addImage('gameOver', GameOverImage);
gameOver.scale = 0.5;
gameOver.visible = false;
}

function draw() {
background('#1E1D1D');


    fill('white');
    text( 'x: ' + mouseX + ' y: ' +  mouseY, mouseX, mouseY);
    fill('white')
    text('score: ' + score, 523, 20 )

    if (gameState == play) {
        ground.velocityX = -4;
        if (ground.x < 0) {
            ground.x = ground.width / 2;
        }
        if (touches.length > 0 || keyDown("space") && trex.y >= height-120) {
                trex.velocityY = -10;
                touches = [];
                jumpSound.play();
        }
        trex.velocityY = trex.velocityY + 0.8

        if (obstaclesGroup.isTouching(trex)) {
            gameState = end;
            dieSound.play();
            
           // console.log(gameState);
         }
         score = score + Math.round(frameCount / 360);

         if (score > 0 && score % 1000 === 0) {
            checkpointSound.play();
         }
         clouds();
         obstacles();
    } else if(gameState == end) {
        trex.changeAnimation("collided");
    
        ground.velocityX = 0;
        trex.velocityY = 0;
        cloudsGroup.setVelocityXEach(0);
        obstaclesGroup.setVelocityXEach(0);
        cloudsGroup.setLifetimeEach(-1);
        obstaclesGroup.setLifetimeEach(-1);
        restart.visible = true;
        gameOver.visible = true;
        console.log(gameState);

        if (mousePressedOver(restart)) {
           reset();
        }
    }

    console.log(gameState);
    trex.collide(invisibleGround);


//console.log(trex.y);
//jump when the space button is pressed
    drawSprites();
}

function clouds() {
    if(frameCount % 60 === 0){
        cloud = createSprite(width-100,height-20,10,10);
        cloud.velocityX = -6;
        cloud.scale = 0.15;
        cloud.addImage(cloudImage);
        //console.log(trex.depth);
        //console.log(cloud.depth);
        cloud.lifetime = 220;
        trex.depth = cloud.depth;
        trex.depth = trex.depth + 1;

        cloud.y = Math.round(random(height-100,height -200));
        console.log(cloud.y);

        cloudsGroup.add(cloud);

    }
}    

function obstacles() {
    if(frameCount % 60 === 0){
        obstacle = createSprite(width -100,height-30,10,10);
        obstacle.velocityX = -6;
        obstacle.scale = 0.5;
        //console.log(trex.depth);
        //console.log(cloud.depth);
        obstacle.lifetime =220;
        //trex.depth = cloud.depth;
        //trex.depth = trex.depth + 1;
        var ran = Math.round(random(1, 6));
        
        switch(ran) {
            case 1 :  obstacle.addImage(obstacle1);
                      break;
            case 2 :  obstacle.addImage(obstacle2);
                      break;
            case 3 :  obstacle.addImage(obstacle3);
                      break;
            case 4 :  obstacle.addImage(obstacle4);
                      break;
            case 5 :  obstacle.addImage(obstacle5);
                      break;
            case 6 :  obstacle.addImage(obstacle6);
               
            default: break;

         } 
        
        obstaclesGroup.add(obstacle);
    }

} 

function reset() {
    gameState = play;
    obstaclesGroup.destroyEach(); 
    cloudsGroup.destroyEach();
    gameOver.visible = false;
    restart.visible = false;
    score=0;
    trex.changeAnimation('running');
}