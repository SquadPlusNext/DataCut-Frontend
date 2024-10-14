import React from 'react';
import '../css/Menu.css'

import imgUser from '../Icons/User.png';
import imgConfig from '../Icons/Config.png';
import imgNotfica from '../Icons/Notifica.png';
// import imgLupa from '../Icons/Lupa.png';

const Menu = () => {      
  return (
  <div className="Menu">
    <div className='Topico'>
        <p>Página / Dashboard </p>
        <h2>Dashboard</h2>
    </div>
    <div className='Pesquisa'>
    {/* <div className="search-container">
        <img src={imgLupa} alt="Lupa" className="search-icon" />
        <input type="search" placeholder="Digite aqui..." />
        </div> */}

        <a><img src={imgUser}></img>  Logout</a>
        <a><img src={imgConfig}></img></a>
        <a><img src={imgNotfica}></img></a>
    </div>
  </div>
  );
}

export default Menu;
