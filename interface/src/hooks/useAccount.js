import Web3 from 'web3';
import { useState, useEffect} from 'react'
import ContractsUtils from '../utils/contractsUtils.js';

export default function useAccount(){
  var web3 = new Web3();
  const {platon} = window;
  if(!!platon) web3.setProvider(platon);

  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState('');
  const [blockNumber, setBlockNumber] = useState();
  const [currentAccount, setCurrentAccount] = useState(null);

  // 初始化
  useEffect(() => {
    if(!!platon) {
      getBlockNumber();
      setChainId(platon.chainId);
      getBalance(platon.selectedAddress);
      setCurrentAccount(platon.selectedAddress)
    }
  }, [])

  if(!!platon) {
    // 监听账户切换/链切换
    platon.on('accountsChanged', function(accounts) {
      getBlockNumber();
      getBalance(accounts[0]);
      setChainId(platon.chainId);
      setCurrentAccount(accounts[0]);
    });
    platon.on('chainChanged', function (chainId) {
      getBlockNumber();
      setChainId(chainId);
      getBalance(platon.selectedAddress);
    });
  }

  // 查余额
  const getBalance = (account) => {
    if(!!account){
      web3.platon.getBalance(account, web3.platon.defaultBlock)
      .then((res) => {setBalance(res)})
      .catch((err) => ContractsUtils.rpcCatch(err));
    }
  }

  // 查区块编号
  const getBlockNumber = () => {
    web3.platon.getBlockNumber()
      .then((res) => {setBlockNumber(res)})
      .catch((err) => ContractsUtils.rpcCatch(err));
  }

  return {
    chainId,
    balance,
    blockNumber,
    currentAccount
  };
}
