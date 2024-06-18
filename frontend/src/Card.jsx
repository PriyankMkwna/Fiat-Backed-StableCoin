import { Button, VStack, background } from '@chakra-ui/react'
import React from 'react'

const Card = ({ amount, checkoutHandler }) => {
    return (
        <VStack>
            <Button style={{background: "green"}} onClick={() => checkoutHandler(amount)}>Buy Now</Button>
        </VStack>
    )
}

export default Card