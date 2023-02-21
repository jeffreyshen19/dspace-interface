import { writable } from "svelte/store";
import { browser } from '$app/environment';

const defaultValue = {};
const storedValueSavedItems = browser ? JSON.parse(window.localStorage.getItem("savedItems")) ?? defaultValue : defaultValue;
const storedValueSessionData = browser ? JSON.parse(window.localStorage.getItem("sessionData")) ?? defaultValue : defaultValue;
export const savedItems = writable(storedValueSavedItems);
export const sessionData = writable(storedValueSessionData);

// Anytime the store changes, update the local storage value.
savedItems.subscribe((value) => {
    if(browser) window.localStorage.setItem("savedItems", JSON.stringify(value));
})

sessionData.subscribe((value) => {
    if(browser) window.localStorage.setItem("sessionData", JSON.stringify(value));
})

