import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

const store = configureStore({
	reducer: {
		auth: authSlice,
		//adding functions / slices to do stuffs
		// which can be used by any components
		//just import store there
	},
});

export default store;
