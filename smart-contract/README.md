# Contract 

## Overview

We use smart contracts to record the user's address book. First, the factory contract will be used to create a user's own address book, and subsequent users can operate on their own address book, including adding friends, modifying friends' notes, and sending users information. 

Considering that the contract can be compatible with multiple chains as much as possible, we tried to use solidity and motoko to implement this smart contract.

## solidity-contract deploy

1. access to remix: http://remix.app.hubwiz.com/
2. compile contract
3. deploy  contract: OpenInfo
4. deploy factory contract: ReleationFactory

## motoko-contract deploy

1. create canister ：  https://nns.ic0.app
2. get your principal and add to controller
   ~~~
    dfx identity get-principal
   ~~~
3. edit canister_ids.json
   ~~~
    {
    "relationship": {
        "ic": "canister-id"
    }
  }
   ~~~
4. deploy 
   ~~~
    dfx deploy --network ic --no-wallet
   ~~~


