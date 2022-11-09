import React from 'react'
import { Contract, providers, utils } from "ethers";
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router'
import { NFT_ABI, NFT_ADDRESS, NFT_MARKETPLACE_ABI , NFT_MARKETPLACE_ADDRESS} from "../constants";

export default function MyAssets() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const router = useRouter()
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new providers.Web3Provider(connection)
    const signer = provider.getSigner()


    const marketplaceContract = new Contract(NFT_MARKETPLACE_ADDRESS, NFT_MARKETPLACE_ABI, signer)
    const data = await marketplaceContract.fetchMyNFTs()

    const items = await Promise.all(data.map(async i => {
      const tokenURI = await marketplaceContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenURI)
      let price = utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        name: meta.data.name,
        image: meta.data.image,
        description: meta.data.description,
        tokenURI,
      };
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  function listNFT(nft) {
    console.log('nft:', nft)
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
  }
  if (loadingState === 'loaded' && !nfts.length) return <h1 className="no_my_nfts">No NFTs owned</h1>;
  return (
    <div className="container">
      <div className="rowx nft-mg">
        <div className="">
          {nfts.map((nft, i) => (
            <div key={i} className="col29 nft-img gradient-box gradient-box epic-img nft_home_img_width">
              <img src={nft.image} className="" />
              <div className="my_nfts_text">
                <p>Name: { nft.name}</p>
                <p className="">Price - {nft.price} Eth</p>
                <button className="mynfts_btn " onClick={() => listNFT(nft)}>
                  List
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}