import React, {
  ReactNode,
  useLayoutEffect,
  useState,
  TouchEvent as ReactTouchEvent,
  useRef,
  useCallback
} from 'react';
import { Subscription } from 'rxjs';
import { easeSpeed } from '@/utils/functions/easeSpeed';
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
  const [carouselRef, setCarouselRef] = useState<HTMLDivElement | null>();
  const [carouselItemsWidth, setCarouselItemsWidth] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);

  const [startDragXY, setStartDragXY] = useState<[number, number]>([0, 0]);
  const [lastDragX, setLastDragX] = useState(0);
  const [lastDragChange, setLastDragChange] = useState(0);
  const [isDragging, setIsDragging] = useState<boolean>();

  const [dragEndAnimation, setDragEndAnimation] = useState<Subscription>();

  const ref = useRef<HTMLDivElement>(null);

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

  const onDragStart = (event: ReactTouchEvent) => {
    if (dragEndAnimation) {
      dragEndAnimation.unsubscribe();
      setIsDragging(undefined);
    }

    const dragXY = getDragXY(event);
    setStartDragXY(dragXY);
    setLastDragX(dragXY[0]);
  };

  const onDrag = useCallback(
    (event: TouchEvent) => {
      if (isDragging === false) {
        return;
      } else if (isDragging === true && !event.cancelable) {
        // if event becomes not cancelable while dragging, abort
        setIsDragging(false);
      }

      const dragXY = getDragXY(event);

      const totalDragChangeX = Math.abs(startDragXY[0] - dragXY[0]);
      const totalDragChangeY = Math.abs(startDragXY[1] - dragXY[1]);

      if (isDragging === undefined) {
        // wait for large enough drag before determining isDragging
        if (totalDragChangeX < 20) {
          return;
        } else {
          // check for vertical scroll
          const isVerticallyScrolling = totalDragChangeY > 10;

          setIsDragging(!isVerticallyScrolling);

          if (isVerticallyScrolling) {
            return;
          }
        }
      }

      // prevent vertical scroll while dragging
      event.preventDefault();

      const dragChange = lastDragX - dragXY[0];

      // drag carousel
      updateOffset(offset + dragChange);
      setLastDragX(dragXY[0]);
      setLastDragChange(dragChange);
    },
    [offset, lastDragX, isDragging]
  );

  const onDragEnd = () => {
    // we use lastDragChange as the starting speed of the ease animation
    if (!isDragging || lastDragChange === 0) {
      setIsDragging(undefined);
      return;
    }

    const dragEndAnimation = easeSpeed(offset, lastDragChange).subscribe(easingOffset => {
      if (easingOffset != undefined) {
        updateOffset(easingOffset);
      } else {
        dragEndAnimation.unsubscribe();
        setIsDragging(undefined);
      }
    });

    setLastDragChange(0);
    setDragEndAnimation(dragEndAnimation);
  };

  const getDragXY = (event: TouchEvent | ReactTouchEvent): [number, number] => {
    const touch = event.changedTouches[0];
    return [touch.clientX, touch.clientY];
  };

  useLayoutEffect(() => {
    onResize();
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, [carouselRef, props.children]);

  useLayoutEffect(() => {
    // manually bind onTouchMove to support preventDefault
    if (ref.current) {
      ref.current.ontouchmove = event => onDrag(event);
    }
  }, [ref, onDrag]);

  const sliderWidth =
    carouselWidth && carouselItemsWidth && (carouselWidth / carouselItemsWidth) * INDICATOR_WIDTH;
  const sliderOffset = carouselWidth && offset && (offset / carouselItemsWidth) * INDICATOR_WIDTH;

  return (
    <div ref={setCarouselRef} className={`${styles.carousel} ${isDragging ? styles.dragging : ''}`}>
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

      <div
        ref={ref}
        className={styles.carousel__items}
        style={{ marginLeft: -offset }}
        onTouchStart={onDragStart}
        onTouchEnd={onDragEnd}
        onTouchCancel={onDragEnd}
      >
        {props.children}
      </div>

      {maxOffset > 0 && (
        <div className={styles.carousel__indicator} style={{ width: INDICATOR_WIDTH }}>
          <div
            className={styles.indicator__slider}
            style={{ width: sliderWidth, marginLeft: sliderOffset }}
          />
        </div>
      )}
    </div>
  );
};
