import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {NFT_MARKETPLACE_ADDRESS  , NFT_MARKETPLACE_ABI} from "../../constants";
import axios from "axios";
import { useRouter } from "next/router";
import { Contract, providers, utils } from "ethers";
import { BigNumber} from 'ethers';

export default function AllNFTs() {
  const router = useRouter();
  let { itemid } = router.query;

  const [loading, setLoading] = useState(false);
  const [nftData, setNftData] = useState();
  const [resellPrice, setResellPrice] = useState("");
  const [isReselling, setIsReselling] = useState(false);
  const [isPurchasing, setisPurchasing] = useState(false);

  const [nfts, setNfts] = useState([]);

  const [loadingState, setLoadingState] = useState("not-loaded");
  // useEffect(() => {
  //   loadNFTs();
  // }, []);
//   async function loadNFTs() {
//     /* create a generic provider and query for unsold market items */
//     const provider = new providers.JsonRpcProvider(
//       "https://polygon-mumbai.infura.io/v3/4fa55521d0f647f28c1a179e85f454da"
//     );

//     const contract = new Contract(
//       NFT_MARKETPLACE_ADDRESS,
//       NFT_MARKETPLACE_ABI,
//       provider
//     );
// //     const data = await contract.fetchMarketItems();
// // console.log(data)


// const data = await contract.getPerticularItem(
//   router.query.tokenId
// );
// console.log(data);
//     const items = await Promise.all(
//       data.map(async (i) => {
//         const tokenUri = await contract.tokenURI(i.tokenId);
//         const meta = await axios.get(tokenUri);
//         const decimals = 18;
//         const input = "999"; // Note: this is a string, e.g. user input
//         // const amount = ethers.utils.parseUnits(input, decimals)
//         let price = utils.parseUnits(i.price.toString(), decimals, "ether");

//         // const amount = BigNumber.from(i.price).mul(BigNumber.from(10).pow(decimals));

//         let item = {
//           price,
//           tokenId: i.tokenId.toNumber(),
//           seller: i.seller,
//           owner: i.owner,
//           image: meta.data.image,
//           name: meta.data.name,
//           description: meta.data.description,
//         };
//         return item;
        
//       })
//     );
//     setNfts(items);
//     console.log(items);

//     setLoadingState("loaded");
//   }
  // Function to load a selected nft 
 
  useEffect(() => {
    loadNFT();
  }, []);

  async function loadNFT () {
    setLoading(true);
    const provider = new providers.JsonRpcProvider(
            "https://polygon-mumbai.infura.io/v3/4fa55521d0f647f28c1a179e85f454da"
          );

    const nftMarketPlaceContract = new ethers.Contract(
      NFT_MARKETPLACE_ADDRESS,
      NFT_MARKETPLACE_ABI,
      provider
    );
    const data = await nftMarketPlaceContract.fetchMarketItems();
    ;
    const idnft = data
    console.log(idnft);

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await nftMarketPlaceContract.tokenURI(i.tokenId);
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
    setNftData(items);
    setLoading(false);
  };

  console.log(nftData[router.query.itemid]);

  const idNft = nftData?.[router.query.itemid]
  console.log(idNft);


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

  return (
    <div>
      rex
      {loading == true ? (
        <hr />
      ) : (
      <div>
        
       {
      console.log(idNft)
       }
      
      </div>
       )}
    

       {/* {
         idNft?.map((nft, i) => (
          <div>
              <div className=" gradient-box epic-img nft_home_img_width">
                <img src={idNft.image} alt="img" />
              </div>
          </div>
        ))
       } */}
    </div>
  );
}