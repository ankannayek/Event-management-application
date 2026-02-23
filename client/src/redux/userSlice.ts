import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


export interface IUser {
    id: string;
    name: string;
    email: string;
    mobileNumber: string;
    role: "admin" | "organizer" | "attendee" | "exhibitor" | "sponsor";
}

export type userStateType = {
    data: IUser | {};
    authorization: string | null
}

const initialState: userStateType = {
    data: {},
    authorization: ''
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        add: (state, action: PayloadAction<userStateType>) => {
            state.data = action.payload.data;
            state.authorization = action.payload.authorization;
        },
        remove: (state) => {
            state.data = {};
            state.authorization = null;
        }
    }
})

export const { add, remove } = userSlice.actions

export default userSlice.reducer