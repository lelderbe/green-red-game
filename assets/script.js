const statsLivesElement = document.querySelector('.stats__lives');
const statsBlocksElement = document.querySelector('.stats__blocks');
const levelElement = document.querySelector('#level');
const bestLevelElement = document.querySelector('#best-level');
const blocksElement = document.querySelector('.blocks');
const restartBtn = document.querySelector('.restartBtn');

const GOOD_CLICK_DELAY = 200;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function updateStats() {
    const blocksCount = level + 1;

    const emptyLives = livesPerLevel[level] - lives;
    const livesAvailable = '<span class="stats-live_available">❤️</span>'.repeat(lives);
    const livesEmpty = '<span class="stats-live_empty">💔</span>'.repeat(emptyLives);
    statsLivesElement.innerHTML = livesAvailable + livesEmpty;

    const goodBlocksCount = goodBlocksPerLevel[level];
    const badBlocksCount = blocksCount - goodBlocksCount - (livesPerLevel[level] - lives);
    const emptyBlocksCount = blocksCount - badBlocksCount - goodBlocksCount;
    const emptyBlocks = '<div class="stats-block stats-block_bad stats-block_empty"></div>'.repeat(emptyBlocksCount);
    const badBlocks = '<div class="stats-block stats-block_bad"></div>'.repeat(badBlocksCount);
    const goodBlocks = '<div class="stats-block stats-block_good"></div>'.repeat(goodBlocksCount);
    statsBlocksElement.innerHTML = emptyBlocks + badBlocks + goodBlocks;

    levelElement.textContent = `${level} / ${livesPerLevel.length - 1}`;
    bestLevelElement.textContent = `${bestLevel}`; // TODO
}

// function resetBlocks() {
//     [...blocksElement.children].forEach((item) => {
//         item.style.removeProperty('background-color');
//         item.style.cursor = 'pointer';
//         item.onclick = checkBlock;
//     });
// }

function addBlock(id) {
    const block = document.createElement('div');
    block.classList.add('block');
    block.id = id;
    block.onclick = checkBlock;
    blocksElement.append(block);
}

function checkBlock(e) {
    const id = e.target.id;
    if (map[id] === 0) {
        handleWrongClick(e.target);
    } else {
        handleGoodClick(e.target);
    }
}

function handleWrongClick(block) {
    block.style.backgroundColor = 'red';
    block.style.cursor = 'unset';
    block.onclick = null;
    lives--;
    updateStats();
    if (!lives) {
        gameOver();
    }
}

async function handleGoodClick(block) {
    block.style.backgroundColor = 'green';
    await sleep(GOOD_CLICK_DELAY);
    bestLevel = bestLevel > level ? bestLevel : level;
    localStorage.setItem('best-level', bestLevel);
    level++;
    initLevel(level);
}

function gameOver() {
    [...blocksElement.children].forEach((item) => {
        item.style.backgroundColor = map[item.id] ? 'green' : 'red';
        item.style.cursor = 'unset';
        item.onclick = null;
    });
    restartBtn.style.visibility = 'visible';
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // случайный индекс от 0 до i
        const j = Math.floor(Math.random() * (i + 1));
        // поменять элементы местами
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateMap(level) {
    const blocksCount = level + 1;
    const goodBlocksCount = goodBlocksPerLevel[level];
    const badBlocksCount = blocksCount - goodBlocksCount;

    const map = [...Array(goodBlocksCount).fill(1), ...Array(badBlocksCount).fill(0)];
    // console.log('map:', map);
    shuffle(map);
    // console.log('shuffled map:', map);
    return map;
}

function checkMapShuffling(level) {
    frequencyMap = {};
    generatesCount = 1000;

    for (let i = 0; i < generatesCount; i++) {
        let array = generateMap(level);
        shuffle(array);
        let key = array.join('');
        if (!frequencyMap[key]) {
            frequencyMap[key] = 0;
        }
        frequencyMap[key]++;
    }

    // показать количество всех возможных вариантов
    for (let key in frequencyMap) {
        console.log(`${key}: ${frequencyMap[key]} (${(frequencyMap[key] * 100) / generatesCount}%)`);
    }
}

function initGame() {
    // hide restart button
    restartBtn.style.visibility = 'hidden';
    level = 1;
    initLevel(level);
}

function initLevel(level) {
    const needBlocksCount = level + 1;

    // remove old blocks
    blocksElement.innerHTML = '';

    // generate map
    map = generateMap(level);

    // set lives
    lives = livesPerLevel[level];

    // add blocks
    for (let i = 0; i < needBlocksCount; i++) {
        addBlock(i);
    }

    updateStats();
}

//......................... 1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18  - count of blocks
const goodBlocksPerLevel = [0, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4]; // - count of green blocks for level
const livesPerLevel = [0, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4];

let map;
let level;
let lives;
let bestLevel = Number(localStorage.getItem('best-level')) || 0;
initGame();

// checkMapShuffling(4);
