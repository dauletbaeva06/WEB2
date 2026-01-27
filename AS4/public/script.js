document.getElementById('queryForm').onsubmit = async (e) => {
    e.preventDefault();
    const field = document.getElementById('field').value;
    const start = document.getElementById('start_date').value;
    const end = document.getElementById('end_date').value;

    const response = await fetch(`/api/measurements?field=${field}&start_date=${start}&end_date=${end}`);
    const data = await response.json();

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => new Date(d.timestamp).toLocaleDateString()),
            datasets: [{ label: field, data: data.map(d => d[field]) }]
        }
    });
};