import { Value, Dragged } from "./types";

// Utils
const $ = <T extends HTMLElement>(node: string): T => document.querySelector(node) as T;
const $$ = <T extends NodeListOf<HTMLElement>>(node: string): T => document.querySelectorAll(node) as T;

// DOM
const $container = $<HTMLUListElement>(".image-container"),
      $startButton = $<HTMLButtonElement>(".start-button"),
      $gameText = $<HTMLParagraphElement>('.game-text'),
      $playTime = $<HTMLParagraphElement>('.play-time'),
      $cheatButton = $<HTMLButtonElement>('.cheat-button');

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

let isPlaying: boolean = false;
let timeInterval: NodeJS.Timeout;
let time: number = 0;
let cheatState: boolean = false;

// createImageTiles함수 반환 배열을 담을 배열
let tiles: HTMLLIElement[] = [];


/* Functions */
const checkStatus = (): void =>{
  const currentList = [...$container.children];
  const unMatchList = currentList.filter((el, i: number)=> +((el as HTMLLIElement).dataset.index || "") !== i )
  
  // game finish
  if(!unMatchList.length){
    $gameText.style.display = "block";
    isPlaying = false;
    clearInterval(timeInterval);
  } 
}

const createImageTiles = (): HTMLLIElement[] => {

  let randomImg: number = Math.trunc(Math.random() * (6 - 1) + 1);

  // 요소를 받을 빈 배열
  const temArr = [];

  // 요소 생성
  for(let i = 0; i < tilesLen; i++){
    const $li = document.createElement('li');

    $li.dataset.index = i + "";
    $li.draggable = true;
    $li.classList.add(`list${i}`);
    $li.style.backgroundPositionX = `-${positionX}00px`; 
    $li.style.backgroundImage =  `url("./img/${randomImg}.jpg")`       
    
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

const setGame = (): void =>{
  isPlaying = true;
  time = 0;
  $container.innerHTML = '';
  $gameText.style.display = 'none';
  $cheatButton.style.display = 'block';

  clearInterval(timeInterval);

  timeInterval = setInterval(()=>{
    $playTime.textContent = (time++).toString();
  },1000)

  tiles = createImageTiles();

  tiles.forEach((tile: HTMLElement) => {
    $container.appendChild(tile);
  })

  // 일정 시간 뒤 기존에 추가된 요소들 제거 후 suffle함수로 순서가 섞인 배열 요소들을 추가
  setTimeout((): void => {
    $container.innerHTML = '';
  
    shuffle(tiles).forEach((tile: HTMLElement) => {
    $container.appendChild(tile);
  })
  }, 5000);
}


/* Events */
$container.addEventListener("dragstart",(e: DragEvent) =>{
  if(!isPlaying) return;

  const target = e.target as HTMLLIElement
  
  dragged["el"] = target;
  dragged["class"] = target.className;
  dragged["index"] = [...target.parentNode!.children].indexOf(target); 
})

$container.addEventListener("dragover",(e: DragEvent) =>{
  e.preventDefault();
  console.log('over');
})

$container.addEventListener("drop",(e: DragEvent) =>{
  if(!isPlaying) return;
  
  const target = e.target as HTMLLIElement;
  
  if(target.className !== dragged["class"]){

      let originPlace: ChildNode;
      let isLast: boolean = false;
    
      if(dragged["el"]?.nextSibling) originPlace = dragged["el"].nextSibling;      
      else{
        originPlace = dragged["el"]?.previousSibling!;
        !isLast
      }  

      const droppedIndex = [...target.parentNode!.children].indexOf(target); 

      if(dragged["el"]){
          dragged.index! > droppedIndex ? target.before(dragged["el"]) : target.after(dragged["el"])
          isLast ? originPlace.after(target) : originPlace.before(target);
      };            
  }
})

$startButton.addEventListener('click',_=> {
  setGame()
})

$cheatButton.addEventListener('click',_=>{
  
  if(!cheatState){
    [...$container.children].forEach(el=>{
      el.textContent = (el as HTMLLIElement).dataset.index || "";
    })
  }

   if(cheatState){
    [...$container.children].forEach(el=>{
      el.textContent = "";
    })    
  }
  cheatState = !cheatState;  
})

