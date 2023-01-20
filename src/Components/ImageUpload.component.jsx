import React, {useEffect, useRef, useState} from 'react';
import styles from './ImageUpload.module.css';
import stencil from '../../src/stencil.png'
import stencil2 from '../../src/stencil2.png';

const ImageUpload = () => {

    const canvasRef = useRef();
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [stencilSelected, setStencilSelected] = useState('');
    const [stencilImageMoveId, setStencilImageMoveId] = useState('');

    useEffect(() => {
        const canvas = canvasRef?.current;
        const listener = (event) => {
            const { x, y} = getCursorPosition(canvas, event);
            const createdStencil = document.createElement('img');
            createdStencil.src = stencilSelected;
            createdStencil.width = 40;
            createdStencil.style.position = 'absolute';
            createdStencil.setAttribute('draggable', 'true');
            createdStencil.style.top = y.toString() + 'px';
            createdStencil.style.left = x.toString() + 'px';
            createdStencil.id = new Date().getTime();
            createdStencil.ondragstart = (event) => {
                setStencilImageMoveId(event.target.id);
            }

            document.getElementById('canvasStencil').appendChild(createdStencil);
            setStencilSelected('');
        }
        
        if(stencilSelected ) {
            canvas.addEventListener('click', listener);
        }

        return () => {
            canvas.removeEventListener('click', listener);
        }
    }, [stencilSelected]);




    const onImageSelected = (event) => {
        if(selectedImage){
            if(stencilSelected) {
                setStencilSelected('');
            } else {
                setStencilSelected(event.target.src);
            }
        }
    };
 
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
        const x = event.clientX - rect.x
        const y = event.clientY - rect.y
        const {top ,left, right, bottom} = rect;
      return {x, y, top, left, right, bottom};
    }

    useEffect(() => {
        if(selectedImage !== '' && stencilSelected === '')
            drawImage(selectedImage);
        else
            return;

        const canvas = canvasRef?.current;

        const listener = (event) => {
            const {x, y} = getCursorPosition(canvas, event);
            const coordinates = {x, y, color: selectedColor, image: selectedImage};
            console.log(coordinates);
        };

        if(!stencilSelected)
            canvas.addEventListener('mouseup', listener);

        return () => {
            canvas.removeEventListener('mouseup', listener);
        }
    }, [selectedColor, selectedImage, stencilSelected]);

    const onDropOfStencil = (event) => {
        const {x, y} = getCursorPosition(canvasRef?.current, event);
        document.getElementById(stencilImageMoveId).style.top = y.toString() + 'px';
        document.getElementById(stencilImageMoveId).style.left = x.toString() + 'px';
    }

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
            <div className={styles.stencilContainer}>
                <img src={stencil} alt="stencil" style={{border: `${stencilSelected.includes(stencil) ? '1px solid black': '0'}` }} onClick={onImageSelected} />
                <img src={stencil2} alt="stencil" style={{border: `${stencilSelected.includes(stencil2) ? '1px solid black': '0'}` }} onClick={onImageSelected} />

            </div>
            <div className={styles.mainCanvasArea}>
                <div className={styles.canvasContainer} id={'canvasStencil'} style={{position: 'relative'}} 
                onDragOver={(event) => {event.preventDefault()}} onDrop={onDropOfStencil}>
                    <canvas id='image-canvas' ref={canvasRef} />
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;