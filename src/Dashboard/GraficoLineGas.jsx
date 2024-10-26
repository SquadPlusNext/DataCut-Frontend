import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const GraficoLineGas = ({ timeRange }) => { // Recebendo timeRange como prop
  const [sensorData, setSensorData] = useState([]); // Estado para armazenar os dados do sensor
  const [tempChartInstance, setTempChartInstance] = useState(null); // Instância do gráfico de gases
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento inicial

  // Função para buscar os dados
  const fetchData = async () => {
    try {
      const response = await fetch(`http://squadplus.zapto.org:3000/influxdb?range=${timeRange}`); // Usando timeRange na URL
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
        const response = await fetch(`http://squadplus.zapto.org:3000/influxdb?range=${timeRange}`); // Usando timeRange na URL
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

      const tempCtx = document.getElementById('GraficoLineGas').getContext('2d'); // Obtendo o contexto do canvas

      // Filtrando os dados para gas_a e gas_b
      const GasAData = sensorData.filter(entry => entry._measurement === 'gas_a').map(entry => entry._value);
      const GasBData = sensorData.filter(entry => entry._measurement === 'gas_b').map(entry => entry._value);
      
      // Criar novo gráfico de gases
      const newTempChartInstance = new Chart(tempCtx, {
        type: 'line',
        data: {
          labels: sensorData.filter(entry => entry._measurement === 'gas_a').map(entry => {
            const timestamp = new Date(entry._time);
            timestamp.setHours(timestamp.getHours() - 3); // Ajuste de fuso horário
            return timestamp.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
          }),
          datasets: [
            {
              label: 'Gás A',
              data: GasAData,
              borderColor: '#0172fa',
              backgroundColor: 'rgba(4,108,244, 0.5)',
              fill: false,
            },
            {
              label: 'Gás B',
              data: GasBData,
              borderColor: '#f0ba2d',
              backgroundColor: 'rgba(134, 236, 93, 0.2)',
              fill: true,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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

      setTempChartInstance(newTempChartInstance); // Armazenar nova instância do gráfico de gases
    }
  }, [sensorData, isLoading]);

  return (
    <div>
      <div className='BodyNvlMonitoramentoGases'>
        <div className='TxTNvlMonitoramentoGases'>
          <p className='TituloNvlEstabilidade'>Monitoramento de gases tóxicos</p>
          <p>Monitoramento em tempo real dos níveis de gases tóxicos</p>
          {isLoading ? (
            <p>Carregando...</p>
          ) : (
            <canvas id="GraficoLineGas"></canvas>
          )}
        </div>
      </div>
    </div>
  );
};

export default GraficoLineGas;
