import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

//location_id, temperatura, ph, salinidade

const SensorDataChart = () => {
  const [sensorData, setSensorData] = useState([]); // Estado para armazenar os dados do sensor
  const [tempChartInstance, setTempChartInstance] = useState(null); // Instância do gráfico de temperatura
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento inicial

  // Busca inicial de dados do backend
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('http://localhost:3000/dados-sensores');
  //       if (!response.ok) {
  //         throw new Error('Erro ao buscar dados: ' + response.statusText);
  //       }
  //       const data = await response.json();
  //       setSensorData(data);
  //       setIsLoading(false); // Marcamos que a busca de dados terminou
  //     } catch (error) {
  //       console.error('Erro ao buscar dados:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

//Nova busca inicial de dados do backend no influxdb
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/influxdb?range=30d');
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
        const response = await fetch('http://localhost:3000/influxdb?measurement=curr_a&range=30d');
        if (!response.ok) {
          throw new Error('Erro ao buscar dados: ' + response.statusText);
        }
        const data = await response.json();
        setSensorData(data);
      } catch (error) {
        console.error('Erro ao buscar ou atualizar dados:', error);
      }
    };

    const interval = setInterval(updateChartData, 6000); // Intervalo de 60s 

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
          labels: sensorData.filter(entry => entry._measurement === 'curr_a').map(entry => {
            const timestamp = new Date(entry._time);
            timestamp.setHours(timestamp.getHours() - 3); // Ajuste de fuso horário
            return timestamp.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
          }),
          datasets: [
            {
              label: 'Corrente',
              data: sensorData.filter(entry => entry._measurement === 'curr_a').map(entry => entry.table),
              borderColor: 'rgb(227 15 89)',
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

      setTempChartInstance(newTempChartInstance); // Armazenar nova instância do gráfico de temperatura

    }
  }, [sensorData, isLoading]);

  return (
    <div>
      <canvas id="temp-chart" width="600" height="200"></canvas>
    </div>
  );
};

export default SensorDataChart;