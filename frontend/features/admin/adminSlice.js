import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "./adminService";

const initialState = {
  isFetchLoading: false,
  isFetchSucceed: false,
  isEditLoading: false,
  isEditSucceed: false,
  creators: [],
  currentCreatorIdentityCheck: null,
  conflicts: [],
};

// Get all creators
export const getCreators = createAsyncThunk(
  "admin/getCreators",
  async (query, thunkAPI) => {
    try {
      return await adminService.getCreators(query);
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue();
    }
  }
);

// Get all creators
export const getCurrentCreatorIdentityCheck = createAsyncThunk(
  "admin/getCurrentCreatorIdentityCheck",
  async (values, thunkAPI) => {
    try {
      return await adminService.getCurrentCreatorIdentityCheck(values);
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue();
    }
  }
);

// Change verif state
export const changeVerificationState = createAsyncThunk(
  "admin/changeVerificationState",
  async (values, thunkAPI) => {
    try {
      return await adminService.changeVerificationState(values);
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue();
    }
  }
);

// Get all conflict
export const getConflicts = createAsyncThunk(
  "admin/getConflicts",
  async (query, thunkAPI) => {
    try {
      return await adminService.getConflicts(query);
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue();
    }
  }
);

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetAdmin: (state) => {
      state.isFetchLoading = false
      state.isFetchSucceed = false
      state.isEditLoading = false
      state.isEditSucceed = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCreators.pending, (state) => {
        state.isFetchLoading = true
      })
      .addCase(getCreators.fulfilled, (state, action) => {
        state.isFetchLoading = false
        state.isFetchSucceed = true
        state.creators = action.payload
      })
      .addCase(getCreators.rejected, (state) => {
        state.isFetchLoading = false
      })
      .addCase(getCurrentCreatorIdentityCheck.pending, (state) => {
        state.isFetchLoading = true
      })
      .addCase(getCurrentCreatorIdentityCheck.fulfilled, (state, action) => {
        state.isFetchLoading = false
        state.isFetchSucceed = true
        state.currentCreatorIdentityCheck = action.payload
      })
      .addCase(getCurrentCreatorIdentityCheck.rejected, (state) => {
        state.isFetchLoading = false
      })
      .addCase(changeVerificationState.pending, (state) => {
        state.isEditLoading = true
      })
      .addCase(changeVerificationState.fulfilled, (state, action) => {
        state.isEditLoading = false
        state.isEditSucceed = true
      })
      .addCase(changeVerificationState.rejected, (state) => {
        state.isEditLoading = false
      })
      .addCase(getConflicts.pending, (state) => {
        state.isFetchLoading = true
      })
      .addCase(getConflicts.fulfilled, (state, action) => {
        state.isFetchLoading = false
        state.isFetchSucceed = true
        state.conflicts = action.payload
      })
      .addCase(getConflicts.rejected, (state) => {
        state.isFetchLoading = false
      })
  },
});

export const { resetAdmin } = adminSlice.actions;
export default adminSlice.reducer;
