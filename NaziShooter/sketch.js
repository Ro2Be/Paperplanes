function Player(p) {
  this.n = random(0, 100); //noise timer
  this.posT = createVector(width/2, height/2); //tip
  this.posB = createVector(this.posT.x, this.posT.y + this.h)

  this.show = function() {
    fill(255);
    triangle(this.posT.x, this.posT.y, this.posB.x, this.posB.y, this.posB.x, this.posB.y + 15);
    triangle(this.posT.x, this.posT.y, this.posB.x -20, this.posB.y, this.posB.x + 20, this.posB.y);
    line(this.posT.x, this.posT.y, this.posB.x, this.posB.y);
  }
  
  this.move = function(){
    this.posT.x = constrain(this.posT.x, 0, width);
    this.posT.y = constrain(this.posT.y, 0, height);
    
    if(p === 0) {
    posM = createVector(map(noise(this.n), 0, 1, 0, width), map(noise(this.n + 50), 0, 1, 0, height));
    this.n += 0.01;
    if(timer === 1) {
    console.log("pew");
    newBullet = new Bullet(this.posT.x, this.posT.y, posM.x, posM.y, 5);
    bullets.push(newBullet); }
    }
    if(p === 1) {posM = createVector(mouseX, mouseY); } //mouse position
    
    if(this.posT.dist(posM) < 3) {return;}
    vDir = posM.copy().sub(this.posT).normalize(); //direction
    this.posT.add(posM.copy().sub(this.posT).normalize().mult(3));
    this.posB = this.posT.copy().sub(vDir.copy().mult(70).add(0, 10));
  }
  
  this.shoot = function(){
    console.log("pew");
    newBullet = new Bullet(this.posT.x, this.posT.y, mouseX, mouseY, 10);
    bullets.push(newBullet);
  }
}

function Bullet(bx, by, mx, my, m) {
  this.r = 10;
  this.pos = createVector(bx, by);
  this.moveTo = createVector(mx - bx,  my - by).normalize().mult(m);
  
  this.move = function() {
    this.pos = this.pos.add(this.moveTo);
  }
  
  this.show = function() {
    fill(255, 0, 155);
    ellipseMode(CENTER);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
  }
  
  this.kill = function(Nazi) {
    if(this.pos.dist(Nazi.pos) < 15) {
    console.log("aarg")
    nazi.pos.x = random (0, width - 30);
    nazi.pos.y = random (0, height - 30);
    if(m ===10) {score += 1;}
    }
  }
  
  this.gameOver = function() {
    var d = player.posT.dist(player.posB)*0.7;
    if(this.pos.dist(player.posT) < d && this.pos.dist(player.posB) < d) {
    if(score != 0) {nein.play();
    console.log("GAMEOVER")}
    score = 0;
    }
  }
}

function Nazi() {
  this.pos = createVector(random (15, width - 15), random (15, height - 15));
  img.resize(30, 30);
  this.show = function(){
  imageMode(CENTER);
  image(img, this.pos.x, this.pos.y);
  }
}

bullets = [];
var score = 0;
var topscore = 0;
var img;
var nein;
var timer = 0;

setInterval(setTimer, 2);
function setTimer(){
  timer += 1;
  if (timer === 50) {timer = 0;}
}

setInterval(removeBullets, 500);
function removeBullets(){
  for (i = 0; i < bullets.length; i ++) {
    if(bullets[i].pos.x < 0 || bullets[i].pos.x > width || bullets[i].pos.y < 0 || bullets[i].pos.y > height){
      bullets.splice(i, 1);
    }
  }
}

function preload() {
  img = loadImage("images/jesseisnazi.jpg");
  nein = loadSound("sound/nein.mp3");
}

function setup() {
  createCanvas(600, 600);
  player = new Player(1);
  naziPlayer = new Player(0);
  nazi = new Nazi();
}

function draw() {
  background(0);
  nazi.show();
  naziPlayer.move();
  naziPlayer.show();
  player.move();
  player.show();
  this.mousePressed = function() {player.shoot();}
  for (i = 0; i < bullets.length; i ++) {
  bullets[i].move();
  bullets[i].show();
  bullets[i].kill(nazi);
  bullets[i].gameOver();
  }
  drawScore();
  
  function drawScore() {
      if (topscore < score) {topscore = score;}
      fill (255, 0, 155);
      textSize(15); 
      text("Topscore: " + str(topscore), 10, 20);
      text("Score: " + str(score), 10, 40);
  }
}

