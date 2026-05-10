Chart.defaults.color = '#ffffff';

// Gráfico de Linha (CPU e RAM)
const ctxLinha = document.getElementById('meuGrafico').getContext('2d');
const hardwareChart = new Chart(ctxLinha, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            { label: 'Uso de CPU (%)', data: [], borderColor: '#00ff88', tension: 0.4 },
            { label: 'Uso de RAM (%)', data: [], borderColor: '#00d2ff', tension: 0.4 }
        ]
    },
    options: { scales: { y: { beginAtZero: true, max: 100 } } }
});

// Gráfico de disco
const ctxDisco = document.getElementById('discoGrafico').getContext('2d');
const discoChart = new Chart(ctxDisco, {
    type: 'doughnut',
    data: {
        labels: ['Espaço Usado', 'Espaço Livre'],
        datasets: [{
            data: [0, 100], // Começa vazio, atualiza na API
            backgroundColor: ['#ff3366', '#2a2a2a'],
            borderWidth: 0
        }]
    },
    options: { cutout: '75%' }
});

async function atualizarDados() {
    const response = await fetch('/api/hardware');
    const dados = await response.json();
    const agora = new Date().toLocaleTimeString();

    // Textos
    document.getElementById('cpu-name').innerText = dados.cpuModel;
    document.getElementById('cpu-cores').innerText = `Núcleos Físicos: ${dados.cpuCores}`;
    document.getElementById('gpu-name').innerText = dados.gpuModel;
    document.getElementById('os-name').innerText = dados.osName;
    document.getElementById('uptime').innerText = `Tempo Ligado: ${dados.uptime} hrs`;
    document.getElementById('ram-total').innerText = dados.ramTotal;
    document.getElementById('ram-type').innerText = dados.ramType;

    // Atualiza Gráfico de Linha
    if (hardwareChart.data.labels.length > 10) {
        hardwareChart.data.labels.shift();
        hardwareChart.data.datasets[0].data.shift();
        hardwareChart.data.datasets[1].data.shift();
    }
    hardwareChart.data.labels.push(agora);
    hardwareChart.data.datasets[0].data.push(dados.cpuUsage);
    hardwareChart.data.datasets[1].data.push(dados.ramUsage);
    hardwareChart.update();

    // Atualiza Gráfico de Disco
    if (dados.diskUsed !== "0") {
        discoChart.data.datasets[0].data = [dados.diskUsed, 100 - dados.diskUsed];
        discoChart.update();
    }
}

setInterval(atualizarDados, 2000);