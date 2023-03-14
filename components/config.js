import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import userDbAbi from '../components/userdb.json';
import tokenAbi from '../components/erc20abi.json'


{/*const client = create('http://172.20.10.2:5001');

const data = await client.add('Hey this is Big Walt from Block Republic');
console.log(data);*/}

export const client = ipfsHttpClient('http://172.20.10.2:5001');
export const userdbaddress = '0xE546ebB8338B5359732E9B2841B26eE17050a125';
const rpc = 'https://rpc-mumbai.maticvigil.com';
const updaterwallet = '593a3a6eb8be9717c7d88e23190a9db446f5520d89ab2f41d7e00db8ca8e1760';
const provider = new ethers.providers.JsonRpcProvider(rpc);
const updater = new ethers.Wallet(updaterwallet, provider);
export const usercontract = new ethers.Contract(userdbaddress, userDbAbi, updater);
export const nftcontract = "0x37Fe871E299ba7C41865F072DC4F614c6f19EEB9";
export const tokenaddress = "0x676Bc22ac18831B99aFDB3C6267efCa0a15BF2Bc";
export const tokencontract = new ethers.Contract(tokenaddress, tokenAbi, updater);