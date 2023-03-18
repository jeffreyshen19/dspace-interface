<script>
    import { sessionData, savedItems, taskData } from '../../lib/store';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';

    //Redirect if not yet filled out entrance survey
    if(browser && !("is_control" in $sessionData)) goto("/survey/entrance", {replaceState: true});

    const taskTexts = {
        "training": "Find an article about fuel cells and add it to your bag.",
        "goal": `Imagine you have been asked to conduct a literature review on "${$sessionData["goal_task_topic"]}". Search for and add at least 5 documents you think are relevant and that you would be interested in reading more in-depth. Make sure to pick documents you would be interested in reading and that you think represent the topic well.`,
        "non-goal": "Imagine you come across this website and decide to look around. Explore the interface for as long as you like until you are completely and utterly bored. When you find an item interesting, engaging, or relevant, add it to your saved items."
    }

    const tutorialLinkControl = "VjH09H6ywKA";
    const tutorialLinkExperimental = "abApI_0F628";

    // Get task details 
    let {current_task, goal_task_first} = $sessionData;
    let taskText; 
    let is_training = false;
    let is_goal_oriented;
    let minSavedItems; 
    if(current_task == 0) { // Training
        taskText = taskTexts["training"];
        is_training = true;
        minSavedItems = 1;
    } 
    else if((current_task == 1 && goal_task_first) || (current_task == 2 && !goal_task_first)) { // Goal Task
        taskText = taskTexts["goal"];
        is_goal_oriented = true;
        minSavedItems = 5;
    }
    else { // Non goal task
        taskText = taskTexts["non-goal"];
        is_goal_oriented = false;
        minSavedItems = 0;
    }

    function startTask(){
        // Start timer
        let start = Date.now();

        // Save to localStorage
        taskData.set({
            start,
            taskText,
            is_training,
            is_goal_oriented,
            itemsDisplayed: [],
            itemsClicked: [],
            searchQueries: [],
            locationHistory: [],
            minSavedItems
        });

        // Redirect to correct interface
        goto(`/${$sessionData["is_control"] ? "b" : "a"}/`, { "replaceState": true }); 
    }
</script>

<form on:submit|preventDefault={startTask}>
    <h1>{current_task == 0 ? "Training Task" : "Task " + current_task} Instructions</h1>
    {#if current_task == 0}
        <iframe width="560" height="315" src="https://www.youtube.com/embed/{$sessionData["is_control"] ? tutorialLinkControl : tutorialLinkExperimental}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        <!-- <iframe width="560" height="315" src="https://www.youtube.com/embed/{$sessionData["is_control" ? tutorialLinkControl : tutorialLinkExperimental]}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> -->
        <p>For this experiment, you will complete three short tasks. Your first task is a training task to become familiar with the interface: </p>
        <ul>
            <li>First, watch the video which provides a tutorial of how to use the interface.</li>
            <li><strong>Your task</strong>: {taskText}</li>
            <li>Once you start the task, task instructions can be found by clicking on the bag button in the top right corner.</li>
        </ul>
        <p>Once you are done with each task, press the bag button in the top right corner then click "Finish Task".</p>
    {:else if current_task == 1}
        <p>Great work completing the training task! Your next task: <br><br>{taskText}</p>
    {:else if current_task == 2}
        <p>{taskText}</p>
    {/if}
    <br>
    <input type = "submit" value = "Start task">
</form>

<style>
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



