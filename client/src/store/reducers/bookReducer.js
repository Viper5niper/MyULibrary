import {
  GET_BOOKS_LOADING,
  GET_BOOKS_SUCCESS,
  GET_BOOKS_FAIL,
  ADD_BOOK_LOADING,
  ADD_BOOK_SUCCESS,
  ADD_BOOK_FAIL,
  DELETE_BOOK_LOADING,
  DELETE_BOOK_SUCCESS,
  DELETE_BOOK_FAIL,
  EDIT_BOOK_LOADING,
  EDIT_BOOK_SUCCESS,
  EDIT_BOOK_FAIL,
  BORROW_BOOK_LOADING,
  BORROW_BOOK_SUCCESS,
  BORROW_BOOK_FAIL,
  GET_WITHDRAWALS_LOADING,
  GET_WITHDRAWALS_SUCCESS,
  GET_WITHDRAWALS_FAIL,
  CLEAR_BOOK_ERROR,
} from '../types';

const initialState = {
  books: [],
  isLoading: false,
  error: null,
};

// You could have an array [{ id: 1, isLoading: false, error: null, text: "Hey" }, { id: 2, isLoading: true, error: null, text: null }]

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case GET_BOOKS_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_WITHDRAWALS_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case ADD_BOOK_LOADING:
      return {
        ...state,
        books: [
          {
            id: 0,
            title: 'Loading...',
            author: 'Loading...',
            year: 'Loading...',
            genre: 'Loading...',
            stock: 'Loading...',
            isLoading: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...state.books,
        ],
      };
    case DELETE_BOOK_LOADING:
    case EDIT_BOOK_LOADING:
      return {
        ...state,
        books: state.books.map((b) => {
          if (b.id === payload.id) return { ...b, isLoading: true };
          return b;
        }),
      };
    case BORROW_BOOK_LOADING:
      return {
        ...state,
        books: state.books.map((b) => {
          if (b.id === payload.id) return { ...b, isLoading: true };
          return b;
        }),
      };
    case GET_BOOKS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        books: payload.books,
      };
    case GET_WITHDRAWALS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        users: payload.users,
      };
    case ADD_BOOK_SUCCESS:
      return {
        ...state,
        books: state.books.map((b) => {
          if (b.id === 0) return payload.book;
          return b;
        }),
      };
    case DELETE_BOOK_SUCCESS:
      return {
        ...state,
        books: state.books.filter((b) => b.id !== payload.book.id),
      };
    case EDIT_BOOK_SUCCESS:
      return {
        ...state,
        books: state.books.map((b) => {
          if (b.id === payload.book.id) return payload.book;
          return b;
        }),
      };
    case BORROW_BOOK_SUCCESS:
      return {
        ...state,
        books: state.books.map((b) => {
          if (b.id === payload.book.id) return payload.book;
          return b;
        }),
      };
    case DELETE_BOOK_FAIL:
    case EDIT_BOOK_FAIL:
      return {
        ...state,
        error: null,
        books: state.books.map((b) => {
          if (b.id === payload.id) return { ...b, isLoading: false, error: payload.error };
          return b;
        }),
      };
    case BORROW_BOOK_FAIL:
      return {
        ...state,
        error: null,
        books: state.books.map((b) => {
          if (b.id === payload.id) return { ...b, isLoading: false, error: payload.error };
          return b;
        }),
      };
    case GET_BOOKS_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case GET_WITHDRAWALS_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case ADD_BOOK_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
        books: state.books.filter((b) => b.id !== 0),
      };
    case CLEAR_BOOK_ERROR:
      return {
        ...state,
        books: state.books.map((b) => {
          if (b.id === payload.id) return { ...b, isLoading: false, error: null };
          return b;
        }),
      };
    default:
      return state;
  }
}
