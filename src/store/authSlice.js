//this is for autheticating a user and providing login , logout functionality

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	status: false,
	userData: null,
};

const authSlice = createSlice({//add those slices / functions
	name: "auth",
	initialState,
	reducers: {
		login: (state, action) => {
			state.status = true;
			state.userData = action.payload.userData;
		},
		logout: (state) => {
			state.status = false;
			state.userData = null;
		},
	},
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;

