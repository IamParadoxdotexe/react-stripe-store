import { Roboto } from 'next/font/google';
import styles from './index.module.scss';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin']
});

export default function Home() {
  return <main className={`${roboto.className} ${styles.main}`}>Hello world!</main>;
}
