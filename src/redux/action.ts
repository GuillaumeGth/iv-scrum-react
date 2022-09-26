import { createAction } from "@reduxjs/toolkit";
export const SET_DEVS = "SET_DEVS";
export const SET_DEV_TALKED = "SET_DEV_TALKED";
const setDevs = createAction(SET_DEVS, devs => {
    return {payload: {devs}};
});
const setDevTalked = createAction(SET_DEV_TALKED, dev => {
    return {payload: {dev}};
});
export {setDevs, setDevTalked};