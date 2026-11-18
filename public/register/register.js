document.getElementById('accept').addEventListener('click', async () => {
    const userid = document.getElementById('userid').value.trim();
    const passwd = document.getElementById('passwd').value;
    const confirmPasswd = document.getElementById('confirm-passwd').value;

    if (!userid || !passwd) {
        alert('Please fill in all fields.');
        return;
    }

    if (passwd !== confirmPasswd) {
        alert('Passwords do not match!');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userid, passwd })
        });

        const data = await response.json();
        alert(data.message);

        if (response.ok) {
            document.getElementById('userid').value = '';
            document.getElementById('passwd').value = '';
            document.getElementById('confirm-passwd').value = '';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Could not connect to the backend server.');
    }
});
