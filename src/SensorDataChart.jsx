// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

//location_id, temperatura, ph, salinidade

const SensorDataChart = () => {
  const [sensorData, setSensorData] = useState([]); // Estado para armazenar os dados do sensor
  const [tempChartInstance, setTempChartInstance] = useState(null); // Instância do gráfico de temperatura
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento inicial


  // Função para enviar os dados do sensor para o backend
  const sendSensorData = async () => {
    const dadosSensor = {
      location_id: 1,
      temperatura: (Math.random() * 3) + 21.8, // Gerando temperatura aleatória
      ph: (Math.random() * 0.6) + 7.9, // Gerando umidade aleatória
      salinidade: (Math.random() * 9) + 32
    };

    try {
      const response = await fetch('http://50.16.40.172:3000/inserir-dados-sensor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosSensor)
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar dados do sensor: ' + response.statusText);
      }

      console.log('Dados do sensor enviados com sucesso.');
    } catch (error) {
      console.error('Erro ao enviar dados do sensor:', error);
    }
  };

  // Busca inicial de dados do backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://50.16.40.172:3000/dados-sensores');
        if (!response.ok) {
          throw new Error('Erro ao buscar dados: ' + response.statusText);
        }
        const data = await response.json();
        setSensorData(data);
        setIsLoading(false); // Marcamos que a busca de dados terminou
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  // Atualização periódica dos dados a cada 10 segundos
  useEffect(() => {
    const updateChartData = async () => {
      try {
        await sendSensorData(); // Enviar os dados do sensor a cada 10 segundos

        const response = await fetch('http://50.16.40.172:3000/dados-sensores');
        if (!response.ok) {
          throw new Error('Erro ao buscar dados: ' + response.statusText);
        }
        const data = await response.json();
        setSensorData(data);
      } catch (error) {
        console.error('Erro ao buscar ou atualizar dados:', error);
      }
    };

    const interval = setInterval(updateChartData, 300000); // Intervalo de 5 min

    return () => clearInterval(interval); // Limpar intervalo ao desmontar o componente
  }, []);

  // Renderização dos gráficos
  useEffect(() => {
    if (!isLoading) { // Renderizar gráficos somente após o carregamento inicial
      if (tempChartInstance) {
        tempChartInstance.destroy(); // Destruir o gráfico existente antes de criar um novo
      }

      const tempCtx = document.getElementById('temp-chart');

      // Criar novo gráfico de temperatura
      const newTempChartInstance = new Chart(tempCtx, {
        type: 'line',
        data: {
          labels: sensorData.map(entry => {
            const timestamp = new Date(entry.timestamp);
            timestamp.setHours(timestamp.getHours() - 3); // Ajuste de fuso horário
            return timestamp.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
          }),
          datasets: [
            {
              label: 'PH',
              data: sensorData.map(entry => entry.ph),
              borderColor: '#dfaa47',
              backgroundColor: 'rgba(224,170,72,0.3)',
              // fill: true,
              tension: 0.4,
            },
            {
              label: 'Temperatura',
              data: sensorData.map(entry => entry.temperatura),
              borderColor: 'rgba(475,120,72,255)',
              backgroundColor: 'rgba(475,120,72,0.3)',
              // fill: true,
              tension: 0.4,
            },
            {
              label: 'Salinidade',
              data: sensorData.map(entry => entry.salinidade),
              borderColor: 'rgb(120, 122, 225)',
              backgroundColor: 'rgba(120, 122, 225, 0.3)',
              // fill: true,
              tension: 0.4,
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
            tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.8)', // Cor de fundo personalizada
              titleColor: '#000', // Cor do texto do título
              bodyColor: '#000', // Cor do texto do corpo
              borderColor: '#ccc', // Cor da borda do tooltip
              borderWidth: 1, // Largura da borda
              padding: 10, // Aumentar o padding para evitar corte
          },
          },
          scales: {
            x: {
              display: false // Esconde o eixo x (legendas na parte inferior)
            },
            y: {
              beginAtZero: true
            }
          }
        }
      });

      setTempChartInstance(newTempChartInstance); // Armazenar nova instância do gráfico de temperatura

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sensorData, isLoading]);

  return (
    <div>
      <canvas id="temp-chart" width="600px" height="200px"></canvas>
    </div>
  );
};

export default SensorDataChart;