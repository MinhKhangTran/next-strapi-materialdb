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
import { NextApiRequest } from "next";
import { parseCookie } from "@/utils/parseCookie";
import { PER_PAGE } from "./dashboard";
import { API_ENDPOINT } from "config";
import Pagination from "@/components/Pagination";

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

const DashboardPage = ({
  data,
  token,
  page,
  totalCount,
}: {
  data: IMaterial[];
  token: string;
  page: number;
  totalCount: number;
}) => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    !user && !token && router.push("/");
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
      {/* <Pagination page={page} total={totalCount} /> */}
    </Layout>
  );
};

export default DashboardPage;

export async function getServerSideProps({
  req,
  query: { term, page = 1 },
}: {
  req: NextApiRequest;
  query: { term: string; page: number };
}) {
  const query = qs.stringify({
    _where: {
      _or: [{ Name_contains: term }, { nummer_contains: term }],
    },
  });
  //   console.log(query);
  const { token } = parseCookie(req);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  //calculate start page
  const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE;
  //get total count
  const { data: totalCount } = await axios(
    `${API_ENDPOINT}/materials/count`,
    config
  );

  const { data } = await axios(
    `${process.env.API_ENDPOINT}/materials?${query}`,
    config
  );
  return {
    props: {
      data,
      totalCount,
      page,
    },
  };
}
