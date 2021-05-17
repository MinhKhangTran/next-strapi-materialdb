import Layout from "@/components/Layout";
import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Search from "@/components/Search";
import Link from "next/link";

export interface IMaterial {
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
              <Link href={`/material/${material.Name}`}>
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
              </Link>
            );
          })}
        </Tbody>
      </Table>
    </Layout>
  );
};

export default DashboardPage;

export async function getStaticProps() {
  const { data } = await axios(
    `${process.env.API_ENDPOINT}/materials?_sort=created_at:DESC&_limit=10`
  );
  return {
    props: {
      data,
    },
    revalidate: 1,
  };
}
