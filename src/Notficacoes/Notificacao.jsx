import './Notificacao.css'
import logo from '../logo.png'

const Notificacoes = () => {
  return (
    <>
        <div className='BodyNotificacao'>
            <div className='TopoNotificacao'>
                <img className='Logo' src={logo}></img>
                <h4>DataCut</h4>
            </div>
            <div className='Notificacao'>
                <p>Dashboard</p>
            </div>
        </div>
    </>
  );
}

export default Notificacoes
