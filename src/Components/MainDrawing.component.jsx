import React, {useState, useEffect, forwardRef} from 'react';
import styles from './MainDrawing.module.css';

import { getCursorPosition } from '../helpers/util.helper';

const MainDrawing = forwardRef(({images, setEvents, stencilSelected, setStencilSelected}, imageRef) => {

    const [stencilImageMoveId, setStencilImageMoveId] = useState('');

    // On Drop of Stencil Event to drop the stencil in the canvas
    const onDropOfStencil = (event) => {
        const {x, y} = getCursorPosition(imageRef?.current, event);
        const image = document.getElementById(stencilImageMoveId);
        image.style.top = (y - ((50/100) * image.height)).toString() + 'px';
        image.style.left = (x - ((50/100) * image.width)).toString() + 'px';
        setEvents(prev => [...prev, {eventName: 'stencilImage', id: stencilImageMoveId, top: image.style.top, left: image.style.left}])
    }

    useEffect(() => {
        const canvas = imageRef?.current;
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
    }, [imageRef, setEvents, setStencilSelected, stencilSelected]);


    return <div className={styles.mainCanvasArea}>
        <div className={styles.canvasContainer} id={'canvasArea'} style={{position: 'relative'}} ref={imageRef}
        onDragOver={(event) => {event.preventDefault()}} onDrop={onDropOfStencil} onTouchCancel={onDropOfStencil}>
            {/* <canvas id='image-canvas' ref={canvasRef} /> */}
            {images.map((image, index) => 
                <img src={image.url} key={index} id={image.id} alt={`layer-${index}`} style={{position: `${index === 0 ? 'relative' : 'absolute'}`, 
                    objectFit: 'contain', width: '100%', height: '100%', zIndex: index, top: 0, left: 0, color: `${image.color}`,
                    filter: `opacity(.4) drop-shadow(0 0 0 ${image.color})`
                }} />
            )}
        </div>
    </div>
});

export default MainDrawing;