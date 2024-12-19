document.getElementById('ipForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const ipInput = document.getElementById('ipInput').value;
    const responseDiv = document.getElementById('response');

    try {
        const response = await fetch('http://localhost:3000/send-ip', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ip: ipInput }),
        });

        if (response.ok) {
            const data = await response.json();
            responseDiv.innerHTML = `<p style="color: green;">IP enviada correctamente: ${data.ip}</p>`;
        } else {
            responseDiv.innerHTML = `<p style="color: red;">Error al enviar la IP</p>`;
        }
    } catch (error) {
        console.error('Error:', error);
        responseDiv.innerHTML = `<p style="color: red;">Error de conexión con el servidor</p>`;
    }
});