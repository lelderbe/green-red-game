function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

/*
 * Add a new block with id
 */
async function add(id) {
    // querySelector, jQuery style
    const $ = function (selector) {
        return document.querySelector(selector);
    };

    // console.log('asked to add: ', id);
    const e = document.createElement('div');
    e.className = 'item';
    e.id = id;
    e.onclick = checkBlock;
    $('.items').appendChild(e);
    count++;
}

async function shuffle(level) {
    let left = greens[level];
    if (left > count)
        return ;    // shouldn't happen
    arr = [];
    for (let i = 0; i < count; i++)
        arr.push(0);
    while (left) {
        let cell = Math.floor(Math.random() * count);
        if (!arr[cell]) {
            arr[cell] = 1;
            left--;
        }
    }
}

function displayAttempts() {
    let result = '';
    switch (attempts) {
        case 4:
            result += '❤️';
        case 3:
            result += '❤️';
        case 2:
            result += '❤️';
        case 1:
            result += '❤️';
    }
    document.getElementById('attempts').innerText = result;
}

function displayBlocks() {
    let result = '';
    // console.log('count:', count, ', level:', level, ', greens[level]:', greens[level]);
    for (let i = 0; i < count - greens[level] - (atmpts[level] - attempts); i++)
        result += '🍎 ';
    for (let i = 0; i < greens[level]; i++)
        result += '🍏 ';
    document.getElementById('level').innerText = result;
}

/*
 * Wrong try
 */
function wrong(e) {
    e.style.backgroundColor = "red";
    e.onclick = null;
    attempts--;
    displayAttempts();
    displayBlocks();
    if (!attempts) {
        gameOver();
    }
}

/*
 * Good try - you got lucky!
 */
async function right(e) {
    e.style.backgroundColor = "green";
    await sleep(50);
    await resetItems(); // setTimeout(() => resetItems(), 50);
    await add(count); // setTimeout(() => add(count), 60);
    level++;
    attempts = atmpts[level];
    await shuffle(level);
    displayAttempts();
    displayBlocks();
}

/*
 * Reset all blocks: remove background color, restore clicks
 */
function resetItems() {
    for (let i = 0; i < count; i++) {
        try {
            const e = document.getElementById(i);
            // console.log('reset element:', i, ', elem:', e);
            e.style.removeProperty('background-color');
            e.onclick = checkBlock;
        } catch (ignore) {}
    }
}

/*
 * Show all blocks, disable clicks
 */
function gameOver() {
    let i = 0;
    while (i < count) {
        try {
            const e = document.getElementById(i);
            // console.log('game over element:', i, ', elem:', e);
            if (arr[i]) {
                e.style.backgroundColor = "green";
            } else {
                e.style.backgroundColor = "red";
            }
            e.onclick = null;
        } catch (e) {
            console.log('caught:', e);
        }
        i++;
    }
}

function checkBlock(e) {
    const id = e.target.id;
    const item = document.getElementById(id);
    if (!arr[id]) {
        wrong(item);
    } else {
        right(item);
    }
}

async function init() {
    arr[0] = Math.floor(Math.random() * 2);
    arr[1] = !arr[0];
    await add(0);
    await add(1);
    displayBlocks();
    displayAttempts();
}

             // 1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18  - count of blocks
const greens = [1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4]; // - count of green blocks for level
const atmpts = [2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4];

let arr = [];
let count = 0;
let attempts = 2;
let level = 1;
init();
// console.log('arr:', arr, ', count:', count, ', level:', level, 'attempts:', attempts);
