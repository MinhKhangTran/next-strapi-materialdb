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
import { NextApiRequest } from "next";
import { parseCookie } from "@/utils/parseCookie";
import { API_ENDPOINT } from "config";
import Pagination from "@/components/Pagination";

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
export const PER_PAGE: number = 10;

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

  return (
    <Layout title="MaterialDB | Dashbaord">
      <Search />
      <Table>
        <TableCaption>Datenbank</TableCaption>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Nummer</Th>
            {/* <Th>Sorte</Th> */}
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
              <Link key={material.id} href={`/material/${material.id}`}>
                <Tr>
                  <Td>{material.Name}</Td>
                  <Td>{material.nummer ? material.nummer : "-"}</Td>
                  {/* <Td>Sorte</Td> */}
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
      <Pagination page={page} total={totalCount} />
    </Layout>
  );
};

export default DashboardPage;

export async function getServerSideProps({
  req,
  query: { page = 1 },
}: {
  req: NextApiRequest;
  query: { page: number };
}) {
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
    `${API_ENDPOINT}/materials?_sort=created_at:DESC&_limit=${PER_PAGE}&_start=${start}`,
    config
  );
  return {
    props: {
      data,
      token,
      totalCount,
      page,
    },
  };
}
