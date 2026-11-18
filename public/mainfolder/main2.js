quizbutton = document.getElementById('quizbutton');
vocab1 = document.getElementById('vocab');
vocab2 = document.getElementById('trans');

function quiz() {
   window.location.href = '../quizsection/quiz.html';
}

const userid = localStorage.getItem('currentUser');

if (!userid) {
    alert('Please log in first!');
    window.location.href = 'index.html';
}

async function save() {
    const userid = localStorage.getItem('currentUser');
    const vocab = document.getElementById('vocab').value.trim();
    const trans = document.getElementById('trans').value.trim();

    if (!userid) {
        alert('You are not logged in!');
        window.location.href = 'index.html';
        return;
    }

    if (!vocab || !trans) {
        alert('Please fill in both Vocabulary and Translation.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/main', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userid, vocab, trans })
        });

        const data = await response.json();
        alert(data.message);

        if (response.ok) {
            document.getElementById('vocab').value = '';
            document.getElementById('trans').value = '';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Could not connect to the backend server.');
    }
}
