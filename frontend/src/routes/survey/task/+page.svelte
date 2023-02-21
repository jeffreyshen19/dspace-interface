<script>
    import Likert from "../../../lib/components/Likert.svelte";
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
</script>


<form>
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


