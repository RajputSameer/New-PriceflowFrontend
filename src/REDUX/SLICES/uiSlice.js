
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        sidebarOpen: true,
        darkMode: localStorage.getItem('darkMode') === 'true' || false,
        notifications: [],
        modals: {
            confirmDelete: false,
            addProduct: false,
            editProduct: false,
            createDiscount: false,
        },
    },
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
            localStorage.setItem('darkMode', state.darkMode);
        },
        addNotification: (state, action) => {
            state.notifications.push({
                id: Date.now(),
                ...action.payload,
            });
        },
        removeNotification: (state, action) => {
            state.notifications = state.notifications.filter(
                (notif) => notif.id !== action.payload
            );
        },
        openModal: (state, action) => {
            state.modals[action.payload] = true;
        },
        closeModal: (state, action) => {
            state.modals[action.payload] = false;
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
    },
});

export const {
    toggleSidebar,
    toggleDarkMode,
    addNotification,
    removeNotification,
    openModal,
    closeModal,
    clearNotifications,
} = uiSlice.actions;
export default uiSlice.reducer;
