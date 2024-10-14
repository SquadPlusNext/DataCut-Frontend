import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const SensorDataChart = () => {
  const [sensorData, setSensorData] = useState([]); // Estado para armazenar os dados do sensor
  const [tempChartInstance, setTempChartInstance] = useState(null); // Instância do gráfico de temperatura
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento inicial

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://50.16.40.172:3000/influxdb?range=1h');
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
        const response = await fetch('http://50.16.40.172:3000/influxdb?&range=1h');
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
      
      // Filtrando os dados para temp_a e curr_a
      const tempAData = sensorData.filter(entry => entry._measurement === 'corrente_laser').map(entry => entry._value); // Supondo que '_value' contém os valores
      const currAData = sensorData.filter(entry => entry._measurement === 'corrente_geral').map(entry => entry._value); // Supondo que '_value' contém os valores
      
      // Criar novo gráfico de temperatura e corrente
      const newTempChartInstance = new Chart(tempCtx, {
        type: 'line',
        data: {
          // Assumindo que ambos os datasets têm o mesmo conjunto de timestamps
          labels: sensorData.filter(entry => entry._measurement === 'corrente_geral').map(entry => {
            const timestamp = new Date(entry._time);
            timestamp.setHours(timestamp.getHours() - 3); // Ajuste de fuso horário
            return timestamp.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
          }),
          datasets: [
            {
              label: 'Consumo Tubo',
              data: tempAData, // Valores de temp_a
              borderColor: '#0172fa',
              backgroundColor: 'rgba(4,108,244, 0.5)',
              fill: false,
            },
            {
              label: 'Consumo Geral',
              data: currAData, // Valores de curr_a
              borderColor: '#f0ba2d',
              backgroundColor: 'rgba(1342, 236, 93, 0.2)',
              fill: true,
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true, // Exibir legenda para distinguir temp_a e curr_a
            },
          },
          scales: {
            x: {
              display: false, // Mostrar eixo X com labels de tempo
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      setTempChartInstance(newTempChartInstance); // Armazenar nova instância do gráfico de temperatura
    }
  }, [sensorData, isLoading]);

  return (
    <div>
      <div className='BodyNvlEstabilidade'>
        <div className='TxTNvlEstabilidade'>
          <p className='TituloNvlEstabilidade'>Consumo de Energia</p>
          <p>Monitoramento do consumo de energia das máquinas</p>
          {isLoading ? (
            <p>Carregando...</p>
          ) : (
            <canvas id="temp-chart"></canvas>
          )}
        </div>
      </div>
    </div>
  );
};

export default SensorDataChart;
