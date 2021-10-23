import './index.scss'
import { useState, useEffect } from 'react'
import { Button, Steps, Input } from 'element-react';
import ContractsUtils from '../../utils/contractsUtils';

export default function Swap() {
  const [activeS, setActiveS] = useState(0);

  useEffect(() => {

  }, [])

  const nextSwap = () => {
    if (activeS >= 2) {
      setActiveS(0);
    } else {
      setActiveS(activeS + 1);
    }
  }

  // 授权A币种
  // const approve1 = () => {
  //   ContractsUtils.sendErcApprove(coinA?.address).then(function (receipt) {
  //     nextLiquidity();
  //     console.log("approve1: ===>", receipt);
  //   }).catch(function (err) {
  //     console.log('err: ', err);
  //   })
  // }

  // swap
  const swap = () => {
    ContractsUtils.swap().then(function (receipt) {
      console.log("swap: ===>", receipt);
    }).catch(function (err) {
      console.log('err: ', err);
    })
  }

  return (
    <div className="SwapPage">
      <div className="coinSwap">
        <h2>币币兑换</h2>
        <div className="input">
          <Input placeholder="请输入币种A" />&nbsp;
          <Input placeholder="请输入币种B" />
        </div>
        <Steps space={200} active={activeS} finishStatus="success" className="steps">
          <Steps.Step title="步骤 1"></Steps.Step>
          <Steps.Step title="步骤 2"></Steps.Step>
        </Steps>
        <div className="buttonList">
          <Button onClick={swap}>Approve</Button>
          <Button onClick={nextSwap}>Swap</Button>
        </div>
      </div>
    </div>
  )
}