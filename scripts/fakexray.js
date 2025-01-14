const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const XRAY_DAEMON_IP = '169.254.79.129';
const XRAY_DAEMON_PORT = 2000;

// Simplified X-Ray trace segment
const fakeSegment = JSON.stringify({
  name: "FakeSegment",
  id: "1234567890abcdef",
  start_time: Date.now() / 1000,
  end_time: (Date.now() / 1000) + 1,
  type: "subsegment"
});

const message = Buffer.from(`{"format": "json", "version": 1}\n${fakeSegment}`);

client.send(message, XRAY_DAEMON_PORT, XRAY_DAEMON_IP, (err) => {
  if (err) {
    console.error('Failed to send fake trace:', err);
  } else {
    console.log('Fake trace sent to X-Ray daemon');
  }
  client.close();
});
