import React, { useEffect, useState } from "react";
import axios from 'axios';
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Spinner from 'react-bootstrap/Spinner';
import profile from './assets/profilepic.webp';
import { ethers } from "ethers";
import myEpicNft from './utils/MyEpicNFT.json';

const WEBSITE = 'https://redgraz.vercel.app/';
const nftGenerateAPI = 'https://pinata-uploadfile.vercel.app/nft';
const goerliChainId = "0x5"; 

const CONTRACT_ADDRESS = "0x6E71599bfaC67F72f1a5ac2A4193D4Cd91Dea40c";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [mintedNftCount, setMintedNftCount] = useState(0);

  const connectWallet = async () => {
    try {
      setLoading(true); 
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get Metamask!");
        setLoading(false); 
        return;
      }

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);

      if (chainId !== goerliChainId) {
        setLoading(false); 
        alert("You are not connected to the Goerli Test Network!");
      } else {
        const accounts = await ethereum.request({ method: "eth_requestAccounts"});
        console.log("Connected with account: ", accounts[0]);
        setCurrentAccount(accounts[0]);
        setLoading(false); 
        setupEventListener();
      }      
    } catch (error) {
      setLoading(false); 
      console.log(error); 
    }
  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take max of 10 min to show up on Rarible. Here's the link: https://testnet.rarible.com/token/${CONTRACT_ADDRESS}:${tokenId.toNumber()}`);
        });

        console.log("Setup event Listener!");

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const askContractToMintNft = async () => {

    try {
      const { ethereum } = window;

      if (ethereum) {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        let chainId = await ethereum.request({ method: 'eth_chainId' });
        console.log("Connected to chain " + chainId);

        if (chainId !== goerliChainId) {
          alert("You are not connected to the Goerli Test Network!");
        } else {
          let nftCount = await connectedContract.getTotalNFTsMintedSoFar();
          console.log("NFT count: ",Number(nftCount));
          setMintedNftCount(Number(nftCount));
          console.log("Going to pop wallet now to pay gas...");
          let generateNft = await axios.get(nftGenerateAPI);    
          console.log("nftJson: ", generateNft.data.json);
          let nftTxn = await connectedContract.makeRandomNFTFromIPFS(generateNft.data.json);
          
          console.log("Mining... please wait");
          await nftTxn.wait();         
          console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);

          nftCount = await connectedContract.getTotalNFTsMintedSoFar();
          console.log("NFT count: ",Number(nftCount));
          setMintedNftCount(Number(nftCount));
        } 
        setLoading(false);     
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      setLoading(false); 
      console.log(error);
    }
  }

  const renderNotConnectedContainer = () => (
    <button key="Connect" onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect Your Wallet
    </button>
  );

  const renderMintUI = () => (
    <button key="Mint" onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Mint NFT
    </button>  
  );

  const loadingSpinner = () => (
    <Spinner key="Spin" animation="border" variant="success"/> 
  );

//   const retrieveNftData = async () => {
//         try {
          
//           axios.get(nftGenerateAPI)
//          .then(res => {
//           const nftData = res.data.image;
//           console.log(nftData); 
//         })

//           // const ImgHash = `ipfs://${resFile.data.IpfsHash}`;

//         } catch (error) {
//             console.log("Error sending File to IPFS: ")
//             console.log(error)
//         }
// }

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;
  
      if (!ethereum) {
        console.log("Connect your memtamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
  
      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);
  
      if (chainId !== goerliChainId) {
        alert("You are not connected to the Goerli Test Network!");
      } else {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
  
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account: ", account);
          setCurrentAccount(account);
          setupEventListener();
        } else {
          console.log("No authorized account detected");
        }
      }   
    }
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="App">    
      <div className="container">   
        <div className="header-container">    
          <p className="header gradient-text">Random NFTs 💎</p>
          <p className="sub-text">
           ✨Each unique. Each beautiful. Discover your NFT today✨
          </p>
          {currentAccount === "" ? 
            [loading ? loadingSpinner() : renderNotConnectedContainer()] : 
            [loading ? loadingSpinner() : renderMintUI()]}
        </div>
        {mintedNftCount === 0 ? null :
        (<p className="header gradient-text2"> {mintedNftCount} out of 50 minted</p>)}
        <div className="footer-container">
          <img alt="Profile" className="profile" src={profile} />
          <a
            className="footer-text"
            href={WEBSITE}
            target="_blank"
            rel="noreferrer"
          >{'built by RedGraz'}</a>
        </div>
      </div>
    </div>
  );
};

export default App;