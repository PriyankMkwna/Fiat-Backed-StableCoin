import { app } from "./app.js";
import Razorpay from "razorpay";
import { connectDB } from "./config/database.js";
import { ethers } from 'ethers';
import { abi } from "../server/controllers/ABI.js";


connectDB();


const contractAddress = "0x49CcB1Fb783aff07Af23e060d52C5b781106Aa70";
const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/8P5tiYMyM_zLtMAGJ1UjEmEA4j4ZTl61');
const privateKey = '127676b648f696051c0d4d77cdcb1a0bace3fb9fbbcd5e46e42076e64d1b0f12';
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, abi, wallet);
app.post('/burn-tokens', async (req, res) => {
  try {
    console.log('Received request to burn tokens:', req.body);
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
        console.log('Invalid amount:', amount);
        return res.status(400).send('Invalid amount');
    }

    const amountToBurn = ethers.parseEther(amount.toString());

    // Call the burn function of the token contract
    const tx = await contract.burn(amountToBurn);
    await tx.wait();

    console.log('Tokens burned successfully');
    res.send('Tokens burned successfully');
  } catch (error) {
    console.error('Error burning tokens:', error);
    res.status(500).send('Error burning tokens');
  }
});


export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_APT_SECRET,
});

app.listen(process.env.PORT, () =>
  console.log(`Server is working on ${process.env.PORT}`)
);