const textDisplay = document.querySelector('#textDisplay');
const typingArea = document.querySelector('#typingArea');
const timerDisplay = document.querySelector('#timer');
const wpmDisplay = document.querySelector('#wpm');
const accuracyDisplay = document.querySelector('#accuracy');
const bestWPMDisplay = document.querySelector('#bestWPM');
const startBtn = document.querySelector('#startBtn');
const resetBtn = document.querySelector('#resetBtn');
const audios = document.querySelector('audio');
const timeBtn1 = document.querySelector('.btnn');
const timeBtn2 = document.querySelector('.btnm');
const timeBtn3 = document.querySelector('.btno');

// Neon Colors
const NEON_RED = "#ff0055";
const NEON_GREEN = "#00ff9d";
const NEON_GREY = "#333";
const NEON_BORDER_RED = "2px solid #ff0055";
const NEON_BORDER_GREEN = "2px solid #00ff9d";
const NEON_BORDER_GREY = "2px solid #333";

// test texts

const testTexts = [
"The quick brown fox jumps over the lazy dog. Practice makes perfect when learning to type faster.",
"Technology has revolutionized the way we communicate and work in the modern digital era ." ,
"Typing speed is an essential skill for anyone working with computers in today's workplace."
];

let currentText ='';
let timeleft = 60;
let timerInterval = null;
let startTime = null;
let isTestActive =false;
let bestWPM = 0;



function webLoad(){
 onLoad();
 displayContent();
 // Initialize buttons with neon red (default state in original logic was red)
 timeBtn1.style.borderColor = NEON_RED;
 timeBtn1.style.color = NEON_RED;
 timeBtn2.style.borderColor = NEON_RED;
 timeBtn2.style.color = NEON_RED;
 timeBtn3.style.borderColor = NEON_RED;
 timeBtn3.style.color = NEON_RED;
}

function onLoad() {
    const temp = sessionStorage.getItem('previouswpm');
    if (temp !== null) {
        bestWPM = parseInt(temp, 10);
    } else {
        bestWPM = 0;
    }
}

