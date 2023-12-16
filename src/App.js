
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";
import GreenText from './components/GreenText';
import exportAsImage from './utils/exportAsImage';

import './css/index.css';

function App() {
    const gtContainer = useRef();
    const dispatch = useDispatch();
    const account = useSelector(state => state.account);

    const [imgData, setImgData] = useState({
        src: 'pepe.jpg',
        size: 0,
        type: 'none'
    });

    const mintNFT = () => {
        exportAsImage(gtContainer.current, (image) => {
            dispatch({ type: "MINT", payload: { image: image } });
        });
    };

    const selectImageFile = (event) => {
        const file = event.target.files[0];
        setImgData({
            src: URL.createObjectURL(file),
            size: Math.ceil(file.size / 1000),
            type: file.type.split('/')[1].toUpperCase(),
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

    return (
        <div className="App GreenTextBg h-full">
            <div className="m-auto w-[90%] md:w-[1024px] items-center">
                <div className=" m-auto w-full flex flex-row items-center align-center Title_BG">
                    {/* <p className="w-full Title text">GreenTexts the Most Memeish feature on the Internet now on NFTs</p> */}
                </div>
                <div className=" m-auto w-full mt-5 flex flex-row items-center md:w-[512px]">
                    {
                        account ? 
                        <div className="mx-auto ">{account}</div>
                        :
                        <button className="button bg-[#e2d1c6] m-auto" onClick={handleConnect}>Connect Wallet</button>
                    }
                </div>                
                <div className=" m-auto w-full mt-1 flex flex-row justify-between md:w-[512px]">
                    <input type="file" id="myImage" onChange={selectImageFile} hidden />
                    <label htmlFor="myImage" className="mx-auto button bg-[#e2d1c6]">Upload Image</label>
                    <button className="mx-auto button bg-[#e2d1c6]" onClick={mintNFT}>Mint</button>
                </div>
                <GreenText ref={gtContainer}>
                    <GreenText.Header />
                    <GreenText.Body imgData={imgData} />
                </GreenText>
            </div>
        </div>
    );
}

export default App;
