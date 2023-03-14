/* eslint-disable @next/next/no-img-element */
import 'sf-font';
import { 
  pinJSONToIPFS, 
  checkNfts, 
  signInUser, 
  changePic, 
  addPicture, 
  getAccount, 
  addAccount, 
  convertWeiToEth, 
  migrateProfile, 
  transferTokens} from '../components/web3connect';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Home() {
  const [nftid, getNftId] = useState('');
  const [wallet, getWallet] = useState('');
  const [fileUrl, getFileUrl] = useState(null);
  const [tokenamt, getBalance] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const checkauth = setInterval(() =>{
      checkWallet()
    }, 2000);
    return () => clearInterval(checkauth);
    },[])

  
  async function checkWallet(){
    const output = await checkNfts();
    if (output === 0) {
      router.push("/denied")
      return;
    } 
  }

  async function getUser() {
    const output = await signInUser();
    const nftidraw = (output.getNftId[0]).toString();
    getNftId(nftidraw)
    getWallet(output.walletaddr)
    const userdata = await getAccount();
    const userurl = userdata.userurl;
    if (userurl == undefined) {
      let first = 'Enter First Name'
      let last = 'Enter Last Name'
      let user = 'Enter Username'
      let email = 'Enter Email Address'
      document.getElementById("first").value = first
      document.getElementById("last").value = last
      document.getElementById("user").value = user
      document.getElementById("email").value = email
      let newuser = 'Upload your Avatar and complete your User Profile.'
      document.getElementById('displayupdatechanged').innerHTML = newuser;
      return;
    }
    else {
      const header = {
        "Content-Type": "application/json",
      }
      const userinfo = await axios.get(userurl, header);
      let first = userinfo.data.getfirst;
      let last = userinfo.data.getlast;
      let user = userinfo.data.getuser;
      let email = userinfo.data.getemail;
      document.getElementById("first").value = first
      document.getElementById("last").value = last
      document.getElementById("user").value = user
      document.getElementById("email").value = email
      const tokenbalance = (userdata.balance).toString();
      const tokenbalformat = await convertWeiToEth(tokenbalance);
      getBalance(tokenbalformat);
      const picurl = userdata.picurl;
      if (picurl == 'http://172.20.10.2:8080/ipfs/'){
        getFileUrl('avatar.avif')
      }
      else {
        getFileUrl(picurl);
      }
    }
  }
 
  useEffect(() => {
    getUser()
  },[wallet])


  async function updateProfile() {
    let getfirst = document.getElementById("first").value.toString()
    let getlast = document.getElementById("last").value.toString()
    let getuser = document.getElementById("user").value.toString()
    let getemail = document.getElementById("email").value.toString()
    if(!getfirst || !getlast || !getuser || !getemail ) return
    const data = JSON.stringify({
      getfirst, getlast, getuser, getemail
    })
    const newcid = await pinJSONToIPFS(data);
    await addAccount(newcid);
    let confirmation = 'Profile Updated';
    document.getElementById('displayupdatechanged').innerHTML = confirmation
  }

  async function updatePic(e) {
    const file = e.target.files[0];
    const picCid = await changePic(file);
    console.log(picCid);
    await addPicture(picCid);
  }

  async function migrateAccount() {
    let newwallet = document.getElementById("newwallet").value.toString()
    const result = await migrateProfile(newwallet, nftid);
    if (result == 'completed') {
      let confirmation = 'Wallet Migrated';
      document.getElementById('walletsuccess').innerHTML = confirmation
    }
    else {
    let confirmation = 'Migration Failed';
    document.getElementById('walletsuccess').innerHTML = confirmation
    }
  }

  async function transferERC() {
    const result = await transferTokens();
    if (result == 'completed') {
      let confirmation = 'Token Transfer Completed';
      document.getElementById('displaytransfer').innerHTML = confirmation
    }
    else {
    let confirmation = 'Transfer Failed';
    document.getElementById('displaytransfer').innerHTML = confirmation
    }
  }


  return (
    <div
    style={{ color: "white", fontFamily: "SF Pro Display", fontSmooth: "3em" }}
  >
      <div className='container'>
      <main>
      <nav class="navbar navbarfont navbarglow navbar-expand-md navbar-dark bg-transparent mr-4 ml-4 mx-auto p-4">
          <div class="container-fluid" style={{ fontFamily: "SF Pro Display" }}>
            <a class="navbar-brand px-1" style={{ fontWeight: "800", fontSize: '25px' }} href="#"></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
              <ul class="navbar-nav me-auto mb-2 px-3 mb-md-0" style={{ fontSize: "25px" }}>
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="#">Profile</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/map">On-Ramp</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Raffle</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Listings</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Marketplace</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Chat</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Escrow</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Shares</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Vote</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Portfolio</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      <div className="text-center">
          <div className="col-7 p-1 mx-auto">
            <img
              className=" mb-4 mr-4 ml-4"
              src="logo1.png"
              alt="logo"
              width="300"
              height="300"
            />
          </div>
          <div className="col mt-4 mx-auto">
            <h1 className="mb-0">Block Republic</h1>
            <h1 style={{ fontSize: "54px", marginRight: "5px" }}>Web3 User Profile</h1>
          </div>
        </div>
        <div className="row g-6">
          <div className="col-md-3 col-lg-3">
            <form
              className="card p-1"
              style={{
                backgroundColor: "#00000070",
                boxShadow: "0px 1px 5px #ffffff",
              }}
            >
              <img
                className="d-block mx-auto"
                src="logo1.png"
                alt="logo1"
                style={{
                  maxWidth: "60px",
                  maxHeight: "60px",
                  position: "absolute",
                  boxShadow: "0px, 1px, 10px, #00000070",
                }}
              />
              <h5
                className="d-flex justify-content-end"
                id="displaypicchanged"
              />
              <img
                className="d-block mx-auto mb-4"
                src={fileUrl}
                alt=""
                style={{
                  maxWidth: "250px",
                  maxHeight: "250px",
                  minWidth: "40px",
                  minHeight: "20px",
                }}
              />
              <input
                style={{ backgroundColor: "transparent", color: "lightblue" }}
                className="btn btn-secondary d-flex justify-content-end"
                type="file"
                name="Asset"
                onChange={updatePic}
              />
              Update Profile Avatar
            </form>
            <h4 className="d-flex justify-content-end align-items-right mt-2 mb-3">
              <span className="text-white bold">Shares:</span>
              <span className="badge bg-secondary text-white rounded-pill">51</span>
            </h4>
            <ul className="list-group mb-3">
              <li
                className="list-group-item d-flex justify-content-between"
                style={{ backgroundColor: "black" }}
              >
                <div className="text-success">
                  <h4 className="my-0" style={{ color: "white" }}>
                    NFT
                  </h4>
                  <small style={{ color: "white" }}>PASSPORT</small>
                </div>
                <span style={{ fontSize: "30px", color: "white" }}>
                    # {nftid}
                </span>
              </li>
            </ul>
          </div>
          <div className="col-md-6 col-lg-8">
            <h5
              className="d-flex justify-content-end"
              id="displayupdatechanged"
            />
            <form className="needs-validation" noValidate>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label htmlFor="first" className="form-label">
                    First name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="first"
                    id="first"
                    style={{
                      backgroundColor: "#d3d3d310",
                      fontWeight: "lighter",
                      color: "white",
                    }}
                    required
                  />
                  <div className="invalid-feedback">
                    Valid first name is required.
                  </div>
                </div>

                <div className="col-sm-6">
                  <label htmlFor="last" className="form-label">
                    Last name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="last"
                    id="last"
                    style={{
                      backgroundColor: "#d3d3d310",
                      fontWeight: "lighter",
                      color: "white",
                    }}
                    required
                  />
                  <div className="invalid-feedback">
                    Valid last name is required.
                  </div>
                </div>

                <div className="col-sm-6">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <div className="input-group has-validation">
                    <span className="input-group-text">@</span>
                    <input
                      type="text"
                      className="form-control"
                      name="user"
                      id="user"
                      style={{
                        backgroundColor: "#d3d3d310",
                        fontWeight: "lighter",
                        color: "white",
                      }}
                      required
                    />
                    <div className="invalid-feedback">
                      Your username is required.
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <label htmlFor="email" className="form-label">
                    Email{" "}
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    style={{
                      backgroundColor: "#d3d3d310",
                      fontWeight: "lighter",
                      color: "white",
                    }}
                  />
                  <div className="invalid-feedback">
                    Please enter a valid email address for shipping updates.
                  </div>
                </div>
              </div>
            </form>
            <h6 id="displaysuccess" />
            <button
              className="w-100 btn btn-primary btn-md mt-4"
              onClick={updateProfile}
              style={{
                backgroundColor: "transparent",
                fontWeight: "lighter",
                fontSize: "20px",
                border: "lighter"
              }}
            >
              Update Web3 User Profile
            </button>
              </div>
          </div>
          <hr className="my-3" />
            <div className="row d-flex">
              <div className="col-lg-6">
                <h4 className="mb-2">Personal Wallet Address:</h4>
                <h6
                  style={{
                    color: "#83EEFF",
                    fontSize: "13px",
                  }}
                > {wallet}
                </h6>
                <input
                  type="text"
                  className="form-control col-10"
                  name="newwallet"
                  id="newwallet"
                  placeholder="Paste new wallet id"
                  style={{
                    backgroundColor: "#d3d3d310",
                    fontWeight: "lighter",
                    color: "white",
                  }}
                  required
                />
                <button onClick={migrateAccount} className="btn btn-secondary mt-2">
                  Update Wallet
                </button>
                <p className="lead" style={{ fontSize: "20px" }}>
                  Your wallet is connected to your NFT. If you update your
                  wallet, your NFT passport will be moved as well. You need both items
                  for access. If your NFT has been moved, please
                  re-login using your new wallet.
                </p>
                <h6 id="walletsuccess" />
              </div>
              <div className="col-lg-4">
                <div className="row mb-1">
                  <div className="col-sm-3 items-center">
                    <img width='60' height='60'
                      src='logo1.png' alt='logo1'
                    />
                  </div>
                  <div className='col-md-5'>
                  <h4 className="mb-2">Balance</h4>
                  <h3 className='mt-1'>{tokenamt}</h3>
                  </div>
                <label>Internal Wallet</label>
                <h6
                  style={{
                    color: "#83EEFF",
                    fontSize: "13px",
                  }}
                >
                </h6>
                <h6 className="mt-2">Transfer BREX to Personal Wallet</h6>
                <button onClick={transferERC} className="btn btn-dark  mt-2">
                  Transfer BREX
                </button>
                <h6 id="displaytransfer" />
                </div>
              </div>
              </div>
        </main>
      </div>
      </div>
  )
}
