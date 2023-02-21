<script>
    let loaded = false;
    export let questions;

    $: questions = questions.sort((a, b) => 0.5 - Math.random());
    $: loaded = false; 
    $: setTimeout(function(){
        loaded = true;
    }, 200);


</script>

<table>
    <tr>
        <th></th>
        <th>Strongly Disagree</th>
        <th>Disagree</th>
        <th>Neither Agree nor Disagree</th>
        <th>Agree</th>
        <th>Strongly Agree</th>
    </tr>
    {#each questions as question}
        <tr>
            <td>{question.text}</td>
            {#each Array(5) as _, j}
                <td><input type="radio" name="{question.id}" value="{j + 1}"></td>
            {/each}
        </tr>
    {/each}
</table>
<style>
    
    table{
        width: 100%;
    }

    th, td{
        padding: 0 1em 1em;
        text-align: left;
    }
</style>


