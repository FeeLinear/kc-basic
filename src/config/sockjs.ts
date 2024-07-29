export default  {
  // 开启缓存自动刷新机制
  enable: false,
  connectUrl: "/unity-socket",
  broadcast: {
    enable: true,
    subscribeUrl: "/unity/broad"
  },
  p2p: {
    enable: true,
    subscribeUrl: "/unity/" + localStorage.getItem("userNo")
  }
};
