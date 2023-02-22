<script>
    import Likert from "../../../lib/components/Likert.svelte";
    import { sessionData, savedItems, taskData } from '../../../lib/store.js';
    import { supabase } from '../../../lib/supabaseClient';
    import { goto } from "$app/navigation";

    let questions = [
        {
            "id": "FA-S.1",
            "text": "I lost myself in this experience"
        },
        {
            "id": "FA-S.2",
            "text": "The time I spent using this application just slipped away"
        },
        {
            "id": "FA-S.3",
            "text": "I was absorbed in this task"
        },
        {
            "id": "PU-S.1",
            "text": "I felt frustrated while using this application"
        },
        {
            "id": "PU-S.2",
            "text": "I found this application confusing to use"
        },
        {
            "id": "PU-S.3",
            "text": "Using this application was taxing"
        },
        {
            "id": "AE-S.1",
            "text": "This application is attractive"
        },
        {
            "id": "AE-S.2",
            "text": "This application was aesthetically appealing"
        },
        {
            "id": "AE-S.3",
            "text": "This application appealed to my senses"
        },
        {
            "id": "RW-S.1",
            "text": "Using this application was worthwhile"
        },
        {
            "id": "RW-S.2",
            "text": "My experience was rewarding"
        },
        {
            "id": "RW-S.3",
            "text": "I felt interested in this experience"
        }
    ];

    async function submitExitSurvey(e){
        const formData = new FormData(e.target);

        // Send to database 
        const { data, error } = await supabase
                .from('respondents')
                .update({"user_engagement": Object.fromEntries(formData.entries())})
                .eq("id", $sessionData["id"])

        // Reset data 
        taskData.set({});
        savedItems.set({});
        sessionData.set({});

        // Redirect to end
        goto('/survey/end', { "replaceState": true }) 
    }
</script>


<form on:submit|preventDefault={submitExitSurvey}>
    <p>The following statements ask you to reflect on your experience of engaging with this application. For each statement, please use the following scale to indicate what is most true for you.</p>
    <Likert {questions}/>

    <br>
    <div style:text-align="center"><input type = "submit" value = "Finish experiment"></div>
</form>

<style>
    p{
        padding: 1em;
    }

    form{
        padding: 2em 4em;
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

</style>


