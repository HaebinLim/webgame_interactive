class Stage {
  constructor() {
    this.level = 0;
    this.isStart = false;
    // this.stageStart();
  }
  /*
  stageStart() {
    setTimeout(() => {
      this.isStart = true;
      this.stageGuide(`START LEVEL${this.level + 1}`);
      this.callMonster();
    }, 2000);
  }*/
  stageGuide(text) {
    this.parentNode = document.querySelector('.game_app');
    this.textBox = document.createElement('div');
    this.textBox.className = 'stage_box';
    this.textNode = document.createTextNode(text);
    this.textBox.appendChild(this.textNode);
    this.parentNode.appendChild(this.textBox);
    setTimeout(() => this.textBox.remove(), 1500);
  }
  callMonster() {
    for (let i = 0; i <= 10; i++) {
      if (i === 10) {
        allMonsterComProp.arr[i] = new Monster(stageInfo.monster[this.level].bossMon, hero.movex + gameProp.screenWidth + 600 * i);
      } else {
        allMonsterComProp.arr[i] = new Monster(stageInfo.monster[this.level].defaultMon, hero.movex + gameProp.screenWidth + 700 * i);
      }
    }
  }
  clearCheck() {
    /*
    if (allMonsterComProp.arr.length === 0 && this.isStart) {
      this.isStart = false;
      this.level++;
      if (this.level < stageInfo.monster.length) {
        this.stageGuide('CLEAR!!');
        this.stageStart();
        hero.heroUpgrade();
      } else {
        // 모든 스테이지 클리어
        this.stageGuide('ALL CLEAR!!');
      }
    }
    */

    // 히어로 위치에 따라 몬스터 소환
    stageInfo.callPosition.forEach(arr => {
      // 소환 위치 도달 && 몬스터 모두 사냥
      if (hero.movex >= arr && allMonsterComProp.arr.length === 0) {
        this.stageGuide('🚨!!!');
        stageInfo.callPosition.shift();
        setTimeout(() => {
          this.callMonster();
          this.level++;
        }, 1000)
      }
    });
  }
}

