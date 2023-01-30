
<script lang="ts">
    import type { Document } from '../types/Document';
    import { supabase } from '../supabaseClient';
    import DocumentBox from "./DocumentBox.svelte";
    import Search from "./Search.svelte";
    import Minimap from './Minimap.svelte';
    import BagButton from "./BagButton.svelte";
    import SavedItems from "./SavedItems.svelte";
    import DocumentInfo from "./DocumentInfo.svelte";
    import { onMount, afterUpdate } from 'svelte';
    import Fa from 'svelte-fa';
    import { faCircleNotch, faY } from '@fortawesome/free-solid-svg-icons';

    let width; let height;
    let selectedDocument: Document = null;
    let documents: Document[] = [];
    let displaySaved = false;

    let boundingBox;
    let loading;
    let loadedBox; 

    let isPointerDown: boolean = false;
    let pointerOrigin;
    let viewBox;
    let newViewBox;

    let moved = false;

    async function getData(){
        let widthPadding = 2 * width;
        let heightPadding = 2 * height;

        loading = true;
        loadedBox = [[boundingBox[0][0] - widthPadding, boundingBox[0][1] - heightPadding], [ boundingBox[1][0] + widthPadding, boundingBox[1][1] + heightPadding]];

        let {data, error} = await supabase
            .from('documents')
            .select()
            .gte("x", loadedBox[0][0]).lte("x", loadedBox[1][0])
            .gte("y", loadedBox[0][1]).lte("y", loadedBox[1][1]);

        documents = data;
        loading = false;
    }

    function setURLParams(){
        var url = new URL(window.location.href);
        url.searchParams.set('x', boundingBox[0][0] + (boundingBox[1][0] - boundingBox[0][0]) / 2);
        url.searchParams.set('y', boundingBox[0][1] + (boundingBox[1][1] - boundingBox[0][1]) / 2);
        window.history.replaceState(null, "", url.toString())
    }

    function transportTo(x: number, y: number){
        boundingBox = [[x - width / 2, y - height / 2], [x + width / 2, y + height / 2]];

        let viewBoxString = `${boundingBox[0][0]} ${boundingBox[0][1]} ${width} ${height}`;
        document.querySelector('#grid svg').setAttribute('viewBox', viewBoxString);

        pointerOrigin = {
            x: boundingBox[0][0], 
            y: boundingBox[0][1]
        };
        viewBox = {
            x: boundingBox[0][0],
            y: boundingBox[0][1]
        };
        newViewBox = {
            x: boundingBox[0][0],
            y: boundingBox[0][1]
        };

        if(!loadedBox || needToReload()) getData();

        setURLParams();
    }

    function onResize(){
        let centerX = boundingBox[0][0] + (boundingBox[1][0] - boundingBox[0][0]) / 2;
        let centerY = boundingBox[0][1] + (boundingBox[1][1] - boundingBox[0][1]) / 2;
        transportTo(centerX, centerY);
    }

	onMount(async () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        let centerX = parseFloat(urlParams.get("x")) || 0;
        let centerY = parseFloat(urlParams.get("y")) || 0;
        
        transportTo(centerX, centerY);

        window.addEventListener('resize', onResize);
		
		return () => {
			window.removeEventListener('resize', onResize);
		}
	});

    // Handle panning of SVG 

    function getPointFromEvent (event) {
        var point = {x: 0, y: 0};
        // If event is triggered by a touch event, we get the position of the first finger
        if (event.targetTouches) {
            point.x = event.targetTouches[0].clientX;
            point.y = event.targetTouches[0].clientY;
        } else {
            point.x = event.clientX;
            point.y = event.clientY;
        }
        
        return point;
    }

    function onPointerDown(event) {
        isPointerDown = true; 
        let pointerPosition = getPointFromEvent(event);
        pointerOrigin.x = pointerPosition.x;
        pointerOrigin.y = pointerPosition.y;
    }

    function onKeyDown(event){
        const speed = 20;

        switch(event.key.toLowerCase()){
            case "a":
            case "arrowleft": 
                viewBox.x -= speed;
                break;
            case "d":
            case "arrowright": 
                viewBox.x += speed;
                break;
            case "w":
            case "arrowup": 
                viewBox.y -= speed;
                break;
            case "s":
            case "arrowdown": 
                viewBox.y += speed;
                break;
        }

        let viewBoxString = `${viewBox.x} ${viewBox.y} ${width} ${height}`;
        document.querySelector('#grid svg').setAttribute('viewBox', viewBoxString);
    }

    function onPointerMove (event) {
        if (!isPointerDown) return; 

        let pointerPosition = getPointFromEvent(event);

        newViewBox.x = viewBox.x - (pointerPosition.x - pointerOrigin.x);
        newViewBox.y = viewBox.y - (pointerPosition.y - pointerOrigin.y);

        let dist = Math.pow(pointerPosition.x - pointerOrigin.x, 2) + Math.pow(pointerPosition.y - pointerOrigin.y, 2);

        if(dist > 10) moved = true;

        let viewBoxString = `${newViewBox.x} ${newViewBox.y} ${width} ${height}`;
        document.querySelector('#grid svg').setAttribute('viewBox', viewBoxString);
    }

    function needToReload(){
        return boundingBox[0][0] < loadedBox[0][0] + 300 || boundingBox[0][1] < loadedBox[0][1] + 300 || boundingBox[1][0] > loadedBox[1][0] - 300 || boundingBox[1][1] > loadedBox[1][1] - 300;
    }

    function onPointerUp(event) {
        if(!isPointerDown) return;
        isPointerDown = false;

        // Update viewbox
        viewBox.x = newViewBox.x;
        viewBox.y = newViewBox.y;

        boundingBox[0][0] = viewBox.x;
        boundingBox[0][1] = viewBox.y;
        boundingBox[1][0] = (width + viewBox.x);
        boundingBox[1][1] = (height + viewBox.y);

        // Update URL params 
        setURLParams();

        // Reload data, if necessary 
        if(needToReload()) getData();
        
        
    }

    function handleDocumentClick(document){
        if(!moved) selectedDocument = (selectedDocument == document) ? null : document;
        moved = false;
    }

