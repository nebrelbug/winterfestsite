// CONFIGURATION:
var spawn_every_nth_frame = 16;    // when not click 
var spawn_on_clicked = 20;
var spawn_on_mousemove = .1;
function colorAlpha(aColor, alpha) {
  var c = color(aColor);
  return color('rgba(' +  [red(c), green(c), blue(c), alpha].join(',') + ')');
}
// every frame 
var particle_start_speed = .75;   // start with this random speed 
var particle_wobble_speed = .1; // change speed in random 
var particle_alpha_factor = .98;  // fade out factor for every frame 

function Mover(loc,c) {
  this.loc = createVector(width/2, height/2);
  this.vel = createVector();
  this.acc = createVector();
  this.r = random(3,7);
  this.c = c;
  this.alpha = 1;
  
  if (typeof loc !== "undefined") {
    this.loc = createVector(loc.x,loc.y);
  }
  this.applyForce = function(a) {
    this.acc.add(a);
  }
  this.update = function() {
    this.vel.add(this.acc);
    this.acc.mult(0);
    this.alpha *= particle_alpha_factor;
    
    if (this.loc.x < 0 || this.loc.x > width) {
      this.vel.x *= -.8;
      if (this.loc.x < 0) this.loc.x = 0;
      if (this.loc.x > width) this.loc.x = width;
    }
    if (this.loc.y < 0 || this.loc.y > height) {
      this.vel.y *= -.8;
      if (this.loc.y < 0) this.loc.y = 0;
      if (this.loc.y > height) this.loc.y = height;
    }
    
    this.loc.add(this.vel);
  }
  this.display = function() {
    fill(colorAlpha('#00ff00', this.alpha));
    noStroke();
    ellipse(this.loc.x,this.loc.y, this.r + (1/this.alpha),this.r + (1/this.alpha));
  }
}

var movers = [];

function setup() {
  colorMode(HSB);
  createCanvas(window.innerWidth,window.innerHeight);   
  background(50);
  
}


function draw() {
  background(5);
  
  if (mouseDown || frameCount%spawn_every_nth_frame==0 ) {    
    for (var x = 0; x < (mouseDown?spawn_on_clicked:spawn_on_mousemove); x++) {
      
      
      var m = new Mover(createVector(mouseX, mouseY), ((frameCount+128)/ 1 % 360));
      m.applyForce(createVector(random(-1,1), random(-6,0)).mult(particle_start_speed));
      movers.push(m);
    }
  }
    
  for(var x = movers.length -1; x >= 0; x--) {
    var mov = movers[x];
    
    if (mov.alpha < .001) {
      movers.shift(x);
    } else {
    
      
     // randomize movement a bit:
     mov.applyForce(createVector(random(-1,1), random(1,-1)).mult(particle_wobble_speed));

      // enables gravity:
      mov.applyForce(createVector(0,.25));
      
      mov.update();
      mov.display(); 
    }
  }
  
}

var mouseDown = false;

function mousePressed() {
  mouseDown = true;
}

function mouseReleased() {
  mouseDown = false;
}