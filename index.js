const { PeerServer } = require('peer');

const clients = new Set();
const peerServer = PeerServer({ port: 9000, path: '/' }, (server) => {
  console.log('Server started!');
});

peerServer.on('connection', (client) => {
  clients.add(client.getId());
  console.log('Connected:', client.getId());
});
peerServer.on('disconnect', (client) => {
  clients.delete(client.getId());
  console.log('Disconnected:', client.getId());
});
peerServer.on('message', (client, message) => {
  const { type, dst, src } = message;
  console.log('Message:', dst ? { type, dst, src } : { type, src });
  if (type === 'HEARTBEAT') {
    client.send({ type: 'CLIENTS', payload: { clients: Array.from(clients) } });
  }
});
peerServer.on('error', (error) => {
  console.error(error);
});
