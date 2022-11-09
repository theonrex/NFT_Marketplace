import React from 'react'
import Navbar from '../components/Navbar'
import Homebanner from '../components/Homebanner'
import {FavouriteNFTs} from '../components/FavouriteNFTs'
import HomeMarketplace from '../components/HomeMarketplace'
import Parthners from '../components/Parthners'
import { News } from '../components/News'

const Layout = () => {
  return (
    <div>
      <Homebanner />
      <FavouriteNFTs />
      <HomeMarketplace />
      <Parthners/>
    </div>
  );
}

export default Layout