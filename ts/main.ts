import { Value, Dragged } from "./types";

// Utils
const $ = <T extends HTMLElement>(node: string): T => document.querySelector(node) as T;
const $$ = <T extends NodeListOf<HTMLElement>>(node: string): T => document.querySelectorAll(node) as T;

// DOM
const $container = $<HTMLUListElement>(".image-container"),
      $startButton = $<HTMLButtonElement>(".start-button"),
      $gameText = $<HTMLParagraphElement>('.game-text'),
      $playTime = $<HTMLParagraphElement>('.play-time');

// Drag & Drop data
const dragged: Dragged = {
  el: null,
  class: null,
  index: null,
}      

const value: Value = {
  positionX: 0, 
  positionY: 0,
  tilesLen: 16,
} 
let { positionX, positionY, tilesLen } = value;

// createImageTiles함수 반환 배열을 담을 배열
let tiles: HTMLLIElement[] = [];


/* Functions */
const createImageTiles = (): HTMLLIElement[] => {

  // 요소를 받을 빈 배열
  const temArr = [];

  // 요소 생성
  for(let i = 0; i < tilesLen; i++){
    const $li = document.createElement('li');

    $li.dataset.index = i + "";
    $li.draggable = true;
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

const setGame = () =>{
  tiles = createImageTiles();

  tiles.forEach((tile: HTMLElement) => {
    $container.appendChild(tile);
  })

  // 일정 시간 뒤 기존에 추가된 요소들 제거 후 suffle함수로 순서가 섞인 배열 요소들을 추가
  setTimeout(() => {
    $container.insertAdjacentHTML("beforeend","");
  
    shuffle(tiles).forEach((tile: HTMLElement) => {
    $container.appendChild(tile);
  })
  }, 3000);
}


/* Events */
$container.addEventListener("dragstart",(e: DragEvent) =>{
  const target = e.target as HTMLLIElement
  
  dragged["el"] = target;
  dragged["class"] = target.className;
  // target이 부모(container)의 자식요소로 이루어진 배열에서 몇번째 index인지 찾아서 할당
  dragged["index"] = [...target.parentNode!.children].indexOf(target); 
})
$container.addEventListener("dragover",(e: DragEvent) =>{
  // Element 위에 over된 상태에서 놓으면 drop이벤트가 발생되지 않으므로 기본 이벤트 방지해 발생하지 않게 설정
  e.preventDefault();
  console.log('over');
})
$container.addEventListener("drop",(e: DragEvent) =>{
  const target = e.target as HTMLLIElement;

  let originPlace: HTMLLIElement;
  let isLast: boolean = false;
  
  if(target.className !== dragged["class"]){
      const droppedIndex = [...target.parentNode!.children].indexOf(target); 

      if(dragged["el"]){
          dragged.index! > droppedIndex ? target.before(dragged["el"]) : target.after(dragged["el"])
      };            
  }
})

setGame();