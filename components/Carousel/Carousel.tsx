import React, { ReactNode, useLayoutEffect, useState, TouchEvent } from 'react';
import { Subscription } from 'rxjs';
import { easeSpeed } from '@/utils/functions/easeSpeed';
import { IconButton } from '@mui/material';
import LeftArrowIcon from '@/icons/ArrowLeft.svg';
import RightArrowIcon from '@/icons/ArrowRight.svg';
import styles from './Carousel.module.scss';

type CarouselProps = {
  title: string;
  children?: ReactNode | ReactNode[];
};

const INDICATOR_WIDTH = 150;

export const Carousel: React.FC<CarouselProps> = (props: CarouselProps) => {
  const [offset, setOffset] = useState(0);
  const [carouselRef, setCarouselRef] = useState<HTMLDivElement | null>();
  const [carouselItemsWidth, setCarouselItemsWidth] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);

  const [lastDragX, setLastDragX] = useState(0);
  const [lastDragChange, setLastDragChange] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragEndAnimation, setDragEndAnimation] = useState<Subscription>();

  const updateOffset = (offset: number) => setOffset(Math.max(0, Math.min(offset, maxOffset)));

  const CarouselControl = (_props: { direction: 'left' | 'right' }) => {
    const isLeft = _props.direction === 'left';
    const nextOffset = isLeft ? offset - carouselWidth : offset + carouselWidth;

    return (
      <IconButton
        color="secondary"
        disabled={isLeft ? offset === 0 : offset === maxOffset}
        onClick={() => updateOffset(nextOffset)}
      >
        {isLeft ? <LeftArrowIcon /> : <RightArrowIcon />}
      </IconButton>
    );
  };

  // calculate the maximum offset based on carousel width and carousel items width
  const onResize = () => {
    if (carouselRef) {
      const carouselWidth = carouselRef?.clientWidth;
      const carouselItemsWidth = (carouselRef?.childNodes[1] as HTMLElement).scrollWidth;
      const newMaxOffset = Math.max(carouselItemsWidth - carouselWidth, 0);

      setCarouselItemsWidth(carouselItemsWidth);
      setCarouselWidth(carouselWidth);
      setMaxOffset(maxOffset => {
        const maxOffsetChange = maxOffset - newMaxOffset;

        if (maxOffsetChange > 0) {
          setOffset(0); // reset offset to 0 to avoid any oddities when maxOffset is increased
        }

        return newMaxOffset;
      });
    }
  };

  const onDragStart = (event: TouchEvent) => {
    if (dragEndAnimation) {
      dragEndAnimation.unsubscribe();
      setIsDragging(false);
    }

    setLastDragX(getDragX(event));
  };

  const onDrag = (event: TouchEvent) => {
    const dragX = getDragX(event);
    const dragChange = lastDragX - dragX;

    updateOffset(offset + dragChange);
    setLastDragX(dragX);
    setLastDragChange(dragChange);
    setIsDragging(true);
  };

  const onDragEnd = () => {
    // we use lastDragChange as the starting speed of the ease animation
    if (lastDragChange === 0) {
      return;
    }

    const dragEndAnimation = easeSpeed(offset, lastDragChange).subscribe(easingOffset => {
      if (easingOffset != undefined) {
        updateOffset(easingOffset);
      } else {
        dragEndAnimation.unsubscribe();
        setIsDragging(false);
      }
    });

    setLastDragChange(0);
    setDragEndAnimation(dragEndAnimation);
  };

  const getDragX = (event: TouchEvent) => event.changedTouches[0].clientX;

  useLayoutEffect(() => {
    onResize();
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, [carouselRef, props.children]);

  const sliderWidth =
    carouselWidth && carouselItemsWidth && (carouselWidth / carouselItemsWidth) * INDICATOR_WIDTH;
  const sliderOffset = carouselWidth && offset && (offset / carouselItemsWidth) * INDICATOR_WIDTH;

  return (
    <div ref={setCarouselRef} className={`${styles.carousel} ${isDragging ? styles.dragging : ''}`}>
      <div className={styles.carousel__header}>
        <div className={styles.header__title}>{props.title}</div>
        {maxOffset > 0 && (
          <div>
            <CarouselControl direction="left" />
            <CarouselControl direction="right" />
          </div>
        )}
      </div>

      <div
        className={styles.carousel__items}
        style={{ marginLeft: -offset }}
        onTouchStart={onDragStart}
        onTouchMove={onDrag}
        onTouchEnd={onDragEnd}
        onTouchCancel={onDragEnd}
      >
        {props.children}
      </div>

      <div className={styles.carousel__indicator} style={{ width: INDICATOR_WIDTH }}>
        <div
          className={styles.indicator__slider}
          style={{ width: sliderWidth, marginLeft: sliderOffset }}
        />
      </div>
    </div>
  );
};
