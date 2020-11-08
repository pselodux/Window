let dummy = -1;
let dummy2 = -1;
let squareSize = 48;
let canvSize = 600;
let centreCalc;
let numSquares = 16;

let mSquareX;
let mSquareY;
let rSquareX;
let rSquareY;

let squareOver = [];
let squareTotalLength = numSquares * squareSize;

// lookup table for scales
let notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C"];
let scales = [[0,2,3,5,7,8,10,12],
              [0,2,4,5,7,9,11,12]];
let octaveSpan = 3;
let transpose = 0;
let minMaj = 0;
let scale = [];


function CreateScales(){
  for(let j=0; j<octaveSpan; j++){
    var octave = j + 3;
    for(let i=0; i<8; i++){
      scale[i+(j*scales[minMaj].length)] = notes[scales[minMaj][i%scales[minMaj].length] % notes.length] + (octave+Math.floor(i/7)).toString();
    }
  }
}

let lightGrey = "#8cfbff";
let grey = "#249da3";
let darkGrey = "#114c4f";
let darkestGrey = "#092729";
let cursorStroke = 5;

let mSeqValues = [];
let mSeqLength = 8;
let mSeqPos = 0;

let rSeqValues = [];
let rSeqLength = 1;
let rSeqPos = 0;

let scrollMLeftButtonX;
let scrollMLeftButtonY;
let scrollMRightButtonX;
let scrollMRightButtonY;

let onMRightButton;
let onMLeftButton;

let scrollM2LeftButtonX;
let scrollM2LeftButtonY;
let scrollM2RightButtonX;
let scrollM2RightButtonY;

let onM2RightButton;
let onM2LeftButton;

let scrollRLeftButtonX;
let scrollRLeftButtonY;
let scrollRRightButtonX;
let scrollRRightButtonY;

let onRRightButton;
let onRLeftButton;

let scrollR2LeftButtonX;
let scrollR2LeftButtonY;
let scrollR2RightButtonX;
let scrollR2RightButtonY;

let onR2RightButton;
let onR2LeftButton;

let playButtonX;
let playButtonY;
let onPlayButton;


let randMButtonX;
let randMButtonY;
let onRandMButton;

let randRButtonX;
let randRButtonY;
let onRandRButton;

let helpScreen = false;
let helpText = "WINDOW by Vague Robots.\n\nsignal@0F.digital\n\nCreated using p5js.\n\nThis is a minimalist sequencer concept that may be useful for generating\nmelodies for your songs, or just playing around with patterns.\n\nThe upper sequencer represents the melody.\nDarker squares are lower notes, lighter squares are higher notes.\n\nThe lower sequencer represents the timing of each note in the upper sequencer.\nThe height of each step corresponds to the length of the note.\n\nThe line beneath each sequencer represents the length of the sequence.\n(minimum 1 step, maximum 16 steps)\n\nUse the < and > buttons to scroll the sequence left and right, and\nthe + and - buttons to increase and decrease the length of the sequence.\n\nThe two sequencers have independent lengths and patterns.\n\nUse the random (dice) button to generate a new set of notes or durations.\n\nFinally, press the play button (top left) to play and loop the sequence.\nAll controls work while the sequencer is running.";

let start = true;
let play = false;
let startTime = 0;

let mPlayHead = -1;
let rPlayHead = -1;

let compMPlayHead = -1;
let compRPlayHead = -1;

let mPlayHeadX = 0;
let mPlayHeadY = 0;

let rPlayHeadX = 0;
let rPlayHeadY = 0;

let tempo = 160;
let noteLength = 2;
let noteLIndex = -1;

const synth = new Tone.PolySynth({polyphony:4,volume:-6,voice:Tone.MonoSynth}).toMaster();

let helpFont;
let playButton;
let playButtonDown;
let playButtonUp;
let addButton;
let addButtonDown;
let addButtonUp;
let subButton;
let subButtonDown;
let subButtonUp;
let leftButton;
let leftButtonDown;
let leftButtonUp;
let rightButton;
let rightButtonDown;
let rightButtonUp;
let randButton;
let randButtonDown;
let randButtonUp;
let infoButton;
let infoButtonDown;
let infoButtonUp;
let saveButton;
let saveButtonDown;
let saveButtonUp;
let stopButton;
let stopButtonDown;
let stopButtonUp;

