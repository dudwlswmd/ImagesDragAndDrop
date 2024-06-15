import React, { useEffect } from 'react';
import 'swiper/swiper-bundle.css';
import './SlideComponent.scss';
import Swiper from 'swiper';

const SlideComponent = ({ images }) => {
  const params = {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };

  useEffect(() => {
    // Swiper 초기화 코드를 이곳으로 이동합니다.
    const swiper = new Swiper('.swiper-container', params);
  }, []); // 빈 배열을 두어 컴포넌트가 마운트될 때 한 번만 실행되도록 합니다.

  return (
    <div className='swiper--main'>
      <div className="swiper-container">
        <div className="swiper-wrapper">
          {images.map((image, index) => (
            <div className="swiper-slide" key={index}>
              <img src={image} alt={`Slide ${index}`} />
            </div>
          ))}
        </div>
        <div className="swiper-pagination"></div>
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
      </div>
    </div>
  );
};

export default SlideComponent;
