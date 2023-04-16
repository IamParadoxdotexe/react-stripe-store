import { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';

export const useServiceState = <T>(subject: BehaviorSubject<T>) => {
  const [state, setState] = useState<T>(subject.value);

  useEffect(() => {
    subject.subscribe(setState);
  }, []);

  return state;
};