function preload(){
  helpFont = loadFont('font/Roboto-Regular.ttf');
  playButton = loadImage('images/icon_play.png');
  playButtonDown = loadImage('images/icon_play-down.png');
  playButtonUp = loadImage('images/icon_play-up.png');
  addButton = loadImage('images/icon_add.png');
  addButtonDown = loadImage('images/icon_add-down.png');
  addButtonUp = loadImage('images/icon_add-up.png');
  subButton = loadImage('images/icon_sub.png');
  subButtonDown = loadImage('images/icon_sub-down.png');
  subButtonUp = loadImage('images/icon_sub-up.png');
  leftButton = loadImage('images/icon_left.png');
  leftButtonDown = loadImage('images/icon_left-down.png');
  leftButtonUp = loadImage('images/icon_left-up.png');
  rightButton = loadImage('images/icon_right.png');
  rightButtonDown = loadImage('images/icon_right-down.png');
  rightButtonUp = loadImage('images/icon_right-up.png');
  randButton = loadImage('images/icon_rand.png');
  randButtonDown = loadImage('images/icon_rand-down.png');
  randButtonUp = loadImage('images/icon_rand-up.png');
  infoButton = loadImage('images/icon_info.png');
  infoButtonDown = loadImage('images/icon_info-down.png');
  infoButtonUp = loadImage('images/icon_info-up.png');
  saveButton = loadImage('images/icon_save.png');
  saveButtonDown = loadImage('images/icon_save-down.png');
  saveButtonUp = loadImage('images/icon_save-up.png');
  stopButton = loadImage('images/icon_stop.png');
  stopButtonDown = loadImage('images/icon_stop-down.png');
  stopButtonUp = loadImage('images/icon_stop-up.png');
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  CreateScales();
  randMSeq();
  randRSeq();
  for(let i=0; i<numSquares; i++){
    squareOver[i] = false;
  }
}


function draw() {

  setSizes();
  background(grey);
  if(!helpScreen){
    drawMSeq();
    drawRSeq();
    drawMLoop();
    drawRLoop();
    drawButtons();
    drawMPlayHead();
    drawRPlayHead();
  }
  Transport(play);
  if(helpScreen){
    drawHelpScreen();
  }
}