</script>
    
<Search/>
<BagButton handleClick={() => {displaySaved = !displaySaved}} {displaySaved} displayDocumentInfo={selectedDocument != null}/>
<DocumentInfo {transportTo} {displaySaved} bind:selectedDocument={selectedDocument}/>
<SavedItems bind:displaySaved={displaySaved} bind:selectedDocument={selectedDocument}/>
<Minimap {boundingBox}/>

<svelte:window 
    bind:innerWidth={width} 
    bind:innerHeight={height}
    on:keydown={onKeyDown}
/>

{#if loading}
    <div id = "overlay"></div>

    <span id = "loading">
        <Fa icon={faCircleNotch} size="3x" spin />
    </span>
{/if}

<div id = "grid" >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <svg 
        on:mousedown={onPointerDown}
        on:mouseup|stopPropagation={onPointerUp}
        on:mouseleave|stopPropagation={onPointerUp}
        on:mousemove={onPointerMove}
        on:touchstart={onPointerDown}
        on:touchend={onPointerUp}
        on:touchmove={onPointerMove}
        on:click|self={() => {if(!moved) selectedDocument = null; moved = false; }}
    >
        {#each documents as document}
            <foreignObject on:click={() => handleDocumentClick(document)} x="{document.x}" y="{document.y}" width="1" height="1">
                <DocumentBox {document}/>
            </foreignObject>
        {/each}
    </svg>
</div>



<style>
    #grid{
        width: 100vw;
        height: 100vh;
        user-select: none; 
    }

    #overlay{
        z-index: 99;
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(181, 181, 181, 0.3);
        backdrop-filter: blur(1px);
    }

    #loading{
        position: absolute;
        z-index: 102;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    svg{
        width: 100%;
        height: 100%;
    }

    foreignObject{
        overflow: visible;
    }
</style>