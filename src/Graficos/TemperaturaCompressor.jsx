// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

import '../TempoCorte.css'

const TemperaturaCompressor = () => {
  const [sensorData, setSensorData] = useState([]); 
  const [tempChartInstance, setTempChartInstance] = useState(null);

  //Variável para ser alterada depois
  const temperaturaCompressor = (Math.random() * 100)

  const sendSensorData = async () => {
    const dadosSensor = {
      location_id: 1,
      temperatura: (Math.random() * 3) + 21.8, 
      ph: (Math.random() * 0.6) + 7.9,
      salinidade: (Math.random() * 9) + 32,
      tof: (Math.random() * 9) + 100
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
    } catch (error) {
      console.error('Erro ao enviar dados do sensor:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://50.16.40.172:3000/dados-sensores');
        if (!response.ok) {
          throw new Error('Erro ao buscar dados: ' + response.statusText);
        }
        const data = await response.json();
        setSensorData(data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const updateChartData = async () => {
      try {
        await sendSensorData(); 

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

    const interval = setInterval(updateChartData, 300000); 

    return () => clearInterval(interval); 
  }, []);

  useEffect(() => {
    if (sensorData.length > 0) { 
      if (tempChartInstance) {
        tempChartInstance.destroy(); 
      }

      const tempCtx = document.getElementById('temp-compressor');


      //Variável para ser alterada depois
      const newTempChartInstance = new Chart(tempCtx, {
        type: 'doughnut',
        data: {
            // labels: sensorData.map(entry => {
            //   const timestamp = new Date(entry.timestamp);
            //   timestamp.setHours(timestamp.getHours() - 3); // Ajuste de fuso horário
            //   return timestamp.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
            // }),
          datasets: [
            {
              data: [temperaturaCompressor, 100-temperaturaCompressor],
              borderRadius: [20, 0],
              borderWidth: 2,
              borderColor: 'transparent',
              backgroundColor: ['#dfaa47', 'rgb(0,0,0,0)'],

            },
          ],
        },
        options: {
          aspectRatio: 1,
          circumference: 360,
          rotation: 0,
          cutout: '76%',
          responsive: true,
          plugins: {
            legend: {
              position: 'transparent',
            },
            tooltip: {
              enabled: false,
          },
          // title: {
          //   display: true,
          //   text: 'Sensor Tof'
          // }
        }
        }
      });

      setTempChartInstance(newTempChartInstance); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sensorData]);

  return (
    <div className='Body'>
      <div className='BodyLegendas'>
        <p className='TextLegendas'>Temperatura do compressor</p>
        <p className='TextLegendasNum'> { temperaturaCompressor.toFixed(3) } C </p>
        <p className='TextLegendaSensorTof'>Temperatura em Celsius</p>
      </div>
      <div className='BodyGrafico'>
        <canvas id="temp-compressor" width="50" height="50"></canvas>
      </div>
    </div>
  );
};

export default TemperaturaCompressor;
