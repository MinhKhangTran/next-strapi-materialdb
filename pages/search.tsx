import Layout from "@/components/Layout";
import {
  Box,
  Heading,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import qs from "qs";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Search from "@/components/Search";

interface IMaterial {
  Name: string;
  Rm: number;
  Rp: number;
  bruchdehnung: number;
  dichte: number;
  emodul: number;
  nummer: null | string;
  querkontraktionszahl: number;
  schwellfestigkeit: null | number;
  wechselfestigkeit: null | number;
  id: number;
}

const DashboardPage = ({ data }: { data: IMaterial[] }) => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    !user && router.push("/");
  });

  if (data.length === 0) {
    return (
      <Layout title="MaterialDB | Dashbaord">
        <Search />
        <Heading>Kein Material gefunden</Heading>
      </Layout>
    );
  }
  return (
    <Layout title="MaterialDB | Dashbaord">
      <Search />
      <Table>
        <TableCaption>Datenbank</TableCaption>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Nummer</Th>
            <Th>Sorte</Th>
            <Th isNumeric>E-Modul [MPa]</Th>
            <Th isNumeric>
              <Text casing="lowercase">ν [-]</Text>
            </Th>
            <Th isNumeric>Rp [MPa]</Th>
            <Th isNumeric>Rm [MPa]</Th>
            <Th isNumeric>Dichte [kg/m3]</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((material) => {
            return (
              <Tr key={material.id}>
                <Td>{material.Name}</Td>
                <Td>{material.nummer ? material.nummer : "-"}</Td>
                <Td>Sorte</Td>
                <Td isNumeric>{material.emodul}</Td>
                <Td isNumeric>{material.querkontraktionszahl}</Td>
                <Td isNumeric>{material.Rp}</Td>
                <Td isNumeric>{material.Rm}</Td>
                <Td isNumeric>{material.dichte}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Layout>
  );
};

export default DashboardPage;

export async function getServerSideProps({
  query: { term },
}: {
  query: { term: string };
}) {
  const query = qs.stringify({
    _where: {
      _or: [{ Name_contains: term }, { nummer_contains: term }],
    },
  });
  //   console.log(query);

  const { data } = await axios(
    `${process.env.API_ENDPOINT}/materials?${query}`
  );
  return {
    props: {
      data,
    },
  };
}
