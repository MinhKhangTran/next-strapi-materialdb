import { Box, Button, Flex, Heading, Spacer } from "@chakra-ui/react";
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
const Layout = ({
  children,
  title = "MaterialDB",
  description = "App um Materialien abzulegen",
  keywords = "stahl",
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
}) => {
  const { user, logout } = useAuth();
  return (
    <Box w="90%" py={4} mx="auto">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Head>
      <Flex>
        <Heading color="green.500">
          <Link href={user ? "/dashboard" : "/"}>MaterialDB</Link>
        </Heading>
        {user && (
          <>
            <Spacer />

            <Button
              colorScheme="green"
              onClick={() => {
                //@ts-expect-error
                logout();
              }}
            >
              Logout
            </Button>
          </>
        )}
      </Flex>
      {children}
    </Box>
  );
};

export default Layout;
