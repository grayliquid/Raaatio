import { createContext, useState } from "react";

export const RenderContext = createContext();

export const RenderProvider = ({ children }) => {
  const [renderParams, setRenderParams] = useState({
    n1: 124,
    n2: 122,
    color: "#FFCBE1",
    backgroundColor: "#131517",
    bgEnabled: true,
    xMargin: 5,
    outsideMargin: 0,
    distortion: 94,
    shouldRecalculate: true,
    cWidth: 600,
    cHeight: 600,
    accountType: "free",
  });

  const { bgEnabled, accountType } = renderParams;

  function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  function randomize() {
    setRenderParams({
      ...renderParams,
      n1: randomNumber(1, 300),
      n2: randomNumber(1, 300),
      distortion: randomNumber(1, 300),
    });
  }

  function updateProperties(value) {
    setRenderParams({
      ...value,
    });
  }

  function onChangeInput(event) {
    let inputFieldName = event.target.dataset.name;
    let inputFieldValue = event.target.value;
    let inputType = event.target.type;

    if (inputType === "checkbox") {
      setRenderParams({
        ...renderParams,
        bgEnabled: !bgEnabled,
      });
    }

    if (inputType === "number") {
      if (accountType === "free") {
        if (inputFieldName === "cWidth") {
          if (inputFieldValue > 800) {
            inputFieldValue = 800;
          }
        }

        if (inputFieldName === "cHeight") {
          if (inputFieldValue > 800) {
            inputFieldValue = 800;
          }
        }
      }
      setRenderParams({
        ...renderParams,
        shouldRecalculate: true,
        [inputFieldName]: inputFieldValue,
      });
    }
  }

  const value = {
    renderParams,
    onChangeInput,
    randomize,
    updateProperties,
  };
  return (
    <RenderContext.Provider value={value}>{children}</RenderContext.Provider>
  );
};
