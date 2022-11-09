import React from "react";
import { useEffect, useState } from "react";
import { Contract, providers, utils } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import {  NFT_MARKETPLACE_ABI, NFT_MARKETPLACE_ADDRESS , NFT_ADDRESS , NFT_ABI } from "../constants";
import Link from "next/link";

const Marketplace = () => {
  const [nfts, setNfts] = useState([]);

  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);



  
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new providers.JsonRpcProvider(
      `https://polygon-mumbai.infura.io/v3/4fa55521d0f647f28c1a179e85f454da`
    );
    // const nftContract = new Contract(NFT_ADDRESS, NFT_ABI, provider);

    const contract = new Contract(NFT_MARKETPLACE_ADDRESS, NFT_MARKETPLACE_ABI, provider);

    const data = await contract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new Contract(
      NFT_MARKETPLACE_ADDRESS,
      NFT_MARKETPLACE_ABI,
      signer
    );

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    loadNFTs();
  }
  return (
    <div>
      {" "}
      <div className="nft_marketpace" style={{ maxWidth: "1600px" }}>
        <header>Market Place</header>

        <div className="rowx nft-mg">
          {nfts.map((nft, i) => (
            <div key={i} className="col29 nft-img gradient-box gradient-box epic-img nft_home_img_width">
              <img src={nft.image} />
              <div className="marketplace_nft_text">
                <p className="text-2xl font-semibold">Name : {nft.name}</p>
                <div style={{ overflow: "hidden" }}>
                  <p className="text-gray-400">
                    {" "}
                    Description : {nft.description}
                  </p>
                </div>

                <div className="">
                  <p className="">Price : {nft.price} Matic</p>
                  <button
                    className="marketplace_btn_buy"
                    onClick={() => buyNft(nft)}
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
