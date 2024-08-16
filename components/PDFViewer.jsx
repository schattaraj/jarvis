import { useContext, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.js";
import { Context } from "../contexts/Context";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PDFViewer = ({ pdfUrl }) => {
  const context = useContext(Context)
  useEffect(() => {
    context.setLoaderState(true)
    if (pdfUrl) {
      const loadingTask = pdfjsLib.getDocument({ url: pdfUrl });
      loadingTask.promise.then((pdf) => {
        const container = document.getElementById("pdf-container");
        container.innerHTML = ""; // Clear the container before rendering
        const renderPages = async () => {
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const scale = 1.5;
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.style.width = "100%";
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            container.appendChild(canvas);

            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };

            await page.render(renderContext).promise;
          }
          context.setLoaderState(false); // Hide loader after rendering all pages
        };

        renderPages();
      }).catch(error => {
        console.error("Error loading PDF: ", error);
      });
    } else {
      console.error("PDF URL is not provided");
    }
  }, [pdfUrl]);

  // Function to handle fullscreen
  const handleFullScreen = () => {
    const container = document.getElementById("pdf-container");
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.mozRequestFullScreen) { // Firefox
      container.mozRequestFullScreen();
    } else if (container.webkitRequestFullscreen) { // Chrome, Safari and Opera
      container.webkitRequestFullscreen();
    } else if (container.msRequestFullscreen) { // IE/Edge
      container.msRequestFullscreen();
    }
  };

  return (
    <div>
      <button className="btn btn-primary mb-3" onClick={handleFullScreen}>View Fullscreen</button>
      <div id="pdf-container" style={{ width: '100%', height: 'auto',maxHeight: '100vh',overflowY: 'auto', }}></div>
    </div>
  );
};

export default PDFViewer;