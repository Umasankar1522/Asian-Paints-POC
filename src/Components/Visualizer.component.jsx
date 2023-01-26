import React, { useRef, useState} from 'react';
import styles from './Visualizer.module.css';

import ImageUploadComponent from './ImageUpload.component';
import Stencil from './Stencil.component';
import MainDrawing from './MainDrawing.component';


const Visualizer = () => {

    const canvasRef = useRef();

    const [selectedImage, setSelectedImage] = useState('');
    const [stencilSelected, setStencilSelected] = useState('');
    const [images, setImages] = useState([]); // store all images for layering
    const [events, setEvents] = useState([]); // store all Events for undo & Redo

    return (
        <div className={styles.visualizerCaontainer}>
            <header> Asian Paints - POC</header>

                <ImageUploadComponent setEvents={setEvents} 
                    setImages={setImages} 
                    stencilSelected={stencilSelected} 
                    baseImage={selectedImage} 
                    onBaseImageChange={setSelectedImage} 
                    imageRef={canvasRef} />

                <Stencil stencilSelected={stencilSelected}
                    setStencilSelected={setStencilSelected}
                    events={events}
                    setEvents={setEvents}
                    baseImage={selectedImage} />

                <MainDrawing
                    images={images}
                    setEvents={setEvents}
                    stencilSelected={stencilSelected}
                    setStencilSelected={setStencilSelected}
                    ref={canvasRef} />

        </div>
    );
};

export default Visualizer;