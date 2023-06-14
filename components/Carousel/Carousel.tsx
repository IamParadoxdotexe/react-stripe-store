import React, { ReactNode, useState, useEffect } from 'react';
import { useIsomorphicLayoutEffect } from '@/utils/hooks/useIsomorphicLayoutEffect';
import { IconButton } from '@mui/material';
import { Skeleton } from '@/components/Skeleton';
import LeftArrowIcon from '@/icons/ArrowLeft.svg';
import RightArrowIcon from '@/icons/ArrowRight.svg';
import styles from './Carousel.module.scss';

type CarouselProps = {
  title: string;
  children?: ReactNode | ReactNode[];
  loading?: boolean;
};

const INDICATOR_WIDTH = 150;

export const Carousel: React.FC<CarouselProps> = (props: CarouselProps) => {
  const [offset, setOffset] = useState(0);
  const [goalOffset, setGoalOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);

  const [carouselRef, setCarouselRef] = useState<HTMLDivElement | null>();
  const [carouselItemsRef, setCarouselItemsRef] = useState<HTMLDivElement | null>();

  const [carouselWidth, setCarouselWidth] = useState(0);
  const [carouselItemsWidth, setCarouselItemsWidth] = useState(0);

  const CarouselControl = (_props: { direction: 'left' | 'right' }) => {
    const isLeft = _props.direction === 'left';
    const nextOffset = isLeft ? offset - carouselWidth : offset + carouselWidth;

    return (
      <IconButton
        color="primary"
        disabled={isLeft ? offset === 0 : offset === maxOffset}
        onClick={() => setGoalOffset(Math.max(0, Math.min(nextOffset, maxOffset)))}
      >
        {isLeft ? <LeftArrowIcon /> : <RightArrowIcon />}
      </IconButton>
    );
  };

  // calculate the maximum offset based on carousel width and carousel items width
  const onResize = () => {
    if (carouselRef && carouselItemsRef) {
      const carouselWidth = carouselRef.clientWidth;
      const carouselItemsWidth = carouselItemsRef.scrollWidth;
      const newMaxOffset = Math.max(carouselItemsWidth - carouselWidth, 0);

      setCarouselWidth(carouselWidth);
      setCarouselItemsWidth(carouselItemsWidth);
      setMaxOffset(maxOffset => {
        const maxOffsetChange = maxOffset - newMaxOffset;

        if (maxOffsetChange > 0) {
          setGoalOffset(0); // reset offset to 0 to avoid any oddities when maxOffset is increased
        }

        return newMaxOffset;
      });
    }
  };

  // listen to window resize
  useIsomorphicLayoutEffect(() => {
    onResize();
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, [carouselRef, props.children]);

  // detect carouselItems scroll
  useEffect(() => {
    const onScroll = (event: any) => {
      setOffset(event.target.scrollLeft);
    };

    if (carouselItemsRef) {
      carouselItemsRef.addEventListener('scroll', onScroll);
    }

    return () => window.removeEventListener('scroll', onScroll);
  }, [carouselItemsRef]);

  // scroll items to goalOffset
  useEffect(() => {
    if (carouselItemsRef?.scrollLeft != goalOffset) {
      carouselItemsRef?.scrollTo({ left: goalOffset, behavior: 'smooth' });
    }
  }, [goalOffset]);

  const sliderWidth =
    carouselWidth && carouselItemsWidth && (carouselWidth / carouselItemsWidth) * INDICATOR_WIDTH;
  const sliderOffset = carouselWidth && offset && (offset / carouselItemsWidth) * INDICATOR_WIDTH;

  return (
    <div ref={setCarouselRef} className={styles.carousel}>
      <div className={styles.carousel__header}>
        <Skeleton className={styles.header__title} loading={props.loading}>
          {props.title}
        </Skeleton>
        {maxOffset > 0 && !props.loading && (
          <div>
            <CarouselControl direction="left" />
            <CarouselControl direction="right" />
          </div>
        )}
      </div>

      <div ref={setCarouselItemsRef} className={styles.carousel__items}>
        {props.children}
      </div>

      {maxOffset > 0 && (
        <div className={styles.carousel__indicator} style={{ width: INDICATOR_WIDTH }}>
          {!props.loading && (
            <div
              className={styles.indicator__slider}
              style={{ width: sliderWidth, marginLeft: sliderOffset }}
            />
          )}
        </div>
      )}
    </div>
  );
};
