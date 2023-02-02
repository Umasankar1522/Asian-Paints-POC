import React, { forwardRef, useEffect, useState } from "react";
import styles from "./ImageUpload.module.css";
import { getCursorPosition, hexToRGBA } from "../helpers/util.helper";
import { helpers } from "./../helpers/endpoint.helpers";

const base64 = "base64,";

const ImageUpload = forwardRef(
  (
    {
      setImages,
      setEvents,
      stencilSelected,
      baseImage,
      onBaseImageChange,
      setStencilImages,
    },
    imageRef
  ) => {
    const [selectedColor, setSelectedColor] = useState("#000000");

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
        onBaseImageChange("");
      }
    };

    // Color Change Handler
    const onColorChange = (event) => {
      setSelectedColor(event.target.value);
    };

    useEffect(() => {
      if (baseImage) {
        const addImage = { url: baseImage, id: new Date().getTime() };
        setStencilImages([]);
        setImages([addImage]);
        setEvents([{ eventName: "image", imageURL: addImage }]);
      }
    }, [baseImage, setEvents, setImages, setStencilImages, imageRef]);

    //  Effects that triggers when ever click actions happens on the canvas
    useEffect(() => {
      const imageElement = imageRef?.current;
      const listener = async (event) => {
        const { x, y } = getCursorPosition(imageElement, event);
        const lengthOfMetadata = baseImage.indexOf(base64);
        const base64encodedImage = Array.from(baseImage)
          .splice(lengthOfMetadata + base64.length)
          .join("");
        // const coordinates = {x, y, color: selectedColor, image: base64encodedImage};
        if (stencilSelected === "" || stencilSelected === "unselected") {
          // RedrawImage
          const rgbaCode = hexToRGBA(selectedColor);
          const response = await fetchImage(x, y, rgbaCode, base64encodedImage);

          const body = await response.json();
          const image = body.precutedImageBase64;

          const addImage = {
            url: `data:image/png;base64,${image}`,
            id: new Date().getTime(),
            color: selectedColor,
          };
          setImages((prev) => [...prev, addImage]);
          setEvents((prev) => [
            ...prev,
            { eventName: "image", data: addImage },
          ]);
        }
      };

      if (baseImage) imageElement.addEventListener("mouseup", listener);

      return () => {
        if (baseImage) imageElement.removeEventListener("mouseup", listener);
      };
    }, [
      stencilSelected,
      selectedColor,
      baseImage,
      imageRef,
      setImages,
      setEvents,
    ]);

    return (
      <section className={styles.menuContainer}>
        {/* Upload Image */}
        <label htmlFor="imageUpload" className={styles.labelName}>
          Upload Image
        </label>
        <input
          type="file"
          name="imageUpload"
          id="imageUpload"
          accept="image/png image/jpeg image/jpg"
          onChange={onImageUpload}
        />

        {/* Color Picker */}
        <label htmlFor="colorPicker" className={styles.labelName}>
          Choose a Color
        </label>
        <input
          type="color"
          name="color picker"
          id="colorPicker"
          value={selectedColor}
          onChange={onColorChange}
        />
      </section>
    );
  }
);

const fetchImage = (x, y, rgbaCode, base64encodedImage) => {
  const url = `${helpers.baseURL}/getPrecutsWithColor?coordinateX=${x}&coordinateY=${y}&baseImageExt=png&colorR=${rgbaCode[0]}&colorG=${rgbaCode[1]}&colorB=${rgbaCode[2]}`;
  return fetch(url, {
    method: "POST",
    body: base64encodedImage,
  });
};

export default React.memo(ImageUpload);
