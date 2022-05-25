const play = document.getElementById('playBtn');
const addWordBtn = document.getElementById('addWordBtn');
const saveWordBtn = document.getElementById('wordSave');
const backWordBtn = document.getElementById('wordBack');
const newGameBtn = document.getElementById('newGame');
const giveUpBtn = document.getElementById('giveUp');
const homePage = document.getElementById('home');
const addWordPage = document.getElementById('addWord');
const gamePage = document.getElementById('game');
const wordValue = document.getElementById('wordAdded');
const tipValue = document.getElementById('tipAdded');
const hangman = document.getElementById('hangman');
const hearts = document.getElementById('hearts');
const tipWord = document.getElementById('tip');
const wordBoard = document.getElementById('word');
const keysBoard = document.getElementById('keys');
const winBoard = document.getElementById('game-win');
const lostBoard = document.getElementById('game-lost');
const mobileKeyboard = document.getElementById('mobile-keyboard');

let lossCount = 0;
let winCount = 0;
let wordBackup = '';
let keyPressed = [];

// words array
const words = ['PEIXE', 'PUNHO', 'PROJETIL', 'PALITO', 'ELEFANTE', 'MILHO', 'RECIPIENTE', 'ADESIVO', 'NICOTINA', 'MINHOCA'];
const tips = ['ANIMAL', 'PARTE DO CORPO', 'ARMA DE FOGO', 'OBJETO', 'ANIMAL', 'ALIMENTO', 'OBJETO', 'COLA', 'SUBSTANCIA', 'ANIMAL'];

// home btns
// go to game page
play.addEventListener('click', () => {
    pageTo(homePage, gamePage);
    if(document.body.clientWidth > 1024){
        createBoard();
    }else {
        createBoardMobile();        
    }
})

// go to addword page
addWordBtn.addEventListener('click', () => {
    pageTo(homePage, addWordPage);
});


// add word btns
saveWordBtn.addEventListener('click', () => {
    const wordToArray = wordValue.value.toUpperCase().normalize('NFD').replace(/[^a-zA-Z/s]/g, '');
    const tipToArray = tipValue.value.toUpperCase().normalize('NFD').replace(/[^a-zA-Z\s]/g, '');    
    if(wordValue.value === '' || tipValue.value === ''){        
        alert('[ERRO] Caixa de texto vazia');
    }else if(words.includes(wordToArray)){
        alert('Já contem essa palavra');
    }else {
        words.push(wordToArray);
        tips.push(tipToArray);
        wordValue.value = 'Adicionado com sucesso';
        tipValue.value = 'Adicionado com sucesso';
        setTimeout(() => {
            wordValue.value = '';
            tipValue.value = '';
        }, 1000)
    }
});

backWordBtn.addEventListener('click', () => {
    pageTo(addWordPage, homePage);
})

// game btns

newGameBtn.addEventListener('click', () => {  
    if(document.body.clientWidth > 1024){
        createBoard();
    }else {
        createBoardMobile();        
    }
})

giveUpBtn.addEventListener('click', () => {
    pageTo(gamePage, homePage);
    document.removeEventListener('keydown', keyDownGame);
    winBoard.style.animation = 'hideResult 1s';
    lostBoard.style.animation = 'hideResult 1s';
    setTimeout(() => {
        winBoard.style.display = 'none';
        winBoard.style.transform = 'translateY(-500px)';
        lostBoard.style.display = 'none';
        lostBoard.style.transform = 'translateY(-500px)';
    }, 900);
})

// if(window.getComputedStyle(gamePage).getPropertyValue('display') === 'block'){
//     document.addEventListener('keydown', keyDownGame);
// }

// functions

function pageTo(pageFrom, pageTo) {
    pageFrom.style.animation = 'fadeOut .3s';
    setTimeout(() => {
        pageFrom.style.display = 'none';
        pageTo.style.display = 'block';
    }, 250);
    pageTo.style.animation = 'fadeIn .3s';
}

function keyDownGame(e) {
    const wordLength = document.querySelectorAll('.word div').length;
    if(e.keyCode >= 65 && e.keyCode <= 90 && !keyPressed.includes(e.key)){
        keyPressed.push(e.key);
        console.log(keyPressed);
        if(wordBackup.includes(e.key.toUpperCase())) {
            for(let i = 0; i < wordLength; i++){
                if(e.key.toUpperCase() === wordBoard.children[i].textContent){
                    wordBoard.children[i].classList.remove('word-disabled');
                    wordBoard.children[i].classList.add('word-enabled');
                    wordBoard.children[i].children[0].classList.add('active');
                    winCount++
                }
            }

            if(winCount === wordBackup.length) {
                win();
            }      
        } else {
            keysBoard.innerHTML += `<div class="key"><p>${e.key.toUpperCase()}</p></div>`
            lossCount++;          
            heartLoss(lossCount);
        }
    }
}

