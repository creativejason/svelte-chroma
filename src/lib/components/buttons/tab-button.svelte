<script lang="ts">

    export let label = "";
    export let active:boolean = false;

</script>

<div class="tabbar-item dpad-focusable" class:active tabindex="0">
    <h2>{label}</h2>
</div>


<style lang="less">

    .tabbar-item{
        border-radius: 8px;
        position: relative;
        h2{
            font-size: var(--font-tv-button-2-font-size);
            line-height: var(--font-tv-button-2-line-height);
            font-family: var(--system-font-family);
            font-weight: var(--font-tv-button-2-font-weight);
            padding: var(--size-m);
        }
        &.active:after{
            content: '';
            position: absolute;
            border-bottom: 4px solid orange;
            width: 100%;
            height: 4px;
            background-color: orange;
            border-radius: 8px;
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