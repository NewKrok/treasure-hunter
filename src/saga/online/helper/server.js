const servers = [
  "stun:stun.l.google.com:19302",
  "stun:stun1.l.google.com:19302",
  "stun:stun2.l.google.com:19302",
  "stun:stun3.l.google.com:19302",
  "stun:stun4.l.google.com:19302",
  "stun:stun.stunprotocol.org:3478",
];

export const getStunServer = () => {
  const serverId = Math.floor(Math.random() * servers.length);
  return servers[serverId];
};