function createBoard() {
    document.addEventListener('keydown', keyDownGame);
    hangman.style.display = 'block';
    hangman.style.animation = 'ropeDown 1s';
    for(let i = 0; i < 6; i++) {
        hearts.children[i].src = './assets/heart.png';
    }
    lossCount = 0;
    winCount = 0;
    keyPressed = [];
    console.log(winCount);
    winBoard.style.animation = 'hideResult 1s';
    lostBoard.style.animation = 'hideResult 1s';
    setTimeout(() => {
        winBoard.style.display = 'none';
        winBoard.style.transform = 'translateY(-500px)';
        lostBoard.style.display = 'none';
        lostBoard.style.transform = 'translateY(-500px)';
    }, 900);
    tipWord.style.display = 'block';
    let randomId = Math.floor(Math.random() * words.length);
    tipWord.textContent = tips[randomId];
    let newWord = words[randomId];
    wordBackup = words[randomId];
    newWord = newWord.split('');
    console.log(newWord);
    wordBoard.innerHTML = '';
    for(let i = 0; i < newWord.length; i++) {
        wordBoard.innerHTML += `<div class="word-disabled"><p class="letter">${newWord[i]}</p></div>`;
    }
    keysBoard.innerHTML = '';
}

function keyDownGameMobile(e) {
    const wordLength = document.querySelectorAll('.word div').length;
    const buttonKeyboard = e.target;
    if(!keyPressed.includes(buttonKeyboard.textContent) && buttonKeyboard.classList.contains('key')){
        keyPressed.push(buttonKeyboard.textContent);
        console.log(buttonKeyboard.textContent);
        if(wordBackup.includes(buttonKeyboard.textContent.toUpperCase())) {
            for(let i = 0; i < wordLength; i++) {
                if(buttonKeyboard.textContent.toUpperCase() === wordBoard.children[i].textContent) {
                    wordBoard.children[i].classList.remove('word-disabled');
                    wordBoard.children[i].classList.add('word-enabled');
                    wordBoard.children[i].children[0].classList.add('active');
                    winCount++;
                }
            }
            buttonKeyboard.classList.remove('key');
            buttonKeyboard.classList.add('key-pressed');
            if(winCount === wordBackup.length) {
                win();
            }
        } else {
            buttonKeyboard.classList.remove('key');
            buttonKeyboard.classList.add('key-pressed');
            lossCount++;          
            heartLoss(lossCount);
        }
    }
}

function createBoardMobile() {
    document.querySelectorAll('.mobile-keyboard div').forEach(e => {
        if(e.classList.contains('key-pressed')){
            e.classList.remove('key-pressed');
            e.classList.add('key');
        }
    }) 
    mobileKeyboard.addEventListener('click', keyDownGameMobile);
    hangman.style.display = 'block';
    hangman.style.animation = 'ropeDown 1s';
    for(let i = 0; i < 6; i++) {
        hearts.children[i].src = './assets/heart.png';
    }
    lossCount = 0;
    winCount = 0;
    keyPressed = [];
    console.log(winCount);
    winBoard.style.animation = 'hideResult 1s';
    lostBoard.style.animation = 'hideResult 1s';
    setTimeout(() => {
        winBoard.style.display = 'none';
        winBoard.style.transform = 'translateY(-500px)';
        lostBoard.style.display = 'none';
        lostBoard.style.transform = 'translateY(-500px)';
    }, 900);
    tipWord.style.display = 'block';
    let randomId = Math.floor(Math.random() * words.length);
    tipWord.textContent = tips[randomId];
    let newWord = words[randomId];
    wordBackup = words[randomId];
    newWord = newWord.split('');
    console.log(newWord);
    wordBoard.innerHTML = '';
    for(let i = 0; i < newWord.length; i++) {
        wordBoard.innerHTML += `<div class="word-disabled"><p class="letter">${newWord[i]}</p></div>`;
    }
}

function heartLoss(points) {
    switch(points){
        case 1:
            hearts.children[5].src = './assets/heart-death6.gif';
            break;
        case 2:
            hearts.children[4].src = './assets/heart-death5.gif';
            break;
        case 3:
            hearts.children[3].src = './assets/heart-death4.gif';
            break;
        case 4:
            hearts.children[2].src = './assets/heart-death3.gif';
            break;
        case 5:
            hearts.children[1].src = './assets/heart-death2.gif';
            break;
        case 6:
            hearts.children[0].src = './assets/heart-death1.gif';
            lost();
            break;
    }
    console.log(points);
}

function win() {
    tipWord.style.display = 'none';
    hangman.style.animation = 'ropeUp 1s';
    winBoard.style.display = 'block';
    winBoard.style.animation = 'showResult 1s';
    document.removeEventListener('keydown', keyDownGame);
    document.removeEventListener('click', keyDownGameMobile);
    setTimeout(() => {
        hangman.style.display = 'none';
        winBoard.style.transform = 'translateY(0)';
    }, 900)
}

function lost() {
    tipWord.style.display = 'none';
    hangman.style.animation = 'ropeUp 1s';
    lostBoard.style.display = 'block';
    lostBoard.style.animation = 'showResult 1s';
    document.removeEventListener('keydown', keyDownGame);
    mobileKeyboard.removeEventListener('click', keyDownGameMobile);
    setTimeout(() => {
        hangman.style.display = 'none';
        lostBoard.style.transform = 'translateY(0)';
    }, 900)
}