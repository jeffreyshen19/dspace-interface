<script>
    import { sessionData } from '../../../lib/store.js';
    import { supabase } from '../../../lib/supabaseClient';
    import { goto } from '$app/navigation';

    console.log($sessionData);

    // Redirect if the survey has already been filled out;
    if("is_control" in $sessionData) goto('/training/', { "replaceState": true });

    async function submitEntranceSurvey(e){
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data["is_control"] = Math.random() < 0.5; // Randomly assign to control or experimental
        data["goal_task_first"] = Math.random() < 0.5; // Randomly assign order of goal task / non-goal gask
        data["created_at"] = new Date().toISOString();

        // Store locally 
        sessionData.set(data);

        // Send to database 
        const { error } = await supabase
                .from('respondents')
                .insert(data);

        // Redirect to task introduction depending on control / experiment
        goto('/training/', { "replaceState": true }) 
    }

    let conductedLitReview;
</script>

<form on:submit|preventDefault={submitEntranceSurvey}>
    <p>Before you begin, please fill out the following demographic information.</p>
    
    <label class = "label" for="year">What year of graduate school are you in? (1-10)</label>
    <input type = "number" min="1" max = "10" name = "year" required/>
    <br>

    <label class = "label" for="field">What field do you study? </label>
    <input type = "text" name = "field" required/>
    <br>

    <label class = "label" for = "conducted_lit_review">Have you ever conducted a literature review before?</label>
    <input type = "radio" bind:group={conductedLitReview} id="lit-review-yes" name = "conducted_lit_review" value = "yes" required/>
    <label for="lit-review-yes">Yes</label>
    <input type = "radio" bind:group={conductedLitReview} id="lit-review-no" name = "conducted_lit_review" value = "no" required/>
    <label for="lit-review-no">No</label>
    <br>

    {#if conductedLitReview == "yes"}
        <div style:padding="1em 0 1em 2em">
            <label class = "label" for="primary_tool"> What is the primary tool you use to search for academic literature online (i.e. Google Scholar, MIT Libraries, HeinOnline)?</label>
            <input type = "text" name = "primary_tool" required/>
            <br> 

            <label class = "label" for="primary_tool_freq">In general, how often do you use that tool to search for academic literature?</label>
            {#each ["More than once a week", "Once a week", "Once every two weeks", "Once a month", "A few times a year"] as response, i}
                <input required type = "radio" id="primary-tool-{i}" name = "primary_tool_freq" value = "{response}"/>
                <label for="primary-tool-{i}">{response}</label>
                <br>
            {/each}
        </div>
    {/if}

    <label class = "label" for = "used_mit_libraries">Have you ever used the MIT Libraries website to search for an item?</label>
    <input required type = "radio" id="mit-libraries-yes" name = "used_mit_libraries" value = "yes"/>
    <label for="mit-libraries-yes">Yes</label>
    <input required type = "radio" id="mit-libraries-no" name = "used_mit_libraries" value = "no"/>
    <label for="mit-libraries-no">No</label>
    <br>

    <label class = "label" for = "used_dspace">Have you ever used DSPACE@MIT to search for an item? </label>
    <input required type = "radio" id="dspace-yes" name = "used_dspace" value = "yes"/>
    <label for="dspace-yes">Yes</label>
    <input required type = "radio" id="dspace-no" name = "used_dspace" value = "no"/>
    <label for="dspace-no">No</label>
    <br>
    <br>

    <div style:text-align="center"><input type = "submit" value = "Begin experiment"></div>
</form>

<style>
    form{
        padding: 3em 5em;
    }

    input[type="submit"]{
        background: rgb(224, 224, 224);
        border: 1px solid gray;
        border-radius: 5px;
        padding: 0.5em 1em;
        font-size: 1em;
        cursor: pointer;
        transition: 0.2s all;
    }

    input[type="submit"]:hover{
        background: rgb(186, 186, 186);
    }

    label{
        margin-right: 5px;
    }

    .label{
        display: block;
        margin: 1em 0 0.5em 0;
    }

</style>


