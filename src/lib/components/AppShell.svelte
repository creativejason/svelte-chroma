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
    let ultrablurImage = "";

    // Update UltraBlur when a new title is set
    // TODO: Move this to current title detals values
    $: {
        if($currentTitle){
            try{
                // Getting some leading slashes at times so clean'em up until I can look deeper
                    const image = $currentTitle.backdrop_path.replace(/^\/+/g, '');
                    artworkImage = getTMDBImageUrlFromPath(image, 1280);
                    ultrablurImage = `https://ultrablur-redux.luma-4y3.pages.dev/api/fragment/ultrablur/image?url=https://images.plex.tv/photo?format%3Dpng%26size%3Dmedium-240%26url%3D${getTMDBImageUrlFromPath(image, 300)}`
                    console.log(ultrablurImage);

                    const ubColorsUrl = `https://ultrablur-redux.luma-4y3.pages.dev/api/fragment/ultrablur/colors?url=https://images.plex.tv/photo?format%3Dpng%26size%3Dmedium-240%26url%3D${getTMDBImageUrlFromPath(image, 300)}`;
                    fetch(ubColorsUrl)
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            ultrablur = {
                                tl: data.topLeft,
                                tr: data.topRight,
                                bl: data.bottomLeft,
                                br: data.bottomRight
                            }
                        });


                    /*
                    let v = new Vibrant(getTMDBImageUrlFromPath($currentTitle.backdrop_path, 300))
                    v.getPalette((err:any, palette:any) => {
                        if(err) return;
                        ultrablur = {
                            tl: palette.DarkVibrant.getHex(),
                            tr: palette.DarkMuted.getHex(),
                            bl: palette.DarkMuted.getHex(),
                            br: palette.Vibrant.getHex()
                        }
                    })
                    */
                } catch(e){
                    console.error(e);
                }
                
        } else {
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

        
        background-image:   radial-gradient(circle at top left, var(--ub-tl), transparent 70%),
                            radial-gradient(circle at top right, var(--ub-tr), transparent 70%),
                            radial-gradient(circle at bottom right, var(--ub-br), transparent 70%),
                            radial-gradient(circle at bottom left, var(--ub-bl), transparent 70%);
        

/*
        background-image:   radial-gradient(circle at top left, var(--ub-tl), var(--ub-tl) 50%, transparent 50%),
                            radial-gradient(circle at top right, var(--ub-tr), var(--ub-tl) 50%, transparent 50%),
                            radial-gradient(circle at bottom right, var(--ub-br), var(--ub-tl) 50%, transparent 50%),
                            radial-gradient(circle at bottom left, var(--ub-bl), var(--ub-tl) 50%, transparent 50%);

                            */
                                         
        background-color: black;
        position: relative;
        overflow: hidden;
        transition: --ub-tl 1s, --ub-tr 1s, --ub-bl 1s, --ub-br 1s; 
        
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
        width: 64%;
        height: 64%;
        background-color: transparent;
        top: 0;
        right: 0;
        background-image: var(--artwork-image);
        background-size: cover;
        background-position: 0 0;

        //background-image: url(/src/lib/assets/images/artwork-mask.svg);
        mask-image: url(/src/lib/assets/images/artwork-mask.svg);
        mask-size: 100% 100%;
        //-webkit-mask-image: url(/src/lib/assets/images/artwork-mask.svg);
        //-webkit-mask-size: 100% 100%;
        transition: background-image 1s ease-in-out;
    }

</style>