import adapter from '@sveltejs/adapter-vercel';
import autoPreprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	},
	preprocess: autoPreprocess()
};

export default config;
