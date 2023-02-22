<script>
    import Likert from "../../../lib/components/Likert.svelte";
    import { sessionData, taskData } from "../../../lib/store";
    import { supabase } from '../../../lib/supabaseClient';
    import {goto} from "$app/navigation";

    let questions = [
        {
            "id": "found_interesting_items",
            "text": "I found interesting items using this application "
        },
        {
            "id": "found_relevant_items",
            "text": "The results I found were relevant to the task "
        },
        {
            "id": "found_items_by_chance",
            "text": "I came across interesting items by chance"
        },
    ];

   async function submitTask(e){
        // TODO: deal with is_training

        const formData = new FormData(e.target);
        const dataToInsert = Object.fromEntries(formData.entries());
        dataToInsert["respondent_id"] = $sessionData["id"];
        dataToInsert["session_length"] = $taskData["end"] - $taskData["start"];
        dataToInsert["is_goal_oriented"] = $taskData["is_goal_oriented"];
        dataToInsert["num_unique_items_displayed"] = $taskData["itemsDisplayed"].length;
        dataToInsert["num_unique_items_clicked"] = $taskData["itemsClicked"].length;

        // Send to database 
        const { data, error } = await supabase
                .from('tasks')
                .insert(dataToInsert)
                .select();

        // Redirect to task introduction or end 
        if($sessionData["current_task"] < 2){
            let temp = $sessionData; 
            temp["current_task"]++;
            sessionData.set(temp);
            goto('/task-introduction/', { "replaceState": true });
        }
        else{
            goto('/survey/exit/', { "replaceState": true });
        }

    }
</script>


<form on:submit|preventDefault={submitTask}>
    <p>The following statements ask you to reflect on your experience of engaging with this task. For each statement, please use the following scale to indicate what is most true for you.</p>
    <Likert {questions}/>

    <br>
    <div style:text-align="center"><input type = "submit" value = "Finish task & continue"></div>
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


