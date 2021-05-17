import { Box } from "@chakra-ui/react";
import Layout from "@/components/Layout";
import AddForm from "@/components/AddForm";
import { NextApiRequest } from "next";
import { parseCookie } from "@/utils/parseCookie";

const AddPage = ({ token }) => {
  return (
    <Layout title="MaterialDB | Hinzufügen">
      <AddForm token={token}></AddForm>
    </Layout>
  );
};

export default AddPage;

export async function getServerSideProps({ req }: { req: NextApiRequest }) {
  const { token } = parseCookie(req);
  return {
    props: {
      token,
    },
  };
}
