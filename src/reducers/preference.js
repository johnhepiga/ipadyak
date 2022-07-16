const PreferenceReducer = (state = { mode: 'dark' }, action) => {
  switch (action.type) {
    case 'UPDATEPREFERENCE':
      return { ...state, [action.key]: action.payload };
    default:
      return state;
  }
};

export default PreferenceReducer;
