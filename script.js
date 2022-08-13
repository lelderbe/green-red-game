// querySelector, jQuery style
const $ = function (selector) {
    return document.querySelector(selector);
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function displayCaption() {
    document.querySelector('#attempts').innerText = '❤️ '.repeat(attempts);
    const reds = '🍎 '.repeat(countOfBlocks - greensPerLevel[level] - (attemptsPerLevel[level] - attempts));
    const greens = '🍏 '.repeat(greensPerLevel[level]);
    document.querySelector('#level').innerText = reds + greens;
}

function resetBlocks() {
    document.querySelectorAll('.block').forEach((item) => {
        item.style.removeProperty('background-color');
        item.style.cursor = 'pointer';
        item.onclick = checkBlock;
    });
}

function addBlock(id) {
    const block = document.createElement('div');
    block.classList.add('block');
    block.id = id;
    block.onclick = checkBlock;
    document.querySelector('.blocks').append(block);
    countOfBlocks++;
}

function removeBlocks() {
    document.querySelectorAll('.block').forEach((item) => item.remove());
}

function checkBlock(e) {
    const id = e.target.id;
    const block = document.getElementById(id);
    if (!arr[id]) {
        wrong(block);
    } else {
        right(block);
    }
}

function wrong(block) {
    block.style.backgroundColor = 'red';
    block.style.cursor = 'unset';
    block.onclick = null;
    attempts--;
    displayCaption();
    if (!attempts) {
        gameOver();
    }
}

async function right(block) {
    block.style.backgroundColor = 'green';
    await sleep(50);
    resetBlocks();
    addBlock(countOfBlocks);
    level++;
    attempts = attemptsPerLevel[level];
    displayCaption();
    arr = generateMap(level);
}

function gameOver() {
    document.querySelectorAll('.block').forEach((item) => {
        item.style.backgroundColor = arr[item.id] ? 'green' : 'red';
        item.style.cursor = 'unset';
        item.onclick = null;
    });
    document.querySelector('.restartBtn').style.visibility = 'visible';
}

function generateMap(level) {
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            // случайный индекс от 0 до i
            const j = Math.floor(Math.random() * (i + 1)); 
            // поменять элементы местами
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    const array = [
        ...Array(greensPerLevel[level]).fill(1),
        ...Array(level - greensPerLevel[level] + 1).fill(0),
    ];
    console.log('array:', array);
    shuffle(array);
    console.log('shuffled array:', array);
    return array;
}

async function init() {
    document.querySelector('.restartBtn').style.visibility = 'hidden';
    removeBlocks();
    countOfBlocks = 0;
    level = 1;
    attempts = 2;
    arr = generateMap(level);
    addBlock(countOfBlocks);
    addBlock(countOfBlocks);
    displayCaption();
}

                     // 1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18  - count of blocks
const greensPerLevel = [1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4]; // - count of green blocks for level
const attemptsPerLevel = [2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4];

// const game = {
//     level: 1,
//     greensPerLevel: [1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4],
//     attemptsPerLevel: [2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4],

//     init: function () {
//         this.level = 1;
//         $('.restartBtn').style.visibility = "hidden";
//         await removeBlocks();
//         count = 0;
//         attempts = 2;
//         level = 1;
//         arr = generateMap(level);
//         await addBlock(0);
//         await addBlock(1);
//         displayCaption();
//     }
// };

// game.init();

let arr;
let countOfBlocks;
let attempts;
let level;
init();
// console.log('arr:', arr, ', countOfBlocks:', countOfBlocks, ', level:', level, 'attempts:', attempts);
