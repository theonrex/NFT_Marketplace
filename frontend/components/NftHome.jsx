import React from 'react'
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { marketplaceAddress } from '../config'; //address deployed
import NFTMarketplace from "../artifacts/contracts/NftMarket.sol/NFTMarketplace.json"; //ABI
import { providerOptions } from "./provider";

const NftHome = () => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  return (
    <div>NftHome</div>
  )
}

export default NftHome