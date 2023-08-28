<script lang="ts">
    import { currentTitle } from "$lib/stores/AppState.js"
    import { onMount } from 'svelte';
    import Vibrant from 'node-vibrant';
	import { getTMDBImageUrlFromPath } from "$lib/services/tmdb";
    
    export let ultrablur: { tl: string; tr: string; bl: string; br: string } = {
        tl: "#333333",
        tr: "#090909",
        bl: "#080808",
        br: "#252525"
    };

    let artworkImage = "";

    // Update UltraBlur when a new title is set
    // TODO: Move this to current title detals values
    $: {
        if($currentTitle){
            artworkImage = getTMDBImageUrlFromPath($currentTitle.backdrop_path, 1280);

            let v = new Vibrant(getTMDBImageUrlFromPath($currentTitle.backdrop_path, 300))
            //let v = Vibrant.from(getTMDBImageUrlFromPath($currentTitle.backdrop_path, 300)).useQuantizer(Vibrant.Quantizer.WebWorker)
            v.getPalette((err:any, palette:any) => {
                if(err) return;
                ultrablur = {
                    tl: palette.DarkVibrant.getHex(),
                    tr: palette.DarkMuted.getHex(),
                    bl: palette.DarkMuted.getHex(),
                    br: palette.Vibrant.getHex()
                }
            })
        }
        else {
            artworkImage = "";
        }
	}

    
    onMount(async () => {
        await import('$lib/utils/spatial_navigation.js');
        let SpatialNavigation = (<any>window).SpatialNavigation;
        SpatialNavigation.init();
        SpatialNavigation.add({
            selector: '.dpad-focusable',
            straightOnly: true,
            rememberSource: true,
        });
        SpatialNavigation.makeFocusable();
        SpatialNavigation.focus();
        

    });
    
    
</script>

<div class="app-shell" style="--ub-tl:{ultrablur.tl}; --ub-tr:{ultrablur.tr}; --ub-bl:{ultrablur.bl}; --ub-br:{ultrablur.br};" >
    <div class="artwork" style="--artwork-image:url({artworkImage})"></div>
    <div class="ui">
        <slot></slot>
    </div>
    
</div>

<style lang="less">

    // We use custom properties here to allow the ultrablur gradient to be transitioned
    @property --ub-tl {
        syntax: '<color>';
        initial-value: #000;
        inherits: false;
    }

    @property --ub-tr {
        syntax: '<color>';
        initial-value: #000;
        inherits: false;
    }

    @property --ub-br {
        syntax: '<color>';
        initial-value: #000;
        inherits: false;
    }

    @property --ub-bl {
        syntax: '<color>';
        initial-value: #000;
        inherits: false;
    }

    .app-shell{
        color: var(--color-text-default);
        width: 1920px;
        height: 1080px;
        background-image:   radial-gradient(at top left, var(--ub-tl), transparent 60%),
                            radial-gradient(at top right, var(--ub-tr), transparent 60%),
                            radial-gradient(at bottom left, var(--ub-bl), transparent 60%),
                            radial-gradient(at bottom right, var(--ub-br), transparent 60%);
        background-color: black;
        position: relative;
        overflow: hidden;
        -webkit-transition: all 2s ease-in-out;
        transition: --ub-tl 2s, --ub-tr 2s, --ub-bl 2s, --ub-br 2s;
    }

    .ui{
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-flow: column nowrap;
        z-index: 1;
        overflow: hidden;
        gap: 32px;
    }

    .artwork{
        position: absolute;
        width: 70%;
        height: 70%;
        background-color: black;
        top: 0;
        right: 0;
        background-image: var(--artwork-image);
        background-size: cover;
        background-position: 0 0;
        mask-image: url(/src/lib/assets/images/artwork-mask.svg);
        mask-size: 100% 100%;
        -webkit-mask-image: url(/src/lib/assets/images/artwork-mask.svg);
        -webkit-mask-size: 100% 100%;
        transition: background-image 1s ease-in-out;
    }

</style>