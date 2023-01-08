import React, {useEffect, useRef, useState} from 'react';
import styles from './ImageUpload.module.css';

const ImageUpload = () => {

    const canvasRef = useRef();
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedColor, setSelectedColor] = useState('#000000');

    // Image Upload Handler
    const onImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener("load", function () {
                setSelectedImage(this.result);
            });
            reader.readAsDataURL(file);
          } else {
            setSelectedImage('');
          }
    };

    // Color Change Handler
    const onColorChange = (event) => {
        setSelectedColor(event.target.value);
    };


    // Draw Image within the CanvasContainer
    const drawImage = (imageURL) => {
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

    // onClick of mouse --> get Current Coordinates of X and Y with respect to the Image
    function getCursorPosition(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
      return {x, y};
    }

    useEffect(() => {
        if(selectedImage !== '')
            drawImage(selectedImage);
        else
            return;

        const canvas = canvasRef?.current;

        const listener = (event) => {
            const {x, y} = getCursorPosition(canvas, event);
            const coordinates = {x, y, color: selectedColor, image: selectedImage};
            console.log(coordinates);
        };

        canvas.addEventListener('mouseup', listener);

        return () => {
            canvas.removeEventListener('mouseup', listener);
        }
    }, [selectedColor, selectedImage]);


    return (
        <div className={styles.imageUploadContainer}>
            <div className={styles.menuContainer}>

                {/* Upload Image */}
                <label htmlFor='imageUpload' />
                <input type='file' 
                name='imageUpload' 
                id='imageUpload' 
                accept='image/png image/jpeg image/jpg' 
                onChange={onImageUpload}/>

                 {/* Color Picker */}
                <label htmlFor='colorPicker' />
                <input type='color' name='color picker' id='colorPicker' value={selectedColor} onChange={onColorChange}/>
            </div>
            <div className={styles.mainCanvasArea}>
                <div className={styles.canvasContainer} >
                    <canvas id='image-canvas' ref={canvasRef} />
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;