Let's say you want to change your contract. You'd need to do 3 things:

We need to deploy it again.

We need to update the contract address on our frontend.

We need to update the abi file on our frontend.


Getting picture -> tokenID to tokenURI on contract -> Axios.get (IPFS JSON) -> image 

<img className="testingImage" alt="pinata" src="https://gateway.pinata.cloud/ipfs/QmYmNr2NpRYY6Zt2YbqAdibHGGQH2wTJSkqjvDWeYExJeE"/> 


<div className="row items mt-3">
{nftdata.map(result => {
    return(
        <div className="card">
            <div className="image-over">
                <img className="card-img-top" src={result.tokenId.json.image} alt="">
    )

})}

backup

<div className="card">
            <div className="image-over">
              {result.image && <img className="card-img-top" alt="pinata" src={result.image}/>}
            </div>
            <div className="card-caption col-12 p-0">
              <div className="card-body">
                <h5 className="mb-0">Random Word Collection NFT #{result.tokenid}</h5>
                <h5 className="mb-0 mt-2">Owner Wallet:<p>{result.owner}</p></h5>
                <div className="card-botom d-flex justify-content-between">
                  <Button className="btn btn-bordered-white btn-smaller mt-3">
                    <i className="mr-2" />Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </div>

  const retrieveNftData = async () => {
      let goerliApi = `
        ${goerliApiBase}module=account&action=tokennfttx&contractaddress=${CONTRACT_ADDRESS}&page=1&offset=1&tag=latest&apikey=${ethScanApiKey}
      `
      console.log(goerliApi);
        try { 
          axios.get(goerliApi)
         .then(res => {
          console.log(res.data); 
          })
        } catch (error) {
            console.log("Error talking to etherscan: ", error);
        }
}

    <button key="ethscan" onClick={retrieveNftData} className="cta-button connect-wallet-button">
      Query Contract
    </button> 