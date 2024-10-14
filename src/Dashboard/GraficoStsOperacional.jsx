import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

import '../css/GraficoStsOperacional.css'

const GraficoStsOperacional = () => {
  const [sensorData, setSensorData] = useState([]); // Estado para armazenar os dados do sensor
  const [tempChartInstance, setTempChartInstance] = useState(null); // Instância do gráfico de temperatura
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento inicial
  const [totalGasA, setTotalGasA] = useState(0); // Estado para armazenar o total de Gas A

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
        const response = await fetch('http://50.16.40.172:3000/influxdb?range=1h');
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

  // Recalcula o total de Gas A sempre que os dados do sensor são atualizados
// Recalcula o total de Gas A sempre que os dados do sensor são atualizados
useEffect(() => {
  if (sensorData.length > 0) {
    const gasAValues = sensorData
      .filter(entry => entry._measurement === 'temperatura_compressor')
      .map(entry => entry._value);

    // Pegue apenas o último valor
    const lastValue = gasAValues[gasAValues.length - 1]; // Último valor
    setTotalGasA(lastValue || 0); // Atualiza o estado com o valor, ou 0 se não existir
  }
}, [sensorData]); // Executa esse cálculo sempre que `sensorData` for atualizado


  // Renderização dos gráficos
  useEffect(() => {
    if (!isLoading && sensorData.length > 0) { // Renderizar gráficos somente após o carregamento inicial e quando houver dados
      if (tempChartInstance) {
        tempChartInstance.destroy(); // Destruir o gráfico existente antes de criar um novo
      }

      const tempCtx = document.getElementById('StsOperacional').getContext('2d'); // Correção: adiciona getContext('2d')
      
      const gradient = tempCtx.createLinearGradient(0, 0, 0, 200);
      gradient.addColorStop(1, 'rgba(23, 32, 33, 0)');  // Cor inicial
      gradient.addColorStop(0, '#a72d0f');

      
      // Criar novo gráfico de temperatura
      const newTempChartInstance = new Chart(tempCtx, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: [totalGasA, 100 - totalGasA], // Ajustar os dados para o gráfico de doughnut
              borderRadius: [20, 0],
              borderWidth: 2,
              borderColor: 'transparent',
              backgroundColor: [gradient, 'rgba(0, 0, 0, 0)'], // Aplicando o degradê como cor
            },
          ],
        },
        options: {
          aspectRatio: 2,
          circumference: 180,
          rotation: 270,
          cutout: '86%',
          responsive: true,
          plugins: {
            legend: {
              display: false, 
            },
            tooltip: {
              enabled: false,
            },
          },
        }
      });
  
      setTempChartInstance(newTempChartInstance); 
    }
  }, [sensorData, totalGasA]); // O gráfico também é atualizado quando o totalGasA muda

  // Arredondar totalGasA para uma porcentagem exibível
  const totalGasAPercent = Math.round(totalGasA); // Arredonda para o valor mais próximo

  return (
    <div className='Body'>
      <div className='BodyLegendas'>
        <p className='TextLegendas'>Temperatura do Compresso</p>
        <p>A temperatura atual do compressor está</p>
      </div>
      <div className='BodyGrafico'>
        <canvas id='StsOperacional'></canvas>
      </div>
      <div className='BodyPorcentagem'>
        <div className='Porcentagem'>
          <p className='PorcentagemZero'>0°C</p>
          <p className='PorcentagemCem'>100°C
          </p>
        </div>
        {/* Exibe o valor dinâmico totalGasA aqui */}
        <p className='TextLegendasNum'>{totalGasAPercent}°C</p> 
        <p className='TextLegendasDesc'>próxima do seu limite recomendado</p>
      </div>
    </div>
  );
};

export default GraficoStsOperacional;
