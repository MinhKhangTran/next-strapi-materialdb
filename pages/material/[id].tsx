import { Box, Heading } from "@chakra-ui/react";
import axios from "axios";
import { API_ENDPOINT } from "config";
import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextApiRequest,
} from "next";
import { IMaterial } from "../dashboard";
import EditForm from "@/components/EditForm";
import { parseCookie } from "@/utils/parseCookie";
import Layout from "@/components/Layout";

const SinglePage = ({ data, token }: { data: IMaterial; token: string }) => {
  // console.log(data);

  return (
    <Layout title="MaterialDB | Ändern/Löschen">
      <Heading color="green.400">Ändern/Löschen</Heading>
      <EditForm material={data} token={token}></EditForm>
    </Layout>
  );
};

export default SinglePage;

// export const getStaticPaths: GetStaticPaths = async () => {
//   const { data } = await axios(`${API_ENDPOINT}/materials`);

//   const paths = data.map((material: IMaterial) => ({
//     params: { Name: material.Name },
//   }));
//   return {
//     paths,
//     fallback: true,
//   };
// };

// export const getStaticProps: GetStaticProps = async (context) => {
//   const { data }: { data: IMaterial[] } = await axios(
//     `${API_ENDPOINT}/materials?Name=${context.params?.Name}`
//   );
//   const material = data[0];
//   return {
//     props: {
//       material,
//     },
//     revalidate: 1,
//   };
// };

export async function getServerSideProps({
  req,
  params,
}: {
  req: NextApiRequest;
  params: any;
}) {
  const { token } = parseCookie(req);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data }: { data: IMaterial[] } = await axios(
    `${API_ENDPOINT}/materials/${params.id}`,
    config
  );

  return {
    props: {
      token,
      data,
    },
  };
}
