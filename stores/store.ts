import { configureStore } from "@reduxjs/toolkit";
import AppConfigReducer from '@/stores/appConfigSlice';

const store = configureStore({
    reducer: {
        appConfig: AppConfigReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;