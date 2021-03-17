import React, { useState } from 'react';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';
import {connect} from 'react-redux';


const ShopCarousel = (props) => {

    const items = []
    for (let i=0; i<props.selectedShop.shopImages.length; i++) {
        items.push({ src: props.selectedShop.shopImages[i], altText: props.selectedShop.shopName, caption: props.selectedShop.shopName, desciption: props.selectedShop.shopName})
    }
    

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
            <img style={{width: '120%', height: '100%'}} src={item.src} alt={item.altText} />
            
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

  function mapStateToProps(state){
    return {selectedShop: state.selectedShop}
  }
  
  export default connect(
    mapStateToProps,
    null,
  )(ShopCarousel);
  
 