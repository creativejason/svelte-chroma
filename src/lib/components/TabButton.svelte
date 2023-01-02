<script lang="ts">

    export let label = "";
    export let active:boolean = false;

</script>

<button class="text-button-2 dpad-focusable" class:active tabindex="0">
    {label}
</button>


<style lang="less">

    button{
        border-radius: 8px;
        position: relative;
        display: block;
        color: var(--color-text-default);
        padding: var(--size-m);
        &.active:after{
            content: '';
            position: absolute;
            border-bottom: 4px solid orange;
            width: 100%;
            height: 4px;
            background-color: orange;
            border-radius: 8px;
            bottom: 0;
            left: 0;
        }
        &:hover, &:focus{
            background-color: var(--color-background-focus);
            color: var(--color-text-on-focus);
            border-bottom: none;
            margin-bottom: -4px;
            transition: background-color 500ms linear;
            &.active:after{
                display:none;
            }
        }
    }

</style>