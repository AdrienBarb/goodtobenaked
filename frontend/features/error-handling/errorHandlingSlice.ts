import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isError: false,
  toastMessage: '',
  statusCode: null,
};

export const errorHandlingSlice = createSlice({
  name: 'errorHandling',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.toastMessage = '';
      state.statusCode = null;
    },
    setToastError: (state, action) => {
      state.isError = true;
      state.toastMessage = action.payload;
    },
    setStatusCode: (state, action) => {
      state.statusCode = action.payload;
    },
  },
});

export const { reset, setToastError, setStatusCode } = errorHandlingSlice.actions;
export default errorHandlingSlice.reducer;
