import React, { useState } from 'react';
import ChartBox from './ChartBox.jsx';
import Menu from './Menu.jsx';
import Status from './Status.jsx';
import '../css/Dashboard.css';

import GraficoStsOperacional from '../Dashboard/GraficoStsOperacional.jsx'
import GraficoStsTemperatura from '../Dashboard/GraficoStsTemperatura.jsx';
import GraficoLineGas from '../Dashboard/GraficoLineGas.jsx';
import GraficoBar from '../Dashboard/GraficoBar.jsx';
import SensorDataChart from '../Dashboard/GraficoLine.jsx';

import GraficoCorrenteGeral from '../Dashboard/GraficoSensorTof.jsx';
import GraficoSensorTof from '../Dashboard/GraficoCorrenteGeral.jsx';
import GraficoSensorGasA from '../Dashboard/GraficoSensorGasA.jsx';
import GraficoLineTempCompressor from '../Dashboard/GraficoLineTempCompressor.jsx';
import GraficoSensorGasB from '../Dashboard/GraficoSensorGasB.jsx';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('10m'); // Estado para o intervalo de tempo

  return (
    <div className='BodyDashboard'>
      <Menu />
      <div className='dashboard'>
        <Status timeRange={timeRange} setTimeRange={setTimeRange} /> {/* Passando o estado */}

        <div className='BodyUser'>
          <div className='UserText'>
            <p>Bem-vindo de volta!</p>
            <p className='user-text'>Usuário</p>
            <p>Ficamos felizes em vê-lo novamente!
            Vamos ver como está a sua máquina de corte a laser.</p>
            <a>Tap to record
            <svg className='imgImpressora' viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.05469 2.84619L10.7109 6.50244L7.05469 10.1587" stroke="white" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.2031 6.50269H2.78906" stroke="white" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            </a>
          </div>
        </div>

        {/* <GraficoStsOperacional /> */}
        <GraficoStsOperacional />

        <GraficoStsTemperatura />

        </div>



        <div className='dashboard'>
          <GraficoSensorTof />
          <GraficoLineGas timeRange={timeRange} />
          <GraficoCorrenteGeral/>
        </div>


        <div className='dashboard'>
          <SensorDataChart timeRange={timeRange}
          title="Corrente Elétrica" 
          measurement="curr_a" 
          range="30d" 
          description="Gráfico de corrente elétrica nos últimos 30 dias." 
        />
      

        <GraficoBar title="Potencia Geral da Máquina" descricao={""} timeRange={timeRange}/>
        </div>


        <div className='dashboard'>
          <GraficoSensorGasA />
          <GraficoLineTempCompressor timeRange={timeRange}/>
          <GraficoSensorGasB/>
        </div>

        
          {/* <GraficoLine title="Nível de Estabilidade 2" descricao={"Monitoramento das Vibrações assegurando que a máquina opere de forma estável e suave"}/>

          <ChartBox title="Concentração de Gás Monitorada" />
          <ChartBox title="Concentração de Gás Monitorada" />
 */}

        

        {/* <ChartBox title="Medição de Distância em Tempo Real" />
        <ChartBox title="Concentração de Gás Monitorada" />
        <ChartBox title="Taxa de Fluxo do Sistema de Refrigeração" /> */}
      </div>
  );
}

export default Dashboard;
