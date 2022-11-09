import React from "react";
import { useEffect, useState } from "react";
import { Contract, providers, utils } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import {
 
  NFT_MARKETPLACE_ADDRESS,
  NFT_MARKETPLACE_ABI,
} from "../constants";
import PolygonImg from "../public/assets/polygon.png";
import Link from "next/link";

export const FavouriteNFTs = () => {
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
    const contract = new Contract(NFT_MARKETPLACE_ADDRESS, NFT_MARKETPLACE_ABI, provider);
    const data = await contract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri)
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
  const favNft = nfts[2];

  if (favNft != undefined) {
    console.log(favNft.price);
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
  // const usd = favNft.price * favNft.price;

  //import polygon current pricr from coingecko

  const [usdPrice, setUsdPrice] = useState(null);

  useEffect(() => {
    const options = {
      method: "GET",
      url: "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd",
    };

    axios
      .request(options)
      .then((response) => {
        console.log(response.data);
        setUsdPrice(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    // console.log(usdPrice.matic-network.usd)
  }, []);
  const favNfts = nfts[3];

  if (favNfts != undefined) {
    const UsdPrice = usdPrice["matic-network"].usd * 3;

    console.log(UsdPrice);
  }

  // console.log(usdPrice.matic-network.usd)

 
  return (
    <>
      <div className="second-section container" id="Explore" data-aos="zoom-in">
        <div className="row">
          <div className="col50 fav">
            <h1>
              Choose Your Favorite <br />
              Art. If you want!
            </h1>
          </div>
          <div className="col50 begin">
            <p>
              Begin with the simplest and most secure stage to purchase <br />
              and exchange advanced workmanship and NET's
            </p>
          </div>
        </div>
        <div className="rowX nft-m">
          <div>
       
            <div className="gradient-box col50  ">
              <div className="meta-nft col50">
                <img src={favNft?.image} alt="Nft Image" />
              </div>
              <div className="meta-text col50">
                <p>{favNft?.name}</p>
                <h3>ID #{favNft?.tokenId}</h3>
                {/* <p>
                  <i className="bi bi-alarm" />{" "}
                  <span>Feb 18, 2022 at 4:07pm +06</span>
                </p> */}
                <p>
                  <img src={PolygonImg.src} className="polygon" />
                  {Number(favNft?.price).toFixed(3)} MATIC
                </p>

                <p className="nft_price_in_usd">
                  <span>
                    {" "}
                    {usdPrice && favNft
                      ? Number(usdPrice["matic-network"].usd).toFixed(2) *
                        Number(favNft.price).toFixed(2)
                      : null}{" "}
                    USD{" "}
                  </span>
                </p>
                <button
                    className="marketplace_btn_buy"
                    onClick={() => buyNft(favNft)}
                  >
                    Buy
                  </button>
             

              </div>
            </div>
          </div>
          <div className="col50">
            <div className="col50">
              <img
                src="https://theonrex.github.io/theon-NFT-Page/images/nftart.jpg"
                alt=""
              />
            </div>
            <div className="col50">
              <img
                src="https://theonrex.github.io/theon-NFT-Page/images/nfthead.jpg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
