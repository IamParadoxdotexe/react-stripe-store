import React, { ReactNode, useEffect, useLayoutEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import LeftArrowIcon from '@/icons/ArrowLeft.svg';
import RightArrowIcon from '@/icons/ArrowRight.svg';
import styles from './Carousel.module.scss';

type CarouselProps = {
  title: string;
  children: ReactNode[];
};

export const Carousel: React.FC<CarouselProps> = (props: CarouselProps) => {
  const [offset, setOffset] = useState(0);
  const [carouselRef, setCarouselRef] = useState<HTMLDivElement | null>();
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);

  const CarouselControl = (_props: { direction: 'left' | 'right' }) => {
    const isLeft = _props.direction === 'left';
    const nextOffset = isLeft
      ? Math.max(0, offset - carouselWidth)
      : Math.min(offset + carouselWidth, maxOffset);

    return (
      <IconButton
        color="secondary"
        disabled={isLeft ? offset === 0 : offset === maxOffset}
        onClick={() => setOffset(nextOffset)}
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

  useLayoutEffect(() => {
    onResize();
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, [carouselRef, props.children]);

  return (
    <div ref={setCarouselRef} className={styles.carousel}>
      <div className={styles.carousel__header}>
        <div className={styles.header__title}>{props.title}</div>
        {maxOffset > 0 && (
          <div>
            <CarouselControl direction="left" />
            <CarouselControl direction="right" />
          </div>
        )}
      </div>
      <div className={styles.carousel__items} style={{ marginLeft: -offset }}>
        {props.children}
      </div>
    </div>
  );
};
