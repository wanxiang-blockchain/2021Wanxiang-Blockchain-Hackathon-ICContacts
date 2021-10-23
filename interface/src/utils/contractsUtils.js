import Web3 from 'web3';
import axios from 'axios';
import pair from '../contracts/pair';
import erc20 from '../contracts/erc20';
import router from '../contracts/router';
import factory from '../contracts/factory';
import {
  PairAddress,
  RouteAddress, 
  Erc20Address, 
  FactoryAddress, 
  InitCodePairHash,
} from '../constants/index'

var web3 = new Web3();
const {platon} = window;
if(!!platon) web3.setProvider(platon);


// console.log(new BigNumber('11010100101'));
let ContractsUtils = {
  // rpcCatch统一方法
  rpcCatch: (err) => {
    if (err.code === 4001) {
      console.log('Please connect to Samurai.');
    } else {
      console.error(err);
    }
  },

  //发起授权合约
  sendErcApprove: (tokenAddress) => {
    console.log('sendErcApprove ===>' + tokenAddress);
    var contract = new web3.platon.Contract(erc20, tokenAddress);
    return contract.methods.approve(RouteAddress, "900000000000000000000000000000")
      .send({ from: platon.selectedAddress, gas: 4999999 })
  },

  //添加流动性
  addLiquidity: (tokenA, tokenB, valueA, valueB) => {
    var contract = new web3.platon.Contract(router, RouteAddress);
    return contract.methods.addLiquidity(
      tokenA, 
      tokenB, 
      valueA, 
      valueB,
      "0",
      "0",
      platon.selectedAddress,
      (new Date().getTime()+ 1000 * 60).toString()
    ).send({ from: platon.selectedAddress, gas: 4999999 })
  },

  //添加LAT流动性
  addLatLiquidity: (tokenA, tokenB, valueA, valueB) => {
    var contract = new web3.platon.Contract(router, RouteAddress);
    return contract.methods.addLiquidityETH(
      tokenA, 
      valueA, 
      "0",
      "0",
      platon.selectedAddress,
      (new Date().getTime()+ 1000 * 60).toString(),
      // valueB
    ).send({ from: platon.selectedAddress, value:valueB,  gas: 4999999 })
  },

  //查询我的流动性列表 - 服务器
  getMyLiquidityServer: (routeAddress, userAddress) => {
    return axios.post('http://139.196.149.112:7443/chain/platon/getLiquidityList', {
      "routeAddress": routeAddress,  //路由合约地址
      "userAddress": userAddress,    //当前用户的钱包地址
    })
  },

  //swap - 转账transfer
  transfer: (tokenAddress, pairAddress) => {
    var contract = new web3.platon.Contract(erc20, tokenAddress);
    return contract.methods.transfer(pairAddress, "10000000000")
      .send({ from: platon.selectedAddress, gas: 4999999 })
  },

  //swap - 兑换swap
  swap: () => {
    var contract = new web3.platon.Contract(router, RouteAddress);
    return contract.methods.swapExactTokensForTokens(
      "10000000", // 输入的token数量
      "0",        // 预期的输出token数量最小值
      ['lat1xj9n6edltpw426c8y93msdr24u6aur78vgzz0a',  'lat1lz8m9a5mutrela0p5aw83tk895qrlkl7tldf4n'], // [流动性的两个币种地址]
      platon.selectedAddress,
      (new Date().getTime()+ 1000 * 60).toString()
    ).send({ from: platon.selectedAddress, gas: 4999999 })
  },

  //查询Pool地址 - SDK
  getPairNode: (tokenA, tokenB) => { 
    var contract = new web3.platon.Contract(factory, FactoryAddress);
    return contract.methods.getPair(tokenA, tokenB).call()
  },

  //查询Pool地址 - 服务器
  getPairServer: (tokenA, tokenB) => {
    return axios.post('http://139.196.149.112:7443/chain/getPairAddress', {
      "factoryAddress": "lat1793rwsfgrks9wyv820wn3wfppp2zj6086stk8d",
      "tokenA": tokenA,
      "tokenB": tokenB
    })
  },

  //创建池子
  createPair: (tokenA, tokenB) => {
    var contract = new web3.platon.Contract(factory, FactoryAddress);
    return contract.methods.createPair(tokenA, tokenB)
      .send({ from: platon.selectedAddress, gas: 4999999 })
  },

  // // 获取Pair合约地址
  // const getPair = () => {
  //   ContractsUtils.getPairServer(
  //     coinA?.address,
  //     coinB?.address,
  //   ).then(function (response) {
  //     console.log(response);
  //   }).catch(function (error) {
  //     console.log(error);
  //   });
  // }

  //  // 创建Pair合约地址
  // const createPair = () => {
  //   ContractsUtils.createPair(
  //     coinA?.address,
  //     coinB?.address,
  //   ).then(function (receipt) {
  //     console.log("创建池子的结果：");
  //     console.log(receipt);
  //   }).catch(function (err) {
  //     console.log('err: ', err);
  //   })
  // }
}

export default ContractsUtils;