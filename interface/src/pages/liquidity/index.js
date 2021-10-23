import './index.scss'
import { useState, useEffect } from 'react'
import ContractsUtils from '../../utils/contractsUtils.js';
import { Button, Steps, Input, Collapse, Select, Message, Table } from 'element-react';

export default function Swap() {
  const [numA, setNumA] = useState('30000000000');// CoinA信息
  const [numB, setNumB] = useState('30000000000');// CoinB信息
  const [coinA, setCoinA] = useState(null);       // CoinA添加数量
  const [coinB, setCoinB] = useState(null);       // CoinB添加数量
  const [activeL, setActiveL] = useState(0);      // 当前步骤
  const [button1, setButton1] = useState(false);  // 授权按钮A
  const [button2, setButton2] = useState(false);  // 授权按钮B
  const [button3, setButton3] = useState(false);  // 添加流动性按钮
  const [lpList, setLpList] = useState([]);       // 流动性列表
  const [coinList, setCoinList] = useState([{     // 币种选择列表
    label: 'LAT: lat1lyrfzdyjxs3a6a80znfkdsjmys2ef35jzl909l',
    value: 'LAT',
    address: 'lat1lyrfzdyjxs3a6a80znfkdsjmys2ef35jzl909l',
  }, {
    label: 'TEST2: lat1gyere98akkp2v395t8l6wzatpnhff765au4mxr',
    value: 'TEST2',
    address: 'lat1gyere98akkp2v395t8l6wzatpnhff765au4mxr',
  }, {
    label: 'PHP: lat1xj9n6edltpw426c8y93msdr24u6aur78vgzz0a',
    value: 'PHP',
    address: 'lat1xj9n6edltpw426c8y93msdr24u6aur78vgzz0a',
  }, {
    label: 'FLUTTER: lat1lz8m9a5mutrela0p5aw83tk895qrlkl7tldf4n',
    value: 'FLUTTER',
    address: 'lat1lz8m9a5mutrela0p5aw83tk895qrlkl7tldf4n',
  }])

  useEffect(() => {
    getMyLiquidityServer();
  }, [])

  useEffect(() => {
    if(activeL === 0) {
      setButton1(false);
      setButton2(false);
      setButton3(false);
    }
    if(activeL === 1) setButton1(true);
    if(activeL === 2) setButton2(true);
    if(activeL === 3) setButton3(true);
  }, [activeL])

  useEffect(() => {
    if(coinA?.address === 'lat1lyrfzdyjxs3a6a80znfkdsjmys2ef35jzl909l') {
      setActiveL(1);
      setButton1(true);
    }
    if(coinB?.address === 'lat1lyrfzdyjxs3a6a80znfkdsjmys2ef35jzl909l') {
      setActiveL(2);
      setButton2(true);
    }
  }, [coinA, coinB])

  const nextLiquidity = () => {
    if (activeL >= 3) {
      setActiveL(0);
    } else {
      setActiveL(activeL + 1);
    }
  }

  const numAChange = (value) => {
    setNumA(value)
  }

  const numBChange = (value) => {
    setNumB(value)
  }

  const coinAChange = (value) => {
    setCoinA(coinList.filter((item) => item.value === value)[0])
  }

  const coinBChange = (value) => {
    setCoinB(coinList.filter((item) => item.value === value)[0])
  }

  const coinAClear = () => {
    setActiveL(0);
    setCoinA(null);
  }

  const coinBClear = () => {
    setActiveL(0);
    setCoinB(null);
  }

  // 授权A币种
  const approve1 = () => {
    if(button1) return Message.warning('coinA已授权');
    if(coinA === null) return Message.error('请选择币种');

    ContractsUtils.sendErcApprove(coinA?.address).then(function (receipt) {
      nextLiquidity();
      console.log("approve1: ===>", receipt);
    }).catch(function (err) {
      console.log('err: ', err);
    })
  }

  // 授权B币种
  const approve2 = () => {
    if(!button1) return Message.error('coinA未授权');
    if(button2) return Message.warning('coinB已授权');
    if(coinB === null) return Message.error('请选择币种');

    ContractsUtils.sendErcApprove(coinB?.address).then(function (receipt) {
      nextLiquidity();
      console.log("approve2: ===>", receipt);
    }).catch(function (err) {
      console.log('err: ', err);
    })
  }

  // 添加流动性
  const addLiquidity = () => {
    if(!button1 && !button2) return Message.error('请完成前置操作');
    if(coinA?.value === '') return Message.error('请选择币种A');
    if(coinB?.value === '') return Message.error('请选择币种B');
    if(numA === '') return Message.error('请输入A数量');
    if(numB === '') return Message.error('请输入B数量');

    if (coinB?.value !== "LAT") {
      ContractsUtils.addLiquidity( 
        coinA?.address, 
        coinB?.address, 
        numA,
        numB,
      ).then(function (receipt) {
        nextLiquidity();
        console.log("receipt: ", receipt);
      }).catch(function (err) {
          console.log('err: ', err);
      })
    } else {
      ContractsUtils.addLatLiquidity(
        coinA?.address, 
        coinB?.address, 
        numA,
        numB,
      ).then(function (receipt) {
        nextLiquidity();
        console.log("receipt: ", receipt);
      }).catch(function (err) {
          console.log('err: ', err);
      })
    }
  }

  // 获取流动性列表
  const getMyLiquidityServer = () => {
    ContractsUtils.getMyLiquidityServer(
      "lat1ut70phnzjzv0turgkacpmvj6vcm8gzgfpmg29a",  //路由合约地址
      "lat1lyrfzdyjxs3a6a80znfkdsjmys2ef35jzl909l"   //当前用户的钱包地址
    ).then(function (response) {
      console.log(response.data.data);
      setLpList(response.data.data)
    }).catch(function (error) {
      console.log(error);
    });
  }

  const rowClassName = (row, index) => {
    if (index === 1) {
      return 'info-row';
    } else if (index === 3) {
      return 'positive-row';
    }
    return '';
  }

  const columns = [
    {
      label: "我的流动性",
      prop: "myLiquidity",
      width: 180
    },
    {
      label: "pairAddress",
      prop: "pairAddress",
      width: 180
    },
    {
      label: "routeAddress",
      prop: "routeAddress"
    },
    {
      label: "tokenAAddress",
      prop: "tokenAAddress"
    },
    {
      label: "tokenAName",
      prop: "tokenAName"
    },
    {
      label: "tokenBAddress",
      prop: "tokenBAddress"
    },
    {
      label: "tokenBName",
      prop: "tokenBName"
    },
    {
      label: "totalLiquidity",
      prop: "totalLiquidity"
    },
  ]

  return (
    <div className="SwapPage">
      <div className="addLiquidity">
        <h2>添加流动性</h2>
        <div className="input">
          <div className="coinInput">
            <p>coinA：</p>
            <Select value={coinA?.value} clearable={true} onChange={coinAChange} onClear={coinAClear} className="coinSelectStyle">
              { coinList.map(el => { return <Select.Option key={el.value} label={el.label} value={el.value} />})}
            </Select>
            <Input placeholder="请输入币种数量" onChange={numAChange} value={numA}/>
          </div>
          <div className="coinInput">
            <p>coinB：</p>
            <Select value={coinB?.value} clearable={true} onChange={coinBChange} onClear={coinBClear} className="coinSelectStyle">
              { coinList.map(el => { return <Select.Option key={el.value} label={el.label} value={el.value} />})}
            </Select>
            <Input placeholder="请输入币种数量" onChange={numBChange} value={numB}/>
          </div>
        </div>
        <Steps space={350} active={activeL} finishStatus="success" className="stepsStyle">
          <Steps.Step title="步骤 1"></Steps.Step>
          <Steps.Step title="步骤 2"></Steps.Step>
          <Steps.Step title="步骤 3"></Steps.Step>
        </Steps>
        <div className="buttonList">
          <Button onClick={approve1} className={button1 ? 'successButton' : null}>Approve CoinA</Button>
          <Button onClick={approve2} className={button2 ? 'successButton' : null}>Approve CoinB</Button>
          <Button onClick={addLiquidity} className={button3 ? 'successButton' : null}>Add Liquidity</Button>
        </div>
      </div> 

      <div className="showLiquidity">
        <h2>查看流动性LP列表</h2>
        {/* { lpList.length !== 0 &&
          <Collapse>
            {
              lpList.map((item) => {
                return <Collapse.Item title={item.title} key={item.title}>
                  <div>{item.content}</div>
                </Collapse.Item>
              })
            }
          </Collapse>
        } */}
        <Table
          style={{width: '100%'}}
          rowClassName={rowClassName}
          columns={columns}
          data={lpList}
        />
      </div>
    </div>
  )
}