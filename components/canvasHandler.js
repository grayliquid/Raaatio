import { useContext, useEffect, useRef, useState } from "react";
import { ExportContext, RenderContext } from "../context/contexts";
import { Canvas, CanvasContainer, Wrapper } from "./styles";

function isOffscreenCavnasSupported(canvas) {
  return canvas.transferControlToOffscreen !== undefined;
}

const CanvasComponent = () => {
  const canvasRef = useRef(undefined);
  const offscreenCanvasRef = useRef(undefined);
  const workerRef = useRef(undefined);
  const [offscreenTransfered, setOffscreenTransfered] = useState(false);

  const context = useContext(RenderContext);
  const exportContext = useContext(ExportContext);
  const { initializeCanvas } = exportContext;

  const { renderParams } = context;

  useEffect(() => {
    if (canvasRef && !offscreenTransfered) {
      const { current: canvas } = canvasRef;

      if (isOffscreenCavnasSupported(canvas)) {
        const offscreen = canvas?.transferControlToOffscreen();
        offscreen.width = 100;
        offscreen.height = 100;
        const worker = new Worker("/sw.js");

        worker.postMessage({ canvas: offscreen }, [offscreen]);
        setOffscreenTransfered(true);

        offscreenCanvasRef.current = offscreen;
        workerRef.current = worker;
        // initialize canvas in exportProvider
        initializeCanvas(canvas, worker, offscreen);
      }
    }
  }, []);

  useEffect(() => {
    if (offscreenCanvasRef && workerRef) {
      const { current: worker } = workerRef;

      worker.postMessage({ type: "run_canvas", animData: renderParams });
    }
  }, [renderParams]);

  return (
    <Wrapper className="canvas">
      <CanvasContainer>
        <Canvas ref={canvasRef}></Canvas>
      </CanvasContainer>
    </Wrapper>
  );
};

export default CanvasComponent;
