import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentMenu: "",
    currentPage: "",  
    isAlarmPage: false,
    isSpreadMainMenu: true,
    allPageLoading: false,
}

const appConfigSlice = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {
    setCurrentMenu: (state, action) => { state.currentMenu = action.payload; },
    setCurrentPage: (state, action) => { state.currentPage = action.payload; },
    setIsAlarmPage: (state, action) => { state.isAlarmPage = action.payload; },
    setIsSpreadMainMenu: (state, action) => { state.isSpreadMainMenu = action.payload; },
    setAllPageLoading: (state, action) => { state.allPageLoading = action.payload; }
  }
});

export const { 
  setCurrentMenu, 
  setCurrentPage, 
  setIsAlarmPage,
  setIsSpreadMainMenu,
  setAllPageLoading
} = appConfigSlice.actions;
export default appConfigSlice.reducer;