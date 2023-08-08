import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { Link, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const seachQuery = useSearchParams()[0];

  const referenceNum = seachQuery.get("reference");

  return (
    <Box>
      <VStack h="100vh" justifyContent={"center"}>
        <Heading textTransform={"uppercase"}> Order Successfull</Heading>

        <Text>Reference No.{referenceNum}</Text>
        <Link to="/">
          <button className="font-medium text-indigo-600 hover:text-indigo-500">
            Continue Shopping
            <span aria-hidden="true"> &rarr;</span>
          </button>
        </Link>
      </VStack>
    </Box>
  );
};

export default PaymentSuccess;
