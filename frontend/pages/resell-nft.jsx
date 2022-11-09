import React from 'react'
import { useEffect, useState } from 'react'
import { Contract, providers, utils } from "ethers";
import { useRouter } from 'next/router'
import axios from 'axios'
import Web3Modal from 'web3modal'


import { NFTMarketplace , marketplaceAddress} from "../constants";


export default function ResellNFT() {
  const [formInput, updateFormInput] = useState({ price: '', image: '' })
  const router = useRouter()
  const { id, tokenURI } = router.query
  const { image, price } = formInput

  useEffect(() => {
    fetchNFT()
  }, [id])

  async function fetchNFT() {
    if (!tokenURI) return
    const meta = await axios.get(tokenURI)
    updateFormInput(state => ({ ...state, image: meta.data.image }))
  }

  async function listNFTForSale() {
    if (!price) return
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const priceFormatted = utils.parseUnits(formInput.price, 'ether')
    let contract = new Contract(marketplaceAddress, NFTMarketplace, signer)
    let listingPrice = await contract.getListingPrice()

    listingPrice = listingPrice.toString()
    let transaction = await contract.resellToken(id, priceFormatted, { value: listingPrice })
    await transaction.wait()
   
    router.push('/')
  }

  return (
    <div className=" container ">
      <div className="rowx">
        <div className="col50 resell_nft">
          <header>Sell Your NFTs</header>

          <input
            placeholder="Asset Price in MATIC"
            className="resel_nft_input"
            onChange={(e) =>
              updateFormInput({...formInput, price: e.target.value})
            }
          />
          <button onClick={listNFTForSale} className="resell_btn">
            List NFT
          </button>
        </div>

        <div className="col50 resel_nft_image">
          {image && <img className="rounded mt-4" width="350" src={image} />}
        </div>
      </div>
    </div>
  );
}