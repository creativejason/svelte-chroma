export function hoverToFocus(node: HTMLElement) {

    const handleMouseEnter = () => {
        node.focus();
    }
    
    //node.addEventListener("mouseenter", handleMouseEnter, true);
    node.setAttribute("tabindex", "0");

	return {
		destroy() {
			document.removeEventListener("mouseenter", handleMouseEnter, true);
		}
	};
}