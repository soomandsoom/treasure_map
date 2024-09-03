/*
[Title] 보물 지도 제너레이터
새로운 지도가 만들어지면 새로운 세계와 새로운 여정이 함께 생성된다.

[Interaction Guide]
  ENTER = 새로고침, 새 지도 생성
  마우스 = 오브젝트 회전, 움직임
  스페이스바 / 숫자 1~5 = 도장찍기
  방향키 = 지도의 좌측 상단 주목! 보물 찾으러 떠나기
*/
let ver1 = false; //기본테마
let ver2 = true; //밤?우주?테마?

let geo = []; //산 or 섬 생성
let lands = []; //땅덩어리 생성
let d = 30; //모눈 한 칸 크기
let c; //메인 색상

//프레임
let h5;
let mapw1, mapw2, maph1, maph2;
let boardangle, boardscale;

//거점
let stx = [];
let sty = [];
let num; //거점수

//스탬프
let stpsc; //스케일
let stp = false;
let stp1 = false;
let stp2 = false;
let stp3 = false;
let stp4 = false;
let stp5 = false;
let stpc, stpc1, stpc2; //컬러
let stpx, stpy;

//현재위치
let nowx = 0;
let nowy = 0;

let input;
let value;

function preload() {
  img = loadImage("./texture.jpg");
  img2 = loadImage("./textureb.jpg");

  garamond = loadFont("./EBGaramond-BoldItalic.ttf");
  garamondR = loadFont("./EBGaramond-Regular.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  //input
  input = createInput();
  input.position(width / 2 - 50, 100);
  input.size(100, 20);
  input.changed(updateValue);

  //산섬
  for (let i = 0; i < 20; i++) {
    geo[i] = new Geosomething();
  }

  //땅덩어리
  for (let i = 0; i < 10; i++) {
    lands[i] = new Land();
  }

  //프레임
  stampangle = radians(float(random(-20, 20)));
  boardangle = radians(float(random(-20, 20)));
  boardscale = random(0.7, 1);

  h5 = int(height / 5);
  mapw1 = width / 2 - 3 * h5 + d;
  mapw2 = 6 * h5 - d;
  maph1 = height / 2 - 2 * h5 + d;
  maph2 = 4 * h5 - d;

  //현재 위치
  nowx = mapw1 - (mapw1 % d) + d;
  nowy = maph1 - (maph1 % d) + d;

  //스탬프
  stpx = random(0, 3 * h5);
  stpy = random(-2 * h5, 2 * h5);
  stpsc = random(0.8, 1.5);

  stpc2 = color(random(200, 255), random(200, 255), random(200, 255));
  stpc1 = color(random(70), random(40), random(20));
  //거점
  num = random(2, 6);
  for (let i = 0; i < num; i++) {
    stx[i] = random(mapw1, mapw2);
    sty[i] = random(maph1, maph2);
  }

  //change ver.
  let button = createButton("into another world");
  button.position(width / 2 - 55, height - 100);

  button.mousePressed(changever);
}

function draw() {
  //설정 온오프, c 지정
  if (ver2 == true) {
    c = color(76, 47, 173);
    stpc = stpc2;
  } else {
    c = color(255, 34, 0);
    stpc = stpc1;
  }

  //조명
  ambientLight(80);
  pointLight(255, 255, 255, width / 3, -height / 2, 800);

  background(stpc);
  orbitControl(1, 1, 0);
  //질문
  push();

  translate(0, 0, 1);
  textFont(garamondR);
  textAlign(CENTER);
  textSize(20);

  if (ver2 == true) {
    fill(0);
    stroke(0);
  } else {
    fill(255);
    stroke(255);
  }
  strokeWeight(1);
  text("What's your treasure?", 0, -height / 2 + 80);
  if (value === undefined) {
    value = "treasure";
  }
  pop();

  //프레임
  rotateZ(boardangle);
  scale(boardscale);
  board();

  //클리핑마스크
  beginClip();
  push();
  translate(0, 0, -1);
  fill(255);
  stroke(0);
  strokeWeight(0.6);
  rectMode(CENTER);
  rect(0, 0, 6 * h5, 4 * h5);
  pop();
  endClip();

  //이미지 텍스쳐
  translate(-width / 2, -height / 2);
  if (ver2 == true) {
    image(img2, 0, 0, width, height);
  } else {
    image(img, 0, 0, width, height);
  }
  
  //모눈
  grid(50);
  translate(0, 0, 1);

  //땅덩어리
  for (let i = 0; i < 10; i++) {
    lands[i].display();
  }

  for (let i = 0; i < 10; i++) {
    geo[i].display();
  }

  //현재 원점.. 좌측 상단
  //거점
  spots();

  //스탬프
  translate(width / 2, height / 2, 3);
  if (stp == true) {
    stamp();
  } else if (stp1 == true) {
    stamp1();
  } else if (stp2 == true) {
    stamp2();
  } else if (stp3 == true) {
    stamp3();
  } else if (stp4 == true) {
    stamp4();
  } else if (stp5 == true) {
    stamp5();
  }

  //텍스트
  push();
  translate(0, 0, 15);
  if (mouseIsPressed) {
    texts(garamond);
  }
  pop();

  //현위치
  now();
}

function updateValue() {
  value = input.value();
  redraw();
}
//산섬 클래스
class Geosomething {
  constructor() {
    this.xpos = d * int(random(0, width / 40));
    this.ypos = d * int(random(0, width / 30));
    this.xpos2 = d * int(random(0, width / 40));
    this.ypos2 = d * int(random(0, width / 30));
    this.c = [color(37, 77, 47), color(170)];
    this.p = random(1);
  }

  display() {
    push();
    translate(0, 0, 1);
    if (ver2 == true) {
      fill(this.c[1]);
    } else {
      fill(this.c[0]);
    }
    stroke(0, 90);
    strokeWeight(0.5);
    beginShape(TRIANGLES);
    vertex(this.xpos, this.ypos);
    vertex(this.xpos, this.ypos - d);
    vertex(-d + this.xpos, this.ypos);

    vertex(this.xpos, this.ypos);
    vertex(d + this.xpos, this.ypos);
    vertex(this.xpos, this.ypos - d);
    endShape();
    pop();

    if (this.p < 0.25) {
      this.bigone();
    }
  }

  bigone() {
    push();
    if (ver2 == true) {
      fill(this.c[1]);
    } else {
      fill(this.c[0]);
    }
    stroke(0, 90);
    strokeWeight(0.5);
    beginShape(TRIANGLES);
    vertex(this.xpos2 - d, this.ypos2);
    vertex(this.xpos2 - d, this.ypos2 - d);
    vertex(-2 * d + this.xpos2, this.ypos2);

    vertex(this.xpos2 - d, this.ypos2 - d);
    vertex(this.xpos2, this.ypos2 - d * 2);
    vertex(this.xpos2, this.ypos2 - d);

    vertex(this.xpos2 + d, this.ypos2 - d);
    vertex(this.xpos2, this.ypos2 - d * 2);
    vertex(this.xpos2, this.ypos2 - d);

    vertex(this.xpos2 + 2 * d, this.ypos2);
    vertex(this.xpos2 + d, this.ypos2);
    vertex(this.xpos2 + d, this.ypos2 - d);
    endShape();

    beginShape(QUADS);
    vertex(this.xpos2, this.ypos2);
    vertex(this.xpos2 - d, this.ypos2);
    vertex(this.xpos2 - d, this.ypos2 - d);
    vertex(this.xpos2, this.ypos2 - d);

    vertex(this.xpos2, this.ypos2);
    vertex(this.xpos2 + d, this.ypos2);
    vertex(this.xpos2 + d, this.ypos2 - d);
    vertex(this.xpos2, this.ypos2 - d);

    endShape();
    pop();
  }
}

//현재 위치
function now() {
  push();
  translate(-width / 2, -height / 2, 0);
  if (ver2 == true) {
    fill(255, 150);
    stroke(255);
    strokeWeight(1);
  } else {
    fill(0);
    stroke(0);
    strokeWeight(2);
  }

  //움직이는 애
  circle(nowx, nowy, 20);
  translate(mapw1 - (mapw1 % d), maph1 - (maph1 % d), -3);
  //화살표
  line(30, 30, 59, 59);
  beginShape(TRIANGLES);
  vertex(40, 60);
  vertex(60, 60);
  vertex(60, 40);
  endShape();
  pop();
}

//마우스 누르면 뜨는 글씨
function texts(fontname) {
  push();
  translate(0, 0, 1);
  textFont(fontname);
  textAlign(CENTER);
  textSize(100);

  //빛효과용
  if (ver2 == true) {
    fill(0);
    stroke(0);
  } else {
    fill(255);
    stroke(255);
  }
  strokeWeight(1);
  text("Go get your " + value + "!", 0, maph2 / 3);

  //찐
  fill(stpc);
  noStroke();
  translate(0, 0, 2);
  text("Go get your " + value + "!", 0, maph2 / 3);

  pop();
}

//스탬프
function stamp() {
  push();
  //noSmooth();
  noFill();
  strokeWeight(20);
  stroke(stpc);
  translate(stpx, stpy);
  scale(stpsc);
  rotate(stampangle);
  circle(0, 0, 200);
  scale(1.5);
  strokeCap(PROJECT);

  beginShape();
  vertex(-5, 0);
  vertex(0, -50);
  vertex(5, 0);
  vertex(0, 50);
  vertex(-5, 0);
  endShape();

  beginShape();
  vertex(0, -5);
  vertex(-30, 0);
  vertex(0, 5);
  vertex(30, 0);
  vertex(0, -5);
  endShape();

  pop();
}
function stamp1() {
  push();
  noSmooth();
  noFill();
  strokeWeight(20);
  stroke(stpc);
  translate(stpx - 100, stpy - 100);
  scale(stpsc);
  rotate(stampangle);
  line(25, 0, 75, 0);
  line(25, 150, 75, 150);
  line(50, 0, 50, 150);
  ellipseMode(CORNER);
  ellipse(-50, -30, 210, 210);
  pop();
}
function stamp2() {
  push();
  noSmooth();
  noFill();
  strokeWeight(20);
  stroke(stpc);
  translate(stpx - 100, stpy - 100);
  scale(stpsc);
  rotate(stampangle);
  line(10, 0, 90, 0);
  line(10, 150, 90, 150);
  line(30, 0, 30, 150);
  line(70, 0, 70, 150);
  ellipseMode(CORNER);
  ellipse(-55, -34, 220, 220);

  pop();
}
function stamp3() {
  push();
  noSmooth();
  noFill();
  strokeWeight(20);
  stroke(stpc);
  translate(stpx - 100, stpy - 100);
  scale(stpsc);
  rotate(stampangle);
  line(0, 0, 100, 0);
  line(0, 150, 100, 150);
  line(20, 0, 20, 150);
  line(50, 0, 50, 150);
  line(80, 0, 80, 150);
  ellipseMode(CORNER);
  ellipse(-57, -34, 220, 220);

  pop();
}
function stamp4() {
  push();
  noSmooth();
  noFill();
  strokeWeight(20);
  stroke(stpc);
  translate(stpx - 100, stpy - 100);
  scale(stpsc);
  rotate(stampangle);
  line(0, 0, 115, 0);
  line(0, 150, 95, 150);
  line(20, 0, 20, 150);
  line(50, 0, 75, 150);
  line(75, 150, 100, 0);
  ellipseMode(CORNER);
  ellipse(-55, -35, 220, 220);

  pop();
}
function stamp5() {
  push();
  noSmooth();
  noFill();
  strokeWeight(20);
  stroke(stpc);
  translate(stpx - 100, stpy - 100);
  scale(stpsc);
  rotate(stampangle);
  line(0, 0, 100, 0);
  line(35, 150, 65, 150);
  line(80, 0, 50, 150);
  line(50, 150, 20, 0);
  ellipseMode(CORNER);
  ellipse(-55, -38, 220, 220);

  pop();
}

function keyPressed() {
  if (keyCode === 13) {
    //엔터 누르면 새로고침
    location.reload();
  } else if (keyCode === 32) {
    //스페이스바
    stp = true;
  } else if (keyCode === 49) {
    //1
    stp1 = true;
  } else if (keyCode === 50) {
    //2
    stp2 = true;
  } else if (keyCode === 51) {
    //3
    stp3 = true;
  } else if (keyCode === 52) {
    //4
    stp4 = true;
  } else if (keyCode === 53) {
    //5
    stp5 = true;
  }

  if (keyCode === RIGHT_ARROW) {
    nowx += d;
  } else if (keyCode === LEFT_ARROW) {
    nowx -= d;
  } else if (keyCode === UP_ARROW) {
    nowy -= d;
  } else if (keyCode === DOWN_ARROW) {
    nowy += d;
  }
  loop();
}

//프레임 뒷면 + 옆면
function board() {
  push();
  beginShape(QUADS);
  fill(0);

  translate(-width / 2, -height / 2, -1);
  translate(mapw1 - d, maph1 - d, 0);

  vertex(0, 0, -5);
  vertex(0, 4 * h5, -5);
  vertex(6 * h5, 4 * h5, -5);
  vertex(6 * h5, 0, -5);

  vertex(0, 0, 0);
  vertex(0, 0, -5);
  vertex(0, 4 * h5, -5);
  vertex(0, 4 * h5, 0);

  vertex(0, 0, 0);
  vertex(0, 0, -5);
  vertex(6 * h5, 0, -5);
  vertex(6 * h5, 0, 0);

  vertex(0, 4 * h5, 0);
  vertex(6 * h5, 4 * h5, 0);
  vertex(6 * h5, 4 * h5, -5);
  vertex(0, 4 * h5, -5);

  vertex(6 * h5, 0, 0);
  vertex(6 * h5, 4 * h5, 0);
  vertex(6 * h5, 4 * h5, -5);
  vertex(6 * h5, 0, -5);
  endShape();
  pop();
}

//거점이랑.. 나침반
function spots() {
  //보물
  push();
  translate(stx[0], sty[0], 1);
  spot();
  pop();

  //거점
  push();
  for (let i = 0; i < stx.length; i++) {
    //말뚝
    if (ver2 == true) {
      fill(161, 141, 227);
    } else {
      fill(181, 44, 25);
    }
    noStroke();
    push();
    translate(stx[i], sty[i], 1);
    rotateX(radians(90));
    cylinder(7, 15);
    pop();

    //좌표
    push();
    translate(stx[i], sty[i], 10);
    if (ver2 == true) {
      fill(200);
    } else {
      fill(0);
    }
    textFont(garamondR);
    textSize(20);
    text("(" + int(stx[i]) + ", " + int(sty[i]) + ")", 10, 0);
    pop();
  }
  pop();

  //선으로 잇기..
  push();
  if (ver2 == true) {
    stroke(200);
  } else {
    stroke(0);
  }
  translate(0, 0, 5);
  strokeWeight(1.2);
  for (i = 0; i < stx.length - 1; i++) {
    line(stx[i], sty[i], stx[i + 1], sty[i + 1]);
  }
  pop();

  //나침반쓰..
  push();
  noStroke();
  translate(width - mapw1 - 2 * d, height - maph1 - 2 * d, 0);
  if (ver2 == true) {
    fill(255, 150);
    stroke(255);
  } else {
    fill(0);
    stroke(0);
  }
  strokeWeight(0.7);
  translate(0, 0, 15);

  if (pmouseX < mouseX) {
    //마우스 이동 방향 따라 회전 방향 바뀌게
    rotateZ(frameCount / 4);
  } else {
    rotateZ(frameCount / -4);
  }

  beginShape();
  vertex(-5, 0);
  vertex(0, -50);
  vertex(5, 0);
  vertex(0, 50);
  vertex(-5, 0);
  endShape();

  beginShape();
  vertex(0, -5);
  vertex(-30, 0);
  vertex(0, 5);
  vertex(30, 0);
  vertex(0, -5);
  endShape();
  pop();
}

function mousePressed() {
  loop();
}

function mouseReleased() {
  noLoop();
}

function keyReleased() {
  noLoop();
}

//보물 스팟
function spot() {
  beginShape();
  if (ver2 == true) {
    fill(0, 100);
    stroke(200);
  } else {
    fill(255, 150);
    stroke(0);
  }
  strokeWeight(0.6);
  for (let i = 0; i < TWO_PI; i += 0.03) {
    let r = noise(i) * random(10, 100) + random(20, 100);
    let x = cos(i) * r;
    let y = sin(i) * r;
    let rate = random(0.2, 1);

    vertex(rate * x, rate * y);
  }
  endShape(CLOSE);
}

//그리드
function grid(opc) {
  push();
  if (ver2 == true) {
    stroke(214, 189, 255, opc);
  } else {
    stroke(255, 84, 10, opc);
  }
  for (let i = 0; i < width; i++) {
    line(i * d, 0, i * d, height);
    line(0, i * d, width, i * d);
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//땅덩어리 클래스
class Land {
  constructor() {
    this.xpos = d * int(random(0, width / 40));
    this.ypos = d * int(random(0, height / 30));
    this.l = int(random(2, 10));
    this.ll = int(random(2, 7));
    this.lll = int(random(2, 4));
    this.w = int(random(1, 30));
    this.h = int(random(1, 30));
    noLoop();
  }

  display() {
    if (ver2 == true) {
      this.c2 = color(70, 150, 166);
      this.c3 = color(72, 108, 145);
    } else {
      this.c2 = color(173, 140, 7);
      this.c3 = color(126, 140, 0);
    }

    this.createLand();
    translate(0, 0, 0.2);
    this.createLandSmall(this.c2);
    translate(0, 0, 0.2);
    this.createLandSmall2(this.c3);
  }

  createLand() {
    push();
    translate(this.xpos, this.ypos);
    stroke(0, 50);
    fill(c);

    for (let i = -this.l; i < this.l; i++) {
      for (let j = -this.l; j < this.l; j++) {
        let x = j * d;
        let y = i * d;
        if (this.l < 8) {
          if (
            i == -this.l ||
            i == this.l - 1 ||
            j == -this.l ||
            j == this.l - 1
          ) {
            if (random(1) < 0.5) {
              rect(x, y, d);
            }
          } else {
            rect(x, y, d);
          }
        } else {
          if (
            i == -this.l ||
            i == this.l - 1 ||
            i == this.l - 2 ||
            j == -this.l ||
            j == this.l - 1 ||
            j == this.l - 2
          ) {
            if (random(1) < 0.5) {
              rect(x, y, d);
            }
          } else {
            rect(x, y, d);
          }
        }
      }
    }
    pop();
  }

  createLandSmall(col) {
    push();
    translate(this.xpos + 2 * d, this.ypos * d);
    stroke(0, 50);
    fill(col);

    for (let i = -this.lll; i < this.lll; i++) {
      for (let j = -this.lll; j < this.lll; j++) {
        let x = j * d;
        let y = i * d;
        if (
          i == -this.lll ||
          i == this.lll - 1 ||
          j == -this.lll ||
          j == this.lll - 1
        ) {
          if (random(1) < 0.5) {
            rect(x, y, d);
          }
        } else {
          rect(x, y, d);
        }
      }
    }
    pop();
  }

  createLandSmall2(col) {
    push();
    translate(this.ypos, this.xpos);
    stroke(0, 50);
    fill(col);

    for (let i = -this.ll; i < this.ll; i++) {
      for (let j = -this.ll; j < this.ll; j++) {
        let x = j * d;
        let y = i * d;
        if (
          i == -this.ll ||
          i == this.ll - 1 ||
          j == -this.ll ||
          j == this.ll - 1
        ) {
          if (random(1) < 0.5) {
            rect(x, y, d);
          }
        } else {
          rect(x, y, d);
        }
      }
    }
    pop();
  }
}

function changever() {
  if (ver1 == true) {
    ver1 = false;
    ver2 = true;
  } else if (ver2 == true) {
    ver1 = true;
    ver2 = false;
  }
}
