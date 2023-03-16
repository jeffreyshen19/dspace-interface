<script>
    import {selectColor} from "../colors.js";
    import { supabase } from '../supabaseClient';

    export let documents;
    let uniqueTopics = new Set();
    let topicNames = [];
    let hovered = null;

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
            <div class = "legend-item">
                <div class = "circle" style:background-color="{selectColor(topic, 0.4)}"></div>
                {topicNames[topic].title}
            </div>
            <br>
        {/each}

        <!-- All other documents should be dots -->
        {#each topicNames as topicTitle, i}
            {#if !uniqueTopics.has(topicTitle.topic)}
                <div class = "legend-item" on:mouseover={() => {hovered = topicTitle.topic}} on:mouseout={() => {hovered = null}}>
                    <div class = "circle" style:background-color="{selectColor(topicTitle.topic, 0.4)}"></div>
                    {#if hovered == topicTitle.topic}
                        {topicTitle.title}
                    {/if}
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
    }

    .circle{
        width: 10px;
        height: 10px;
        border-radius: 100%;
        display: inline-block;
        margin-right: 2px;
    }

    .legend-item{
        display: inline-block;
        margin-right: 5px;
        font-size: 12px;
        line-height: 12px;
    }
</style>