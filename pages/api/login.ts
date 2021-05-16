import axios from "axios";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    if (req.method === "POST") {
      const { identifier, password } = req.body;

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data, status } = await axios.post(
        `${process.env.API_ENDPOINT}/auth/local`,
        { identifier, password },
        config
      );

      //set Cookie it statuscode is 200
      if (status === 200) {
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("token", data.jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 60 * 60 * 24 * 7, //1 week
            sameSite: "strict",
            path: "/",
          })
        );
      }

      res.status(200).json({ user: data.user });
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).json({ msg: "Nur Post Methode ist erlaubt" });
    }
  } catch (error) {
    console.log(error.response.data.message[0].messages[0].message);
    // console.log(error.response.status);
    // console.log(error.response.headers);
    res
      .status(error.response.status)
      .json({ msg: error.response.data.message[0].messages[0].message });
  }
}
