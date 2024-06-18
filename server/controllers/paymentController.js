import { instance } from "../server.js";
import crypto from "crypto";
import { Payment } from "../models/paymentModel.js";
import { ethers } from "ethers";
import { abi } from "./ABI.js";


const contractAddress = "0x49CcB1Fb783aff07Af23e060d52C5b781106Aa70";
const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/8P5tiYMyM_zLtMAGJ1UjEmEA4j4ZTl61');
const privateKey = '##############################################';
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, abi, wallet);


export const checkout = async (req, res) => {
  const { amount, walletAddress, numberOfCoins } = req.body;
  const options = {
    amount: Number(amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order,
    walletAddress, // Include walletAddress in the response
    numberOfCoins // Include numberOfCoins in the response
  });
};

export const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, walletAddress, numberOfCoins } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database logic
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      walletAddress, // Save walletAddress to the database
      numberOfCoins // Save numberOfCoins to the database
    });

    try {
      // Mint tokens
      const mintTx = await contract.mint('0x76cD0A807ef7E23185e29FB2C2D05466b67747CA', ethers.parseEther(numberOfCoins.toString()));
      await mintTx.wait(); // Wait for the transaction to be mined

      console.log('Mint transaction:', mintTx);

      const trans = await contract.transfer(walletAddress,ethers.parseEther(numberOfCoins.toString()));
      await trans.wait();

      console.log('Transfer transaction:', trans);

      res.redirect(
        `http://localhost:3000/paymentsuccess?walletAddress=${walletAddress}&coins=${numberOfCoins}&reference=${razorpay_payment_id}`
      );
    } catch (error) {
      console.error('Minting error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mint tokens'
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
};

