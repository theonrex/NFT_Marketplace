import React, { useEffect , useState} from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";
import "../styles/style.css";
import Head from "next/head";
import NavBar from "../components/Navbar"
// import Layout from "../Layout/Layout"
import Script from "next/script";
import Footer from "../components/Footer";






//Web3Modal

  import Nft from "../public/assets/aped.png";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <meta name="description" content="TheonNfts" />
        <link rel="icon" href={Nft.src} />
        <title> TheonNfts</title>
        {/* <link rel="manifest" href="%PUBLIC_URL%/manifest.json" /> */}
      </Head>
      <NavBar />
      <Component {...pageProps} />

      <Footer/>
      <script
        src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.5/dist/umd/popper.min.js"
        integrity="sha384-Xe+8cL9oJa6tN/veChSP7q+mnSPaj5Bcu9mPX5F5xIGE0DVittaqT5lorf0EI7Vk"
        crossOrigin="anonymous"
      ></script>

      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.min.js"
        integrity="sha384-ODmDIVzN+pFdexxHEHFBQH3/9/vQ9uori45z4JjnFsRydbmQbmL5t1tQ0culUzyK"
        crossOrigin="anonymous"
      ></script>
    </div>
  );
}

export default MyApp;