function setSizes(){
  // if ((windowWidth * .75) / numSquares < 48){
  //   squareSize = min((windowWidth * .75) / numSquares, windowHeight * .75);
  // }
  squareSize = min((windowWidth * .75) / numSquares, windowHeight / 20);
  centreCalc = (windowWidth - numSquares * squareSize) / 2;
  cursorStroke = squareSize * .15;
  scrollMLeftButtonX = centreCalc;
  scrollMLeftButtonY = mSquareY + squareSize;
  scrollMRightButtonX = windowWidth -centreCalc - squareSize;
  scrollMRightButtonY = mSquareY + squareSize;

  scrollM2LeftButtonX = centreCalc + squareSize;
  scrollM2LeftButtonY = mSquareY + squareSize *2;
  scrollM2RightButtonX = windowWidth -centreCalc - squareSize *2;
  scrollM2RightButtonY = mSquareY + squareSize *2;

  scrollRLeftButtonX = centreCalc;
  scrollRLeftButtonY = rSquareY + squareSize;
  scrollRRightButtonX = windowWidth -centreCalc - squareSize;
  scrollRRightButtonY = rSquareY + squareSize;

  scrollR2LeftButtonX = centreCalc + squareSize;
  scrollR2LeftButtonY = rSquareY + squareSize *2;
  scrollR2RightButtonX = windowWidth -centreCalc - squareSize *2;
  scrollR2RightButtonY = rSquareY + squareSize *2;

  playButtonX = centreCalc;
  playButtonY = windowHeight / 4 - squareSize * 2.5;

  helpButtonX = windowWidth / 2 - squareSize * 0.5;
  helpButtonY = windowHeight * .85;

  randMButtonX = centreCalc + squareSize * (numSquares-1);
  randMButtonY = mSquareY - squareSize * 2;

  randRButtonX = centreCalc + squareSize * (numSquares-1);
  randRButtonY = rSquareY - squareSize * 2;

  mPlayHeadX = centreCalc + squareSize * mPlayHead;
  mPlayHeadY = mSquareY - squareSize * 0.75;

  rPlayHeadX = centreCalc + squareSize * rPlayHead;
  rPlayHeadY = rSquareY - squareSize * 0.75;

  // set up mouseover bools
  onMRightButton = mouseX > scrollMRightButtonX &&
                   mouseX < scrollMRightButtonX + squareSize &&
                   mouseY > scrollMRightButtonY &&
                   mouseY < scrollMRightButtonY + squareSize;

  onMLeftButton = mouseX > scrollMLeftButtonX &&
                  mouseX < scrollMLeftButtonX + squareSize &&
                  mouseY > scrollMLeftButtonY &&
                  mouseY < scrollMLeftButtonY + squareSize;

  onM2RightButton = mouseX > scrollM2RightButtonX &&
                    mouseX < scrollM2RightButtonX + squareSize &&
                    mouseY > scrollM2RightButtonY &&
                    mouseY < scrollM2RightButtonY + squareSize;

  onM2LeftButton = mouseX > scrollM2LeftButtonX &&
                   mouseX < scrollM2LeftButtonX + squareSize &&
                   mouseY > scrollM2LeftButtonY &&
                   mouseY < scrollM2LeftButtonY + squareSize;

  onRRightButton = mouseX > scrollRRightButtonX &&
                   mouseX < scrollRRightButtonX + squareSize &&
                   mouseY > scrollRRightButtonY &&
                   mouseY < scrollRRightButtonY + squareSize;

  onRLeftButton = mouseX > scrollRLeftButtonX &&
                  mouseX < scrollRLeftButtonX + squareSize &&
                  mouseY > scrollRLeftButtonY &&
                  mouseY < scrollRLeftButtonY + squareSize;

  onR2RightButton = mouseX > scrollR2RightButtonX &&
                    mouseX < scrollR2RightButtonX + squareSize &&
                    mouseY > scrollR2RightButtonY &&
                    mouseY < scrollR2RightButtonY + squareSize;

  onR2LeftButton = mouseX > scrollR2LeftButtonX &&
                   mouseX < scrollR2LeftButtonX + squareSize &&
                   mouseY > scrollR2LeftButtonY &&
                   mouseY < scrollR2LeftButtonY + squareSize;

  onPlayButton = mouseX > playButtonX &&
                 mouseX < playButtonX + squareSize &&
                 mouseY > playButtonY &&
                 mouseY < playButtonY + squareSize;

  onHelpButton = mouseX > helpButtonX &&
                 mouseX < helpButtonX + squareSize &&
                 mouseY > helpButtonY &&
                 mouseY < helpButtonY + squareSize;

  onRandMButton = mouseX > randMButtonX &&
                  mouseX < randMButtonX + squareSize &&
                  mouseY > randMButtonY &&
                  mouseY < randMButtonY + squareSize;

  onRandRButton = mouseX > randRButtonX &&
                  mouseX < randRButtonX + squareSize &&
                  mouseY > randRButtonY &&
                  mouseY < randRButtonY + squareSize;
}

function drawHelpScreen(){
  textFont(helpFont);
  textSize(min(windowWidth / 48, windowHeight / 48));
  fill(darkGrey);
  noStroke();
  textAlign(CENTER);
  text(helpText,centreCalc,windowHeight / 4 - squareSize *2.5,squareSize * 16,squareSize * 16);
  //help button
  if(onHelpButton){
    image(infoButtonDown, helpButtonX, helpButtonY, squareSize, squareSize);
  } else {
    image(infoButton, helpButtonX, helpButtonY, squareSize, squareSize);
  }
}

function drawMSeq(){
  noStroke();
  rectMode(CENTER);
  colorMode(HSB);
  for(let i=0; i<numSquares; i++){
    mSquareX = centreCalc + i * squareSize + squareSize/2;
    mSquareY = windowHeight / 4;
    fill(180,10/mSeqValues[i]*100, mSeqValues[i] * (100/scale.length));
    rect(mSquareX, mSquareY, squareSize+1, squareSize);
  }
  colorMode(RGB);
}

function drawRSeq(){
  noStroke();
  rectMode(CENTER);
  for(let i=0; i<numSquares; i++){
    rSquareX = centreCalc + i * squareSize + squareSize/2;
    rSquareY = windowHeight / 2 + squareSize;
    fill(darkGrey);
    // fill(rSeqValues[i] * 60);
    rect(rSquareX, (rSquareY-squareSize/2) + (rSeqValues[i])*(squareSize/8) + (4-rSeqValues[i])*squareSize/4, squareSize+1, squareSize/4 * rSeqValues[i]);
  }
}

