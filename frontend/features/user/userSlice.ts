import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import userService from "./userService";
import { User } from "@/types/models/User";

type State = {
  isEditUserLoading: boolean;
  isEditUserSucceed: boolean;
  isEditProfilImageLoading: boolean;
  isEditProfilImageSucceed: boolean;
  loggedUser: null | User;
  creditAmount: number;
};

const initialState: State = {
  isEditUserLoading: false,
  isEditUserSucceed: false,
  isEditProfilImageLoading: false,
  isEditProfilImageSucceed: false,
  loggedUser: null,
  creditAmount: 0,
};

export const userProfile = createAsyncThunk(
  "user/userProfile",
  async (values: {}, thunkAPI) => {
    try {
      return await userService.userProfile(values);
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getCreditAmount = createAsyncThunk(
  "user/getCreditAmount",
  async (_, thunkAPI) => {
    try {
      return await userService.getCreditAmount();
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const addProfilPicture = createAsyncThunk(
  "user/addProfilPicture",
  async (values: { filetype: string }, thunkAPI) => {
    try {
      return await userService.addProfilPicture(values);
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser: (state) => {
      state.isEditUserLoading = false;
      state.isEditUserSucceed = false;
      state.isEditProfilImageLoading = false;
      state.isEditProfilImageSucceed = false;
    },
    setLoggedUser: (state, action) => {
      state.loggedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userProfile.pending, (state) => {
        state.isEditUserLoading = true;
      })
      .addCase(userProfile.fulfilled, (state) => {
        state.isEditUserLoading = false;
        state.isEditUserSucceed = true;
      })
      .addCase(userProfile.rejected, (state) => {
        state.isEditUserLoading = false;
      })
      .addCase(getCreditAmount.fulfilled, (state, action) => {
        state.creditAmount = action.payload;
      })
      .addCase(addProfilPicture.pending, (state) => {
        state.isEditProfilImageLoading = true;
      })
      .addCase(addProfilPicture.fulfilled, (state) => {
        state.isEditProfilImageLoading = false;
        state.isEditProfilImageSucceed = false;
      })
      .addCase(addProfilPicture.rejected, (state) => {
        state.isEditProfilImageLoading = false;
      });
  },
});

export const { resetUser, setLoggedUser } = userSlice.actions;
export default userSlice.reducer;
