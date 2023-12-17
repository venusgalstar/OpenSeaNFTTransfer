import ERC1155Abi from './erc1155abi.json';

var address = [
    "0x7361A0E33F717BaF49cd946f5B748E6AA81cC6Fb",
];

// real net, avalanche-c chain
var config = {
    APIKEY: '',
    ERC1155Abi:ERC1155Abi,
    ADDRESSLIST: address,
    mainNetUrl: "https://polygon.llamarpc.com", //bsc testnet RPC
    chainId: 137, // bsc testnet chain id,
};

export default config; 
