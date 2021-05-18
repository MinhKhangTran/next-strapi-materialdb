import { Button, ButtonGroup, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { PER_PAGE } from "pages/dashboard";

const Pagination = ({ page, total }: { page: number; total: number }) => {
  //get number of pages
  const pages = Math.ceil(total / PER_PAGE);

  return (
    <Flex display={pages === 1 ? "none" : "flex"} mt={4} justify="center">
      <ButtonGroup>
        {Array.from({ length: pages }, (_, index: number) => {
          return (
            <Link
              key={index}
              href={
                index + 1 === 1 ? "/dashboard" : `/dashboard?page=${index + 1}`
              }
            >
              <Button
                colorScheme="green"
                variant={Number(page) === index + 1 ? "outline" : "solid"}
              >
                {index + 1}
              </Button>
            </Link>
          );
        })}
      </ButtonGroup>
    </Flex>
  );
};

export default Pagination;
