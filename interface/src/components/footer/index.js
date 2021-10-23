import './index.scss';
import logo from '../../logo.svg';

export default function Footer() {

  return (
    <div className="footer">
      <div className="footerContent">
        <div className="colum">
          <div className="navLeft">
            <img src={logo} className="App-logo" alt="logo" />
            <a className="navText">IC Contracts</a>
          </div>
          <div className="columnDes">
            IC Contracts is the home of DeFi. 
            Our community is building a comprehensive, 
            decentralized trading platform for the future of finance. Join us!
          </div>
        </div>
        <div className="colum">
          <div className="columnTitle columWidth">PRODUCTS</div>
          <div className="columnText">CiviswapSwap AMM</div>
          <div className="columnText">CiviswapSwap AMM</div>
          <div className="columnText">CiviswapSwap AMM</div>
        </div>
        <div className="colum">
          <div className="columnTitle columWidth">PRODUCTS</div>
          <div className="columnText">CiviswapSwap AMM</div>
          <div className="columnText">CiviswapSwap AMM</div>
          <div className="columnText">CiviswapSwap AMM</div>
        </div>
        <div className="colum">
          <div className="columnTitle columWidth">PRODUCTS</div>
          <div className="columnText">CiviswapSwap AMM</div>
          <div className="columnText">CiviswapSwap AMM</div>
          <div className="columnText">CiviswapSwap AMM</div>
        </div>
      </div>
    </div>
  )
}