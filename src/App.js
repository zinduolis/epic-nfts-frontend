import React, { useEffect, useState } from "react";
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Spinner from 'react-bootstrap/Spinner';
import profile from './assets/profilepic.webp';
import { ethers } from "ethers";
import myEpicNft from './utils/MyEpicNFT.json';

const WEBSITE = 'https://redgraz.vercel.app/';
const goerliChainId = "0x5"; 

const CONTRACT_ADDRESS = "0x81927EC8E60AB44D1BE4319832cB226389cE6cAa";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get Metamask!");
        return;
      }

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);

      if (chainId !== goerliChainId) {
        alert("You are not connected to the Goerli Test Network!");
      } else {
        const accounts = await ethereum.request({ method: "eth_requestAccounts"});
        console.log("Connected with account: ", accounts[0]);
        setCurrentAccount(accounts[0]);
        setupEventListener();
      }      
    } catch (error) {
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
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        let chainId = await ethereum.request({ method: 'eth_chainId' });
        console.log("Connected to chain " + chainId);

        if (chainId !== goerliChainId) {
          alert("You are not connected to the Goerli Test Network!");
        } else {
          console.log("Going to pop wallet now to pay gas...");
          let nftTxn = await connectedContract.makeAnEpicNFT();

          console.log("Mining... please wait");
          await nftTxn.wait();

          console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);
        }      
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect Your Wallet
    </button>
  );

  const renderMintUI = () => (
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Mint NFT
    </button>
  );

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
        <Spinner animation="border" variant="success"/>   
          <p className="header gradient-text">Random NFTs 💎</p>
          <p className="sub-text">
           ✨Each unique. Each beautiful. Discover your NFT today✨
          </p>
          {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
        </div>
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