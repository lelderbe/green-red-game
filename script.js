
// querySelector, jQuery style
const $ = function (selector) {
    return document.querySelector(selector);
};

async function add(id) {
    console.log('ask to add: ', id);
    const e = document.createElement('div');
    e.className = 'item';
    e.id = id;
    e.onclick = choosed;

    // Append it and attach the event (via onclick)
    $('.items').appendChild(e);
    // li.onclick = dynamicEvent;
    count++;
    // lives = 2;
    // displayAttempts();
}

async function shuffle(level) {
                 // 1  2  3  4  5  6  7  8  9
    const greens = [1, 1, 1, 2, 2, 3, 3, 3, 3];
    let left = greens[level];
    if (left > count)
        return ;
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
    switch (lives) {
        case 2:
            result += '❤️';
        case 1:
            result += '❤️';
    }
    document.getElementById('attempts').innerText = result;
}

function displayBlocks() {
    let result = '';
    console.log('count:', count, ', level:', level, ', greens[level]:', greens[level]);
    for (let i = 0; i < count - greens[level] - (2 - lives); i++)
        result += '🍎 ';
    for (let i = 0; i < greens[level]; i++)
        result += '🍏 ';
    document.getElementById('level').innerText = result;
    // document.getElementById('level').innerText = 'Ты на уровне: ' + level;
    console.log('end of displayBlocks');
}

function wrong(e) {
    e.style.backgroundColor = "red";
    e.onclick = null;
    lives--;
    displayAttempts();
    displayBlocks();
    console.log('lives:', lives);
    if (!lives) {
        endGame();
    }
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function right(e) {
    e.style.backgroundColor = "green";
    await sleep(50);
    await resetItems();
    await add(count);
    // setTimeout(() => resetItems(), 50);
    // setTimeout(() => add(count), 60);
    level++;
    lives = 2;
    await shuffle(level);
    displayAttempts();
    displayBlocks();
}

function resetItems() {
    let i = 0;
    while (i < count) {
        try {
            const e = document.getElementById(i);
            // console.log('reset element:', i, ', elem:', e);
            e.style.removeProperty('background-color');
            e.onclick = choosed;
        } catch (e) {
            // console.log('caught:', e);
        }
        i++;
    }
}

function endGame() {
    let i = 0;
    while (i < count) {
        try {
            const e = document.getElementById(i);
            console.log('end game element:', i, ', elem:', e);
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

function choosed(e) {
    // console.log('clicked:', e);
    const id = e.target.id;
    // console.log('from id:', e.target.id);
    const item = document.getElementById(id);
    console.log('arr[id]:', arr[id]);
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
    console.log('after add[0]');
    await add(1);
    console.log('after add[1]');
    displayBlocks();
    console.log('after displayBlocks');
    displayAttempts();
    console.log('after displayAttempts');
}

             // 1  2  3  4  5  6  7  8  9   - count of blocks
const greens = [1, 1, 1, 2, 2, 3, 3, 3, 3]; // - count of green blocks for level

let arr = [];
let count = 0;
let lives = 2;
// console.log('before init arr:', arr, ', count:', count, 'lives:', lives);
let level = 1;
init();
// document.getElementById('level').innerText = 'Ты на уровне: ' + level;
// document.getElementById('level').innerText = 'Level: ' + level;
// $('level').innerText = 'Level: ' + level;
console.log('after init arr:', arr, ', count:', count, ', level:', level, 'lives:', lives);