class Hero {
  constructor(el) {
    this.el = document.querySelector(el);
    this.movex = 0;
    this.speed = 11;
    this.direction = 'right';
    this.attackDamage = 10000;
    this.hpProgress = 0;
    this.hpValue = 100000;
    this.defaultHpValue = this.hpValue;
    this.realDamage = 0;
    this.slideSpeed = 14;
    this.slideTime = 0;
    this.slideMaxTime = 30;
    this.slideDown = false;
    this.level = 1;
    this.exp = 0;
    this.maxExp = 3000;
    this.expProgress = 0;
  }
  keyMotion() {
    // 이동 키
    if (key.keyDown['left']) {
      this.el.classList.add('run');
      this.el.classList.add('flip');
      this.direction = 'left';
      this.movex = this.movex <= 0 ? 0 : this.movex - this.speed;

    } else if (key.keyDown['right']) {
      this.el.classList.add('run');
      this.el.classList.remove('flip');
      this.direction = 'right';
      this.movex = this.movex + this.speed;
    }

    if (!key.keyDown['left'] && !key.keyDown['right']) {
      this.el.classList.remove('run');
    }
    this.el.parentNode.style.transform = `translateX(${this.movex}px)`;

    // 공격 키
    if (key.keyDown['attack']) {
      if (!bulletComProp.launch) {
        this.el.classList.add('attack');
        bulletComProp.arr.push(new Bullet());
        bulletComProp.launch = true;
      }
    }
    if (!key.keyDown['attack']) {
      this.el.classList.remove('attack');
      bulletComProp.launch = false;
    }

    // 슬라이드
    if (key.keyDown['slide']) {
      if (!this.slideDown) {
        this.el.classList.add('slide');
        if (this.direction === 'right') {
          this.movex += this.slideSpeed;
        } else {
          this.movex -= this.slideSpeed;
        }
        if (this.slideTime > this.slideMaxTime) {
          this.el.classList.remove('slide');
          this.slideDown = true; // 슬라이드 이동 멈춤
        }
        this.slideTime += 1;
      }
    }
    if (!key.keyDown['slide']) {
      this.el.classList.remove('slide');
      this.slideDown = false;
      this.slideTime = 0;
    }

  }
  // 캐릭터 위치 값
  position() {
    return {
      left: this.el.getBoundingClientRect().left,
      right: this.el.getBoundingClientRect().right,
      top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
      bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
    }
  }
  size() {
    return {
      width: this.el.offsetWidth,
      height: this.el.offsetHeight,
    }
  }
  minusHp(monsterDamage) {
    this.hpValue = Math.max(0, this.hpValue - monsterDamage);
    this.renderHp();
    this.crash();
    if (this.hpValue === 0) {
      this.dead();
    }
  }
  plusHp(hp) {
    this.hpValue = hp;
    this.renderHp();
  }
  renderHp() {
    this.hpProgress = this.hpValue / this.defaultHpValue * 100;
    document.querySelector('.state_box .hp span').style.width = this.hpProgress + '%';
  }
  crash() {
    this.el.classList.add('crash');
    setTimeout(() => {
      this.el.classList.remove('crash');
    }, 400);
  }
  dead() {
    this.el.classList.add('dead');
    endGame();
  }
  hitDamage() {
    this.realDamage = this.attackDamage - Math.round(Math.random() * this.attackDamage * 0.1); // 공격력 90%~100% 랜덤
  }
  heroUpgrade() {
    this.attackDamage += 5000;
  }
  updateExp(exp) {
    this.exp += exp;
    this.expProgress = this.exp / this.maxExp * 100;
    document.querySelector('.state_box .exp span').style.width = this.expProgress + '%';
    if (this.exp >= this.maxExp) {
      this.levelUp();
    }
  }
  levelUp() {
    this.exp = 0;
    this.maxExp = this.maxExp + this.level * 1000;
    this.level += 1;
    document.querySelector('.level_box strong').innerText = this.level;
    const levelGuide = document.querySelector('.level_up');
    levelGuide.classList.add('active');
    setTimeout(() => levelGuide.classList.remove('active'), 1000);
    this.updateExp(this.exp);
    this.heroUpgrade();
    this.plusHp(this.defaultHpValue);
  }
}

class Bullet {
  constructor() {
    this.parentNode = document.querySelector('.game');
    this.el = document.createElement('div');
    this.el.className = 'hero_bullet';
    this.x = 0;
    this.y = 0;
    this.speed = 30;
    this.distance = 0;
    this.bulletDirection = 'right';
    this.init();
  }
  init() {
    this.bulletDirection = hero.direction;
    this.x = this.bulletDirection === 'right' ? hero.movex + hero.size().width / 2 : hero.movex - hero.size().width / 2;
    this.y = hero.position().bottom - hero.size().height / 2;
    this.distance = this.x;
    this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
    this.parentNode.appendChild(this.el);
  }
  moveBullet() {
    let setRotate = '';
    if (this.bulletDirection === 'left') {
      this.distance -= this.speed;
      setRotate = 'rotate(180deg)';
    } else {
      this.distance += this.speed;
    }
    this.el.style.transform = `translate(${this.distance}px, ${this.y}px) ${setRotate}`;
    this.crashBullet(); // 검이 이동할 때마다 호출
  }
  // 검 위치 값
  position() {
    return {
      left: this.el.getBoundingClientRect().left,
      right: this.el.getBoundingClientRect().right,
      top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
      bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
    }
  }
  crashBullet() {
    // 검의 왼쪽 위치가 화면 오른쪽을 벗어남 || 검의 오른쪽 위치가 화면 왼쪽을 벗어남
    if (this.position().left > gameProp.screenWidth || this.position().right < 0) {
      for (let i = 0; i < bulletComProp.arr.length; i++) {
        if (bulletComProp.arr[i] === this) {
          bulletComProp.arr.splice(i, 1);
          this.el.remove();
        }
      }
    }
    // 검이 몬스터를 지날 때
    for (let j = 0; j < allMonsterComProp.arr.length; j++) {
      if (this.position().left > allMonsterComProp.arr[j].position().left && this.position().right < allMonsterComProp.arr[j].position().right) {
        if (bulletComProp.arr[j] === this) {
          hero.hitDamage();
          bulletComProp.arr.splice(j, 1);
          this.el.remove();
          this.damageView(allMonsterComProp.arr[j]);
          allMonsterComProp.arr[j].updateHp(j);
        }
      }
    }
  }
  damageView(monster) {
    this.parentNode = document.querySelector('.game_app');
    this.textDamageNode = document.createElement('div');
    this.textDamageNode.className = 'text_damage';
    this.textDamage = document.createTextNode(hero.realDamage);
    this.textDamageNode.appendChild(this.textDamage);
    this.parentNode.appendChild(this.textDamageNode);

    let textPosition = Math.random() * -100;
    let damagex = monster.position().left + textPosition;
    let damagey = monster.position().top;

    this.textDamageNode.style.transform = `translate(${damagex}px,${-damagey}px)`;
    setTimeout(() => this.textDamageNode.remove(), 500);
  }
}

