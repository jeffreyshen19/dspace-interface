
<script lang="ts">
    import type { Document } from '../types/Document';
    import { supabase } from '../supabaseClient';
    import DocumentBox from "./DocumentBox.svelte";
    import Legend from "./Legend.svelte";
    import ZoomControl from './ZoomControl.svelte';
    import Search from "./Search.svelte";
    import Minimap from './Minimap.svelte';
    import BagButton from "./BagButton.svelte";
    import SavedItems from "./SavedItems.svelte";
    import DocumentInfo from "./DocumentInfo.svelte";
    import { onMount, afterUpdate } from 'svelte';
    import Fa from 'svelte-fa';
    import { faCircleNotch, faY } from '@fortawesome/free-solid-svg-icons';
    import DirectionIndicator from './DirectionIndicator.svelte';
    import { savedItems, taskData, sessionData } from '../store.js';

    let width; let height;
    let selectedDocument: Document = null;
    let documents: Document[] = [];
    let displaySaved = true;
    let resultsVisible = false;
    let showDirectionIndicator = false;
    let directionIndicatorAngle = 0;
    let directionIndicatorTitle;
    let expanded = false;
    let hovered = null;

    let boundingBox;
    let loading;
    let loadedBox; 

    let isPointerDown: boolean = false;
    let pointerOrigin;
    let viewBox;
    let newViewBox;
    let minimapBox;

    let zoom;
    let zoomFactor = 0.9;
    let minZoom = 0.25;
    let maxZoom = 1.5;

    let moved = false;

    

    async function getData(){
        let widthPadding = width;
        let heightPadding = height;

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
        url.searchParams.set('z', zoom);
        window.history.pushState(null, "", url.toString())
    }

    function saveLocationHistory(x, y){
        if(!("locationHistory" in $taskData)) return;
        let locationHistory = $taskData["locationHistory"];
        locationHistory.push({x: x, y: y, t: Date.now()});
        let temp = $taskData;
        temp["locationHistory"] = locationHistory;
        taskData.set(temp);
    }

    
    function transportTo(x: number, y: number, z?: number){
        saveLocationHistory(x, y);
        boundingBox = [[x - width / 2, y - height / 2], [x + width / 2, y + height / 2]];

        pointerOrigin = {
            x: boundingBox[0][0], 
            y: boundingBox[0][1]
        };
        viewBox = {
            x: boundingBox[0][0],
            y: boundingBox[0][1],
            width: width,
            height: height
        };
        newViewBox = {
            x: boundingBox[0][0],
            y: boundingBox[0][1]
        };
        minimapBox = {
            x: boundingBox[0][0],
            y: boundingBox[0][1],
            width: width,
            height: height
        };

        zoom = z || 1;
        scale();

        setViewBoxString();
        if(!loadedBox || needToReload()) getData();

        setURLParams();
    }

    function onResize(){
        let centerX = boundingBox[0][0] + (boundingBox[1][0] - boundingBox[0][0]) / 2;
        let centerY = boundingBox[0][1] + (boundingBox[1][1] - boundingBox[0][1]) / 2;
        transportTo(centerX, centerY, zoom);
    }

    function init(){
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        let centerX = parseFloat(urlParams.get("x")) || 0;
        let centerY = parseFloat(urlParams.get("y")) || 0;
        zoom = Math.max(minZoom, Math.min(parseFloat(urlParams.get("z")) || 1, maxZoom));
        
        transportTo(centerX, centerY, zoom);
        addDisplayedItems();
    }

	onMount(async () => {
        init();

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
        }
        else if(event.type == "wheel"){
            point.x = event.clientX + wheeldelta.x;
            point.y = event.clientY + wheeldelta.y;
        }
        else {
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

    function scale(){
        let cx = viewBox.x + viewBox.width / 2;
        let cy = viewBox.y + viewBox.height / 2;

        let newWidth = width / zoom;
        let newHeight = height / zoom;

        viewBox.x = cx - newWidth / 2;
        viewBox.y = cy - newHeight / 2;
        viewBox.width = newWidth;
        viewBox.height = newHeight; 

        boundingBox[0][0] = viewBox.x;
        boundingBox[0][1] = viewBox.y;
        boundingBox[1][0] = (viewBox.width + viewBox.x);
        boundingBox[1][1] = (viewBox.height + viewBox.y);

        minimapBox.x = viewBox.x;
        minimapBox.y = viewBox.y;
        minimapBox.width = viewBox.width;
        minimapBox.height = viewBox.height;

        addDisplayedItems();
    }

    function zoomOut(){
        zoom = Math.max(zoom * zoomFactor, minZoom);
        scale();
        setURLParams();
        setViewBoxString();
        if(needToReload()) getData();
    }

    function zoomIn(){
        zoom = Math.min(zoom / zoomFactor, maxZoom);
        scale();
        setURLParams();
        setViewBoxString();
        if(needToReload()) getData();
    }

    function setViewBoxString(){
        let viewBoxString = `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`;
        document.querySelector('#grid svg').setAttribute('viewBox', viewBoxString);
    }

    function onKeyDown(event){

        switch(event.key.toLowerCase()){
            case "escape":
                selectedDocument = null; 
                displaySaved = false; 
                resultsVisible = false; 
                showDirectionIndicator = false;
                break;
        }

    }

    function onPointerMove (event, scalingX?, scalingY?) {
        if (!isPointerDown) return; 
        if(!scalingX) scalingX = 1.0 / zoom;
        if(!scalingY) scalingY = 1.0 / zoom;

        let pointerPosition = getPointFromEvent(event);

        newViewBox.x = viewBox.x - scalingX * (pointerPosition.x - pointerOrigin.x);
        newViewBox.y = viewBox.y - scalingY * (pointerPosition.y - pointerOrigin.y);

        let dist = Math.pow(pointerPosition.x - pointerOrigin.x, 2) + Math.pow(pointerPosition.y - pointerOrigin.y, 2);

        if(dist > 10) moved = true;

        let viewBoxString = `${newViewBox.x} ${newViewBox.y} ${viewBox.width} ${viewBox.height}`;
        minimapBox = {
            "x": newViewBox.x,
            "y": newViewBox.y,
            "width": viewBox.width, 
            "height": viewBox.height,
        };
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
        boundingBox[1][0] = (viewBox.width + viewBox.x);
        boundingBox[1][1] = (viewBox.height + viewBox.y);

        addDisplayedItems();

        // Update URL params 
        setURLParams();

        // Save location history
        saveLocationHistory(boundingBox[0][0] + (boundingBox[1][0] - boundingBox[0][0]) / 2, boundingBox[0][1] + (boundingBox[1][1] - boundingBox[0][1]) / 2);

        // Reload data, if necessary 
        if(needToReload()) getData();
    }

    
    function handleDocumentClick(document){
        if(!moved) {
            selectedDocument = (selectedDocument == document) ? null : document;
            if(selectedDocument) displaySaved = false;
        }
        moved = false;
        resultsVisible = false;

        if(!("itemsClicked" in $taskData)) return;
        let itemsClicked = $taskData["itemsClicked"];
        if(itemsClicked.indexOf(document.filename) == -1) itemsClicked.push(document.filename);
        let temp = $taskData;
        temp["itemsClicked"] = itemsClicked;
        taskData.set(temp);
    }

    function addDisplayedItems(){
        if(!("itemsDisplayed" in $taskData)) return;
        let itemsDisplayed = new Set($taskData["itemsDisplayed"]);
        documents.forEach((d) => {
            if(d.x >= boundingBox[0][0] && d.x <= boundingBox[1][0] && d.y >= boundingBox[0][1] && d.y <= boundingBox[1][1]) itemsDisplayed.add(d.filename);
        });
        let temp = $taskData;
        temp["itemsDisplayed"] = Array.from(itemsDisplayed);
        taskData.set(temp);
    }

    function hoverOnDocument(document){
        // If document is outside bounding box, show direction indicator
        if(document.x < boundingBox[0][0] || document.y < boundingBox[0][1] || document.x > boundingBox[1][0] || document.y > boundingBox[1][1]){
            showDirectionIndicator = true;
            let cx = viewBox.x + viewBox.width / 2;
            let cy = viewBox.y + viewBox.height / 2;
            directionIndicatorAngle = Math.atan2(document.x - cx, cy - document.y);
            directionIndicatorTitle = document.title;
        }
    }

    function hoverOffDocument(){
        showDirectionIndicator = false;
    }

    function handleBagButtonClick(){
        if(displaySaved){
            displaySaved = false; 
        }
        else{
            selectedDocument = null;
            displaySaved = true;
        }
    }

    let wheeling;
    var wheeldelta = {
        x: 0,
        y: 0
    };

    function wheel(e){
        if(!wheeling) onPointerDown(e);

        clearTimeout(wheeling);
        wheeling = setTimeout(function() {
            wheeling = undefined;
            wheeldelta.x = 0;
            wheeldelta.y = 0;
            onPointerUp(e);
        }, 50);

        wheeldelta.x += e.deltaX;
        wheeldelta.y += e.deltaY;

        onPointerMove(e);
    }

</script>
    
<Search {hoverOffDocument} {hoverOnDocument}  {transportTo} bind:displaySaved={displaySaved} bind:selectedDocument={selectedDocument} bind:resultsVisible={resultsVisible}/>
<ZoomControl {zoomIn} {zoomOut} {expanded} {displaySaved} displayDocumentInfo={selectedDocument != null}/>
<BagButton handleClick={handleBagButtonClick} {displaySaved} displayDocumentInfo={selectedDocument != null}/>
<DocumentInfo control={false} {hoverOffDocument} {hoverOnDocument} {transportTo} {displaySaved} bind:selectedDocument={selectedDocument}/>
<SavedItems bind:displaySaved={displaySaved} bind:selectedDocument={selectedDocument}/>
<Minimap {hovered} {onPointerUp} {onPointerDown} {onPointerMove} {minimapBox} {transportTo} {zoom} bind:expanded={expanded} {displaySaved} displayDocumentInfo={selectedDocument != null}/>
<DirectionIndicator  title={directionIndicatorTitle} angle={directionIndicatorAngle} {width} {height} {showDirectionIndicator}/>
<Legend {transportTo} bind:hovered={hovered} {documents} />

<svelte:window 
    bind:innerWidth={width} 
    bind:innerHeight={height}
    on:keydown={onKeyDown}
    on:popstate={init}
/>

{#if loading}
    <div id = "overlay"></div>

    <span id = "loading">
        <Fa icon={faCircleNotch} size="3x" spin />
    </span>
{/if}

<div id = "grid">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <svg 
        on:mousedown={onPointerDown}
        on:mouseup|stopPropagation={onPointerUp}
        on:mouseleave|stopPropagation={onPointerUp}
        on:mousemove={onPointerMove}
        on:touchstart={onPointerDown}
        on:touchend={onPointerUp}
        on:touchmove={onPointerMove}
        on:wheel={wheel}
        on:click|self={() => {if(!moved) selectedDocument = null; moved = false; resultsVisible = false; }}
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