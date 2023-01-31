import React from "react";
import styles from "./Stencil.module.css";

import stencil from "../../src/stencil.png";
import stencil2 from "../../src/stencil2.png";

const Stencil = ({
  stencilSelected,
  baseImage,
  setStencilSelected,
  events,
  onClickUndo,
}) => {
  // Selects the Stencil to be painted on the wall
  const onImageSelected = (event) => {
    if (baseImage) {
      if (stencilSelected !== "unselected" && stencilSelected !== "") {
        setStencilSelected("unselected");
      } else {
        setStencilSelected(event.target.src);
      }
    }
  };

  return (
    <>
      <div className={styles.stencilContainer}>
        <div className={styles.stencils} id="stencilImages">
          <img
            src={stencil}
            alt="stencil"
            style={{
              border: `${
                stencilSelected.includes(stencil) ? "1px solid black" : "0"
              }`,
            }}
            onClick={onImageSelected}
          />
          <img
            src={stencil2}
            alt="stencil"
            style={{
              border: `${
                stencilSelected.includes(stencil2) ? "1px solid black" : "0"
              }`,
            }}
            onClick={onImageSelected}
          />
        </div>
        <button
          type="button"
          disabled={events.length < 2}
          onClick={() => {
            onClickUndo();
          }}
        >
          {" "}
          undo{" "}
        </button>
      </div>
    </>
  );
};

export default Stencil;
