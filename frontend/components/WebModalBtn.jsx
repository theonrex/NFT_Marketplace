
import React from "react";
import { useEffect, useState } from "react";
// import { networkParams } from "./networks";
// import { toHex, truncateAddress } from "./utils";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { providerOptions } from "./providerOptions";

// const web3Modal = new Web3Modal({
//   cacheProvider: true, // optional
//   providerOptions, // required
// });

let web3Modal;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    cacheProvider: false,
    // network: "goerli",
    providerOptions, // required
    theme: "dark",
  });
}

export default function Home() {
  const [provider, setProvider] = useState();
  const [library, setLibrary] = useState();
  const [account, setAccount] = useState();
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [chainId, setChainId] = useState();
  const [network, setNetwork] = useState();
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [verified, setVerified] = useState();

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const network = await library.getNetwork();
      setProvider(provider);
      setLibrary(library);
      if (accounts) setAccount(accounts[0]);
      setChainId(network.chainId);

        if (network.chainId !== 80001) {
          window.alert("Change the network to Mumbai");
          throw new Error("Change network to Mumbai");
        }
    } catch (error) {
      setError(error);
    }
  };

  const networkId = async () => {
    try {
         const provider = await web3Modal.connect();
       const library = new ethers.providers.Web3Provider(provider);
          const network = await library.getNetwork();

        const {chainId} = await library.getNetwork();
        if (chainId !== 80001) {
          window.alert("Change the network to Mumbai");
          throw new Error("Change network to Mumbai");
        }
    } catch (error) {
      setError(error)
      }

  }

  //  const getProviderOrSigner = async (needSigner = false) => {
  //    // Connect to Metamask
  //    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
  //    const provider = await web3ModalRef.current.connect();
  //    const web3Provider = new providers.Web3Provider(provider);

  //    // If user is not connected to the Mumbai network, let them know and throw an error
  //    const {chainId} = await web3Provider.getNetwork();
  //    if (chainId !== 80001) {
  //      window.alert("Change the network to Mumbai");
  //      throw new Error("Change network to Mumbai");
  //    }

  //    if (needSigner) {
  //      const signer = web3Provider.getSigner();
  //      return signer;
  //    }
  //    return web3Provider;
  //  };

    useEffect(() => {
      // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
       networkId();

    }, []);


  // alert(networkId)

  const handleNetwork = (e) => {
    const id = e.target.value;
    setNetwork(Number(id));
  };

  const handleInput = (e) => {
    const msg = e.target.value;
    setMessage(msg);
  };

  

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams[toHex(network)]],
          });
        } catch (error) {
          setError(error);
        }
      }
    }
  };

  const signMessage = async () => {
    if (!library) return;
    try {
      const signature = await library.provider.request({
        method: "personal_sign",
        params: [message, account],
      });
      setSignedMessage(message);
      setSignature(signature);
    } catch (error) {
      setError(error);
    }
  };

  const verifyMessage = async () => {
    if (!library) return;
    try {
      const verify = await library.provider.request({
        method: "personal_ecRecover",
        params: [signedMessage, signature],
      });
      setVerified(verify === account.toLowerCase());
    } catch (error) {
      setError(error);
    }
  };

  const refreshState = () => {
    setAccount();
    setChainId();
    setNetwork("");
    setMessage("");
    setSignature("");
    setVerified(undefined);
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    refreshState();
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        console.log("accountsChanged", accounts);
        if (accounts) setAccount(accounts[0]);
      };

      const handleChainChanged = (_hexChainId) => {
        setChainId(_hexChainId);
      };

      const handleDisconnect = () => {
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider]);

  return (
    <>
      {!account ? (
        <span onClick={connectWallet}>Connect Wallet</span>
      ) : (
        <span onClick={disconnect}>Disconnect</span>
      )}
    </>
  );
}
