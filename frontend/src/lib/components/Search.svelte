<script>
    import Fa from 'svelte-fa'
    import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
    let query = ""; 
</script>

<div id = "search">
    <Fa id = "icon" icon={faMagnifyingGlass} />
    <input value={query} placeholder="Widespread occurrence of hybrid internal-terminal widespread occurence hybrid terminal">
</div>

<style>
    #search{
        position: absolute;
        top: 1.2rem;
        left: 1.5rem;
        width: min(400px, 100%);
        background-color: white;
        /* border: 4px solid #A3A0A9; */
        border-radius: 5px;
        box-sizing: border-box;
        padding: 0.7rem 1.2rem;
        color: #c6c5c8;
        font-size: 1rem;
        box-shadow: 0 4px 9px #A3A0A9;
        z-index: 100;
    } 

    #icon{
        position: absolute;
    }

    input{
        width: 100%;
        position: absolute;
        border: none;
        background: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        top: 50%;
        left: 0;
        padding-left: 45px;
        padding-right: 25px;
        box-sizing: border-box;
        font-size: 0.9rem;
        transform: translateY(-50%);
    }

    input:focus{
        outline: none;
    }
</style>