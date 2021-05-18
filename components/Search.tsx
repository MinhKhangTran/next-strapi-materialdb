import { Box, Button, Flex, Input, Spacer } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IMaterial } from "pages/dashboard";
import { useState } from "react";

const Search = () => {
  const [term, setTerm] = useState("");
  const router = useRouter();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    router.push(`/search?term=${term}`);
    setTerm("");
  };
  return (
    <Flex mt={8} mb={4}>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Suche ..."
        ></Input>
      </form>
      <Spacer />
      <Button variant="outline">
        <Link href="/add">Neue Hinzufügen</Link>
      </Button>
    </Flex>
  );
};

export default Search;
