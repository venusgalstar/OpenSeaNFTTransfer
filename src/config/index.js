import ERC721Abi from './ERC721Abi.json';

// real net, avalanche-c chain
var config = {
    ERC721Abi: ERC721Abi,
    ERC721Address: "0x86b8E921a6b740F2fe9F0b51C69eaafC1C09c5Ca", // GreenTextNFT contract address

    //mainNetUrl: "https://mainnet.infura.io/v3/", //Ethereum mainnet RPC
    //chainId: 1, // Ethereum mainnet chain id

    mainNetUrl: "https://data-seed-prebsc-1-s1.binance.org:8545", //bsc testnet RPC
    chainId: 97, // bsc testnet chain id,

    baseTokenURI: "http://95.217.33.149/green-text-nft/",
};

export default config; 
