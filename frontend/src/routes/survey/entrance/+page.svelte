<script>
    import { sessionData, savedItems } from '../../../lib/store.js';
    import { supabase } from '../../../lib/supabaseClient';
    import { goto } from '$app/navigation';

    // Redirect if the survey has already been filled out;
    if("is_control" in $sessionData) goto('/task-introduction/', { "replaceState": true });

    async function submitEntranceSurvey(e){
        const formData = new FormData(e.target);
        const dataToInsert = Object.fromEntries(formData.entries());
        const goalTaskTopics = ["Supply chain management", "Venture capital markets in Europe", "Air traffic control"];

        dataToInsert["is_control"] = Math.random() > 0.5; // Randomly assign to control or experimental
        dataToInsert["goal_task_first"] = Math.random() < 0.5; // Randomly assign order of goal task / non-goal gask
        dataToInsert["goal_task_topic"] = goalTaskTopics[Math.floor(Math.random() * goalTaskTopics.length)];
        dataToInsert["created_at"] = new Date().toISOString();

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        dataToInsert["prolific_id"] = urlParams.get("PROLIFIC_PID");
        dataToInsert["study_id"] = urlParams.get("STUDY_ID");
        dataToInsert["session_id"] = urlParams.get("SESSION_ID");

        dataToInsert["consent"] = (dataToInsert["consent"] == "true");

        // Send to database 
        const { data, error } = await supabase
                .from('respondents')
                .insert(dataToInsert)
                .select()
                .single();

        if(error){
            alert("There was an error submitting. Please try again.");
        }
        else{
            // Store locally 
            dataToInsert["id"] = data["id"];
            dataToInsert["current_task"] = 0; // 0: training, 1: first task, 2: last task
            sessionData.set(dataToInsert);

            // Redirect to task introduction depending on control / experiment
            goto('/task-introduction/', { "replaceState": true }) 
        }
    }

    let conductedLitReview;
</script>

<form on:submit|preventDefault={submitEntranceSurvey}>
    <p>This is an MIT research study. Before you begin, please fill out the following demographic information and consent form. 
        
    <ul>
        <li>The purpose of this research is to test an interface for discovering research articles.</li>
        <li>Your participation is voluntary.</li>
        <li>You may decline to answer any or all questions and may decline further participation, at any time, without adverse consequences.</li>
        <li>Responses are confidential and anonymized.</li>
    </ul>

    <p>Please contact Jeffrey (jjshen@mit.edu) with any questions or concerns.</p>
    
    <label for="consent"><strong>I consent to participate in this research study    </strong></label>
    <input type="checkbox" name="consent" value="true" required>
    <br>
    
    <label class = "label" for="highest_education">Which of these is the highest level of education you have completed?</label>
    <input type = "radio" id="ms" name = "highest_education" value = "Currently in"/>
    <label for="ms">Currently in graduate program (MA/MSc/MPhil/other)</label>
    <input type = "radio" id="ms" name = "highest_education" value = "Graduate degree (MA/MSc/MPhil/other)"/>
    <label for="ms">Graduate degree (MA/MSc/MPhil/other)</label>
    <input type = "radio" id="phd" name = "highest_education" value = "Doctorate degree (PhD/other)"/>
    <label for="phd">Doctorate degree (PhD/other)</label>
    <br>

    <label class = "label" for="field">What field do/did you study? </label>
    <input type = "text" name = "field"/>
    <br>

    <label class = "label" for = "conducted_lit_review">Have you ever conducted a literature review before?</label>
    <input type = "radio" bind:group={conductedLitReview} id="lit-review-yes" name = "conducted_lit_review" value = "yes"/>
    <label for="lit-review-yes">Yes</label>
    <input type = "radio" bind:group={conductedLitReview} id="lit-review-no" name = "conducted_lit_review" value = "no"/>
    <label for="lit-review-no">No</label>
    <br>

    {#if conductedLitReview == "yes"}
        <div style:padding="1em 0 1em 2em">
            <label class = "label" for="primary_tool"> What is the primary tool you use to search for academic literature online (i.e. Google Scholar, MIT Libraries, HeinOnline)?</label>
            <input type = "text" name = "primary_tool"/>
            <br> 

            <label class = "label" for="primary_tool_freq">In general, how often do you use that tool to search for academic literature?</label>
            {#each ["More than once a week", "Once a week", "Once every two weeks", "Once a month", "A few times a year"] as response, i}
                <input type = "radio" id="primary-tool-{i}" name = "primary_tool_freq" value = "{response}"/>
                <label for="primary-tool-{i}">{response}</label>
                <br>
            {/each}
        </div>
    {/if}

    <label class = "label" for = "used_mit_libraries">Have you ever used the MIT Libraries website to search for an item?</label>
    <input type = "radio" id="mit-libraries-yes" name = "used_mit_libraries" value = "yes"/>
    <label for="mit-libraries-yes">Yes</label>
    <input type = "radio" id="mit-libraries-no" name = "used_mit_libraries" value = "no"/>
    <label for="mit-libraries-no">No</label>
    <br>

    <label class = "label" for = "used_dspace">Have you ever used DSPACE@MIT to search for an item? </label>
    <input type = "radio" id="dspace-yes" name = "used_dspace" value = "yes"/>
    <label for="dspace-yes">Yes</label>
    <input type = "radio" id="dspace-no" name = "used_dspace" value = "no"/>
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


