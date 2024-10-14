// // import { useState } from 'react';
// import SensorDataChart from './SensorDataChart.jsx';
// import SensorTof from './Graficos/SensorTof.jsx'
// import TemperaturaCompressor from './Graficos/TemperaturaCompressor.jsx'
// import TempoCorte from './Graficos/TempoCorte.jsx'

// import './App.css'
// import BotaoLimparDados from './BotaoLimparDados';

// import Notificacoes from './Notficacoes/Notificacao.jsx';

// function App() {
//   return (
//     <div className="App">
//       <Notificacoes />
//       {/* <div className='Nav'>
//         <div className='TextNav'>
//           <h1>Dashboard</h1>
//           <p>Monitoramento Aquario</p>
//         </div>
        
//         <div className='ButtonNav'>
//           <BotaoLimparDados />
//         </div>
        
//       </div>

      
//       <div className='BodyContainerTeste'>
//       {/* <div className='Teste'><p>aaaaa</p></div> */}
      
//       {/* <div className='BodyContainer'>
//         <div className="container">
//           <div className="chart">
//             <SensorTof />
//           </div>
//         <div className="chart">
//             <TemperaturaCompressor />
//           </div>
//           <div className="chart">
//             <TempoCorte />
//           </div>
//       </div>
//     </div>
//     <div className='teste'>
//       <SensorDataChart />
//     </div>
//     </div> */}
//     </div>
//   );
// }

// export default App


//import React from 'react';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
// import background from 'Background.png';

import './App.css';

function App() {
  return (
    <div className="App">
      <Sidebar />
      <Dashboard />
    </div>
  );
}

export default App;
