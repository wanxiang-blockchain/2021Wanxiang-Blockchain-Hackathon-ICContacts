import './index.scss'
import useWinSize from '../../hooks/useWinSize.js'
import logoWhiteImg from '../../static/img/logo-white.png'
import logoBlackImg from '../../static/img/logo-black.png'

export default function Home() {
  const size = useWinSize();

  // Banner组件
  const SectionA = () => {
    return <div className="full-page" style={{height: size.height}}>
      <div className="SectionA">
        <div className="mainLogoAlt">
          {/* <div className="mainLogo">
            <div className="logo1"></div>
            <div className="logo2"></div>
          </div> */}
          <img src={logoWhiteImg} className="logoBlock"></img>
        </div>
        <div className="mainTitle">
          Be a DeFi Chef with IC Contracts.
        </div>
        <div className="mainDes">
          Swap, earn, stack yields, lend, borrow, leverage all on one decentralized, community driven platform. Welcome home to DeFi.
        </div>
      </div>
    </div>
  }

  // 介绍组件
  const SectionB = () => {
    return <div className="full-page" style={{height: size.height}}>
      <div className="SectionB description">
        <div className="text">
          Michelin star-worthy DeFi innovations crafted by our master chefs
        </div>
      </div>
    </div>
  }

  return (
    <div className="fullPage-wrapper">
      <SectionA/>
      <SectionB/>
    </div>
  )
}