import { ethers } from "ethers";
import { RelationFactoryContractAddress } from '../constants/index.js';
import relationFactoryContractABI from '../utils/contracts/releationFactoryContract.js';
import addressListContractABI from '../utils/contracts/addressListContract.js';

let ContractsUtils = {

  // 生成一个infuraProvider实例
  getEthersProvider:() => {
    try {
      return new ethers.providers.JsonRpcProvider(
        "https://rinkeby.infura.io/v3/118060a28fc04ba3abff5aa8530ce0e9"
      );
    } catch(err) {
      console.log(err);
    }
  },

  // wallet实例方式1 - 创建一个随机账户
  getRandomWallet:() => {
    try {
      let wallet = ethers.Wallet.createRandom();
      return wallet.connect(ContractsUtils.getEthersProvider());
    } catch(err) {
      console.log(err);
    }
  },

  // wallet实例方式2 - 通过【privateKey】导入
  getPrivateKeyWallet:(privateKey) => {
    try {
      let wallet = new ethers.Wallet(privateKey);
      return wallet.connect(ContractsUtils.getEthersProvider());
    } catch(err) {
      console.log(err);
    }
  },

  // wallet实例方式3 - 通过【keyStore + 密码】导入
  getKeyStoreWallet:(data, password) => {
    try {
      ethers.Wallet.fromEncryptedJson(JSON.stringify(data), password).then(function(wallet) {
        return wallet.connect(ContractsUtils.getEthersProvider());
      });
    } catch(err) {
      console.log(err);
    }
  },

  // wallet实例方式4 - 通过【助记词】导入
  getMnemonicWallet:(mnemonic) => {
    try {
      let wallet = ethers.Wallet.fromMnemonic(mnemonic);
      return wallet.connect(ContractsUtils.getEthersProvider());
    } catch(err) {
      console.log(err);
    }
  },

  // wallet实例方式5 - 通过localStorage中获取
  getLocalStorageWallet:() => {
    try {
      let wallet = new ethers.Wallet(JSON.parse(window.localStorage.getItem("wallet")));
      return wallet.connect(ContractsUtils.getEthersProvider());
    } catch(err) {
      console.log(err);
      return null;
    }
  },

  //合约方法 - 1.创建relationContract对象
  createRelationContract: () => {
    try {
      let wallet = ContractsUtils.getLocalStorageWallet();
      var relationContract = new ethers.Contract(RelationFactoryContractAddress, relationFactoryContractABI, wallet);
      return relationContract;
    } catch(err) {
      console.log(err);
    }
  },

  //合约方法 - 2.获取当前用户的好友合约地址
  getRelationAddress: async() => {
    try {
      let wallet = ContractsUtils.getLocalStorageWallet();
      var relationContract = ContractsUtils.createRelationContract();
      let relationAddress = await relationContract.getAddressListContract(wallet.address);
      if (relationAddress == undefined || relationAddress == null || relationAddress == "0x0000000000000000000000000000000000000000") {
        await relationContract.createAddressListContract(wallet.address)
        relationAddress = await relationContract.getAddressListContract(wallet.address);
      }
      console.log("当前用户的好友合约 地址：" + relationAddress);
      return relationAddress;
    } catch(err) {
      console.log(err);
    }
  },

  //合约方法 - 3.获取addressListContract对象
  createAddressListContract: async() => {
    try {
      let wallet = ContractsUtils.getLocalStorageWallet();
      var addressListContract = new ethers.Contract(await ContractsUtils.getRelationAddress(), addressListContractABI, wallet);
      return addressListContract;
    } catch(err) {
      console.log(err);
    }
  },

  //合约方法 - 4.获取当前用户基本信息
  getUserInfo: async() => {
    try {
      var addressListContract = await ContractsUtils.createAddressListContract();
      let ownerNickName = await addressListContract.ownerNickName();
      let ownerAvatar = await addressListContract.ownerAvatar();
      console.log("当前用户的昵称" + ownerNickName + ",当前用户的头像：" + ownerAvatar);
    } catch(err) {
      console.log(err);
    }
  },

  //合约方法 - 5.添加好友
  addFriend: async(value) => {
    try {
      var addressListContract = await ContractsUtils.createAddressListContract();
      return  addressListContract.addFriend(
        value, //好友的地址
        ContractsUtils.getUserName(value), //好友备注
        RelationFactoryContractAddress //好友来源，暂时写死
      );
    } catch(err) {
      console.log(err);
    }
  },

  //合约方法 - 6.获取当前用户好友列表
  getFriendList: async() => {
    try {
      let addressListContract = await ContractsUtils.createAddressListContract();
      let friendInfoSize = await addressListContract.friendSize();
      friendInfoSize = parseInt(friendInfoSize);
      if (friendInfoSize != window.localStorage.getItem("friendSize")) {
        let friendList = [];
        //遍历，获取好友列表
        if (friendInfoSize > 0) {
          for (var i = 1; i <= friendInfoSize; i++) {
            let friendAddress = await addressListContract.indexAddressMap(i);
            let friendInfo = await addressListContract.friendMap(friendAddress);
            console.log(friendInfo);
            friendList.push({
              name: friendInfo.name,
              identity: friendInfo.identity,
              iconUrl: 'https://wepiggy.static.fortop.site/app/static/lowRisk.aa37608b.gif',
            })
          }
        }
        window.localStorage.setItem("friendSize", friendList.length);
        window.localStorage.setItem("friendList", JSON.stringify(friendList));
        return friendList;
      } else {
        if(!!window.localStorage.getItem("friendList") == true) {
          return JSON.parse(window.localStorage.getItem("friendList"));
        } else {
          return [];
        }
      }
    } catch(err) {
      console.log(err);
    }
  },

  //合约方法 - 7.向好友发送消息
  sendMessage: async(currentItem) => {
    try {
      console.log(currentItem);
      var addressListContract = await ContractsUtils.createAddressListContract();
      var userName = ContractsUtils.getUserName(ContractsUtils.getLocalStorageWallet().address)
      return addressListContract.sendMessage(
        currentItem?.identity, 
        `https://ivg37-qiaaa-aaaab-aaaga-cai.ic0.app/#!/game/${currentItem?.name}/.${userName}`
      )
    } catch(err) {
      console.log(err);
    }
  },

  //合约方法 - 9.监听自己收到的消息
  listenMessage: async() => {
    try {
      let messageList = [];
      messageList = [...JSON.parse(window.localStorage.getItem("messageList"))]
      var addressListContract = await ContractsUtils.createAddressListContract();
      addressListContract.on('GetMessage', (from, to, value) => {
        messageList.push({
          sender: value.args.sender,
          message: value.args.message,
        });
        window.localStorage.setItem("messageList", JSON.stringify(messageList));
      });
    } catch(err) {
      console.log(err);
    }
  },

  // 通用方法 - 获取用户昵称（默认地址: 前4-后4 ）
  getUserName: (address) => {
    if(address  != null) {
      return address.substring(0, 4)+"-"+address.substr(address.length-4);
    }
  },

  // 通过方法 - 判断好友是否创建好友合约
  isCreateRelationAddress: async(address) => {
    try {
      var relationContract = ContractsUtils.createRelationContract();
      let relationAddress = await relationContract.getAddressListContract(address);
      console.log(relationAddress);
      if(relationAddress == '0x0000000000000000000000000000000000000000') {
        return false;
      } else {
        return true;
      }
    } catch(err) {
      console.log(err);
    }
  }

}

export default ContractsUtils;