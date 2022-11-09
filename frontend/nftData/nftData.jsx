import React from 'react'
import {useEffect, useState} from "react";
import {Contract, providers, utils} from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import {abi, NFT_CONTRACT_ADDRESS} from "../constants";

export const nftData = () => {
    const [nfts, setNfts] = useState([]);

    const [loadingState, setLoadingState] = useState("not-loaded");
    useEffect(() => {
      loadNFTs();
    }, []);
  
    async function loadNFTs() {
      /* create a generic provider and query for unsold market items */
      const provider = new providers.JsonRpcProvider(
        "https://polygon-mumbai.infura.io/v3/4fa55521d0f647f28c1a179e85f454da"
      );
      const contract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
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
    const homeNft = nfts[0];
  
    if (homeNft != undefined) {
      console.log(homeNft.price);
    }
    console.log(homeNft);
  return (
    <div>

        {
            

        }


    </div>
  )
}
