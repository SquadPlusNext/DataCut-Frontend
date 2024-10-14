import React from 'react';
import ChartBox from './ChartBox.jsx';
import Menu from './Menu.jsx';
import Status from './Status.jsx';
import '../css/Dashboard.css';

import GraficoStsOperacional from '../Dashboard/GraficoStsOperacional.jsx'
import GraficoStsTemperatura from '../Dashboard/GraficoStsTemperatura.jsx';
import GraficoLine from '../Dashboard/GraficoLine.jsx';
import GraficoLineGas from '../Dashboard/GraficoLineGas.jsx';
import GraficoBar from '../Dashboard/GraficoBar.jsx';
import SensorDataChart from '../Dashboard/GraficoLine.jsx';

const Dashboard = () => {
  return (
    <div className='BodyDashboard'>
      <Menu />
      <div className='dashboard'>
        <Status />

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

        <GraficoStsOperacional />
        <GraficoStsTemperatura />

        </div>
        <div className='dashboard'>
          <SensorDataChart 
          title="Corrente Elétrica" 
          measurement="curr_a" 
          range="30d" 
          description="Gráfico de corrente elétrica nos últimos 30 dias." 
        />
      

        <GraficoBar title="Altura de Corte" descricao={"Monitoramento da altura do corte"}/>
        </div>

        <div className='dashboard'>
        <GraficoLineGas />
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
