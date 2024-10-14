import React from 'react';
import '../css/Status.css'

import imgLiga from '../Icons/Liga.png'
import imgOperacional from '../Icons/Operacional.png'
import imgData from '../Icons/Data.png'
import imgEnergia from '../Icons/Energia.png'

const Status = () => {      
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
        <p>Status Operacional</p>
        <span>Em Operação</span>
        <div className='imgStatus'>
          <img src={imgOperacional}></img>
        </div>
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
      <span>00/00/00</span>
      <div className='imgStatus'>
          <img src={imgData}></img>
      </div>
    </div>
  </div>
  );
}

export default Status;
