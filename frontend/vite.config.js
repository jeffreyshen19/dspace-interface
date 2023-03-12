import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	base: "/dspace-interface/",
	plugins: [sveltekit()]
};

export default config;
