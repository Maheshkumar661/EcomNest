import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getData, setData } from "../../Helpers/StorageHelper";

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
}

interface FavoritesState {
    items: Product[];
}

const FAVORITES_KEY = "FAVORITES_ITEMS";

const initialState: FavoritesState = {
    items: [],
};

const favoritesSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        setFavorites: (state, action: PayloadAction<Product[]>) => {
            state.items = action.payload;
        },
        toggleFavorite: (state, action: PayloadAction<Product>) => {
            const exists = state.items.find((item) => item.id === action.payload.id);
            if (exists) {
                state.items = state.items.filter((item) => item.id !== action.payload.id);
            } else {
                state.items.push(action.payload);
            }
            setData(FAVORITES_KEY, state.items);
        },
    },
});

export const { toggleFavorite, setFavorites } = favoritesSlice.actions;

export const loadFavoritesFromStorage = () => async (dispatch: any) => {
    const saved = await getData(FAVORITES_KEY);
    if (saved && Array.isArray(saved)) {
        dispatch(setFavorites(saved));
    }
};

export default favoritesSlice.reducer;
