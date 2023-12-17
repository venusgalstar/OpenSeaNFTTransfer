
import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";
import './css/index.css';
import config from './config'
// const sdk = require('api')('@opensea/v2.0#11yss2slq5imwsc');

// sdk.auth(config.APIKEY);

let idx;
let map = [];

console.log("config.ADDRESSLIST", config.ADDRESSLIST);
for (idx = 0; idx < config.ADDRESSLIST.length; idx++) {
    map.push({
        address: config.ADDRESSLIST[idx],
        nftID: idx + 1
    });
}

console.log("map", map);

function App() {
    const dispatch = useDispatch();
    const account = useSelector(state => state.account);
    const [contractAddress, setContractAddress] = useState('');
    const [inputArray, setInputArray] = useState(map);

    console.log("inputArray", inputArray);

   

    const createContractAndFill = async () => {
        dispatch({
            type: 'CREATECONTRACT',
            payload: {
                address: contractAddress
            }
        });
    }

    const setNftID = (index, value) => {
        const newInputArray = [...inputArray];
        console.log("map before", newInputArray);
        newInputArray[index].nftID = value;
        setInputArray(newInputArray);
        console.log("map", newInputArray);
    }

    const transferNFT = (idx) => {
        if (contractAddress == '') {
            // alert("Wrong smart contract address");
            return;
        }

        console.log("idx", idx);

        dispatch({
            type: 'TRANSFER_NFT',
            payload: {
                contractAddress: contractAddress,
                receiverAddress: inputArray[idx].address,
                nftID: inputArray[idx].nftID
            }
        });
    };

    const handleConnect = async () => {
        console.log("Dispatching CONNECT...");
        if (window.ethereum) {
            await window.ethereum.enable();
            dispatch({
                type: 'CONNECT',
                payload: {}
            });
        } else {
            toast.info('Please install metamask on your device', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };


    useEffect(() => {

        // sdk.list_collections({chain_identifier: 'matic', include_hidden: 'true', limit: '100'})
        //     .then(({ data }) => console.log(data))
        //     .catch(err => console.error(err));

    }, []);

    return (
        <div className="App GreenTextBg h-full">
            <div className="m-auto w-[90%] md:w-[1024px] items-center">
                <div className=" m-auto w-full flex flex-col items-center align-center Title_BG">
                    {/* <p className="w-full Title text">GreenTexts the Most Memeish feature on the Internet now on NFTs</p> */}
                </div>
                <div className=" m-auto w-full mt-5 flex flex-col items-center md:w-[512px]">
                    {
                        account ?
                            <div className="mx-auto ">{account}</div>
                            :
                            <button className="button bg-[#e2d1c6] m-auto" onClick={handleConnect}>Connect Wallet</button>
                    }
                </div>
                <div className=" m-auto w-full mt-5 flex flex-col items-center md:w-[512px]">
                    NFT Contract Address
                    <input onChange={(e) => setContractAddress(e.target.value)}></input>
                </div>
                <div className=" m-auto w-full mt-1 flex flex-col justify-between md:w-[512px]">
                    <button className="mx-auto button bg-[#e2d1c6]" onClick={createContractAndFill}>Select And Autofill</button>
                </div>
            </div>
            <div className="m-auto w-[90%] md:w-[1024px] items-center flex">
                <div className=" m-auto w-full mt-5 flex flex-col items-center md:w-[512px]">
                    Address List
                    {
                        config.ADDRESSLIST.map((item, index) => (
                            <div key={index} className='flex mt-5'>{item}</div>
                        ))
                    }
                </div>
                <div className=" m-auto w-full mt-5 flex flex-col items-center md:w-[512px]">
                    NFT ID List
                    {
                        inputArray.map((item, index) => (
                            <input key={index} className='flex mt-5' value={item.nftID} onChange={(e) => setNftID(index, e.target.value)}></input>
                        ))
                    }
                </div>
                <div className=" m-auto w-full mt-5 flex flex-col justify-between md:w-[512px]">
                    Transfer
                    {
                        config.ADDRESSLIST.map((item, index) => (
                            <button key={index} className="button bg-[#e2d1c6]" onClick={(e) => transferNFT(index)}>Transfer</button>
                        ))
                    }

                </div>
            </div>
        </div>
    );
}

export default App;
