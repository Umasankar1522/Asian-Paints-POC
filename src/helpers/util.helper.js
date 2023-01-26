// get Current Coordinates of X and Y with respect to the Image
export function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.x
    const y = event.clientY - rect.y
    const {top ,left, right, bottom} = rect;
    return {x, y, top, left, right, bottom};
}

// converts Hex code to RGBA format
export const hexToRGBA = (hexCode, opacity = 1) => {  
    let hex = hexCode.replace('#', '');
    
    if (hex.length === 3) {
        hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }    
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    /* Backward compatibility for whole number based opacity values. */
    if (opacity > 1 && opacity <= 100) {
        opacity = opacity / 100;   
    }

    return `rgba(${r},${g},${b},${opacity})`;
};

// Draw Image within the CanvasContainer
export const drawImage = (imageURL, canvasRef) => {
    const canvas = canvasRef?.current;
    const context = canvas.getContext("2d");
    const image = new Image();
    image.src = imageURL;
    image.alt='canvas Image';
    image.addEventListener('load', () => {
        const rect = canvas.parentNode.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        image.width = rect.width - 1;
        image.height = rect.height - 1;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, image.width, image.height);
        context.save();
    });
};