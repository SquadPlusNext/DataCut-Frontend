import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
// import '../css/TesteSensorTof.css';

const GraficoSensorGasA = () => {
  const [sensorData, setSensorData] = useState([]); // Estado para armazenar os dados do sensor
  const [tempChartInstance, setTempChartInstance] = useState(null); // Instância do gráfico de temperatura
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento inicial
  const [totalTof, settotalTof] = useState(0); // Estado para armazenar o total de Gas A



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://squadplus.zapto.org:3000/influxdb?range=1h');
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
        const response = await fetch('http://squadplus.zapto.org:3000/influxdb?&range=1h');
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


  useEffect(() => {
    if (sensorData.length > 0) {
      const gasAValues = sensorData
        .filter(entry => entry._measurement === 'gas_a')
        .map(entry => entry._value);
  
      // Pegue apenas o último valor
      const lastValue = gasAValues[gasAValues.length - 1]; // Último valor
      settotalTof(lastValue || 0); // Atualiza o estado com o valor, ou 0 se não existir
    }
  }, [sensorData]); // Executa esse cálculo sempre que `sensorData` for atualizado

  // Renderização dos gráficos
  useEffect(() => {
    if (!isLoading) { // Renderizar gráficos somente após o carregamento inicial
      if (tempChartInstance) {
        tempChartInstance.destroy(); // Destruir o gráfico existente antes de criar um novo
      }

      const tempCtx = document.getElementById('GraficoSensorGasA');
      
      // Filtrando os dados para corrente_geral e curr_a
    //   const tempAData = sensorData.filter(entry => entry._measurement === 'tof').map(entry => entry._value); // Supondo que '_value' contém os valores
      
      // Criar novo gráfico de temperatura e corrente
      const newTempChartInstance = new Chart(tempCtx, {
        type: 'doughnut',
        data: {
          // Assumindo que ambos os datasets têm o mesmo conjunto de timestamps
          //data: [totalTof, 100 - totalTof], // Ajustar os dados para o gráfico de doughnut
          
          datasets: [
            {
              label: 'Consumo Tubo',
              data: [totalTof, 100 - totalTof], // Valores de corrente_geral
            //   borderColor: '#0172fa',
              borderColor: 'transparent',
              backgroundColor: ['#0172fa', 'rgba(0, 0, 0, 0)'], // Aplicando o degradê como cor
            }
          ]
        },
        options: {
            aspectRatio: 2,
            circumference: 180,
            rotation: 360,
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

      setTempChartInstance(newTempChartInstance); // Armazenar nova instância do gráfico de temperatura
    }
  }, [sensorData, isLoading, totalTof]);

  return (
    <div>
      <div className='BodySensorTof'>
        <div className='TxTNvlSensorTof'>
          <p className='TituloNvlTof'>Sensor de Gás A (Fumos Metálicos ou Compostos Químicos Perigosos)</p>
          {isLoading ? (
            <p>Carregando...</p>
          ) : (
            <canvas id="GraficoSensorGasA"></canvas>
          )}
          <p className='ValorTof'>{totalTof} ppm</p>
        </div>
      </div>
    </div>
  );
};
export default GraficoSensorGasA;
