const key = {
  keyDown: {},
  keyValue: {
    // key code e.which
    13: 'enter',
    37: 'left',
    39: 'right',
    38: 'up',
    40: 'down',
    67: 'slide', // c
    88: 'attack', // x
  }
}

const allMonsterComProp = {
  arr: [], // 생성되는 몬스터를 배열에 담아 관리
}

const bulletComProp = {
  launch: false, // 공격 키 눌렀을 때 검이 한번만 생성되도록 관리
  arr: [], // 생성되는 검의 인스턴스를 이 배열에 담아 관리
}

const gameBackground = {
  gameBox: document.querySelector('.game'),
}

const stageInfo = {
  stage: [],
  totalScore: 0,
  monster: [
    { defaultMon: greenMonster, bossMon: greenBossMonster }, //stage1
    { defaultMon: yellowMonster, bossMon: yellowBossMonster }, //stage2
    { defaultMon: pinkMonster, bossMon: pinkBossMonster }, //stage3
    { defaultMon: pinkMonster, bossMon: zombieKing }, //stage4
  ],
  callPosition: [1000, 5000, 9000, 12000],
}

const gameProp = {
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  gameOver: false,
}

const renderGame = () => {
  hero.keyMotion(); // 키눌림 딜레이 차이 해결

  setGameBackground();

  npcOne.crash();
  npcTwo.crash();

  bulletComProp.arr.forEach((arr, i) => {
    arr.moveBullet();
  });

  allMonsterComProp.arr.forEach((arr, i) => {
    arr.moveMonster();
  });

  stageInfo.stage.clearCheck();

  window.requestAnimationFrame(renderGame); // 재귀호출. 초당 60프레임을 그리면서 무한반복
}

const endGame = () => {
  gameProp.gameOver = true;
  key.keyDown.left = false;
  key.keyDown.right = false;
  document.querySelector('.game_over').classList.add('show');
}

const setGameBackground = () => {
  let parallaxValue = Math.min(0, ((hero.movex - gameProp.screenWidth / 3) * -1)); // 둘 중 작은 값 대입
  gameBackground.gameBox.style.transform = `translateX(${parallaxValue}px)`;
}

// window event 함수
const windowEvent = () => {
  window.addEventListener('keydown', e => {
    if (!gameProp.gameOver) {
      key.keyDown[key.keyValue[e.which]] = true;
    }
    if (key.keyDown['enter']) {
      npcOne.talk();
      npcTwo.talk();
    }
  });
  window.addEventListener('keyup', e => {
    key.keyDown[key.keyValue[e.which]] = false;
  });
  window.addEventListener('resize', e => {
    gameProp.screenWidth = window.innerWidth;
    gameProp.screenHeight = window.innerHeight;
  });
}

const loadImg = () => {
  /*
    background image가 스크립트에서 클래스 추가시 로드되는 문제를 해결. 
    미리 로드되어 깜박거림 없이 처리
  */
  const preLoadImgSrc = [
    '../../lib/images/ninja_run.png',
    '../../lib/images/ninja_attack.png',
    '../../lib/images/ninja_slide.png',
  ];
  preLoadImgSrc.forEach(arr => {
    const img = new Image();
    img.src = arr;
  });
}

let hero;
let npcOne;
let npcTwo;

// 프로그램 시작에 필요한 함수
const init = () => {
  hero = new Hero('.hero'); // 인스턴스 생성
  stageInfo.stage = new Stage();
  npcOne = new Npc(levelQuest);
  npcTwo = new Npc(levelQuestTwo);
  loadImg();
  windowEvent();
  renderGame();
}

// 모든 요소 로드 후 게임 실행
window.onload = () => {
  init();
}