function displayContent(){
timerDisplay.textContent = timeleft;
 bestWPMDisplay.textContent = bestWPM;
}

 webLoad();

 function endGame(){
    clearInterval(timerInterval);
    startBtn.disabled = true;
    audios.pause();
    // stop typing input and reset
    typingArea.value = "";
    typingArea.disabled = true;
    timeleft = 60;
    timeBtn1.disabled=false;
    timeBtn2.disabled=false;
    timeBtn3.disabled=false;
    
    // Reset buttons to initial neon state
    timeBtn1.style.backgroundColor = "transparent";
    timeBtn1.style.border = NEON_BORDER_RED;
    timeBtn1.style.color = NEON_RED;
    
    timeBtn2.style.backgroundColor = "transparent";
    timeBtn2.style.border = NEON_BORDER_RED;
    timeBtn2.style.color = NEON_RED;
    
    timeBtn3.style.backgroundColor = "transparent";
    timeBtn3.style.border = NEON_BORDER_RED;
    timeBtn3.style.color = NEON_RED;

    // update best WPM from displayed value
    const finalWPM = parseInt(wpmDisplay.textContent, 10) || 0;
    if(finalWPM > bestWPM){
        bestWPM = finalWPM;
        sessionStorage.setItem('previouswpm', bestWPM);
    }
    startTime = null;
    wpmDisplay.textContent = 0;
    accuracyDisplay.textContent = '0';
    displayContent();
 }

 function startGame(){
    if (typeof timeleft !== 'number' || timeleft <= 0) {
        timeleft = 60;
    }
    clearInterval(timerInterval);
    startBtn.disabled = true;                                                                                                                                                                                                                           
    currentText = testTexts[Math.floor(Math.random()*testTexts.length)];
    // console.log(currentText);
    audios.play();
    textDisplay.textContent = currentText;
    
    typingArea.disabled = false;
    typingArea.value = "";
    typingArea.focus();
    typingArea.setAttribute('placeholder', 'Start typing...');
    // reset start time hota hai
    startTime = null;
    timerInterval = setInterval(function(){
        // decrement the remaining time each second
        timeleft--;

        if(timeleft === 30)
        {
            audios.play();
        }
    
    
        if(timeleft <= 15){
            timeBtn2.disabled = true;
            timeBtn2.style.backgroundColor = "transparent";
            timeBtn2.style.borderColor = NEON_GREY;
            timeBtn2.style.color = NEON_GREY;
            
            timeBtn3.disabled = true;
            timeBtn3.style.backgroundColor = "transparent";
            timeBtn3.style.borderColor = NEON_GREY;
            timeBtn3.style.color = NEON_GREY;
        }
         if(timeleft <= 30 && timeleft > 15){
            timeBtn1.disabled = true;
            timeBtn1.style.backgroundColor = "transparent";
            timeBtn1.style.borderColor = NEON_GREY;
            timeBtn1.style.color = NEON_GREY;
            
            timeBtn3.disabled = true;
            timeBtn3.style.backgroundColor = "transparent";
            timeBtn3.style.borderColor = NEON_GREY;
            timeBtn3.style.color = NEON_GREY;
        }
         if(timeleft <= 60 && timeleft >30){
            timeBtn2.disabled = true;
            timeBtn2.style.backgroundColor = "transparent";
            timeBtn2.style.borderColor = NEON_GREY;
            timeBtn2.style.color = NEON_GREY;
            
            timeBtn1.disabled = true;
            timeBtn1.style.backgroundColor = "transparent";
            timeBtn1.style.borderColor = NEON_GREY;
            timeBtn1.style.color = NEON_GREY;
        }
        if(timeleft <= 0){
            endGame();
            return;
        }
        displayContent();
    },1000);
 }
  function typeControl(){
    if(startTime == null){
        startTime = Date.now();
    }
    // console.log(startTime);
    updateStatus();
    highlight();
 }
 function updateStatus(){
    var textContent = typingArea.value;
    const word = textContent.trim().split(/\s+/).filter(w => w.length > 0);
    if (startTime == null) {
        wpmDisplay.textContent = 0;
        accuracyDisplay.textContent = '0';
        return;
    }
    // if(wpm > 5){
    //     wpmDisplay.style.color ="red";
    // }
    
    // Logic for accuracy color change if needed, but CSS handles standard text color
    // We can add glow effect here if we want dynamic changes
    
    const elapsedTime = (Date.now() - startTime)/(1000*60);
    const wpm = elapsedTime > 0 ? Math.floor(word.length / elapsedTime): 0;
    wpmDisplay.textContent = wpm;

    var currentScore = 0;
    for(var i = 0; i < textContent.length && i < currentText.length; i++){
        if(textContent[i] === currentText[i]){
            currentScore++;
        }
    }
    const accuracy = (textContent.length > 0) ? Math.floor((currentScore / textContent.length) * 100) : 100;
    accuracyDisplay.textContent = accuracy + '%';
    
    if(accuracy === 100){
        accuracyDisplay.style.color = NEON_GREEN;
        accuracyDisplay.style.textShadow = `0 0 10px ${NEON_GREEN}`;
    } else {
        accuracyDisplay.style.color = NEON_RED; // Or default neon pink/white
        accuracyDisplay.style.textShadow = `0 0 10px ${NEON_RED}`;
    }
 }

 function highlight(){
    var typed = typingArea.value;
    var highlightText = "";
    for(let i=0; i<currentText.length; i++){
        if(i < typed.length){
            if(currentText[i] === typed[i]){
                highlightText+= `<span class="correct">${currentText[i]}</span>`;
            }
            else{
                highlightText+= `<span class="incorrect">${currentText[i]}</span>`;
            }
        }
        else{
            highlightText += currentText[i];
        }
    }
    textDisplay.innerHTML = highlightText;
 }
