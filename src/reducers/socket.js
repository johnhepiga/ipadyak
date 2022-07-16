const SocketReducer = (state = null, action) => {
  switch (action.type) {
    case 'CONNECT':
      return (state = action.payload);
    case 'DISCONNECT':
      return (state = null);
    default:
      return state;
  }
};

export default SocketReducer;
