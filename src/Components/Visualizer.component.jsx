import React, { useRef, useState } from "react";
import styles from "./Visualizer.module.css";

import ImageUploadComponent from "./ImageUpload.component";
import Stencil from "./Stencil.component";
import MainDrawing from "./MainDrawing.component";

const Visualizer = () => {
  const canvasRef = useRef();

  const [selectedImage, setSelectedImage] = useState("");
  const [stencilSelected, setStencilSelected] = useState("");
  const [images, setImages] = useState([]); // store all images for layering
  const [stencilImages, setStencilImages] = useState([]); // store all images of stencil
  const [events, setEvents] = useState([]); // store all Events for undo & Redo

  const onClickUndo = () => {
    const lastEvent = events[events.length - 1];
    const undoEvents = events.slice(0, events.length - 1);
    setEvents(undoEvents);

    if (lastEvent.eventName === "stencilImage") {
      for (let i = undoEvents.length - 1; i >= 0; i--) {
        if (undoEvents[i].eventName === "stencilImage") {
          if (undoEvents[i].id === lastEvent.id) {
            const image = document.getElementById(undoEvents[i].id);
            image.style.top = undoEvents[i].top;
            image.style.left = undoEvents[i].left;
            return;
          }
        }
      }
      const updatedStencilImages = [...stencilImages];
      setStencilImages(
        updatedStencilImages.filter((image) => image.id !== lastEvent.id)
      );
    } else if (lastEvent.eventName === "image") {
      if (images.length > 1) {
        const updatedImages = [...images];
        updatedImages.pop();
        setImages(updatedImages);
      }
    }
  };

  return (
    <div className={styles.visualizerCaontainer}>
      <header> Asian Paints - POC</header>

      <ImageUploadComponent
        setEvents={setEvents}
        setImages={setImages}
        setStencilImages={setStencilImages}
        stencilSelected={stencilSelected}
        baseImage={selectedImage}
        onBaseImageChange={setSelectedImage}
        ref={canvasRef}
      />

      <Stencil
        stencilSelected={stencilSelected}
        setStencilSelected={setStencilSelected}
        events={events}
        baseImage={selectedImage}
        onClickUndo={onClickUndo}
      />

      <MainDrawing
        images={images}
        setEvents={setEvents}
        stencilImages={stencilImages}
        setStencilImages={setStencilImages}
        stencilSelected={stencilSelected}
        setStencilSelected={setStencilSelected}
        ref={canvasRef}
      />
    </div>
  );
};

export default Visualizer;
