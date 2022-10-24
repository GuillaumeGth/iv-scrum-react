import { combineReducers } from "redux";
import { SET_DEV, SET_DEVS, SET_TEAMS } from "./action";
import { configureStore } from "@reduxjs/toolkit";
import Dev from "../types/Dev";

// const reduxDevs = (state = { devs : null}, action: Record<string, any>) => {
//     switch (action.type) {
//       case SET_DEVS:          
//           return Object.assign({}, state, {
//               devs: action.payload.devs
//           });    
//       case SET_DEV:          
//           const id = action.payload.dev.id;     
//           const devs = state.devs as unknown as Array<Dev>;     
//           if (!devs)  {
//             return Object.assign({}, state, {
//                 devs: null
//             });
//           }
//           const dev = devs.find((dev : Dev) => dev.id === id) as unknown as Dev;
//           if (!dev) return;
//           const newDevs = [...devs].reduce((prev: [], cur: Dev) => {
//               let d = {...cur};
//               if (action.payload.dev.speaking){

//               }
//               if (d.id === dev.id){
//                   d = {...action.payload.dev};
//               }              
//               prev.push(d as never);
//               return prev;
//           }, []);          
//           return Object.assign({}, state, {
//               devs: newDevs
//           }); 
//       default:
//           return state;
//     }
//   }
  const reduxTeams = (state = { teams : null}, action: Record<string, any>) => {
    switch (action.type) {
        case SET_TEAMS:          
          return Object.assign({}, state, {
              teams: action.payload.teams
        });
        default:
            return state;
    }
  }
const reducer = combineReducers(
    {
        // devs: reduxDevs, 
        teams: reduxTeams
    });
const store = configureStore({reducer: reducer,
    preloadedState: {
        // devs: { devs: null },
        teams: {teams: null }
    }});
export type RootState = ReturnType<typeof store.getState>
export default store;