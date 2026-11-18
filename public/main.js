document.getElementById('accept').addEventListener('click', async () => {
    const userid = document.getElementById('userid').value.trim();
    const passwd = document.getElementById('passwd').value;

    if (!userid || !passwd) {
        alert('Please enter both User ID and password.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userid, passwd })
        });

        const data = await response.json();
        alert(data.message);

        if (response.ok) {
            localStorage.setItem('currentUser', data.userid);
            window.location.href = 'mainfolder/main.html';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Could not connect to the backend server.');
    }
});
