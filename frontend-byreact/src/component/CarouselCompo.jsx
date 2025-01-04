import React, { useState, useEffect } from 'react';
import { request, Config } from '../util/apiUtil';

const Slideshow = () => {
  const [product, setProduct] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [hoveredArrow, setHoveredArrow] = useState(null);
  const [randomSlides, setRandomSlides] = useState([]);

  useEffect(() => {
    getProducts();
    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % randomSlides.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [randomSlides.length]);

  const getProducts = async () => {
    const res = await request('GET', `products`);
    if (res.status === 200) {
      const shuffled = res.data.sort(() => Math.random() - 0.5).slice(0, 4); 
      setProduct(res.data);
      setRandomSlides(shuffled);
    }
  };

  const handleDotClick = (index) => {
    setSlideIndex(index);
  };

  const handleArrowClick = (direction) => {
    setSlideIndex((prevIndex) => {
      if (direction === 'next') {
        return (prevIndex + 1) % randomSlides.length;
      } else {
        return (prevIndex - 1 + randomSlides.length) % randomSlides.length;
      }
    });
  };
  const animations = ['fadeIn', 'slideInDown', 'scaleUp', 'bounceInDown'];

  return (
    <div>
      <div style={{ 
        position: 'relative',
        margin: 'auto', 
        maxWidth: '1000px',
      }}>
        <button
          onClick={() => handleArrowClick('prev')}
          onMouseEnter={() => setHoveredArrow('prev')}
          onMouseLeave={() => setHoveredArrow(null)}
          style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            zIndex: '1000',
            background: 'transparent',
            color: 'white',
            fontSize: '24px',
            border: 'none',
            cursor: 'pointer',
            padding: '16px',
            transform: 'translateY(-50%)',
            backgroundColor: hoveredArrow === 'prev' ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
          }}
        >
          &#10094;
        </button>
        <button
          onClick={() => handleArrowClick('next')}
          onMouseEnter={() => setHoveredArrow('next')}
          onMouseLeave={() => setHoveredArrow(null)}
          style={{
            position: 'absolute',
            top: '50%',
            right: '0',
            zIndex: '1000',
            color: 'white',
            background: 'transparent',
            fontSize: '24px',
            border: 'none',
            cursor: 'pointer',
            padding: '16px',
            transform: 'translateY(-50%)',
            backgroundColor: hoveredArrow === 'next' ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
          }}
        >
          &#10095;
        </button>

        {randomSlides.map((slide, index) => {
          const slideName = slide.name || 'No Name'; 
          const slideAnimation = animations[index % animations.length]; // Dynamically pick animation

          return (
            <div
              style={{
                minWidth: '100%',
                height: '325px',
                display: slideIndex === index ? 'block' : 'none',
                position: 'relative',
              }}
              key={slide.id}
            >
              <img
                src={Config.image_path + slide.product_image}
                alt={`Slide ${index + 1}`}
                style={{ 
                  width: '100%', 
                  height: '100%',
                  borderRadius: '10px', 
                  verticalAlign: 'middle', 
                  objectFit: 'cover'
                }}
              />
              <div
                style={{
                  padding: '8px 12px',
                  position: 'absolute',
                  bottom: '10px',
                  width: '100%',
                  textAlign: 'center',
                  opacity: 0,
                  animation: slideIndex === index ? `${slideAnimation} 2s forwards` : 'none',
                }}
              >
                <span style={{ 
                  color: 'white', 
                  fontSize: '35px', 
                  fontWeight: 'bold', 
                  padding: '10px 20px', 
                  borderRadius: '20px',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}>
                  {slideName}
                </span>
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: '90%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {randomSlides.map((_, dotIndex) => (
                  <span
                    key={dotIndex}
                    style={{
                      height: '15px',
                      width: '15px',
                      borderRadius: '50%',
                      backgroundColor: slideIndex === dotIndex ? '#ff0000' : '#717171',
                      display: 'inline-block',
                      transition: 'background-color 0.6s ease',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleDotClick(dotIndex)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInDown {
            0% {
              opacity: 0;
              transform: translateY(-50px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes scaleUp {
            0% {
              opacity: 0;
              transform: scale(0.8);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes bounceInDown {
            0%, 60%, 75%, 90%, 100% {
              animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
            }
            0% {
              opacity: 0;
              transform: translateY(-3000px);
            }
            60% {
              opacity: 1;
              transform: translateY(25px);
            }
            75% {
              transform: translateY(-10px);
            }
            90% {
              transform: translateY(5px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Slideshow;


//================================================================================================



// import { useState, useEffect } from "react";
// import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

// const Slider = ({ width = "100%", height = "350px" }) => {
  
//   const sliderData = [
//     {
//       image: "https://i.ibb.co/58Mq6Mb/slide1.jpg",
//       heading: "Slide One",
//       desc: "This is the description of slide one Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi quos quas, voluptatum nesciunt illum exercitationem.",
//     },
//     {
//       image: "https://i.ibb.co/8gwwd4Q/slide2.jpg",
//       heading: "Slide Two",
//       desc: "This is the description of slide two Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi quos quas, voluptatum nesciunt illum exercitationem.",
//     },
//     {
//       image: "https://i.ibb.co/8r7WYJh/slide3.jpg",
//       heading: "Slide Three",
//       desc: "This is the description of slide three Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi quos quas, voluptatum nesciunt illum exercitationem.",
//     },
//   ];

//   const [currentSlide, setCurrentSlide] = useState(0);
//   const slideLength = sliderData.length;

//   const autoScroll = true;
//   let slideInterval;
//   let intervalTime = 5000;

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev === slideLength - 1 ? 0 : prev + 1));
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev === 0 ? slideLength - 1 : prev - 1));
//   };

//   function auto() {
//     slideInterval = setInterval(nextSlide, intervalTime);
//   }

//   useEffect(() => {
//     setCurrentSlide(0);
//   }, []);

//   useEffect(() => {
//     if (autoScroll) {
//       auto();
//     }
//     return () => clearInterval(slideInterval);
//   }, [autoScroll]);

//   const sliderStyles = {
//     slider: {
//       width: width,
//       height: height,
//       margin: "auto",
//       position: "relative",
//       overflow: "hidden",
//     },
//     slide: {
//       position: "absolute",
//       top: 0,
//       left: 0,
//       width: "100%",
//       height: "100%",
//       opacity: 0,
//       transform: "translateX(-50%)",
//       transition: "all 0.5s ease",
//     },
//     currentSlide: {
//       opacity: 1,
//       transform: "translateX(0)",
//     },
//     content: {
//       position: "absolute",
//       top: "23rem",
//       left: "5rem",
//       opacity: 0,
//       width: "50%",
//       color: "#fff",
//       padding: "3rem",
//       background: "rgba(0, 0, 0, 0.3)",
//       visibility: "hidden",
//       animation: "slide-up 1s ease 0.5s forwards",
//     },
//     visibleContent: {
//       opacity: 1,
//       visibility: "visible",
//     },
//     arrow: {
//       border: "2px solid white",
//       backgroundColor: "transparent",
//       color: "#fff",
//       cursor: "pointer",
//       height: "2rem",
//       width: "2rem",
//       borderRadius: "50%",
//       position: "absolute",
//       zIndex: 999,
//     },
//     next: {
//       top: "35%",
//       right: "1.5rem",
//     },
//     prev: {
//       top: "35%",
//       left: "1.5rem",
//     },
//     hr: {
//       height: "2px",
//       background: "white",
//       width: "50%",
//     },
//   };

//   return (
//     <div style={sliderStyles.slider}>
//       <AiOutlineArrowLeft
//         style={{ ...sliderStyles.arrow, ...sliderStyles.prev }}
//         onClick={prevSlide}
//       />
//       <AiOutlineArrowRight
//         style={{ ...sliderStyles.arrow, ...sliderStyles.next }}
//         onClick={nextSlide}
//       />
//       {sliderData.map((slide, index) => (
//         <div
//           style={
//             index === currentSlide
//               ? { ...sliderStyles.slide, ...sliderStyles.currentSlide }
//               : sliderStyles.slide
//           }
//           key={index}
//         >
//           {index === currentSlide && (
//             <div>
//               <img
//                 src={slide.image}
//                 alt="slide"
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "cover",
//                   borderRadius: "10px",
//                 }}
//               />
//               <div
//                 style={
//                   index === currentSlide
//                     ? { ...sliderStyles.content, ...sliderStyles.visibleContent }
//                     : sliderStyles.content
//                 }
//               >
//                 <h2>{slide.heading}</h2>
//                 <p>{slide.desc}</p>
//               </div>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Slider;


//================================================================================================


// import React from 'react';
// import { Carousel } from 'antd';

// const slides = [
//   {
//     img: 'https://cdn.pixabay.com/photo/2023/08/08/09/21/couple-8176869_1280.jpg',
//     caption: 'Caption One',
//   },
//   {
//     img: 'https://cdn.pixabay.com/photo/2017/12/10/14/47/pizza-3010062_1280.jpg',
//     caption: 'Caption Two',
//   },
//   {
//     img: 'https://www.w3schools.com/howto/img_lights_wide.jpg',
//     caption: 'Caption Three',
//   },
//   {
//     img: 'https://www.w3schools.com/howto/img_mountains_wide.jpg',
//     caption: 'Caption Four',
//   },
// ];

// const mainContentStyle = {
//   width: '100%',
//   maxWidth: '1000px',
//   margin: 'auto',
// };

// const contentStyle = {
//   position: 'relative',
// };

// const imgStyle = {
//   width: '100%',
//   height: '350px',
//   objectFit: 'cover',
//   borderRadius: '8px',
// };

// const textContentStyle = {
//   margin: '10px 20px',
//   position: 'absolute',
//   transform: 'translate(400px, -150px)',
//   color: '#fff',
//   zIndex: 1000,
// };

// const captionStyle = {
//   fontSize: '30px',
//   fontWeight: 'bold',
// };

// const App = () => {
//   return (
//     <div style={mainContentStyle}>
//       <Carousel autoplay autoplaySpeed={9000} arrows>
//         {slides.map((slide, index) => (
//           <div key={index} style={contentStyle}>
//             <img style={imgStyle} src={slide.img} alt={`img ${index + 1}`} />
//             <div style={textContentStyle}>
//               <h3 style={captionStyle}>{slide.caption}</h3>
//             </div>
//           </div>
//         ))}
//       </Carousel>
//     </div>
//   );
// };

// export default App;

//================================================================================================

// import React, { useState, useEffect } from 'react';

// const Slideshow = () => {
//   const [slideIndex, setSlideIndex] = useState(0);
//   const slides = [
//     {
//       img: 'https://cdn.pixabay.com/photo/2023/08/08/09/21/couple-8176869_1280.jpg',
//       caption: 'Caption One',
//     },
//     {
//       img: 'https://cdn.pixabay.com/photo/2017/12/10/14/47/pizza-3010062_1280.jpg',
//       caption: 'Caption Two',
//     },
//     {
//       img: 'https://www.w3schools.com/howto/img_lights_wide.jpg',
//       caption: 'Caption Three',
//     },
//     {
//       img: 'https://www.w3schools.com/howto/img_mountains_wide.jpg',
//       caption: 'Caption Four',
//     },
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [slides.length]);

//   const handleArrowClick = (direction) => {
//     setSlideIndex((prevIndex) => {
//       if (direction === 'next') {
//         return (prevIndex + 1) % slides.length;
//       } else {
//         return (prevIndex - 1 + slides.length) % slides.length;
//       }
//     });
//   };

//   const handleDotClick = (index) => {
//     setSlideIndex(index);
//   };

//   return (
//     <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', margin: 'auto', overflow: 'hidden' }}>
//       {/* Slide Container */}
//       <div
//         style={{
//           display: 'flex',
//           transition: 'transform 0.6s ease-in-out',
//           transform: `translateX(-${slideIndex * 100}%)`,
//         }}
//       >
//         {slides.map((slide, index) => (
//           <div
//             key={index}
//             style={{
//               minWidth: '100%',
//               boxSizing: 'border-box',
//               position: 'relative',
//             }}
//           >
//             <img
//               src={slide.img}
//               alt={`Slide ${index + 1}`}
//               style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
//             />
//             <div
//               style={{
//                 position: 'absolute',
//                 bottom: '10%',
//                 left: '50%',
//                 transform: 'translateX(-50%)',
//                 background: 'rgba(0, 0, 0, 0.5)',
//                 color: 'white',
//                 padding: '10px 20px',
//                 borderRadius: '20px',
//                 fontSize: '18px',
//                 fontWeight: 'bold',
//                 textAlign: 'center',
//               }}
//             >
//               {slide.caption}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Navigation Arrows */}
//       <button
//         onClick={() => handleArrowClick('prev')}
//         style={{
//           position: 'absolute',
//           top: '50%',
//           left: '10px',
//           transform: 'translateY(-50%)',
//           background: 'rgba(0, 0, 0, 0.5)',
//           color: 'white',
//           border: 'none',
//           borderRadius: '50%',
//           width: '40px',
//           height: '40px',
//           cursor: 'pointer',
//           fontSize: '20px',
//         }}
//       >
//         &#10094;
//       </button>
//       <button
//         onClick={() => handleArrowClick('next')}
//         style={{
//           position: 'absolute',
//           top: '50%',
//           right: '10px',
//           transform: 'translateY(-50%)',
//           background: 'rgba(0, 0, 0, 0.5)',
//           color: 'white',
//           border: 'none',
//           borderRadius: '50%',
//           width: '40px',
//           height: '40px',
//           cursor: 'pointer',
//           fontSize: '20px',
//         }}
//       >
//         &#10095;
//       </button>

//       {/* Dots */}
//       <div
//         style={{
//           position: 'absolute',
//           bottom: '15px',
//           left: '50%',
//           transform: 'translateX(-50%)',
//           display: 'flex',
//           gap: '8px',
//         }}
//       >
//         {slides.map((_, index) => (
//           <span
//             key={index}
//             onClick={() => handleDotClick(index)}
//             style={{
//               width: '12px',
//               height: '12px',
//               borderRadius: '50%',
//               background: slideIndex === index ? '#1890ff' : '#d9d9d9',
//               cursor: 'pointer',
//               transition: 'background-color 0.3s',
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Slideshow;


//================================================================================================  


// import React, { useState, useEffect } from 'react';

// const Slideshow = () => {
//   const [slideIndex, setSlideIndex] = useState(0);
//   const [hoveredArrow, setHoveredArrow] = useState(null);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const slides = [
//     {
//       img: 'https://cdn.pixabay.com/photo/2023/08/08/09/21/couple-8176869_1280.jpg',
//       caption: 'Caption Text',
//       animation: 'fadeIn'
//     },
//     {
//       img: 'https://cdn.pixabay.com/photo/2017/12/10/14/47/pizza-3010062_1280.jpg',
//       caption: 'Caption Two',
//       animation: 'scaleUp'
//     },
//     {
//       img: 'https://www.w3schools.com/howto/img_lights_wide.jpg',
//       caption: 'Caption Three',
//       animation: 'slideInDown'
//     },
//     {
//       img: 'https://www.w3schools.com/howto/img_mountains_wide.jpg',
//       caption: 'Caption Four',
//       animation: 'bounceInDown'
//     },
//   ];

//   const handleDotClick = (index) => {
//     setSlideIndex(index);
//   };

//   const handleArrowClick = (direction) => {
//     setSlideIndex((prevIndex) => {
//       if (direction === 'next') {
//         return (prevIndex + 1) % slides.length;
//       } else {
//         return (prevIndex - 1 + slides.length) % slides.length;
//       }
//     });
//   };

//   return (
//     <div>
//       <div className="slideshow-container" style={{ position: 'relative', margin: 'auto', maxWidth: '1000px' }}>
//         <button
//           onClick={() => handleArrowClick('prev')}
//           onMouseEnter={() => setHoveredArrow('prev')}
//           onMouseLeave={() => setHoveredArrow(null)}
//           style={{
//             position: 'absolute',
//             top: '50%',
//             left: '0',
//             zIndex: '1000',
//             background: 'transparent',
//             color: 'white',
//             fontSize: '24px',
//             border: 'none',
//             cursor: 'pointer',
//             padding: '16px',
//             transform: 'translateY(-50%)',
//             backgroundColor: hoveredArrow === 'prev' ? 'rgba(0, 0, 0, 0.5)' : 'transparent', // Hover effect
//           }}
//         >
//           &#10094;
//         </button>
//         <button
//           onClick={() => handleArrowClick('next')}
//           onMouseEnter={() => setHoveredArrow('next')}
//           onMouseLeave={() => setHoveredArrow(null)}
//           style={{
//             position: 'absolute',
//             top: '50%',
//             right: '0',
//             zIndex: '1000',
//             color: 'white',
//             background: 'transparent',
//             fontSize: '24px',
//             border: 'none',
//             cursor: 'pointer',
//             padding: '16px',
//             transform: 'translateY(-50%)',
//             backgroundColor: hoveredArrow === 'next' ? 'rgba(0, 0, 0, 0.5)' : 'transparent', // Hover effect
//           }}
//         >
//           &#10095;
//         </button>

//         {slides.map((slide, index) => (
//           <div
//             className="mySlides fade"
//             style={{
//               display: slideIndex === index ? 'block' : 'none',
//               position: 'relative',
//             }}
//             key={index}
//           >
//             <img
//               src={slide.img}
//               alt={`Slide ${index + 1}`}
//               style={{ width: '100%', height: '350px', borderRadius: '10px', verticalAlign: 'middle' }}
//             />
//             <div
//               style={{
//                 padding: '8px 12px',
//                 position: 'absolute',
//                 bottom: '10px',
//                 width: '100%',
//                 textAlign: 'center',
//                 opacity: 0,
//                 animation: slideIndex === index ? `${slide.animation} 2s forwards` : 'none',
//               }}
//             >
//               <span style={{ color: 'white', fontSize: '35px', fontWeight: 'bold' }}>
//                 {slide.caption}
//               </span>
//             </div>

//             <div
//               style={{
//                 position: 'absolute',
//                 bottom: '90%',
//                 left: '50%',
//                 transform: 'translateX(-50%)',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 gap: '8px',
//               }}
//             >
//               {slides.map((_, dotIndex) => (
//                 <span
//                   key={dotIndex}
//                   style={{
//                     height: '15px',
//                     width: '15px',
//                     borderRadius: '50%',
//                     backgroundColor: slideIndex === dotIndex ? '#ff0000' : '#717171',
//                     display: 'inline-block',
//                     transition: 'background-color 0.6s ease',
//                     cursor: 'pointer',
//                   }}
//                   onClick={() => handleDotClick(dotIndex)}
//                 />
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add CSS for the fade-in, slide-up, and scale-up animations */}
//       <style>
//         {`
//           @keyframes fadeIn {
//             0% {
//               opacity: 0;
//               transform: translateY(20px);
//             }
//             100% {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }

//            @keyframes slideInDown {
//             0% {
//               opacity: 0;
//               transform: translateY(-50px);
//             }
//             100% {
//               opacity: 1;
//               transform: translateY(0);
//             }
//            }

//           @keyframes scaleUp {
//             0% {
//               opacity: 0;
//               transform: scale(0.8);
//             }
//             100% {
//               opacity: 1;
//               transform: scale(1);
//             }
//           }
//           @keyframes bounceInDown {
//     0%, 60%, 75%, 90%, 100% {
//         animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
//     }
//     0% {
//         opacity: 0;
//         transform: translateY(-3000px);
//     }
//     60% {
//         opacity: 1;
//         transform: translateY(25px);
//     }
//     75% {
//         transform: translateY(-10px);
//     }
//     90% {
//         transform: translateY(5px);
//     }
//     100% {
//      opacity: 1;
//         transform: translateY(0);
//     }
// }
//         `}
//       </style>
//     </div>
//   );
// };

// export default Slideshow;




