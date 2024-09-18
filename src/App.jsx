import { useState } from 'react';
import SensorDataChart from './SensorDataChart.jsx';

import './App.css'
import BotaoLimparDados from './BotaoLimparDados';

function App() {
  return (
    <div className="App">
      <h1>Monitoramento Aquario</h1>
      <SensorDataChart />
      <BotaoLimparDados />
    </div>
  );
}

export default App
