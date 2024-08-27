import { useContext, useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.js";
import { Context } from "../contexts/Context";
import { PageFlip } from "page-flip";
import Link from "next/link";
import { Button } from "react-bootstrap";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PDFViewer = ({ pdfUrl }) => {
  const context = useContext(Context);
  const flipbookRef = useRef(null);
  const [flipSound] = useState(new Audio('/page-flip2-178323.mp3')); 
  useEffect(() => {
    context.setLoaderState(true);

    if (pdfUrl) {
      const loadingTask = pdfjsLib.getDocument({ url: pdfUrl });
      loadingTask.promise
        .then(async (pdf) => {
          //
          const container = document.getElementById("pdf-container");
          container.innerHTML = "";
          // Get dimensions of the first page to set the flipbook size
          const firstPage = await pdf.getPage(1);
          const scale = 1.5; // You can adjust the scale to fit your needs
          const viewport = firstPage.getViewport({ scale });
          
          const containerWidth = viewport.width;
          const containerHeight = viewport.height;

          // Initialize PageFlip
          const flipbook = new PageFlip(flipbookRef.current, {
            width: containerWidth,
            height: containerHeight,
            size: "stretch",
            maxShadowOpacity: 0.5,
            // showCover: true,
            useMouseEvents: true,
            display: "double",  // Show two pages by default
          });
          const pages = [];

          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };

            await page.render(renderContext).promise;

            pages.push(canvas);
          }

          // Add pages to the flipbook
          flipbook.loadFromHTML(pages);
 // Set up page turn sound
  flipbook.on("changeState", (e) => {
    if(e.data == "flipping"){
      flipSound.pause();
      flipSound.currentTime = 0;
      flipSound.play();
    }
  });

          // Set the initial view to show two pages
          // if (pdf.numPages > 1) {
          //   flipbook.setPage(2); // Show the first two pages by default
          // }

          context.setLoaderState(false);
        })
        .catch((error) => {
          console.error("Error loading PDF: ", error);
        });
    } else {
      console.error("PDF URL is not provided");
    }
  }, [pdfUrl,flipSound]);

  // Function to handle fullscreen
  const handleFullScreen = () => {
    const container = document.getElementById("pdf-container");
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.mozRequestFullScreen) { // Firefox
      container.mozRequestFullScreen();
    } else if (container.webkitRequestFullscreen) { // Chrome, Safari, and Opera
      container.webkitRequestFullscreen();
    } else if (container.msRequestFullscreen) { // IE/Edge
      container.msRequestFullscreen();
    }
  };
  function downloadPDF(url) {
    const slipLength = url.split("/").length
    const fileName = url.split("/")[slipLength - 1]
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
        })
        .catch(error => console.error('Error downloading the PDF:', error));
}
  return (
    <div>
      <div className="d-flex">
      <button className="btn btn-primary mb-3 me-2" onClick={handleFullScreen}>View Fullscreen</button>
      <button className="btn btn-primary mb-3 w-auto" onClick={()=>{downloadPDF(pdfUrl)}}>Download</button>
      </div>
      <div
        id="pdf-container"
        ref={flipbookRef}
        style={{ 
          // width: `${pageDimensions.width}px`,
          // height: `${pageDimensions.height}px`,
          width: `100%`,
          height: `auto`,
          maxHeight: '100vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      ></div>
    </div>
  );
};

export default PDFViewer;
