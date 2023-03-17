<script>
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';

    if(browser) {
        goto("/survey/entrance/" + window.location.search, {replaceState: true});
    }

    
</script>