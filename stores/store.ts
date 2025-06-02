import { configureStore } from "@reduxjs/toolkit";
import AppConfigReducer from '@/stores/appConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
const store = configureStore({
    reducer: {
        appConfig: AppConfigReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const UseDispatch = useDispatch;
export const UseSelector = useSelector;

export default store;