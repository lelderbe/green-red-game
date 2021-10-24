// querySelector, jQuery style
const $ = function (selector) {
    return document.querySelector(selector);
};

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

/*
 * Add a new block with id
 */
async function add(id) {
    // console.log('asked to add: ', id);
    const e = document.createElement('div');
    e.className = 'block';
    e.id = id;
    e.onclick = checkBlock;
    $('.blocks').appendChild(e);
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
            result += '❤️ ';
        case 3:
            result += '❤️ ';
        case 2:
            result += '❤️ ';
        case 1:
            result += '❤️ ';
    }
    $('#attempts').innerText = result;
}

function displayBlocks() {
    let result = '';
    // console.log('count:', count, ', level:', level, ', greens[level]:', greens[level]);
    for (let i = 0; i < count - greens[level] - (atmpts[level] - attempts); i++)
        result += '🍎 ';
    for (let i = 0; i < greens[level]; i++)
        result += '🍏 ';
    $('#level').innerText = result;
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
    await resetBlocks(); // setTimeout(() => resetBlocks(), 50);
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
function resetBlocks() {
    for (let i = 0; i < count; i++) {
        try {
            const e = document.getElementById('' + i);
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
            const e = document.getElementById('' + i);
            if (arr[i]) {
                e.style.backgroundColor = "green";
            } else {
                e.style.backgroundColor = "red";
            }
            e.onclick = null;
        } catch (ignore) {}
        i++;
    }
    $('.restart').style.visibility = "visible";
}

function checkBlock(e) {
    const id = e.target.id;
    const element = document.getElementById(id);
    if (!arr[id]) {
        wrong(element);
    } else {
        right(element);
    }
}

/*
 * Remove all blocks if there any
 */
async function clearBlocks() {
    if (count) {
        for (let i = 0; i < count; i++) {
            try {
                const e = document.getElementById('' + i);
                $('.blocks').removeChild(e);
            } catch (ignore) {
            }
        }
    }
}

async function init() {
    $('.restart').style.visibility = "hidden";
    await clearBlocks();
    arr = [];
    count = 0;
    attempts = 2;
    level = 1;
    arr[0] = Math.floor(Math.random() * 2);
    arr[1] = !arr[0];
    await add(0);
    await add(1);
    displayBlocks();
    displayAttempts();
}

// бэка нет - не шали ;)

             // 1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18  - count of blocks
const greens = [1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4]; // - count of green blocks for level
const atmpts = [2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4];

let arr;
let count;
let attempts;
let level;
init();
// console.log('arr:', arr, ', count:', count, ', level:', level, 'attempts:', attempts);
