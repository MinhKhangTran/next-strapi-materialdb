import { Box, Grid, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();
  const [count, setCount] = useState(4);
  useEffect(() => {
    setTimeout(() => {
      router.push("/");
    }, 4000);
  }, []);
  useEffect(() => {
    const counter = setInterval(() => {
      setCount((oldValue) => {
        return oldValue - 1;
      });
    }, 1000);
    return () => clearInterval(counter);
  }, []);
  return (
    <Grid placeItems="center" h="100vh">
      <Box>
        <Heading as="h1">404</Heading>
        <Text fontSize="2xl">Diese Seite gibt es (noch) nicht 🥲</Text>
        <Text fontSize="2xl">
          Du wirst gleich zur{" "}
          <Text as="span" cursor="pointer" color="cyan.400">
            <Link href="/">Homepage</Link>
          </Text>{" "}
          zurückgeleitet ...{count}
        </Text>
      </Box>
    </Grid>
  );
}
