import {   
  GET_WITHDRAWALS_LOADING,
  GET_WITHDRAWALS_SUCCESS,
  GET_WITHDRAWALS_FAIL, 
  EDIT_WITHDRAWAL_LOADING,
  EDIT_WITHDRAWAL_SUCCESS,
  EDIT_WITHDRAWAL_FAIL, 
} from '../types';

const initialState = {
  usersWithdrawals: [],
  isLoading: false,
  error: null,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case GET_WITHDRAWALS_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case EDIT_WITHDRAWAL_LOADING:
      return {
        ...state,
        usersWithdrawals: state.usersWithdrawals.map((b) => {
          if (b.id === payload.id) return { ...b, isLoading: true };
          return b;
        }),
      };
    case GET_WITHDRAWALS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        usersWithdrawals: payload.usersWithdrawals,
      };
    case EDIT_WITHDRAWAL_SUCCESS:
      return {
        ...state,
        usersWithdrawals: state.usersWithdrawals.map((b) => {
          if (b.id === payload.userWithdrawal.id) return payload.userWithdrawal;
          return b;
        }),
      };
    case GET_WITHDRAWALS_FAIL:
      return {
        ...state,
        isLoading: false,
        usersWithdrawals: [],
        error: payload,
      };
    case EDIT_WITHDRAWAL_FAIL:
      return {
        ...state,
        error: null,
        usersWithdrawals: state.usersWithdrawals.map((b) => {
          if (b.id === payload.id) return { ...b, isLoading: false, error: payload.error };
          return b;
        }),
      };
    default:
      return state;
  }
}
