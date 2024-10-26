import React from 'react';
import '../css/Status.css'

import imgLiga from '../Icons/Liga.png'
import imgOperacional from '../Icons/Operacional.png'
import imgData from '../Icons/Data.png'
import imgEnergia from '../Icons/Energia.png'

const Status = ({ timeRange, setTimeRange }) => {      
  return (
  <div className="header">
    <div className='status'>
      <p>Status da Máquina</p>
      <span>LIGADA</span>
      <div className='imgStatusLiga'>
        <img src={imgLiga}></img>
      </div>
    </div>  
    <div className="status">
        <p>Intervalo de Tempo</p>
        <select onChange={(e) => setTimeRange(e.target.value)} value={timeRange}>
          <option value="15m">15 Minutos</option>
          <option value="1h">1 Hora</option>
          <option value="3h">3 Horas</option>
          <option value="12h">12 Horas</option>
          <option value="24h">24 Horas</option>
          <option value="7d">7 Dias</option>
          <option value="14d">14 Dias</option>
          <option value="30d">30 Dias</option>
        </select>
      </div>
    <div className="status">
      <p>Consumo de Energia</p>
      <span>2.5 kW</span>
      <div className='imgStatus'>
          <img src={imgEnergia}></img>
      </div>
    </div>
    <div className="status">
      <p>Última Manutancao</p>
      <span>10/07/2024</span>
      <div className='imgStatus'>
          <img src={imgData}></img>
      </div>
    </div>
  </div>
  );
}

export default Status;
