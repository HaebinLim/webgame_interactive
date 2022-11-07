const key = {
  keyDown: {},
  keyValue: {
    // key code e.which
    37: 'left',
    39: 'right',
    38: 'up',
    40: 'down',
    88: 'attack',
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

const gameProp = {
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
}

const renderGame = () => {
  hero.keyMotion(); // 키눌림 딜레이 차이 해결

  setGameBackground();

  bulletComProp.arr.forEach((arr, i) => {
    arr.moveBullet();
  });

  window.requestAnimationFrame(renderGame); // 재귀호출. 초당 60프레임을 그리면서 무한반복
}

const setGameBackground = () => {
  let parallaxValue = Math.min(0, ((hero.movex - gameProp.screenWidth / 3) * -1)); // 둘 중 작은 값 대입
  gameBackground.gameBox.style.transform = `translateX(${parallaxValue}px)`;
}

// window event 함수
const windowEvent = () => {
  window.addEventListener('keydown', e => {
    key.keyDown[key.keyValue[e.which]] = true;
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
  ];
  preLoadImgSrc.forEach(arr => {
    const img = new Image();
    img.src = arr;
  });
}

let hero;

// 프로그램 시작에 필요한 함수
const init = () => {
  hero = new Hero('.hero'); // 인스턴스 생성
  allMonsterComProp.arr[0] = new Monster(500, 9000);
  allMonsterComProp.arr[1] = new Monster(1000, 9000);
  loadImg();
  windowEvent();
  renderGame();
}

// 모든 요소 로드 후 게임 실행
window.onload = () => {
  init();
}