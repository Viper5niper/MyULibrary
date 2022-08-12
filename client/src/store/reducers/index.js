import { combineReducers } from 'redux';

import authReducer from './authReducer';
import registerReducer from './registerReducer';
import userReducer from './userReducer';
import usersReducer from './usersReducer';
import bookReducer from './bookReducer';

export default combineReducers({
  auth: authReducer,
  register: registerReducer,
  book: bookReducer,
  user: userReducer,
  users: usersReducer,
});
