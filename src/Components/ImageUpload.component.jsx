import React, {useEffect, useRef, useState} from 'react';
import styles from './ImageUpload.module.css';

import { onClickUndo } from './undo.helper';

import stencil from '../../src/stencil.png'
import stencil2 from '../../src/stencil2.png';
import test from '../Assets/1.png';


const ImageUpload = () => {

    const canvasRef = useRef();
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [stencilSelected, setStencilSelected] = useState('');
    const [stencilImageMoveId, setStencilImageMoveId] = useState('');
    const [images, setImages] = useState([]);

    const [events, setEvents] = useState([]); // store all Events

    // Selects the Stencil to be painted on the wall
    const onImageSelected = (event) => {
        if(selectedImage){
            if(stencilSelected !== 'unselected' && stencilSelected !== '' ) {
                setStencilSelected('unselected');
            } else {
                setStencilSelected(event.target.src);
            }
        }
    };

    // On Drop of Stencil Event to drop the stencil in the canvas
    const onDropOfStencil = (event) => {
        const {x, y} = getCursorPosition(canvasRef?.current, event);
        const image = document.getElementById(stencilImageMoveId);
        image.style.top = (y - ((50/100) * image.height)).toString() + 'px';
        image.style.left = (x - ((50/100) * image.width)).toString() + 'px';
        setEvents(prev => [...prev, {eventName: 'stencilImage', id: stencilImageMoveId, top: image.style.top, left: image.style.left}])
    }
 
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
        if(selectedImage !== '') {
            const addImage = {url: selectedImage, id: new Date().getTime()}
            setImages([addImage]);
            setEvents([{eventName: 'image', imageURL: addImage}]);
        }
    }, [selectedImage]);

    //  Effects that triggers when ever click actions happens on the canvas
    useEffect(() => {
        const canvas = canvasRef?.current;
        const listener = (event) => {
            const {x, y} = getCursorPosition(canvas, event);
            const coordinates = {x, y, color: selectedColor, image: selectedImage};
            if(stencilSelected === '' || stencilSelected === 'unselected') {
                // RedrawImage
                console.log(coordinates);
                const addImage = {url: test, id: new Date().getTime()}
                setImages(prev => [...prev, addImage]);
                setEvents(prev => [...prev, {eventName: 'image', data: addImage}]);
            }
        };
        canvas.addEventListener('mouseup', listener);

        return () => {
            canvas.removeEventListener('mouseup', listener);
        };
    }, [stencilSelected]);

    useEffect(() => {
        const canvas = canvasRef?.current;
        const listener = (event) => {
            const { x, y} = getCursorPosition(canvas, event);
            const createdStencil = document.createElement('img');
            createdStencil.src = stencilSelected;
            createdStencil.width = 45;
            createdStencil.height = 45;
            createdStencil.style.position = 'absolute';
            createdStencil.style.zIndex = '9999';
            createdStencil.setAttribute('draggable', 'true');
            createdStencil.style.top = (y - ((50/100) * createdStencil.height)).toString() + 'px';
            createdStencil.style.left = (x - ((50/100) * createdStencil.width)).toString() + 'px';
            createdStencil.id = new Date().getTime();
            createdStencil.ondragstart = (event) => {
                setStencilImageMoveId(event.target.id);
            }
            createdStencil.ontouchmove = (event) => {
                setStencilImageMoveId(event.target.id);
            };

            document.getElementById('canvasArea').appendChild(createdStencil);
            setStencilSelected('unselected');
            setEvents(prev => [...prev, {eventName: 'stencilImage', id: createdStencil.id, top: createdStencil.style.top, left: createdStencil.style.left}])
        }
        
        if(stencilSelected !== 'unselected' && stencilSelected !== '') {
            canvas.addEventListener('click', listener);
        }

        return () => {
            canvas.removeEventListener('click', listener);
        }
    }, [stencilSelected]);

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

            {/* stencils container and Undo Button */}
            <div className={styles.stencilContainer}>
                <img src={stencil} alt="stencil" style={{border: `${stencilSelected.includes(stencil) ? '1px solid black': '0'}` }} onClick={onImageSelected} />
                <img src={stencil2} alt="stencil" style={{border: `${stencilSelected.includes(stencil2) ? '1px solid black': '0'}` }} onClick={onImageSelected} />
                <button type="button" disabled={events.length < 2} onClick={() => { onClickUndo(events, setEvents)  }}> undo </button>
            </div>

            {/* main canvas area */}
            <div className={styles.mainCanvasArea}>
                <div className={styles.canvasContainer} id={'canvasArea'} style={{position: 'relative'}} ref={canvasRef}
                onDragOver={(event) => {event.preventDefault()}} onDrop={onDropOfStencil} onTouchCancel={onDropOfStencil}>
                    {/* <canvas id='image-canvas' ref={canvasRef} /> */}
                    {images.map((image, index) => 
                    <img src={image.url} key={index} id={image.id} alt={`layer-${index}`} style={{position: `${index === 0 ? 'relative' : 'absolute'}`, 
                    objectFit: 'fit', width: '100%', height: '100%', zIndex: index,
                    top: 0, left: 0 }} />
                     )}
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;