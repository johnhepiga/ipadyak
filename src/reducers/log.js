const LogReducer = (state = { signed: false, user: null }, action) => {
  switch (action.type) {
    case 'SIGNIN':
      return { signed: true, user: [action.payload] };
    case 'SIGNOUT':
      return { signed: false, user: null };
    case 'UPDATEUSER':
      state.user[0] = action.payload;
      return state;
    default:
      return state;
  }
};

export default LogReducer;
