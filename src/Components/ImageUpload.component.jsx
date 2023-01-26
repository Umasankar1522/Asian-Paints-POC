import React, {useEffect, useState} from 'react';
import styles from './ImageUpload.module.css';
import test from '../Assets/1.png';
import { getCursorPosition, hexToRGBA } from '../helpers/util.helper';


const ImageUpload = ({setImages, setEvents, stencilSelected, baseImage, onBaseImageChange, imageRef}) => {
    const [selectedColor, setSelectedColor] = useState('#000000');

    // Image Upload Handler
    const onImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener("load", function () {
                onBaseImageChange(this.result);
            });
            reader.readAsDataURL(file);
          } else {
            onBaseImageChange('');
        }
    };

    // Color Change Handler
    const onColorChange = (event) => {
        setSelectedColor(event.target.value);
    };

    useEffect(() => {
        if(baseImage !== '') {
            const addImage = {url: baseImage, id: new Date().getTime()}
            setImages([addImage]);
            setEvents([{eventName: 'image', imageURL: addImage}]);
        }
    }, [baseImage, setEvents, setImages]);

    //  Effects that triggers when ever click actions happens on the canvas
    useEffect(() => {

        const imageElement = imageRef?.current;
        const listener = (event) => {
            const {x, y} = getCursorPosition(imageElement, event);
            const coordinates = {x, y, color: selectedColor, image: baseImage};
            if(stencilSelected === '' || stencilSelected === 'unselected') {
                // RedrawImage
                console.log(coordinates, hexToRGBA(selectedColor));

                const addImage = {url: test, id: new Date().getTime(), color: selectedColor}
                setImages(prev => [...prev, addImage]);
                setEvents(prev => [...prev, {eventName: 'image', data: addImage}]);
            }
        };

        if(baseImage)
            imageElement.addEventListener('mouseup', listener);

        return () => {
            imageElement.removeEventListener('mouseup', listener);
        };
        
    }, [stencilSelected, selectedColor, baseImage, imageRef, setImages, setEvents]);

    return (
            <section className={styles.menuContainer}>

                {/* Upload Image */}
                <label htmlFor='imageUpload' className={styles.labelName} >Upload Image</label>
                <input type='file' 
                name='imageUpload' 
                id='imageUpload' 
                accept='image/png image/jpeg image/jpg' 
                onChange={onImageUpload}/>

                 {/* Color Picker */}
                <label htmlFor='colorPicker' className={styles.labelName} >Choose a Color</label>
                <input type='color' name='color picker' id='colorPicker' value={selectedColor} onChange={onColorChange}/>

            </section>
    );
};

export default React.memo(ImageUpload);