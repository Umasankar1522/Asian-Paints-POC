import React, { useState, useEffect, forwardRef } from "react";
import styles from "./MainDrawing.module.css";

import { getCursorPosition } from "../helpers/util.helper";

const canvasArea = "canvasArea";
const stencilHeight = 45,
  stencilWidth = 45;

const MainDrawing = forwardRef(
  (
    {
      images,
      setEvents,
      stencilSelected,
      setStencilSelected,
      setStencilImages,
      stencilImages,
    },
    imageRef
  ) => {
    const [stencilImageMoveId, setStencilImageMoveId] = useState("");

    // On Drop of Stencil Event to drop the stencil in the canvas
    const onDropOfStencil = (event) => {
      const { x, y } = getCursorPosition(imageRef?.current, event);
      const image = document.getElementById(stencilImageMoveId);
      image.style.top = (y - (50 / 100) * image.height).toString() + "px";
      image.style.left = (x - (50 / 100) * image.width).toString() + "px";
      setEvents((prev) => [
        ...prev,
        {
          eventName: "stencilImage",
          id: stencilImageMoveId,
          top: image.style.top,
          left: image.style.left,
        },
      ]);
    };

    const onDragStartEvent = (event) => {
      setStencilImageMoveId(event.target.id);
    };

    useEffect(() => {
      const canvas = imageRef?.current;
      const listener = (event) => {
        const { x, y } = getCursorPosition(canvas, event);

        const top = (y - (50 / 100) * stencilHeight).toString() + "px";
        const left = (x - (50 / 100) * stencilWidth).toString() + "px";
        const id = new Date().getTime().toString();
        const width = stencilWidth.toString() + "px";
        const height = stencilHeight.toString() + "px";

        setStencilImages((prev) => [
          ...prev,
          { url: stencilSelected, top, left, id, width, height },
        ]);

        setStencilSelected("unselected");
        setEvents((prev) => [
          ...prev,
          {
            eventName: "stencilImage",
            id,
            top,
            left,
            width,
            height,
          },
        ]);
      };

      if (stencilSelected !== "unselected" && stencilSelected !== "") {
        canvas.addEventListener("click", listener);
      }

      return () => {
        canvas.removeEventListener("click", listener);
      };
    }, [
      imageRef,
      setEvents,
      setStencilSelected,
      stencilSelected,
      stencilImages,
      setStencilImages,
    ]);

    return (
      <div className={styles.mainCanvasArea}>
        {
          <div
            className={styles.canvasContainer}
            id={canvasArea}
            style={{ position: "relative" }}
            ref={imageRef}
            onDragOver={(event) => {
              event.preventDefault();
            }}
            onDrop={onDropOfStencil}
          >
            {images.length > 0 &&
              images.map((image, index) => (
                <img
                  src={image.url}
                  key={image.id}
                  id={image.id}
                  alt={`layer-${index}`}
                  style={{
                    position: `${index === 0 ? "relative" : "absolute"}`,
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                    zIndex: index,
                    top: 0,
                    left: 0,
                    color: `${image.color}`,
                  }}
                />
              ))}
            {stencilImages.length > 0 &&
              stencilImages.map((image) => (
                <img
                  src={image.url}
                  alt={"..."}
                  key={image.id}
                  id={image.id}
                  draggable={true}
                  onDragStart={onDragStartEvent}
                  style={{
                    width: image.width,
                    height: image.height,
                    position: "absolute",
                    top: image.top,
                    left: image.left,
                    zIndex: "9999",
                  }}
                />
              ))}
          </div>
        }
      </div>
    );
  }
);

export default MainDrawing;
