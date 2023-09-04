const grid = document.querySelector('.grid');
const width = 15;
const resultsDisplay = document.querySelector("#results");

let shooterIndex= 202;
let direction = 1;
let invadersId;
let goingRight = true;
let aliensRemoved = [];
let results = 0;

for (let i = 0; i < 225; i++) {
    const square = document.createElement('div');
    grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll('.grid div'));

const alienInvaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]

function draw() {
    for(let i = 0; i < alienInvaders.length; i++) {
        if(!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add('invader');
        }
    }
}

draw();

function remove() {
    for(let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader');
    }
}

squares[shooterIndex].classList.add('shooter');

function moveShooter(e) {
    squares[shooterIndex].classList.remove('shooter');
    switch(e.key) {
        case 'ArrowLeft':
            if (shooterIndex % width !== 0) {
                shooterIndex --;
                break;
            }
        case 'ArrowRight':
            if (shooterIndex % width < width -1) {
                shooterIndex ++;
                break;
            }
        }
    squares[shooterIndex].classList.add('shooter');
}

document.addEventListener('keydown', moveShooter);

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length -1] % width === width -1;
    
    remove();

    if (rightEdge && goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1;
        }
        direction = -1;
        goingRight = false;        
    }
    
    if (leftEdge && !goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1;
        }
        direction = 1;
        goingRight = true;        
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction;
    }

    draw();
    
    if (squares[shooterIndex].classList.contains('invader', 'shooter')) {
        resultsDisplay.innerText = 'Game Over!';
        clearInterval(invadersId);
    }
    
    for (let j = 0; j < alienInvaders.length; j++) {
        if(alienInvaders[j] > (squares.length - 15)) {
            resultsDisplay.innerText = 'Game Over!';
            clearInterval(invadersId);
        }
    }
    
    if(aliensRemoved.length === alienInvaders.length) {
        resultsDisplay.innerText = 'Mission Success!';
        clearInterval(invadersId);
    }
}

invadersId = setInterval(moveInvaders, 300);

function shoot(e) {
    let laserId;
    let laserIndex = shooterIndex;
    function moveLaser() {
        squares[laserIndex].classList.remove('laser');
        laserIndex -= width;
        squares[laserIndex].classList.add('laser');
        
        if (squares[laserIndex].classList.contains('invader')) {
            squares[laserIndex].classList.remove('laser', 'invader');
            squares[laserIndex].classList.add('boom');
            
            setTimeout(() => squares[laserIndex].classList.remove('boom'),300);
            clearInterval(laserId);
            
            aliensRemoved.push(alienInvaders.indexOf(laserIndex));
            results++;
            resultsDisplay.innerHTML = results;
        }
        
        if (laserIndex < width) {
            setTimeout(() => squares[laserIndex].classList.remove('laser'),100);
            clearInterval(laserId);
        }
    }
    switch(e.key) {
        case 'ArrowUp':
            laserId = setInterval(moveLaser,100);
    }
}

document.addEventListener('keydown', shoot);