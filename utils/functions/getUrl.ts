import appConfig from '../constants/appConfig';

export const getUrl = (stub: string) => {
  const url = process.env.NEXT_PUBLIC_ENV === 'PROD' ? appConfig.url : 'http://localhost:3000';
  return `${url}${stub}`;
};
