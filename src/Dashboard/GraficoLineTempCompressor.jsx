import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const GraficoLineTempCompressor = ({ timeRange }) => {
  const [sensorData, setSensorData] = useState([]); // Estado para armazenar os dados do sensor
  const [tempChartInstance, setTempChartInstance] = useState(null); // Instância do gráfico de temperatura
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento inicial

  const fetchData = async () => {
    try {
        const response = await fetch(`http://squadplus.zapto.org:3000/influxdb?range=${timeRange}`);
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

    useEffect(() => {
      fetchData(); // Buscar dados sempre que o componente for montado ou timeRange mudar
    }, [timeRange]);


  // Atualização periódica dos dados a cada 10 segundos
  useEffect(() => {
    const updateChartData = async () => {
      try {
        const response = await fetch(`http://squadplus.zapto.org:3000/influxdb?&range=${timeRange}`);
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
  }, [timeRange]);

  
  // Renderização dos gráficos
  useEffect(() => {
    if (!isLoading) { // Renderizar gráficos somente após o carregamento inicial
      if (tempChartInstance) {
        tempChartInstance.destroy(); // Destruir o gráfico existente antes de criar um novo
      }

      const tempCtx = document.getElementById('GraficoLineTempCompressor');
      
      // Filtrando os dados para temperatura_compressor e curr_a
      const GasAData = sensorData.filter(entry => entry._measurement === 'temperatura_compressor').map(entry => entry._value); // Supondo que '_value' contém os valores
      
      // Criar novo gráfico de temperatura e corrente
      const newTempChartInstance = new Chart(tempCtx, {
        type: 'line',
        data: {
          // Assumindo que ambos os datasets têm o mesmo conjunto de timestamps
          labels: sensorData.filter(entry => entry._measurement === 'temperatura_compressor').map(entry => {
            const timestamp = new Date(entry._time);
            timestamp.setHours(timestamp.getHours() - 3); // Ajuste de fuso horário
            return timestamp.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
          }),
          datasets: [
            {
              label: 'Temperatura Compressor',
              data: GasAData, // Valores de temperatura_compressor
              borderColor: '#0172fa',
              backgroundColor: 'rgba(4,108,244, 0.5)',
              fill: false,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,  // Permitir que o gráfico se ajuste conforme o tamanho do canvas
          plugins: {
            legend: {
              display: true,
            },
          },
          scales: {
            x: {
              display: false,
            },
            y: {
              beginAtZero: true,
            },
          },
        }
      });

      setTempChartInstance(newTempChartInstance); // Armazenar nova instância do gráfico de temperatura
    }
  }, [sensorData, isLoading]);

  return (
    <div>
      <div className='BodyNvlMonitoramentoGases'>
        <div className='TxTNvlMonitoramentoGases'>
          <p className='TituloNvlEstabilidade'>Temperatura do Compressor</p>
          {/* <p>Monitoramento em tempo real dos níveis de gases tóxicos</p> */}
          {isLoading ? (
            <p>Carregando...</p>
          ) : (
            <canvas id="GraficoLineTempCompressor"></canvas>

          )}
        </div>
      </div>
    </div>
  );
};

export default GraficoLineTempCompressor;
