import { createServer } from "@/lib/socket";
import { NextApiRequest } from "next";

let inited = false;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (inited || res.socket.server.io) {
    res.end();
    return;
  }
  inited = true;

  res.socket.server.io = await createServer(res.socket.server);
  res.end();
  return;
}
