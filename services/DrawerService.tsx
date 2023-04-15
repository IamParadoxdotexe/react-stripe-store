import { ReactNode } from 'react';
import { BehaviorSubject } from 'rxjs';

export type DrawerContents = ReactNode | ReactNode[];

export const DrawerService = new (class {
  public isOpen = new BehaviorSubject(false);
  public drawerContents = new BehaviorSubject<DrawerContents>(null);

  public open = (drawerContents: DrawerContents) => {
    this.drawerContents.next(drawerContents);
    this.isOpen.next(true);
  };

  public close = () => {
    this.isOpen.next(false);
  };
})();
