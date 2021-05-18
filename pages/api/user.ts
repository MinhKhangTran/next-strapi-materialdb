import axios from "axios";
import { API_URL } from "config";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // get token from header and parse it
    //check if headers cookie is available
    if (!req.headers.cookie) {
      res.status(403).json({ msg: "Nicht authorisiert" });
      return;
    }
    const { token } = cookie.parse(req.headers.cookie);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    //read logged user from strapi backend with headers

    const { data } = await axios.get(`${API_URL}/users/me`, config);
    // console.log(data);
    res.status(200).json({ data });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ msg: "Nur GET Methode ist erlaubt" });
  }
}
