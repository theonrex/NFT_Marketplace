import React from "react";
import {useState} from "react";
import {ethers} from "ethers";
import {create} from "ipfs-http-client";
import {useRouter} from "next/router";
import Web3Modal from "web3modal";
import {useForm} from "react-hook-form";


const projectId = process.env.PROJECT_ID;
const projectSecret = process.env.PROJECT_SECRET;
const projectIdAndSecret = `${projectId}:${projectSecret}`;

const client = create({
  host: "infura-ipfs.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: `Basic ${Buffer.from(projectIdAndSecret).toString(
      "base64"
    )}`,
  },
});

import {
  abi,
  NFT_CONTRACT_ADDRESS,
  NFT_MARKETPLACE_ABI,
  NFT_MARKETPLACE_ADDRESS,
} from "../constants";




export default function CreateItem() {
  //react form
  const {
    register,
    formState: {errors},
    handleSubmit,
    watch,
  } = useForm();

  // const onSubmit = (data) => {
  //   alert(JSON.stringify(data));
  // };

  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();
  //set ipfs upload function
  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://infura-ipfs.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function uploadToIPFS() {
    const {name, description, price} = formInput;
    if (!name || !description || !price || !fileUrl) return;
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://infura-ipfs.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function listNFTForSale() {
    try {
      const url = await uploadToIPFS();
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    const price = ethers.utils.parseUnits(formInput.price, "ether");
    let contract = new ethers.Contract(
      NFT_MARKETPLACE_ADDRESS,
      NFT_MARKETPLACE_ABI,
      signer
    );
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();
    let transaction = await contract.createToken(url, price, {
      value: listingPrice,
    });
    await transaction.wait();

    router.push("/");
    } catch (error) {
            console.log(" Something went wrong  : ", error);
// alert("Input Price")
    }
    
  }

  return (
    <div className="flex justify-center  container create_item">
      <div className="create_form">
        {/* <label htmlFor="form_label" className="form_label">
          Name
        </label> */}
        <input
          placeholder="Asset Name"
          className=""
          required
          type="text"
          onChange={(e) =>
            updateFormInput({...formInput, name: e.target.value})
          }
          // {...register("Name", {required: true})}
          // aria-invalid={errors.Name ? "true" : "false"}
        />
        {/* {errors.Name?.type === "required" && (
            <p role="alert">Name is required</p>
          )} */}
        <textarea
          placeholder="Asset Description"
          className=""
          type="text"
          required
          onChange={(e) =>
            updateFormInput({...formInput, description: e.target.value})
          }
          // {...register("Description", {required: true})}
          // aria-invalid={errors.Description ? "true" : "false"}
        />
        {/* {errors.Description?.type === "required" && (
            <p role="alert">Description is required</p>
          )} */}
        <input
          placeholder="Asset Price in Matic "
          className="number"
          required
          onChange={(e) =>
            updateFormInput({...formInput, price: e.target.value})
          }
          // {...register("number", {required: true})}
          // aria-invalid={errors.number ? "true" : "false"}
        />
        {/* {errors.Name?.type === "required" && (
            <p role="alert">Price is required</p>
          )} */}
        <label htmlFor="form_label" className="form_label ">
          <span>Upload AN Image</span>
        </label>
        <div className="file_nft">
          <input
            // {...register("testPhotos", {
            //   validate: {
            //     lessThan20MB: (file) =>
            //       file[0]?.size < 3000000 || "Maximum file size is 20mb",
            //     // acceptedFormats: (files) =>
            //     //   ["image/jpeg", "image/png", "image/gif"].includes(
            //     //     files[0]?.type
            //     //   ) || "Only PNG, JPEG e GIF"
            //   },
            // })}
            required
            type="file"
            name="Asset"
            className="Asset"
            onChange={onChange}
          />
          {/* {errors.testPhotos && <span>{errors.testPhotos.message}</span>} */}

          {fileUrl && (
            <img
              className="rounded mt-4"
              width="350"
              src={fileUrl}
              alt="NFT IMAGE"
            />
          )}
        </div>

        <button onClick={listNFTForSale} className="btn_submit_nft">
          Create NFT
        </button>
      </div>
    </div>
  );
}