import logo from './logo.svg';
import './App.scss';
import Marquee from "react-fast-marquee";
import SlideComponent from './components/SlideComponent';

import { Swiper, SwiperSlide } from 'swiper/react';
import React, { useCallback } from 'react';

// import './styles.css';

// import required modules
import { Keyboard, Pagination, Navigation, Autoplay } from 'swiper/modules';
import { useState,useRef ,useEffect} from 'react';
import Typed from 'typed.js';
import CountUp from 'react-countup';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import { useDropzone } from 'react-dropzone';

function App() {
  const [dragging, setDragging] = useState(Array(6).fill(false));
  const [images, setImages] = useState(Array(6).fill(null));
  const [pageTitle, setPageTitle] = useState('');

  const onDrop = useCallback((index) => (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const newImages = [...images];
      newImages[index] = URL.createObjectURL(files[0]);
      setImages(newImages);
    }
    const newDragging = [...dragging];
    newDragging[index] = false;
    setDragging(newDragging);
  }, [dragging, images]);

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
      const newImages = [...images];
      newImages[index] = URL.createObjectURL(e.target.files[0]);
      setImages(newImages);
    }
  };
  return (
    <>
      <div className='main'>
        <input
            type="text"
            placeholder="Fime Name"
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            className="page-title-input"
          />
          <h1>{pageTitle}</h1>
        <div className='box--list'>

          {Array.from({ length: 6 }).map((_, index) => (
            <div className="box--item" key={index}>
              <p>Images{index + 1}</p>
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
                    style={{
                      backgroundImage: images[index] ? `url(${images[index]})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {!images[index] && (
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
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
