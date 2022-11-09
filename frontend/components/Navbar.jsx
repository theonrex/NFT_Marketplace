import React from 'react'
import Web3ModalBtn from './WebModalBtn';
import TheonLogo from "../public/assets/theonrex plain.png"

const Navbar = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg ">
        <div className="container-fluid container">
          <a className="navbar-brand" href="/#">
            <img src={TheonLogo.src} alt="logo" /> 
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div
            className="collapse navbar-collapse justify-content-center"
            id="navbarNav"
          >
            <ul className="navbar-nav ">
              <li className="nav-item">
                <a className="nav-link " href="/">
                  Home
                </a>
              </li>
             
              <li className="nav-item">
                <a className="nav-link" href="/dashboard">
                  Dashboard
                </a>
              </li>
         
              <li className="nav-item">
                <a className="nav-link " href="/marketplace">
                  Marketplace
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link purchase_btn" href="/create-nft">
                  Create <i class="bi bi-cloud-plus-fill"></i>

                </a>
              </li>
              <li className="nav-item hide">
                <a className="nav-link " href="#/">
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    fill="currentColor"
                    className="bi bi-cart3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                  </svg> */}
                </a>
              </li>
              {/* <button className="buy-btn hide">
                <a href="/#"> Buy Now</a>
              </button> */}
            </ul>
          </div>
          <div
            className="collapse navbar-collapse  justify-content-end"
            id="navbarNav "
          >
            <ul className="navbar-nav ">
              {/* <li className="nav-item">
                <a className="nav-link " href="#">
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
              </li> */}
              <button className="buy-btn">
                {/* <a href>  Buy Now</a> */}
                <Web3ModalBtn />
              </button>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar



Web3ModalBtn;