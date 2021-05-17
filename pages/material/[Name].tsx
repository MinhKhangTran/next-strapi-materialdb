import { Box } from "@chakra-ui/react";
import axios from "axios";
import { API_ENDPOINT } from "config";
import { GetStaticPaths, GetStaticProps } from "next";
import { IMaterial } from "../dashboard";

const SinglePage = ({ material }: { material: IMaterial }) => {
  console.log(material);

  return <Box>hi</Box>;
};

export default SinglePage;

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await axios(`${API_ENDPOINT}/materials`);

  const paths = data.map((material: IMaterial) => ({
    params: { Name: material.Name },
  }));
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { data }: { data: IMaterial[] } = await axios(
    `${API_ENDPOINT}/materials?Name=${context.params?.Name}`
  );
  const material = data[0];
  return {
    props: {
      material,
    },
    revalidate: 1,
  };
};
