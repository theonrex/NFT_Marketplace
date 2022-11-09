import React from "react";
import { useEffect, useState } from "react";
import { Contract, providers, utils } from "ethers";
import axios from "axios";
import {
  NFT_MARKETPLACE_ABI,
  NFT_MARKETPLACE_ADDRESS,
  NFT_ADDRESS,
  NFT_ABI,
} from "../constants";
import Web3Modal from "web3modal";
import Link from "next/link";
import { useRouter } from "next/router";

function HomeMarketplace() {
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
  const homePageNft = nfts?.slice(0, 3);

  if (homePageNft != undefined) {
    console.log(homePageNft);
  }
  console.log(nfts?.slice(0, 4));

  //    const first7Articles = articles?.slice(0, 7);

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

  //link [id]
  const homeNft = nfts[2];

  const ROUTE_POST_ID = "posts/[id]";
  const posts = [
    {
      id: homeNft?.name,
      title: homeNft?.tokenId,
    },
  ];
  const router = useRouter();

  return (
    <>
      <div
        className="third-section container"
        id="Marketplace"
        data-aos="flip-left"
      >
        <h1>
          {" "}
          Welcome to the nft <br />
          Marketplace
        </h1>
        <p>
          Welcome to the virtual world's one-stop-shop for the very best digital
          assets. Here you can <br />
          search and buy creators's ASSETS with SAND to incorporate them into
          your LAND.
        </p>
        {/* {posts.map((post) => (
          <div key={`post-${post.id}`}>
            <Link
              href={{
                pathname: ROUTE_POST_ID,
                query: { id: post.id, title: post.title },
              }}
            >
              <a>{post.title}</a>
            </Link>
          </div>
        ))} */}
        <div className="rowX nft-mg">
          {homePageNft.map((homeNft, _index) => (
            <div
              className="col29 nft-img gradient-box"
              key={`post-${homeNft.id}`}
            >
              <div className=" gradient-box epic-img nft_home_img_width">
                <img src={homeNft.image} alt="img" />
              </div>
              
              {/* <Link
                href={{
                  pathname: ROUTE_POST_ID,
                  query: {
                    id: homeNft.tokenId,
                    owner: homeNft.owner,
                    image: homeNft.image,
                    name: homeNft.name,
                    description: homeNft.description,
                    price: homeNft.price,
                  },
                }}
              >
                <a>{homeNft.owner} link</a>
              </Link> */}
              
               <br />
              <h3>
                <span >
                  #{homeNft.tokenId}{" "}
                </span>{" "} 
                {homeNft.name}
              </h3>
              <br />
              {/* button */}
              <div className="epic-box">
                <div className="epic">
                  <button className="epic-btn" onClick={() => buyNft(homeNft)}>
                    {" "}
                    Buy Now
                  </button>
                  <img src={homeNft.image} alt="img" />
                </div>
                <div>{/* <p className="rating"> 18/90</p> */}</div>
              </div>
              {/* eth */}
              <div className="eth-sale">
                <div>
                  <img
                    alt="svgImg"
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNDgiIGhlaWdodD0iNDgiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIj48L3BhdGg+PGc+PHBhdGggZD0iTTM5LjQxNjY3LDg2bDUwLjE2NjY3LC03OC44MzMzM2w1MC4xNjY2Nyw3OC44MzMzM2wtNTAuMTY2NjcsMjguNjY2Njd6IiBmaWxsPSIjMzhmZjA2Ij48L3BhdGg+PHBhdGggZD0iTTg5LjU4MzMzLDcuMTY2NjdsNTAuMTY2NjcsNzguODMzMzNsLTUwLjE2NjY3LDI4LjY2NjY3eiIgZmlsbD0iIzQ2Y2MyZSI+PC9wYXRoPjxwYXRoIGQ9Ik0zOS40MTY2Nyw5Ni43NWw1MC4xNjY2NywyOC42NjY2N2w1MC4xNjY2NywtMjguNjY2NjdsLTUwLjE2NjY3LDY4LjA4MzMzeiIgZmlsbD0iIzM4ZmYwNiI+PC9wYXRoPjxwYXRoIGQ9Ik04OS41ODMzMywxMjUuNDE2NjdsNTAuMTY2NjcsLTI4LjY2NjY3bC01MC4xNjY2Nyw2OC4wODMzM3pNMzkuNDE2NjcsODZsNTAuMTY2NjcsLTIxLjVsNTAuMTY2NjcsMjEuNWwtNTAuMTY2NjcsMjguNjY2Njd6IiBmaWxsPSIjNDZjYzJlIj48L3BhdGg+PHBhdGggZD0iTTg5LjU4MzMzLDY0LjVsNTAuMTY2NjcsMjEuNWwtNTAuMTY2NjcsMjguNjY2Njd6IiBmaWxsPSIjMDJmZjJiIj48L3BhdGg+PC9nPjwvZz48L3N2Zz4="
                  />{" "}
                  {homeNft.price} MATIC
                </div>
                <div className="eth-sale-icon">
                  <a className="nav-link-svg " href="#">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      fill="currentColor"
                      className="bi bi-cart3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default HomeMarketplace;


