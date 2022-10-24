import { createAction } from "@reduxjs/toolkit";
export const SET_DEVS = "SET_DEVS";
export const SET_DEV = "SET_DEV";
export const SET_TEAMS= "SET_TEAMS";

const setDevs = createAction(SET_DEVS, devs => {
    return {payload: {devs}};
});
const setDev = createAction(SET_DEV, dev => {
    return {payload: {dev}};
});
const setTeams = createAction(SET_TEAMS, teams => {
    return {payload: {teams}};
});
export {setDevs, setDev, setTeams};