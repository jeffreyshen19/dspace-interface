<script>
    import { sessionData, savedItems, taskData } from '../../lib/store';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';

    //TODO: redirect if not yet filled out entrance survey
    if(browser && !("is_control" in $sessionData)) goto("/survey/entrance", {replaceState: true});

    function startTask(){
        // Clear existing task data 
        savedItems.set({});
        taskData.set({});

        // Start timer
        let start = Date.now();

        // Get task text 
        let {current_task, goal_task_first} = $sessionData;
        let taskText; 
        let is_training = false;
        let is_goal_oriented;
        if(current_task == 0) { // Training
            taskText = "Select one item about fuel cells";
            is_training = true;
        } 
        else if((current_task == 1 && goal_task_first) || (current_task == 2 && !goal_task_first)) { // Goal Task
            taskText = `Imagine you are conducting a literature review. Please search for and add at least 5 documents to your saved items that you find relevant and interestings: 
                        Select at least one paper related to “DEPLESYN: a three dimensional, discontinuous synthesis, diffusion-depletion code.”
                        Select at least one paper about supply chain management
                        Select at least one paper about venture capital markets in Europe
                        Select at least one paper about lasers
                        Select at least one paper published by the Department of Urban Studies and Planning`;
            is_goal_oriented = true;
        }
        else { // Non goal task
            taskText = "Imagine you come across this website and decide to look around. Explore the interface for as long as you like until you are completely and utterly bored. When you find an item interesting, engaging, or relevant, add it to your saved items.";
            is_goal_oriented = false;
        }

        // Save to localStorage
        taskData.set({
            start,
            taskText,
            is_training,
            is_goal_oriented,
            itemsDisplayed: [],
            itemsClicked: [],
        });

        // Redirect to correct interface
        goto(`/${$sessionData["is_control"] ? "b" : "a"}/`, { "replaceState": true }); 
    }
</script>

<form on:submit|preventDefault={startTask}>
    <div style:text-align="center"><input type = "submit" value = "Start task"></div>
</form>

<style>
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



