import axios from 'axios';

import { attachTokenToHeaders } from './authActions';
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
  CLEAR_BOOK_ERROR,
} from '../types';

export const getBooks = () => async (dispatch, getState) => {
  dispatch({
    type: GET_BOOKS_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/books', options);

    console.log(response);
    dispatch({
      type: GET_BOOKS_SUCCESS,
      payload: { books: response.data.books },
    });
  } catch (err) {
    dispatch({
      type: GET_BOOKS_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const addBook = (formData) => async (dispatch, getState) => {
  dispatch({
    type: ADD_BOOK_LOADING,
    payload: { me: { ...getState().auth.me } },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/books', formData, options);

    dispatch({
      type: ADD_BOOK_SUCCESS,
      payload: { book: response.data.book },
    });
  } catch (err) {
    dispatch({
      type: ADD_BOOK_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

// set filtered books to state
export const searchBooks = (searchTerm) => async (dispatch, getState) => {
  dispatch({
    type: GET_BOOKS_LOADING,
  });
  try {

    console.log('searching for: ' + searchTerm);
    const options = attachTokenToHeaders(getState);
    const response = await axios.get(`/api/books?search=${searchTerm}`, options);

    dispatch({
      type: GET_BOOKS_SUCCESS,
      payload: { books: response.data.books },
    });
  } catch (err) {
    dispatch({
      type: GET_BOOKS_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
}

export const deleteBook = (id) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_BOOK_LOADING,
    payload: { id },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.delete(`/api/books/${id}`, options);

    dispatch({
      type: DELETE_BOOK_SUCCESS,
      payload: { book: response.data.book },
    });
  } catch (err) {
    dispatch({
      type: DELETE_BOOK_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const editBook = (id, formData) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_BOOK_LOADING,
    payload: { id },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/books/${id}`, formData, options);

    dispatch({
      type: EDIT_BOOK_SUCCESS,
      payload: { book: response.data.book },
    });
  } catch (err) {
    dispatch({
      type: EDIT_BOOK_FAIL,
      payload: { error: err?.response?.data.message || err.message, id },
    });
  }
};

export const clearBookError = (id) => ({
  type: CLEAR_BOOK_ERROR,
  payload: { id },
});
