// Utils
const $ = <T extends HTMLElement>(node: string): T => document.querySelector(node) as T;
const $$ = <T extends NodeListOf<HTMLElement>>(node: string): T => document.querySelectorAll(node) as T;

// DOM
const $container = $<HTMLUListElement>(".image-container"),
      $startButton = $<HTMLButtonElement>(".start-button"),
      $gameText = $<HTMLParagraphElement>('.game-text'),
      $playTime = $<HTMLParagraphElement>('.play-time');

// DOMVariable
const count: number = 16;

// Position value
let positionX: number = 0, 
    positionY: number = 0,

    // createImageTiles함수 반환 배열을 담을 배열
    tiles: HTMLLIElement[] = [];


const createImageTiles = (): HTMLLIElement[] => {

  // 요소를 받을 빈 배열
  const temArr = [];

  // 요소 생성
  for(let i = 0; i < count; i++){
    const $li = document.createElement('li');

    $li.dataset.index = i + "";
    $li.classList.add(`list${i}`);
    $li.style.backgroundPositionX = `-${positionX}00px`;  

    positionX < 3 ?  positionX++ : (positionX = 0);
  
    if( i <= 4) positionY = 0; 
    if( i >= 4 && i <= 8 ) positionY = 100;
    if( i >= 8 && i <= 13 ) positionY = 200;
    if( i >= 12 && i <= 17 ) positionY = 300;
    $li.style.backgroundPositionY = `-${positionY}px`;      

    temArr.push($li);
  }
  // 요소가 담긴 배열
  return temArr;
}

const shuffle = <T extends HTMLLIElement[]>( arr: T ): T =>{
  let index = arr.length - 1;

  while(index > 0){
    const radomIndex = Math.trunc(Math.random()*(index+1));

    // 배열 요소 스위칭
    [arr[index], arr[radomIndex]] = [arr[radomIndex], arr[index]];

    index--;
  }

  return arr;
}

tiles = createImageTiles();

// suffle함수로 순서가 섞인 배열 요소들을 $container에 추가
shuffle(tiles).forEach((tile: HTMLElement) => {
  $container.appendChild(tile);
})

