let countDown = 0;
let resetTime = 120;
let lastFrameTime = 0;
let running = false;
let mouseJustClicked = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  countDown = resetTime;
  let params = getURLParams();
  if (params.seconds > 0) {
    // go to url?seconds=180
    countDown = params.seconds;
  }
}

function draw() {
  background(0);
  
  if (countDown === 0) {
    background("#971010");
  }
  
  // process UI
  
  let startStopPress = button((width/2) - 450, height - 200, 400, 120, "start/stop");
  let resetPress = button((width/2) + 50, height - 200, 400, 120, "reset");
  
  if (startStopPress && mouseJustClicked) {
    running = !running;
    mouseJustClicked = false;
  }
  
  if (resetPress && mouseJustClicked) {
    countDown = resetTime;
    running = false;
    mouseJustClicked = false;
  }
  
  // process time
  let timeDiff = (millis() - lastFrameTime) / 1000;
  lastFrameTime = millis();

  if (running) {
    countDown = countDown - timeDiff;
  }
  
  if (countDown < 0) {
    countDown = 0;
  }
  
  let minutes = floor(countDown / 60).toString();
  let seconds = floor(countDown % 60).toString();
  let hundredths = floor((countDown % 1) * 100).toString();
  
  fill(255);
  stroke(0);
  textSize(260);
  textAlign(CENTER);
  text(minutes.padStart(2, '0') + 
       ":" + 
       seconds.padStart(2, '0') + 
       ":" + 
       hundredths.padStart(2,'0'), width/2 ,height/2);
}

function mouseClicked() {
  mouseJustClicked = true;
}

// 1. draws a rectangle (done);
// 2. returns a Boolean (either true or false depending on whether the button is being clicked)
function button(x,y, w, h, label) {
  let clicked = (mouseX >= x) && 
    (mouseX <= x + w) &&
    (mouseY >= y) &&
    (mouseY <= y + h) &&
    mouseIsPressed;
  
  if (clicked) {
    fill(255, 0, 0);
  } else {
    fill(100, 100, 100);
  }
  rect(x,y,w,h);

  fill(255);
  stroke(0);
  textSize(72);
  textAlign(CENTER,CENTER);
  text(label, x + (w/2), y + (h/2));
  
  return clicked;
}
