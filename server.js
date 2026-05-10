const express = require('express');
const os = require('os');
const si = require('systeminformation');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

const fetchWithTimeout = (promise, ms) => {
    const timeout = new Promise((resolve) => setTimeout(() => resolve(null), ms));
    return Promise.race([promise, timeout]);
};

// Variável para guardar os dados que não mudam (CACHE)
let dadosEstaticos = null;

app.get('/api/hardware', async (req, res) => {
    try {
        // 1. DADOS DINÂMICOS (Lidos a cada 2 segundos)
        const cpus = os.cpus();
        const cpuLoad = await si.currentLoad();
        const mem = os.totalmem();
        const freeMem = os.freemem();
        const ramUsage = (((mem - freeMem) / mem) * 100).toFixed(2);
        const disk = await fetchWithTimeout(si.fsSize(), 1500); // Disco atualiza, mas rápido
        
        let diskUsed = (disk && disk.length > 0) ? disk[0].use.toFixed(2) : "0";
        let totalRamGB = (mem / (1024 ** 3)).toFixed(1);

        // DADOS ESTÁTICOS 
        if (!dadosEstaticos) {
            console.log("🔍 Escaneando componentes profundos (GPU, Tipo de RAM)...");
            
            // Damos 4 segundos para a sua APU Radeon responder com calma
            const graphics = await fetchWithTimeout(si.graphics(), 4000); 
            const memLayout = await fetchWithTimeout(si.memLayout(), 2000);
            const osInfo = await fetchWithTimeout(si.osInfo(), 2000);

            let gpuModel = (graphics && graphics.controllers.length > 0) ? graphics.controllers[0].model : "Gráficos Integrados AMD";
            let ramType = (memLayout && memLayout.length > 0) ? `${memLayout[0].type || ''} ${memLayout[0].clockSpeed ? memLayout[0].clockSpeed + ' MHz' : ''}` : "DDR4";

            dadosEstaticos = {
                gpuModel: gpuModel,
                ramType: ramType.trim(),
                osName: osInfo ? `${osInfo.distro} ${osInfo.release}` : "Windows"
            };
            console.log("✅ Escaneamento concluído e salvo em Cache!");
        }

        //  Monta o pacote final juntando o Cache com os dados em tempo real
        res.json({
            cpuUsage: cpuLoad.currentLoad.toFixed(2),
            ramUsage: ramUsage,
            cpuModel: cpus[0].model,
            cpuCores: cpus.length,
            diskUsed: diskUsed,
            uptime: (os.uptime() / 3600).toFixed(1),
            ramTotal: `${totalRamGB} GB`,
            ...dadosEstaticos 
        });

    } catch (error) {
        res.status(500).json({ error: "Falha na leitura" });
    }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));