class Monster {
  constructor(property, positionX) {
    this.parentNode = document.querySelector('.game');
    this.el = document.createElement('div');
    this.el.className = 'monster_box ' + property.name;
    this.elChildren = document.createElement('div');
    this.elChildren.className = 'monster';
    this.hpNode = document.createElement('div');
    this.hpNode.className = 'hp';
    this.hpValue = property.hpValue;
    this.defaultValue = property.hpValue;
    this.hpInner = document.createElement('span');
    this.progress = 0;
    this.positionX = positionX;
    this.moveX = 0;
    this.speed = property.speed;
    this.crashDamage = property.crashDamage;
    this.score = property.score;
    this.exp = property.exp;
    this.init();
  }
  init() {
    this.hpNode.appendChild(this.hpInner);
    this.el.appendChild(this.hpNode);
    this.el.appendChild(this.elChildren);
    this.parentNode.appendChild(this.el);
    this.el.style.left = this.positionX + 'px';
  }
  // 몬스터 위치 값
  position() {
    return {
      left: this.el.getBoundingClientRect().left,
      right: this.el.getBoundingClientRect().right,
      top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
      bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
    }
  }
  updateHp(idx) {
    this.hpValue = Math.max(0, this.hpValue - hero.realDamage);
    this.progress = this.hpValue / this.defaultValue * 100;
    this.el.children[0].children[0].style.width = this.progress + '%';
    if (!this.hpValue) {
      this.dead(idx);
    }
  }
  dead(idx) {
    this.el.classList.add('remove');
    setTimeout(() => this.el.remove(), 400);
    allMonsterComProp.arr.splice(idx, 1);
    this.setScore();
    this.setExp();
  }
  moveMonster() {
    // this.moveX + this.positionX + this.el.offsetWidth 몬스터가 화면 끝에 도착했을 때 0 되는 값
    // hero.position().left - hero.movex 히어로가 화면 기준으로 이동한 거리 ? ??!?!?!
    if (this.moveX + this.positionX + this.el.offsetWidth + hero.position().left - hero.movex <= 0) {
      // 다시 오른쪽에서 나타나도록
      this.moveX = hero.movex - this.positionX + gameProp.screenWidth - hero.position().left;
    } else {
      this.moveX -= this.speed;
    }
    this.el.style.transform = `translateX(${this.moveX}px)`;

    // 몬스터가 이동할 때마다 히어로와 충돌했는지 
    this.crash();
  }
  crash() {
    let rightDiff = 30; // 이미지 여백 때문에
    let leftDiff = 90;

    // 히어로의 오른쪽 위치와 몬스터의 왼쪽 위치 비교
    if (hero.position().right - rightDiff > this.position().left && hero.position().left + leftDiff < this.position().right) {
      hero.minusHp(this.crashDamage);
    }
  }
  setScore() {
    stageInfo.totalScore += this.score;
    document.querySelector('.score_box').innerText = stageInfo.totalScore;
  }
  setExp() {
    hero.updateExp(this.exp);
  }
}