function drawMLoop(){
  noFill();
  stroke(lightGrey);
  strokeWeight(cursorStroke);
  strokeCap(SQUARE);
  line(centreCalc, mSquareY + squareSize * 0.75, centreCalc + mSeqLength * squareSize, mSquareY + squareSize * 0.75);
}

function drawRLoop(){
  noFill();
  stroke(lightGrey);
  strokeWeight(cursorStroke);
  strokeCap(SQUARE);
  line(centreCalc, rSquareY + squareSize * .75, centreCalc + rSeqLength * squareSize, rSquareY + squareSize *.75);
}

function drawButtons(){
  noStroke();
  rectMode(CORNER);

  // left melody scroll button
  if(onMLeftButton){
    image(leftButtonDown, scrollMLeftButtonX,scrollMLeftButtonY,squareSize,squareSize);
  } else {
    image(leftButton, scrollMLeftButtonX,scrollMLeftButtonY,squareSize,squareSize);
  }
  // rect(scrollMLeftButtonX, scrollMLeftButtonY, squareSize, squareSize);

  //right melody scroll button
  if(onMRightButton){
    image(rightButtonDown, scrollMRightButtonX,scrollMRightButtonY,squareSize,squareSize);
  } else {
    image(rightButton, scrollMRightButtonX,scrollMRightButtonY,squareSize,squareSize);
  }
  // rect(scrollMRightButtonX, scrollMRightButtonY, squareSize, squareSize);

  //left melody length button
  if(onM2LeftButton){
    image(subButtonDown, scrollM2LeftButtonX,scrollM2LeftButtonY,squareSize,squareSize);
  } else {
    image(subButton, scrollM2LeftButtonX,scrollM2LeftButtonY,squareSize,squareSize);
  }
  // rect(scrollM2LeftButtonX, scrollM2LeftButtonY, squareSize, squareSize);

  //right melody length button
  if(onM2RightButton){
    image(addButtonDown, scrollM2RightButtonX,scrollM2RightButtonY,squareSize,squareSize);
  } else {
    image(addButton, scrollM2RightButtonX,scrollM2RightButtonY,squareSize,squareSize);
  }
  // rect(scrollM2RightButtonX, scrollM2RightButtonY, squareSize, squareSize);

  // left rhythm scroll button
  if(onRLeftButton){
    image(leftButtonDown, scrollRLeftButtonX,scrollRLeftButtonY,squareSize,squareSize);
  } else {
    image(leftButton, scrollRLeftButtonX,scrollRLeftButtonY,squareSize,squareSize);
  }
  // rect(scrollRLeftButtonX, scrollRLeftButtonY, squareSize, squareSize);

  //right rhythm scroll button
  if(onRRightButton){
    image(rightButtonDown, scrollRRightButtonX,scrollRRightButtonY,squareSize,squareSize);
  } else {
    image(rightButton, scrollRRightButtonX,scrollRRightButtonY,squareSize,squareSize);
  }
  // rect(scrollRRightButtonX, scrollRRightButtonY, squareSize, squareSize);

  //left rhythm length button
  if(onR2LeftButton){
    image(subButtonDown, scrollR2LeftButtonX,scrollR2LeftButtonY,squareSize,squareSize);
  } else {
    image(subButton, scrollR2LeftButtonX,scrollR2LeftButtonY,squareSize,squareSize);
  }
  // rect(scrollR2LeftButtonX, scrollR2LeftButtonY, squareSize, squareSize);

  //right rhythm length button
  if(onR2RightButton){
    image(addButtonDown, scrollR2RightButtonX,scrollR2RightButtonY,squareSize,squareSize);
  } else {
    image(addButton, scrollR2RightButtonX,scrollR2RightButtonY,squareSize,squareSize);
  }
  // rect(scrollR2RightButtonX, scrollR2RightButtonY, squareSize, squareSize);

  //play button
  if(onPlayButton && !play){
    image(playButtonDown, playButtonX,playButtonY,squareSize,squareSize);
  } else if (play && !onPlayButton) {
    image(stopButton, playButtonX,playButtonY,squareSize,squareSize);
  } else if (play && onPlayButton) {
    image(stopButtonDown, playButtonX,playButtonY,squareSize,squareSize);
  } else {
    image(playButton, playButtonX,playButtonY,squareSize,squareSize);
  }
  // rect(playButtonX, playButtonY, squareSize, squareSize);

  //help button
  if(onHelpButton){
    image(infoButtonDown, helpButtonX, helpButtonY, squareSize, squareSize);
  } else {
    image(infoButton, helpButtonX, helpButtonY, squareSize, squareSize);
  }

  //random melody button
  if(onRandMButton){
    image(randButtonDown, randMButtonX,randMButtonY,squareSize,squareSize);
  } else {
    image(randButton, randMButtonX,randMButtonY,squareSize,squareSize);
  }
  // rect(randMButtonX, randMButtonY, squareSize, squareSize);

  //random rhythm button
  if(onRandRButton){
    image(randButtonDown, randRButtonX,randRButtonY,squareSize,squareSize);
  } else {
    image(randButton, randRButtonX,randRButtonY,squareSize,squareSize);
  }
  // rect(randRButtonX, randRButtonY, squareSize, squareSize);

}

