import React ,{useState} from 'react'
import axios from "axios";
import Card from './Card'
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import abi from './ABI';
const Home = () => {
    
    const [walletAddress, setWalletAddress] = useState('');
    const [numberOfCoins, setNumberOfCoins] = useState('');
    const [inrValue, setInrValue] = useState(0);

  const [sellWalletAddress, setSellWalletAddress] = useState('');
  const [sellNumberOfCoins, setSellNumberOfCoins] = useState('');
  const [sellInrValue, setSellInrValue] = useState(0);

    const navigate = useNavigate();
    const validateBuyForm = () => {
      if (!walletAddress) {
        alert("Wallet Address is required.");
        return false;
      }
  
      if (walletAddress.length !== 42) {
        alert("Wallet Address must be exactly 42 characters long.");
        return false;
      }
  
      if (!numberOfCoins || numberOfCoins < 1) {
        alert("Number of Coins is required and must be a positive number.");
        return false;
      }
  
      return true;
    };
    const validateSellForm = () => {
      if (!sellWalletAddress) {
          alert("Phone Number is required.");
          return false;
      }

      if (sellWalletAddress.length !== 10) {
          alert("Phone Number must be exactly 10 characters long.");
          return false;
      }

      if (!sellNumberOfCoins || sellNumberOfCoins < 1) {
          alert("Number of Coins is required and must be a positive number.");
          return false;
      }

      return true;
  };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (validateBuyForm()) {
        // Handle form submission
        const url = new URLSearchParams({ walletAddress });
        console.log(url.toString())
        window.location.href = `/paymentSuccess?${url.toString()}`;
      }
    };

    const handleSellSubmit = async (e) => {
      e.preventDefault();
      if (validateSellForm(sellWalletAddress, sellNumberOfCoins ,sellInrValue)) {
        if (typeof window.ethereum !== 'undefined') {
          try {
            const web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            
            const contractAddress = '0x49CcB1Fb783aff07Af23e060d52C5b781106Aa70'; // MTK contract address
            const contractABI = abi; // Provide ABI of your MTK token contract
            
            // Instantiate the contract
            const contract = new web3.eth.Contract(contractABI, contractAddress);            
            const Address = '0x76cD0A807ef7E23185e29FB2C2D05466b67747CA'; // Burn address
            const amountToBurn = web3.utils.toWei(sellNumberOfCoins.toString(), 'ether'); // Convert to Wei if needed
            
            // Call the transfer function of the MTK token contract to burn tokens
            console.log("hello")

            await contract.methods.transfer(Address, amountToBurn).send({ from: accounts[0] });

            
            console.log("world")

            // Redirect to sell success page
            
            navigate(`/sellSuccess?walletAddress=${sellWalletAddress}&numberOfCoins=${sellNumberOfCoins}&sellInrValue=${sellInrValue}`);
          } catch (error) {
            console.error("Error burning tokens:", error);
          }
        } else {
          alert("MetaMask is not installed. Please install MetaMask and try again.");
        }
      }
    };
  
    const updateINRValue = (e) => {
      const coins = e.target.value;
      setNumberOfCoins(coins);
  
      const paisaPerCoin = 1; // 1 coin = 0.1 paisa
      const inr = (coins * paisaPerCoin) / 100; // Convert paisa to INR
  
      if (inr >= 1) {
        setInrValue(inr);
      } else {
        setInrValue(inr.toFixed(4));
      }
    }

    const updateSellINRValue = (e) => {
      const coins = e.target.value;
      setSellNumberOfCoins(coins);
  
      const paisaPerCoin = 1; // 1 coin = 0.1 paisa
      const inr = (coins * paisaPerCoin) / 100; // Convert paisa to INR
  
      if (inr >= 1) {
        setSellInrValue(inr);
      } else {
        setSellInrValue(inr.toFixed(4));
      }
    };

    const checkoutHandler = async (amount) => {

        const { data: { key } } = await axios.get("http://www.localhost:4000/api/getkey")

        const { data: { order } } = await axios.post("http://localhost:4000/api/checkout", {
            amount,
            walletAddress,
            numberOfCoins
        })

        const options = {
            key,
            amount: order.amount,
            currency: "INR",
            name: "Blockchain",
            description: "Tutorial of RazorPay",
            image: "https://i.imghippo.com/files/e3QJk1717493593.png",
            order_id: order.id,
            callback_url: "http://localhost:4000/api/paymentVerification",
            prefill: {
                name: "",
                email: "",
                contact: ""
            },
            notes: {
                "address": "Razorpay Corporate Office"
            },
            theme: {
                "color": "#121212"
            },
            handler: function (response) {
              // After payment success, call payment verification endpoint
              axios.post("http://localhost:4000/api/paymentVerification", {
                  razorpay_order_id: order.id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  walletAddress,
                  numberOfCoins
              }).then((verificationResponse) => {
                  // Handle verification response, e.g., navigate to payment success page
                  
              }).catch((error) => {
                  console.error("Payment verification failed:", error);
                  // Handle payment verification failure
              });
              navigate(`/paymentsuccess?reference=${order.id}&walletAddress=${walletAddress}&numberOfCoins=${numberOfCoins}`);
          }
        };
        const razor = new window.Razorpay(options);
        razor.open();
    }

    return (
        <div className="container">
      <h2>Buy Coins</h2>
      <form id="buyCoinsForm" onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label htmlFor="walletAddress" className="form-label">Wallet Address:</label>
          <input
            type="text"
            className="form-control"
            id="walletAddress"
            name="walletAddress"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="numberOfCoins" className="form-label">Number of Coins:</label>
          <input
            type="number"
            className="form-control"
            id="numberOfCoins"
            name="numberOfCoins"
            min="1"
            value={numberOfCoins}
            onChange={updateINRValue}
            required
          />
        </div>
        <div className="col-md-12">
          <p id="inrValue" className="form-text">Value in INR: {inrValue}</p>
        </div>
        <div className="col-md-12">
          <Card amount={inrValue} checkoutHandler={checkoutHandler} />
        </div>
        <br/>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      </form>


      <h2>Sell Coins</h2>
      <form id="sellCoinsForm" onSubmit={handleSellSubmit} className="row g-3">
        <div className="col-md-6">
          <label htmlFor="sellWalletAddress" className="form-label">UPI Phone Number:</label>
          <input
            type="text"
            className="form-control"
            id="sellWalletAddress"
            name="sellWalletAddress"
            value={sellWalletAddress}
            onChange={(e) => setSellWalletAddress(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="sellNumberOfCoins" className="form-label">Number of Coins:</label>
          <input
            type="number"
            className="form-control"
            id="sellNumberOfCoins"
            name="sellNumberOfCoins"
            min="1"
            value={sellNumberOfCoins}
            onChange={updateSellINRValue}
            required
          />
        </div>
        <div className="col-md-12">
          <p id="sellInrValue" className="form-text">Value in INR: {sellInrValue}</p>
        </div>
        <div className="col-md-12" >
         <center> <button type="submit" className="btn btn-primary" style={{background: "red"}}>Sell Coins</button></center>
        </div>
      </form>
    </div>
    )
}


export default Home;