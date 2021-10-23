import './index.scss';
import { useEffect, useState } from 'react'
import { Link, useLocation } from "react-router-dom";
import { Popover, Alert } from 'element-react';
import useAccount from '../../hooks/useAccount.js'
import logoWhiteImg from '../../static/img/logo-white.png'
import logoBlackImg from '../../static/img/logo-black.png'

export default function Header() {
  const {platon} = window;
  const {pathname} = useLocation();
  const [showAlert, setShowAlert] = useState(false);
  const [currentMenu, setCurrentMenu] = useState('');
  const {chainId, balance, blockNumber, currentAccount} = useAccount();
  
  // 初始化
  useEffect(() => {
    setCurrentMenu(pathname);
  }, [])

  // 请求账户链接 - Samurai钱包
  const connectWallet = () => {
    // if (!!platon) {
    //   platon.request({ method: 'platon_requestAccounts' })
    // } else {
    //   alert('Please install Samurai!')
    // }
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      window.open("https://github.com/relationlabs");
    }, 3000)
  }

  // 账户地址显示处理
  const formatAccount = (address) =>  {
    var addressStr = address.toString()
    if(address.toString().indexOf('lat') === 0 || address.toString().indexOf('atp') === 0) {
      return addressStr.substring(0, 6)+"..."+addressStr.substr(addressStr.length-4);
    }
  }

  // 链ID显示处理
  const formatChainId = (chainIdValue) =>  {
    let result = '';
    switch(chainIdValue) {
      case '0x64': result = 'Platon Main'; break;
      case '0x33585': result = 'Platon dev'; break;
      case '0x3113A': result = 'Alaya'; break;
      case '0x31146': result = 'Alaya dev'; break;
      default : result = 'error'; break;
    }
    return result;
  }
  
  return (
    <div>
      <div className="nav">
        <div className="navLeft">
          {/* <div>
            <div className="navLogo">
              <div className="navLogo1"></div>
              <div className="navLogo2"></div>
            </div>
          </div> */}
          <img src={logoBlackImg} className="logoBlock"></img>
          <a className="navLogo">IC Contracts</a>
        </div>
        <div className="navRight">
          <div 
            onClick={() => setCurrentMenu('/')}
            className={`navText ${currentMenu === '/' ? 'active' : null}`} >
            <Link to='/'>Home</Link>
          </div>
          {/* <div 
            onClick={() => setCurrentMenu('/liquidity')}
            className={`navText ${currentMenu === '/liquidity' ? 'active' : null}`}>
            <Link to='/liquidity'>Liquidity</Link>
          </div>
          <div 
            onClick={() => setCurrentMenu('/swap')}
            className={`navText ${currentMenu === '/swap' ? 'active' : null}`}>
            <Link to='/swap'>Swap</Link>
          </div>
          <div 
            onClick={() => setCurrentMenu('/dfinity')}
            className={`navText ${currentMenu === '/dfinity' ? 'active' : null}`}>
            <Link to='/dfinity'>Dfinity</Link>
          </div> */}
          <div 
            onClick={() => setCurrentMenu('/download')}
            className={`navText ${currentMenu === '/download' ? 'active' : null}`}>
            <Link to='/download'>Download</Link>
          </div>
          {
            currentAccount != null
              ? <div className="account connectWallet">
                  <span className="indicator"></span>
                  <Popover placement="bottom" title="" width="320" trigger="hover" content={(
                    <div className="popover">
                      <div className="popoverLine">
                        <span>网络ID: </span>
                        <span>{formatChainId(chainId)}</span>
                      </div>
                      <div className="popoverLine">
                        <span>LAT余额: </span>
                        <span>{balance}</span>
                      </div>
                      <div className="popoverLine">
                        <span>当前区块编号: </span>
                        <span>{blockNumber}</span>
                      </div>
                      <div className="popoverLine">
                        <span>账户地址: </span>
                        <a 
                          target='_blank'
                          rel="noreferrer"
                          className="accountLink"
                          href={`https://scan.platon.network/address-detail?address=${currentAccount}`}>
                          {currentAccount}
                        </a>
                      </div>
                    </div>
                  )}>
                    <span>{formatAccount(currentAccount)}</span>
                  </Popover>
                </div>
              : <div style={{display:'flex'}}>
                  <p className="connectWallet"  onClick={connectWallet}>GitHub</p>
                  <img 
                    style={{width: '50px'}}
                    src="https://dfinity.org/static/Internet_Identity-a9cfc092498cf8f17b2cec696d53acdb.webp">  
                  </img>
                </div>
          }
        </div>
      </div>
      { showAlert && <Alert title="Ready to go to the IC Contracts project Github address" type="info"/>}
    </div>
  )
}