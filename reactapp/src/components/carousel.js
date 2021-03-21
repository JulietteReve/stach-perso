import React, { useState } from 'react';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';



const items = [
    {
      src: '/picture1.jpg',
      altText: 'MOMENT A DEUX',
      caption: 'MOMENT A DEUX',
      description: 'Un moment unique en couple, redécouvrez vous tout en découvrant une nouvelle coupe'
    },
    {
      src: '/picture2.jpg',
      altText: 'APERO COIF',
      caption: 'APERO COIF',
      description : "Pas le temps d'aller chez le coiffeur avant votrer soirée, pas besoin de choisir, commencez une before avec vos amis tout en vous faisant coiffer"
    },
    {
      src: '/picture9.jpeg',
      altText: 'PLAY HARD CUT HARD',
      caption: 'PLAY HARD CUT HARD',
      description : "Jouez à vos jeux préférés et devenez le champion du salon de coiffure"
    },
    {
        src: '/picture8.jpeg',
        altText: 'BIEN ETRE',
        caption: 'BIEN ETRE',
        description : "Si vous êtes un peu stressé à l'idée d'avoir une nouvelle coupe, alors détendez vous et profitez d'un massage"
      }
  ];



const MonCarousel = (props) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

  
    const next = () => {
      if (animating) return;
      const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
      setActiveIndex(nextIndex);
    }
  
    const previous = () => {
      if (animating) return;
      const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
      setActiveIndex(nextIndex);
    }
  
    const goToIndex = (newIndex) => {
      if (animating) return;
      setActiveIndex(newIndex);
    }

    function handleClickExperience(item) {
      props.handleClickParent(item)
    }
  
    const slides = items.map((item) => {
      return (
        <CarouselItem
          onExiting={() => setAnimating(true)}
          onExited={() => setAnimating(false)}
          key={item.src}
        >
          <div onClick={() => handleClickExperience(item)}>
            <img style={{width: '100%'}} src={item.src} alt={item.altText} />
            <div style={{textAlign: 'center', color: 'white', backgroundColor: '#4280AB', fontWeight: 'bold'}}>
            <p >{item.caption}</p>
            </div>
          </div>
        </CarouselItem>
      );
    });
  
    return (
        
      <Carousel
        activeIndex={activeIndex}
        next={next}
        previous={previous}
      >
        {/* <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} /> */}
        {slides}
        <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
        <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
      </Carousel>
     
    );
  }
  
  export default MonCarousel;

