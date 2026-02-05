const board = document.getElementById('game-board');
const levelDisplay = document.getElementById('level-display');
const scoreDisplay = document.getElementById('score-display');
const puntosDisplay = document.getElementById('puntos-display');
const livesDisplay = document.getElementById('lives-display');
const timerDisplay = document.getElementById('timer');
const resetBtn = document.getElementById('reset-btn');
const aviso = document.getElementById('mensaje-flotante');

let flippedCards = [];
let matchedCount = 0;
let level = 1;
let score = 100;
let totalPuntos = 0;
let lives = 3;
let seconds = 0;
let gameSpeed = 1500; 
let posicionesVistas = new Set();

function initGame() {
    matchedCount = 0;
    flippedCards = [];
    posicionesVistas.clear();
    let allIds = Array.from({length: 108}, (_, i) => i + 1);
    let selected = allIds.sort(() => Math.random() - 0.5).slice(0, 15);
    let deck = [...selected, ...selected].sort(() => Math.random() - 0.5);

    board.innerHTML = '';
    deck.forEach((id, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = id;
        card.dataset.index = index;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back"><img src="imagenes/${id}.png"></div>
            </div>`;
        card.addEventListener('click', () => flipCard(card));
        board.appendChild(card);
    });
}

function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains('flipped') && lives > 0) {
        card.classList.add('flipped');
        flippedCards.push(card);
        new Audio(`audio/${card.dataset.id}.mp3`).play().catch(() => {});
        if (flippedCards.length === 2) checkMatch();
    }
}

function checkMatch() {
    const [c1, c2] = flippedCards;
    const p1YaVista = posicionesVistas.has(c1.dataset.index);
    const p2YaVista = posicionesVistas.has(c2.dataset.index);

    if (c1.dataset.id === c2.dataset.id) {
        totalPuntos += 10;
        score = Math.min(100, score + 5);
        matchedCount += 2;
        flippedCards = [];
        posicionesVistas.add(c1.dataset.index);
        posicionesVistas.add(c2.dataset.index);
        actualizarInterfaz();
        if (matchedCount === 30) setTimeout(victory, 600);
    } else {
        if (p1YaVista || p2YaVista) {
            score -= 10;
            aviso.innerText = "¡YA LA HABÍAS VISTO!";
            setTimeout(() => aviso.innerText = "", 1000);
        }
        posicionesVistas.add(c1.dataset.index);
        posicionesVistas.add(c2.dataset.index);
        actualizarInterfaz();
        if (score <= 0) {
            perderVida();
        } else {
            setTimeout(() => {
                c1.classList.remove('flipped');
                c2.classList.remove('flipped');
                flippedCards = [];
            }, Math.max(400, gameSpeed));
        }
    }
}

function perderVida() {
    lives--;
    if (lives > 0) {
        alert("PERDISTE UNA VIDA.");
        score = 100;
        flippedCards.forEach(c => c.classList.remove('flipped'));
        flippedCards = [];
        actualizarInterfaz();
    } else {
        alert("GAME OVER. Puntaje: " + totalPuntos);
        resetTotal();
    }
}

function victory() {
    confetti({ particleCount: 200, spread: 90 });
    totalPuntos += 50;
    level++;
    gameSpeed = (level < 4) ? gameSpeed * 0.7 : 450;
    actualizarInterfaz();
    alert("¡Nivel superado!");
    initGame();
}

function actualizarInterfaz() {
    levelDisplay.innerText = level;
    scoreDisplay.innerText = score;
    puntosDisplay.innerText = totalPuntos;
    livesDisplay.innerText = "❤️".repeat(lives);
}

function resetTotal() {
    level = 1; score = 100; lives = 3; gameSpeed = 1500; seconds = 0; totalPuntos = 0;
    actualizarInterfaz(); initGame();
}

setInterval(() => { if(lives > 0) { seconds++; timerDisplay.innerText = seconds + "s"; } }, 1000);
resetBtn.addEventListener('click', resetTotal);
initGame();
actualizarInterfaz();