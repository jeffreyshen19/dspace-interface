<script>
    import {selectColor} from "../colors.js";
    import { supabase } from '../supabaseClient';
    import { fly } from 'svelte/transition';

    export let documents;
    let uniqueTopics = new Set();
    let topicNames = [];
    export let hovered = null;
    export let transportTo;
    
    async function getTopicNames(){
        let {data, error} = await supabase
            .from('topic_names')
            .select()
            .order("topic");

        topicNames = data;
    }

    function getUniqueTopics(){
        let set = new Set();
        documents.forEach((d) => {
            set.add(d.main_topic);
        })
        return set;
    }

    getTopicNames();
    $: if(documents){
        uniqueTopics = getUniqueTopics();
    }


</script>

{#if topicNames.length}
    <div id = "legend">
        <!-- Labels for topics on screen -->
        {#each [...uniqueTopics] as topic}
            <div class = "legend-item" on:click={() => transportTo(topicNames[topic].cx, topicNames[topic].cy)} on:mouseover={() => {hovered = topic}} on:mouseout={() => {hovered = null}}>
                <div class = "circle" style:background-color="{selectColor(topic, 0.4)}"></div>
                {topicNames[topic].title}
            </div>
        {/each}

        <!-- All other documents should be dots -->
        {#each topicNames as topicTitle, i}
            {#if !uniqueTopics.has(topicTitle.topic)}
                <div class = "legend-item" on:click={() => transportTo(topicTitle.cx, topicTitle.cy)} on:mouseover={() => {hovered = topicTitle.topic}} on:mouseout={() => {hovered = null}}>
                    <div class = "circle" style:background-color="{selectColor(topicTitle.topic, 0.4)}"></div>
                    <span style:opacity={hovered == topicTitle.topic ? "1" : "0.3"} transition:fly={{ duration: 200}}>{topicTitle.title}</span>
                </div>
            {/if}
        {/each}
    </div>
{/if}

<style>
    #legend{
        position: absolute;
        bottom: 1.2rem;
        left: 1.5rem;
        background-color: white;
        /* border: 4px solid #A3A0A9; */
        border-radius: 5px;
        box-sizing: border-box;
        box-shadow: 0 2px 9px #A3A0A9;
        z-index: 100;
        user-select: none;
        padding: 5px;
        max-height: 120px;
        /* overflow: scroll; */
        overflow:hidden;
        transition: max-height 0.4s;
    }

    #legend:hover{
        max-height: 500px;
    }

    .circle{
        width: 10px;
        height: 10px;
        border-radius: 100%;
        display: inline-block;
        margin-right: 2px;
    }

    .legend-item{
        font-size: 12px;
        padding: 5px;
        margin-bottom: -2px;
        cursor: pointer;
    }
</style>