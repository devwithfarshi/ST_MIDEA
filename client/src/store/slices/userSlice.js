import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  isLogin: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLogin = true;
    },
    logOutUser: (state, action) => {
      state.user = {};
      state.isLogin = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, logOutUser } = userSlice.actions;

export default userSlice.reducer;
