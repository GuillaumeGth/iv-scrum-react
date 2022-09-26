import { combineReducers } from "redux";
import { SET_DEV_TALKED, SET_DEVS } from "./action";
import { configureStore } from "@reduxjs/toolkit";
import Dev from "../types/Dev";

const reduxDevs = (state = { devs : null}, action: Record<string, any>) => {
  switch (action.type) {
    case SET_DEVS:          
        return Object.assign({}, state, {
            devs: action.payload.devs
        });    
    case SET_DEV_TALKED:          
        const id = action.payload.dev.id;     
        const devs = state.devs as unknown as Array<Dev>;          
        const dev = devs.find((dev : Dev) => dev.id === id) as unknown as Dev;
        if (!dev) return;
        const newDevs = [...devs].reduce((prev: [], cur: Dev) => {
            const d = {...cur};
            if (d.id === dev.id){
                d.talked = true;
            }
            prev.push(d as never);
            return prev;
        }, []);
        return Object.assign({}, state, {
            devs: newDevs
        }); 
    default:
        return state;
  }
}
const reducer = combineReducers({ devs: reduxDevs});
const store = configureStore({reducer: reducer,
    preloadedState: {
        devs: { devs: null },
    }});
export type RootState = ReturnType<typeof store.getState>
export default store;