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

// 키눌림 딜레이 차이 해결
const renderGame = () => {
  hero.keyMotion();
  window.requestAnimationFrame(renderGame); // 재귀호출. 초당 60프레임을 그리면서 무한반복
}

// window event 함수
const windowEvent = () => {
  window.addEventListener('keydown', e => {
    key.keyDown[key.keyValue[e.which]] = true;
  });
  window.addEventListener('keyup', e => {
    key.keyDown[key.keyValue[e.which]] = false;
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
  loadImg();
  windowEvent();
  renderGame();
}

// 모든 요소 로드 후 게임 실행
window.onload = () => {
  init();
}