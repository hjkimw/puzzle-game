const $ = (node) => document.querySelector(node);
const $$ = (node) => document.querySelectorAll(node);
const $container = $(".image-container"), $startGuideMessage = $('.start-guide-message'), $startButton = $(".start-button"), $gameText = $('.game-text'), $playTime = $('.play-time'), $cheatButton = $('.cheat-button');
const dragged = {
    el: null,
    class: null,
    index: null,
};
const value = {
    positionX: 0,
    positionY: 0,
    tilesLen: 16,
};
let { positionX, positionY, tilesLen } = value;
let isPlaying = false;
let timeInterval;
let time = 300;
let cheatState = false;
let anableClick = true;
let tiles = [];
const checkStatus = () => {
    const currentList = [...$container.children];
    const unMatchList = currentList.filter((el, i) => +(el.dataset.index || "") !== i);
    if (!unMatchList.length) {
        $gameText.style.display = "block";
        isPlaying = false;
        clearInterval(timeInterval);
        $startGuideMessage.textContent = "🎉 게임을 클리어 하셨습니다!";
        $startGuideMessage.style.color = "green";
        setTimeout(() => {
            alert(`${time}초 남기고 클리어 하셨습니다!`);
        }, 100);
    }
};
const createImageTiles = () => {
    let randomImg = Math.trunc(Math.random() * (6 - 1) + 1);
    const temArr = [];
    for (let i = 0; i < tilesLen; i++) {
        const $li = document.createElement('li');
        $li.dataset.index = i + "";
        $li.draggable = true;
        $li.classList.add(`list${i}`);
        $li.style.backgroundPositionX = `-${positionX}00px`;
        $li.style.backgroundImage = `url("./img/${randomImg}.jpg")`;
        positionX < 3 ? positionX++ : (positionX = 0);
        if (i <= 4)
            positionY = 0;
        if (i >= 4 && i <= 8)
            positionY = 100;
        if (i >= 8 && i <= 13)
            positionY = 200;
        if (i >= 12 && i <= 17)
            positionY = 300;
        $li.style.backgroundPositionY = `-${positionY}px`;
        temArr.push($li);
    }
    return temArr;
};
const shuffle = (arr) => {
    let index = arr.length - 1;
    while (index > 0) {
        const radomIndex = Math.trunc(Math.random() * (index + 1));
        [arr[index], arr[radomIndex]] = [arr[radomIndex], arr[index]];
        index--;
    }
    return arr;
};
const setGame = () => {
    if (anableClick) {
        anableClick = false;
        time = 300;
        $container.innerHTML = '';
        $gameText.style.display = 'none';
        $cheatButton.style.display = 'block';
        clearInterval(timeInterval);
        timeInterval = setInterval(() => {
            $playTime.textContent = `${--time}`;
            if (time >= 297) {
                $playTime.style.color = "royalblue";
            }
            else
                $playTime.style.color = "white";
            if (time >= 297) {
                $startGuideMessage.textContent = "👀 이미지를 기억해주세요! ";
                $startGuideMessage.style.color = "royalblue";
            }
            else if (time <= 297) {
                $startGuideMessage.textContent = "🏃 게임이 진행중입니다! ";
                $startGuideMessage.style.color = "red";
            }
            if (time === 0) {
                alert('게임 오버');
                clearInterval(timeInterval);
                $startGuideMessage.textContent = "☠️ 게임 오버되었습니다.";
            }
        }, 1000);
        tiles = createImageTiles();
        tiles.forEach((tile) => {
            $container.appendChild(tile);
        });
        setTimeout(() => {
            $container.innerHTML = '';
            shuffle(tiles).forEach((tile) => {
                $container.appendChild(tile);
                isPlaying = true;
                anableClick = true;
            });
        }, 5000);
    }
    else {
        alert('3초 뒤에 재시작 할 수 있습니다.');
    }
};
$container.addEventListener("dragstart", (e) => {
    if (!isPlaying)
        return;
    const target = e.target;
    dragged["el"] = target;
    dragged["class"] = target.className;
    dragged["index"] = [...target.parentNode.children].indexOf(target);
});
$container.addEventListener("dragover", (e) => {
    e.preventDefault();
    console.log('over');
});
$container.addEventListener("drop", (e) => {
    if (!isPlaying)
        return;
    const target = e.target;
    if (target.className !== dragged["class"]) {
        let originPlace;
        let isLast = false;
        if (dragged["el"]?.nextSibling)
            originPlace = dragged["el"].nextSibling;
        else {
            originPlace = dragged["el"]?.previousSibling;
            !isLast;
        }
        const droppedIndex = [...target.parentNode.children].indexOf(target);
        if (dragged["el"]) {
            dragged.index > droppedIndex ? target.before(dragged["el"]) : target.after(dragged["el"]);
            isLast ? originPlace.after(target) : originPlace.before(target);
        }
        ;
    }
    checkStatus();
});
$startButton.addEventListener('click', _ => {
    setGame();
});
$cheatButton.addEventListener('click', _ => {
    const childNodes = [...$container.children];
    if (!cheatState) {
        childNodes.forEach(el => {
            el.textContent = el.dataset.index || "";
        });
        $cheatButton.textContent = "👀 치트키 OFF";
    }
    if (cheatState) {
        childNodes.forEach((el) => {
            el.textContent = "";
        });
        $cheatButton.textContent = "👀 치트키 ON";
    }
    cheatState = !cheatState;
});
export {};
