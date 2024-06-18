import React, { useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import axios from 'axios';
import { ethers } from 'ethers'; // Import ethers.js library

const SellSuccess = () => {
  const queryParams = useSearchParams()[0];
  const walletAddress = queryParams.get('walletAddress');
  const numberOfCoins = queryParams.get('numberOfCoins');
  const inr = queryParams.get('sellInrValue');

  useEffect(() => {
    const burnTokens = async () => {
      try {
        console.log('Initiating burn token request');
        const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/8P5tiYMyM_zLtMAGJ1UjEmEA4j4ZTl61');
        const privateKey = '127676b648f696051c0d4d77cdcb1a0bace3fb9fbbcd5e46e42076e64d1b0f12'; // Replace with your private key
        const wallet = new ethers.Wallet(privateKey, provider);

        const contractAddress = '0x49CcB1Fb783aff07Af23e060d52C5b781106Aa70'; // Replace with your contract address
        const contractABI = [{
          "inputs": [
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "burn",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }]; // Define the burnTokens function ABI

        // Create an instance of the contract
        const contract = new ethers.Contract(contractAddress, contractABI, wallet);

        // Convert numberOfCoins to BigNumber and send the burnTokens transaction
        const tx = await contract.burn(ethers.parseEther(numberOfCoins.toString()));
        await tx.wait(); // Wait for the transaction to be confirmed

        console.log(`Successfully burned ${numberOfCoins} tokens from ${walletAddress}`);
      } catch (error) {
        console.error('Error burning tokens:', error);
      }
    };

    burnTokens();
  }, [walletAddress, numberOfCoins]);

  return (
    <Box>
      <VStack h="100vh" justifyContent={"center"}>
        <Heading>Sell Success</Heading>
        <Text>Your coins have been successfully sold!</Text>
        <Text>UPI Phone Number : {walletAddress}</Text>
        <Text>Coins Burned : {numberOfCoins}</Text>
        <Text> INR Withdrawn : {inr}</Text>
      </VStack>
    </Box>
  );
};

export default SellSuccess;