import React from "react";
import { useEffect, useState } from "react";
import { Contract, providers, utils } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import { NFT_MARKETPLACE_ABI, NFT_MARKETPLACE_ADDRESS } from "../constants";
import Link from "next/link";
import Backgroundimg from "../public/assets/cta-shape-right.png";
import Backgroundimageleft from "../public/assets/cta-2-left.png";
function Homebanner() {
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

    const contract = new Contract(
      NFT_MARKETPLACE_ADDRESS,
      NFT_MARKETPLACE_ABI,
      provider
    );
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

  //link [id]

  const ROUTE_POST_ID = "posts/[id]";
  const posts = [
    {
      id: homeNft?.name,
      title: homeNft?.tokenId,
    },
  ];

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
    <>
      <div className="  first-section" id="Home" data-aos="fade-right">
        <div className="background_img">
          <img src={Backgroundimg.src} alt="" />
        </div>

        <div className="background_img_left">
          <img src={Backgroundimageleft.src} alt="" />
        </div>

        <div className="container rowX">
          <div className="col50 first-nft ">
            <h1 className="gather">
              Discover Digital Artworks & Collect <span>Best NFTs </span>{" "}
            </h1>
            <p>
              Get Started with the easiest and most secure platform to buy and
              trade digital ART and NFT's
            </p>
            <div className="explore">
              <button className="buy-btn ">
                <a href="/marketplace"> Explore More</a>
              </button>
              <h3 className="explore-mg">
                <a href="/marketplace">
                  {" "}
                  <i className="bi bi-play-fill" />
                </a>{" "}
                <span>Show More </span>
              </h3>
            </div>
            <div className="first-counter">
              <h2 className="works">
                23 K+ <br /> <span>Art Work</span>
              </h2>
              <h2 className="works">
                20 K+ <br /> <span>Auction</span>
              </h2>
              <h2 className="works">
                8 K+ <br /> <span>Artist</span>
              </h2>
            </div>
          </div>
          <div className="col50 nfthead">
            <div className="bid gradient-box">
              <div>
                <img
                  src={homeNft?.image}
                  alt="nft imaage"
                  className="homenft_img"
                />
              </div>
              <div className="ending">
                <h5> {homeNft?.name}</h5>
                <h5> Hightest Bid</h5>
              </div>
              <div className="timer">
                <ul>
                  <li id="days" />
                  <li id="hours" />
                  <li id="minutes" />
                  <li id="seconds" />
                </ul>
                <p>{homeNft?.price} MATIC</p>
              </div>
              <div className="bid-btn">
                <button className="purchase-btn" onClick={() => buyNft(homeNft)}>
                  {" "}
                  Purchase
                </button>
                <button className="bids-btn">
                  {" "}
                  <a href="/#"> Place a bid</a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Homebanner;