// function songs() {
//     if(accuracy.accuracyDisplay >= 90){
//       songs.style.display ='block';
//     }
// }
function btns1(){
    startBtn.disabled =false;
    clearInterval(timerInterval);
    
    // Active button: Neon Green
    timeBtn1.style.backgroundColor = "rgba(0, 255, 157, 0.1)"; // Slight fill
    timeBtn1.style.border = NEON_BORDER_GREEN;
    timeBtn1.style.color = NEON_GREEN;
    timeBtn1.style.boxShadow = `0 0 15px ${NEON_GREEN}`;
    
    // Inactive buttons: Neon pink/red (or default theme color)
    timeBtn2.style.border = NEON_BORDER_RED;
    timeBtn2.style.backgroundColor = "transparent";
    timeBtn2.style.color = NEON_RED;
    timeBtn2.style.boxShadow = "none";
    
    timeBtn3.style.border = NEON_BORDER_RED;
    timeBtn3.style.backgroundColor = "transparent";
    timeBtn3.style.color = NEON_RED;
    timeBtn3.style.boxShadow = "none";
    
    timeleft = 15;
     startTime = null;
    typingArea.value = "";
    typingArea.disabled = true;
    wpmDisplay.textContent = 0;
    bestWPM = 0;
    accuracyDisplay.textContent = 100 + '%';
    displayContent();
}
function btns2(){
    startBtn.disabled =false;
    clearInterval(timerInterval);
    
    timeBtn2.style.backgroundColor = "rgba(0, 255, 157, 0.1)";
    timeBtn2.style.border = NEON_BORDER_GREEN;
    timeBtn2.style.color = NEON_GREEN;
    timeBtn2.style.boxShadow = `0 0 15px ${NEON_GREEN}`;
    
    timeBtn1.style.backgroundColor = "transparent";
    timeBtn1.style.border = NEON_BORDER_RED;
    timeBtn1.style.color = NEON_RED;
    timeBtn1.style.boxShadow = "none";
    
    timeBtn3.style.border = NEON_BORDER_RED;
    timeBtn3.style.backgroundColor = "transparent";
    timeBtn3.style.color = NEON_RED;
    timeBtn3.style.boxShadow = "none";
    
    timeleft = 30;
     startTime = null;
    typingArea.value = "";
    typingArea.disabled = true;
    wpmDisplay.textContent = 0;
    bestWPM = 0;
    accuracyDisplay.textContent = 100 + '%';
    displayContent();
}
function btns3(){
    startBtn.disabled =false;
    clearInterval(timerInterval);
    
    timeBtn3.style.backgroundColor = "rgba(0, 255, 157, 0.1)";
    timeBtn3.style.border = NEON_BORDER_GREEN;
    timeBtn3.style.color = NEON_GREEN;
    timeBtn3.style.boxShadow = `0 0 15px ${NEON_GREEN}`;
    
    timeBtn2.style.backgroundColor = "transparent";
    timeBtn2.style.border = NEON_BORDER_RED;
    timeBtn2.style.color = NEON_RED;
    timeBtn2.style.boxShadow = "none";
    
    timeBtn1.style.backgroundColor = "transparent";
    timeBtn1.style.border = NEON_BORDER_RED;
    timeBtn1.style.color = NEON_RED;
    timeBtn1.style.boxShadow = "none";
    
    timeleft = 60;
     startTime = null;
    typingArea.value = "";
    typingArea.disabled = true;
    wpmDisplay.textContent = 0;
    bestWPM = 0;
    accuracyDisplay.textContent = 100 + '%';
    displayContent();
}
 
function resetGame(){
    clearInterval(timerInterval);
    timeleft = 60;
    startTime = null;
    typingArea.value = "";
    typingArea.disabled = true;
    startBtn.disabled = true;
    timeBtn1.disabled = false;
    timeBtn2.disabled = false;
    timeBtn3.disabled = false;
    wpmDisplay.textContent = 0;
    
    // Reset buttons to initial state (Neon red outlines)
    timeBtn1.style.backgroundColor = "transparent";
    timeBtn1.style.borderColor = NEON_RED;
    timeBtn1.style.color = NEON_RED;
    timeBtn1.style.boxShadow = "none";
    
    timeBtn2.style.backgroundColor = "transparent";
    timeBtn2.style.borderColor = NEON_RED;
    timeBtn2.style.color = NEON_RED;
    timeBtn2.style.boxShadow = "none";
    
    timeBtn3.style.backgroundColor = "transparent";
    timeBtn3.style.borderColor = NEON_RED;
    timeBtn3.style.color = NEON_RED;
    timeBtn3.style.boxShadow = "none";
    
    // bestWPMDisplay.textContent = 0;
    bestWPM = 0;
    accuracyDisplay.textContent = 100 + '%';
    accuracyDisplay.style.color = ""; // Reset to default
    accuracyDisplay.style.textShadow = "";
    displayContent();
}


 startBtn.addEventListener('click', startGame);

 typingArea.addEventListener('input', typeControl);
 resetBtn.addEventListener('click',resetGame);
 timeBtn1.addEventListener('click',btns1);
 timeBtn2.addEventListener('click',btns2);
 timeBtn3.addEventListener('click',btns3);

