import Layout from "@/components/Layout";
import {
  Button,
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
import { API_URL } from "config";
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

  //reference to https://stackoverflow.com/questions/56966672/copy-the-html-table-to-clipboard-in-reactjs
  const copyTable = () => {
    const chakraTable = document.querySelector("table");
    let range, sel;

    // Ensure that range and selection are supported by the browsers
    if (document.createRange && window.getSelection) {
      range = document.createRange();
      sel = window.getSelection();
      // unselect any element in the page
      sel?.removeAllRanges();

      try {
        // @ts-expect-error
        range.selectNodeContents(chakraTable);
        sel?.addRange(range);
      } catch (e) {
        // @ts-expect-error
        range.selectNode(chakraTable);
        sel?.addRange(range);
      }

      document.execCommand("copy");
    }

    sel?.removeAllRanges();

    console.log("Element Copied! Paste it in a file");
  };

  return (
    <Layout title="MaterialDB | Dashbaord">
      <Search />
      <Button onClick={() => copyTable()}>Tabelle kopieren (Beta)</Button>
      <Table id="table">
        <TableCaption>Datenbank</TableCaption>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Nummer</Th>
            {/* <Th>Sorte</Th> */}
            <Th isNumeric>E-Modul [MPa]</Th>
            <Th isNumeric>
              <Text casing="lowercase">?? [-]</Text>
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
    `${API_URL}/materials/count`,
    config
  );

  const { data } = await axios(
    `${API_URL}/materials?_sort=created_at:DESC&_limit=${PER_PAGE}&_start=${start}`,
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
