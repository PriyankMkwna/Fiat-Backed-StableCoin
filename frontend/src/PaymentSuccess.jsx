import React from 'react';
import { useSearchParams } from "react-router-dom";
import axios from 'axios';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

const PaymentSuccess = () => {
    const searchQuery = useSearchParams()[0];
    const walletAddress = searchQuery.get("walletAddress");
    const numberOfCoins = searchQuery.get("numberOfCoins");

    return (
        <Box>
            <VStack h="100vh" justifyContent={"center"}>
                <Heading>Payment Successful</Heading>
                <Text>Wallet Address: {walletAddress}</Text>
                <Text>Number of Coins: {numberOfCoins}</Text>
            </VStack>
        </Box>
    )
}



export default PaymentSuccess;
