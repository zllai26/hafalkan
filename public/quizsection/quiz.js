const userid = localStorage.getItem('currentUser');
let words = []; 
let currentIndex = 0;

if (!userid) {
    alert('Please log in first!');
    window.location.href = '../index.html';
}

function back() {
    window.location.href = '../mainfolder/main.html';
}

async function getRandomWords() {
    try {
        const response = await fetch(`http://localhost:3000/quiz/${userid}`);
        
        if (!response.ok) {
            alert('Failed to load quiz words.');
            return;
        }

        words = await response.json();

        if (words.length === 0) {
            alert('You have no saved words yet!');
            return;
        }

        currentIndex = 0;
        document.getElementById('vocab').textContent = words[currentIndex].vocab;
    } catch (error) {
        console.error('Error:', error);
        alert('Could not connect to the backend server.');
    }
}


function check() {
    const userInput = document.getElementById('trans').value.trim().toLowerCase();
    const correctAnswer = words[currentIndex].trans.trim().toLowerCase();
    

    if (userInput === correctAnswer) {
        alert('You got this correct');
    }
    else {
        alert(`You got this wrong. The answer is ${words[currentIndex].trans}`);
    }
    currentIndex++;
    document.getElementById('trans').value=("");
    if (currentIndex < words.length) {
        document.getElementById('vocab').textContent = words[currentIndex].vocab;
        document.getElementById('answer-input').value = '';
    } else {
        alert('Quiz complete! Go back to mainpage to add more vocabs');
    }
}

getRandomWords();
