import React, { CSSProperties, ReactNode, useLayoutEffect, useRef, useState } from 'react';
import styles from './Skeleton.module.scss';

type SkeletonProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  loading?: boolean;
};

/**
 * Content wrapper to add skeleton state while loading.
 */
export const Skeleton: React.FC<SkeletonProps> = (props: SkeletonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [skeletonStyle, setSkeletonStyle] = useState<CSSProperties>();
  const [skeletonContentStyle, setSkeletonContentStyle] = useState<CSSProperties>();

  useLayoutEffect(() => {
    const style = ref.current ? window.getComputedStyle(ref.current) : undefined;

    if (style) {
      if (style.height === style.lineHeight) {
        // skeleton text based on lineHeight, fontSize, and content width
        setSkeletonStyle({ height: style.lineHeight });
        setSkeletonContentStyle({ height: style.fontSize });
      } else {
        // skeleton div based on height and width
        setSkeletonStyle({ height: style.height, width: style.width });
        setSkeletonContentStyle({ height: style.height, width: style.width });
      }
    }
  }, [ref]);

  return props.loading ? (
    <div className={styles.skeleton} style={{ ...skeletonStyle, opacity: ref.current ? 1 : 0 }}>
      <div className={styles.skeleton__inner} style={skeletonContentStyle}>
        <div
          className={`${props.className} ${styles.inner__content}`}
          style={props.style}
          ref={ref}
        >
          {props.children}
        </div>
      </div>
    </div>
  ) : (
    <div className={props.className} style={props.style}>
      {props.children}
    </div>
  );
};
