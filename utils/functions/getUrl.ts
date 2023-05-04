import appConfig from '../constants/appConfig';

export const getUrl = (stub: string) => {
  const url = process.env.NEXT_PUBLIC_ENV === 'DEV' ? 'http://localhost:3000' : appConfig.url;
  return `${url}${stub}`;
};
