import './App.scss';
import React, { useCallback, useState, useRef } from 'react';

function App() {
  const [dragging, setDragging] = useState(Array(6).fill(false));
  const [images, setImages] = useState(Array(6).fill(null));
  const [rotatedImages, setRotatedImages] = useState(Array(6).fill(null));
  const [rotations, setRotations] = useState(Array(6).fill(0));
  const [showRotateButtons, setShowRotateButtons] = useState(Array(6).fill(true));
  const [pageTitle, setPageTitle] = useState('');
  const canvasRef = useRef(null);

  const onDrop = useCallback((index) => (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImages = [...images];
        newImages[index] = event.target.result;
        setImages(newImages);
        rotateImage(index, event.target.result, 0);
        const newShowRotateButtons = [...showRotateButtons];
        newShowRotateButtons[index] = true;
        setShowRotateButtons(newShowRotateButtons);
      };
      reader.readAsDataURL(file);
    }
    const newDragging = [...dragging];
    newDragging[index] = false;
    setDragging(newDragging);
  }, [dragging, images, showRotateButtons]);

  const onDragOver = useCallback((index) => (e) => {
    e.preventDefault();
    const newDragging = [...dragging];
    newDragging[index] = true;
    setDragging(newDragging);
  }, [dragging]);

  const onDragLeave = useCallback((index) => () => {
    const newDragging = [...dragging];
    newDragging[index] = false;
    setDragging(newDragging);
  }, [dragging]);

  const onFileChange = (index) => (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImages = [...images];
        newImages[index] = event.target.result;
        setImages(newImages);
        rotateImage(index, event.target.result, 0);
        const newShowRotateButtons = [...showRotateButtons];
        newShowRotateButtons[index] = true;
        setShowRotateButtons(newShowRotateButtons);
      };
      reader.readAsDataURL(file);
    }
  };

  const rotateImage = (index, src, angle) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      const newAngle = (rotations[index] + angle) % 360;
      if (newAngle === 90 || newAngle === 270) {
        canvas.width = img.height;
        canvas.height = img.width;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((newAngle * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      const newRotatedImages = [...rotatedImages];
      newRotatedImages[index] = canvas.toDataURL();
      setRotatedImages(newRotatedImages);

      const newRotations = [...rotations];
      newRotations[index] = newAngle;
      setRotations(newRotations);
    };
    img.src = src;
  };

  const handleRotateClick = (index) => () => {
    if (images[index]) {
      rotateImage(index, images[index], 90);
    }
  };

  const handleDeleteClick = (index) => () => {
    const newShowRotateButtons = [...showRotateButtons];
    newShowRotateButtons[index] = false;
    setShowRotateButtons(newShowRotateButtons);
  };

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <div className='main'>
        <input
          type="text"
          placeholder="Page Title"
          value={pageTitle}
          onChange={(e) => setPageTitle(e.target.value)}
          className="page-title-input"
        />
        <h1>{pageTitle}</h1>
        <div className='box--list'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="box--item" key={index}>
              <p>Image {index + 1}</p>
              <form className="file-upload-form">
                <label
                  htmlFor={`file${index}`}
                  className={`file-upload-label ${dragging[index] ? 'dragging' : ''}`}
                >
                  <div
                    className="file-upload-design"
                    onDrop={onDrop(index)}
                    onDragOver={onDragOver(index)}
                    onDragLeave={onDragLeave(index)}
                  >
                    {rotatedImages[index] ? (
                      <img
                        src={rotatedImages[index]}
                        alt={`Rotated ${index}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <>
                        <svg viewBox="0 0 640 512" height="1em">
                          <path
                            d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
                          ></path>
                        </svg>
                        <p>Drag and Drop</p>
                        <p>or</p>
                        <span className="browse-button">Browse file</span>
                      </>
                    )}
                  </div>
                  <input
                    id={`file${index}`}
                    type="file"
                    onChange={onFileChange(index)}
                    style={{ display: 'none' }}
                  />
                </label>
              </form>
              {images[index] && showRotateButtons[index] && (
                <>
                  <button onClick={handleRotateClick(index)} className="rotate-button">
                    Rotate 90°
                  </button>
                  <button onClick={handleDeleteClick(index)} className="delete-button">
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
