const hiddenInput = document.getElementById('hiddenInput');
const mouseBox = document.getElementById('mouseBox');
const mouseScroll = document.getElementById('mouse3');
const leftClicker = document.getElementById('mouse1');
const rightClicker = document.getElementById('mouse2');

hiddenInput.focus();

const socket = io();

mouseBox.style.width = window.innerWidth + 'px';
mouseBox.style.height = ((window.innerWidth / 16) * 9) + 'px';

hiddenInput.addEventListener('keydown', (event) => {
    hiddenInput.value = '';
    if (event.key === 'Enter' || event.key === 'Backspace' || event.key.length === 1) {
        socket.emit('key', event.key);
        console.log(event.key);
    } else if (event.key === 'Process') {
        console.warn('This utility does not support the Process key (229). Try changing keyboards if this affects typing.');
    }
});

leftClicker.addEventListener('click', (event) => {
    socket.emit('click', 'left');
});

rightClicker.addEventListener('click', (event) => {
    socket.emit('click', 'right');
});

mouseBox.addEventListener('touchstart', handleTouchStart, false);
mouseBox.addEventListener('touchmove', handleTouchMove, false);

mouseScroll.addEventListener('touchstart', handleTouchStartScroll, false);
mouseScroll.addEventListener('touchmove', handleTouchMoveScroll, false);

let xDown = null;                                                        
let yDown = null;
let scrollDown = null;

function getTouches(evt) {
    return evt.touches || evt.originalEvent.touches;
}                                                     

function handleTouchStart(evt) {                                         
    xDown = getTouches(evt)[0].clientX;                                      
    yDown = getTouches(evt)[0].clientY;                                      
};                                                

function handleTouchStartScroll(evt) {                                  
    scrollDown = getTouches(evt)[0].clientY;                                      
};   

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    const xUp = evt.touches[0].clientX;                                    
    const yUp = evt.touches[0].clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;
    
    socket.emit('touchPadPos', {x: xDiff, y: yDiff});

    xDown = xUp;
    yDown = yUp;
}

function handleTouchMoveScroll(evt) {
    if (!scrollDown) {
        return;
    }
                                
    const scrollUp = evt.touches[0].clientY;

    const yDiff = scrollDown - scrollUp;
    
    socket.emit('scrollPos', yDiff * 0.75);

    scrollDown = scrollUp;
}