# ⚡ Tech Monitor Dashboard Pro

Um dashboard full-stack para monitoramento de hardware em tempo real, construído com Node.js e focado em resiliência de sistema. 

![Status](https://img.shields.io/badge/Status-Concluído-success)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Chart.js](https://img.shields.io/badge/Chart.js-Frontend-blue)

## 🚀 O Projeto
Desenvolvido para apresentar habilidades de integração entre backend e sistema operacional. A aplicação consome dados vitais do hardware (CPU, RAM, GPU, Disco e S.O.) e os exibe em uma interface limpa, com Dark Mode e gráficos reativos a cada 2 segundos.

## 🧠 Arquitetura e Diferenciais Técnicos

Este projeto não é apenas uma leitura simples de API. Ele foi arquitetado para evitar "crashes" comuns do Windows ao tentar ler componentes de hardware restritos.

* **Cache de Memória (Otimização):** Dados pesados e estáticos (como Modelo da Placa de Vídeo e Frequência da RAM) são lidos *uma única vez* na inicialização do servidor e salvos em cache. Isso libera a "Thread" principal do Node.js para focar apenas nas métricas dinâmicas.
* **Timeouts Resilientes (Programação Defensiva):** Utilização do `Promise.race()` para criar timeouts de 1.5 a 4 segundos nas leituras críticas (como o sistema de arquivos WMI do Windows). Se a placa de vídeo ou o disco demorarem para responder, o backend não trava; ele retorna um "fallback" seguro, garantindo que o dashboard (Frontend) nunca congele.
* **Design Clean:** Interface construída com CSS puro (Vanilla), utilizando `backdrop-filter` para transparências e flexbox para total responsividade.

## 🛠️ Tecnologias Utilizadas
* **Backend:** Node.js, Express, `systeminformation` (leitura profunda), `os` (leitura nativa rápida).
* **Frontend:** HTML5, CSS3, JavaScript (Vanilla), Chart.js (Gráficos em tempo real).

## ⚙️ Como rodar localmente

1. Clone o repositório
\`\`\`bash
git clone https://github.com/TiagoBR417/tech-monitor-dashboard.git
\`\`\`

2. Instale as dependências
\`\`\`bash
npm install
\`\`\`

3. Inicie o servidor (⚠️ **Recomendado rodar como Administrador** para leitura de GPU e Disco)
\`\`\`bash
node server.js
\`\`\`

4. Acesse no navegador: `http://localhost:3000`
