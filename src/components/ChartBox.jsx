import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

const ChartBox = ({ title }) => {
  const [sensorData, setSensorData] = useState([]); // Estado para armazenar os dados do sensor
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

  // Atualização periódica dos dados a cada 5 minutos
  useEffect(() => {
    const updateChartData = async () => {
      try {
        await sendSensorData(); // Enviar os dados do sensor a cada 5 minutos

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

  const chartData = {
    labels: sensorData.map((_, index) => `Leitura ${index + 1}`), // Rótulos baseados na quantidade de dados
    datasets: [{
      label: 'Temperatura',
      data: sensorData.map(dado => dado.temperatura), // Usando os dados reais do sensor
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  return (
    <div className="box">
      <h3>{title}</h3>
      <div className="chart-container">
        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <Line data={chartData} options={{ responsive: true }} />
        )}
      </div>
    </div>
  );
};

export default ChartBox;
