import { writable } from "svelte/store";
import { browser } from '$app/environment';

const defaultValue = {};
const storedValue = browser ? JSON.parse(window.localStorage.getItem("savedItems")) ?? defaultValue : defaultValue;
export const savedItems = writable(storedValue);

// Anytime the store changes, update the local storage value.
savedItems.subscribe((value) => {
    if(browser) window.localStorage.setItem("savedItems", JSON.stringify(value));
})
