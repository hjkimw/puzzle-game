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
    positionY: number = 0;

// Create elements and adjust images
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

  $container.appendChild($li);
}



