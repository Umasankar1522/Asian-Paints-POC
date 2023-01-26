// get Current Coordinates of X and Y with respect to the Image
export function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.x
    const y = event.clientY - rect.y
    const {top ,left, right, bottom} = rect;
    return {x, y, top, left, right, bottom};
}

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