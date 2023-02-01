

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

        body{
            font-family: "Inter";
            padding: 0;
            margin: 0;
            overflow: hidden;
            width: 100vw;
            height: 100vh;
        }
    </style>
</svelte:head>

<script>
	import Grid from '../lib/components/Grid.svelte';
    // import GridGenerator from '../lib/components/GridGenerator.svelte';
    // import MinimapGenerator from "../lib/components/MinimapGenerator.svelte";
</script>

<!-- <MinimapGenerator/> -->

<Grid/>
<!-- <GridGenerator/> -->