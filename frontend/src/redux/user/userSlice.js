import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    currentUser : null,
    error : null,
    loading : false,
    // token: null
}

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        signInStart : (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess : (state , action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
            // state.token = localStorage.getItem('token');
        },
        signInFailure : (state , action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateStart : (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess : (state , action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateFailure : (state , action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart : (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess : (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure : (state , action) => {
            state.loading = false;
            state.error = action.payload;
        },
        // Add the missing signout actions
        signOutStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signoutSuccess: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false;
            // state.token = null;
            // localStorage.removeItem('token');
        },
        signOutFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

// Export all actions including the new signout actions
export const { 
    signInFailure, 
    signInStart, 
    signInSuccess, 
    updateStart, 
    updateSuccess, 
    updateFailure, 
    deleteUserStart, 
    deleteUserSuccess, 
    deleteUserFailure, 
    signOutStart,      // Add this
    signoutSuccess,    // This was already there
    signOutFailure     // Add this
} = userSlice.actions;

export default userSlice.reducer;
