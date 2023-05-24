import { Subject } from 'rxjs';

/**
 * Ease a value changing at a rate of speed to a stop.
 */
export const easeSpeed = (value: number, speed: number, frames = 45, msPerFrame = 10) => {
  const easingValue = new Subject<number | undefined>();

  let frameIndex = 0;

  // ease value based on speed and time
  const easeInterval = setInterval(() => {
    // ease curve = (cos(pi * x) + 1) / 2
    const x = (frameIndex + 1) / frames;
    const speedPct = (Math.cos(Math.PI * x) + 1) / 2;

    // ease value by easing speed down to 0
    value += speed * speedPct;
    easingValue.next(value);

    // finish easing
    if (frameIndex === frames - 1) {
      clearInterval(easeInterval);
      easingValue.next(undefined);
    }

    frameIndex++;
  }, msPerFrame);

  return easingValue;
};
