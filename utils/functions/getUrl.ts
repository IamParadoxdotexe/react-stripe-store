import appConfig from '../constants/appConfig';

export const getUrl = (slug: string) => {
  const url = process.env.NEXT_PUBLIC_ENV === 'PROD' ? appConfig.url : 'http://localhost:3000';
  return `${url}${slug}`;
};
