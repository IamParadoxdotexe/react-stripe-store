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

const POLLING_SIZE = 3;
const POLLING_RATE_MS = 10;

export const Carousel: React.FC<CarouselProps> = (props: CarouselProps) => {
  const [offset, setOffset] = useState(0);
  const [carouselRef, setCarouselRef] = useState<HTMLDivElement | null>();
  const [carouselItemsWidth, setCarouselItemsWidth] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);

  // when isDragging = true, carousel can move
  const [isDragging, setIsDragging] = useState<boolean>();
  // startDragXY is used to different drag from vertical scroll
  const [startDragXY, setStartDragXY] = useState<[number, number]>([0, 0]);

  // polling lastDragX is used to compute speed for drag end animation
  const [lastDragX, setLastDragX] = useState({
    value: 0
  });
  const [polledLastDragX, setPolledLastDragX] = useState<number[]>([]);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timer>();

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
      setPolledLastDragX([]);
    }

    const dragXY = getDragXY(event);
    setStartDragXY(dragXY);
    setLastDragX({ value: dragXY[0] });
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

      if (isDragging === undefined) {
        const totalDragChangeX = Math.abs(startDragXY[0] - dragXY[0]);
        const totalDragChangeY = Math.abs(startDragXY[1] - dragXY[1]);

        // check for vertical scroll
        const isVerticallyScrolling = totalDragChangeY > totalDragChangeX;

        setIsDragging(!isVerticallyScrolling);

        if (isVerticallyScrolling) {
          return;
        }
      }

      // prevent vertical scroll while dragging
      event.preventDefault();

      const dragChange = lastDragX.value - dragXY[0];

      // drag carousel
      updateOffset(offset + dragChange);
      setLastDragX({ value: dragXY[0] });
    },
    [offset, lastDragX, isDragging]
  );

  const onDragEnd = () => {
    // skip animation in the vertical scroll case
    if (!isDragging || !polledLastDragX.length) {
      setIsDragging(undefined);
      return;
    }

    const totalDragXChange = polledLastDragX.at(-1)! - polledLastDragX[0];
    const speed = totalDragXChange / polledLastDragX.length;

    const dragEndAnimation = easeSpeed(offset, speed).subscribe(easingOffset => {
      if (easingOffset != undefined) {
        updateOffset(easingOffset);
      } else {
        dragEndAnimation.unsubscribe();
        setIsDragging(undefined);
        setPolledLastDragX([]);
      }
    });

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

  useLayoutEffect(() => {
    if (isDragging) {
      // poll last X position to calculate speed
      setPollingInterval(
        setInterval(() => {
          setLastDragX(lastDragX => {
            setPolledLastDragX(polledLastDragX =>
              [lastDragX.value, ...polledLastDragX].slice(0, POLLING_SIZE)
            );

            // don't actually update lastDragX, we just wanted up-to-date value
            return lastDragX;
          });
        }, POLLING_RATE_MS)
      );
    } else if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(undefined);
    }
  }, [isDragging]);

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
