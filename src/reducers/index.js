import { combineReducers } from 'redux';
import LogReducer from './log';
import PreferenceReducer from './preference';
import SocketReducer from './socket';

export default combineReducers({
  LOG: LogReducer,
  PREFERENCE: PreferenceReducer,
  SOCKET: SocketReducer,
});
