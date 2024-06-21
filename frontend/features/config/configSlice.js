import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  language: false,
  isMapScriptLoaded: false
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    switchLanguage: (state, action) => {
      state.language = action.payload;
    },
    setMapScriptLoaded: (state, action) => {
      state.isMapScriptLoaded = action.payload;
    },
  },
});

export const { switchLanguage, setMapScriptLoaded } = configSlice.actions
export default configSlice.reducer;