function drawMPlayHead(){
  noFill();
  strokeWeight(cursorStroke);
  stroke(lightGrey);
  if (mPlayHead >= 0){
    line(mPlayHeadX, mPlayHeadY, mPlayHeadX + squareSize, mPlayHeadY);
  }
}

function drawRPlayHead(){
  noFill();
  strokeWeight(cursorStroke);
  stroke(lightGrey);
  if (rPlayHead >= 0){
    line(rPlayHeadX, rPlayHeadY, rPlayHeadX + squareSize, rPlayHeadY);
  }
}

function mousePressed(){
  // scroll melody left
  if (onMLeftButton){
    scroll(mSeqValues, 1);
  }
  // scroll melody right
  if (onMRightButton){
    scroll(mSeqValues, -1);
  }

  // decrease melody loop length
  if (onM2LeftButton && mSeqLength > 1){
    mSeqLength--;
  }

  // increase melody loop length
  if (onM2RightButton && mSeqLength < 16){
    mSeqLength++;
  }

  // scroll rhythm left
  if (onRLeftButton){
    scroll(rSeqValues, 1);
  }
  // scroll rhythm right
  if (onRRightButton){
    scroll(rSeqValues, -1);
  }

  // decrease rhythm loop length
  if (onR2LeftButton && rSeqLength > 1){
    rSeqLength--;
  }

  // increase rhythm loop length
  if (onR2RightButton && rSeqLength < 16){
    rSeqLength++;
  }

  if (onPlayButton) {
    mPlayHead = 0;
    rPlayHead = 0;
    dummy = 0;
    dummy2 = 0;
    play = !play;
  }

  if(onHelpButton){
    helpScreen = !helpScreen
  }

  if (onRandMButton){
    randMSeq();
  }

  if (onRandRButton){
    randRSeq();
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

function randMSeq(){
  for(let i=0; i<numSquares; i++){
    mSeqValues[i] = Math.floor(random(0,scale.length));
  }
}

function randRSeq(){
  for(let i=0; i<numSquares; i++){
    rSeqValues[i] = Math.floor(random(1,5));
  }
}

function scroll(arr, count){
  count -= arr.length * Math.floor(count / arr.length);
  arr.push.apply(arr, arr.splice(0, count));
}

function Transport(play) {

  if (play && start) {
    startTime = millis();
    dummy = 1/rSeqValues[rPlayHead] * -1;
    dummy2 = 1/rSeqValues[rPlayHead] * -1;
    playSound(mPlayHead);
    start = false;
  }

  if (play && !start) {

    if (millis() - startTime > (15000 / tempo) * rSeqValues[rPlayHead]){
      startTime = millis();
      if (mPlayHead < mSeqLength-1){
        mPlayHead++;
      } else {
        mPlayHead = 0;
      }
      if (rPlayHead < rSeqLength-1){
        rPlayHead++;
      } else {
        rPlayHead = 0;
      }

      playSound(mPlayHead);
    }

  }

  if (!play && !start) {
    mPlayHead = -1;
    rPlayHead = -1;
    start = true;
  }
}



function playSound(noteNum){
  synth.set({
    "oscillator":{
      "type":"triangle"
    },
    "envelope":{
      "attack":0.02,
      "release":(1 * rSeqValues[rPlayHead])
    },
    "filter":{
      "Q":0,
      "type": "lowpass",
      "rolloff":-12
    },
    "filterEnvelope":{
      "attack":0.001,
      "decay":0.5 * rSeqValues[rPlayHead],
      "release":1 * rSeqValues[rPlayHead],
      "baseFrequency":200,
      "octaves":4
    }

  });
  synth.triggerAttackRelease(scale[mSeqValues[noteNum]], "32n");
}
