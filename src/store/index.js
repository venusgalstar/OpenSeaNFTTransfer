import { createStore } from 'redux'
import Web3 from 'web3';
import Web3Modal from "web3modal";
import config from '../config/index';
import { toast } from 'react-toastify';
import {toUtf8Bytes}  from 'ethers';

const providerOptions = {};
const web3Modal = new Web3Modal({
    //network: "testnet", // optional
    cacheProvider: true, // optional
    providerOptions // required
});
const provider = await web3Modal.connect();
const web3 = new Web3(provider);
let ERC1155Contract;

const createContract = async (state, address) => {
    try {
        ERC1155Contract = new web3.eth.Contract(config.ERC1155Abi, address);
    } catch (e) {
        console.log(e);
    }
}
const TransferNFT = async (state, payload) => {
    if (!state.account) {
        alertMsg("Please connect metamask!");
        return;
    }
    console.log("payload", payload);

    try {
        console.log("config.ERC1155Abi", config.ERC1155Abi);
        ERC1155Contract = new web3.eth.Contract(config.ERC1155Abi, payload.contractAddress);
        console.log("Account:", state.account);
        console.log("receiver:", payload.receiverAddress);

        const bytesData = web3.utils.toHex("0x");
        await ERC1155Contract.methods.safeTransferFrom(state.account, payload.receiverAddress, parseInt(payload.nftID), 1, bytesData).send({ from: state.account });

    } catch (e) {
        console.log(e);
    }
}

const alertMsg = (msg) => {
    toast.info(msg, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}

const checkNetwork = (chainId) => {
    if (chainId !== config.chainId) {
        alertMsg("Change network to BSC Mainnet!");
        return false;
    } else {
        return true;
    }
}

const changeNetwork = async () => {
    try {
        console.log("changeNetwork: chain_id=", config.chainId);
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: web3.utils.toHex(config.chainId) }],
        });
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: web3.utils.toHex(config.chainId),
                            chainName: 'Avalanche',
                            rpcUrls: [config.mainNetUrl] /* ... */,
                        },
                    ],
                });
            } catch (addError) {
            }
        }
    }
}

if (window.ethereum) {
    window.ethereum.on('accountsChanged', function (accounts) {
        console.log("Accounts changed: ", accounts);
        store.dispatch({
            type: "UPDATE_ACCOUNTS",
            payload: {
                accounts: accounts
            }
        });
    });

    window.ethereum.on('chainChanged', function (chainId) {
        console.log("chainChanged: ", parseInt(chainId));
        store.dispatch({
            type: "UPDATE_CHAIN_ID",
            payload: {
                chainId: parseInt(chainId)
            }
        });
    });

    web3.eth.getChainId().then((chainId) => {
        console.log("getChainId: ", parseInt(chainId));
        store.dispatch({
            type: "UPDATE_CHAIN_ID",
            payload: {
                chainId: parseInt(chainId)
            }
        });
    })
}

const _initialState = {
    account: "",
    chainId: 0,
    NFTs: 0,
};

const reducer = (state = _initialState, action) => {
    switch (action.type) {
        case "CREATECONTRACT":
            createContract(state, action.payload.address);
            break;

        case "TRANSFER_NFT":
            console.log("heeee");
            TransferNFT(state, action.payload);
            break;
        case "UPDATE_CHAIN_ID":
            state = {
                ...state,
                chainId: action.payload.chainId,
            };
            if (action.payload.chainId !== config.chainId) {
                state = {
                    ...state,
                    account: ""
                };
            }
            break;

        case "UPDATE_ACCOUNTS":
            if (state.account) {
                state = {
                    ...state,
                    account: action.payload.accounts.length > 0 ? action.payload.accounts[0] : ""
                };
            }
            break;

        case "CONNECT":
            console.log("Trying CONNECT<state, config>:", state.chainId, config.chainId);
            if (!checkNetwork(state.chainId)) {
                changeNetwork();
                return state;
            }

            window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
                if (accounts.length > 0) {
                    store.dispatch({
                        type: 'UPDATE',
                        payload: {
                            account: accounts[0]
                        }
                    });
                }
            })
                .catch((err) => {
                    console.error(err);
                });
            break;

        // case "MINT":
        //     if (!checkNetwork(state.chainId)) {
        //         changeNetwork();
        //         return state;
        //     }

        //     mint(state, action.payload.image);
        //     break;


        case "UPDATE":
            return Object.assign({}, state, action.payload);

        default:
            break;
    }
    return state;
}

const store = createStore(reducer);
export default store