import {
  ErrorFetchResponse,
  FetchResponse,
  SuccessFetchResponse,
  SuccessFetchResponseBody
} from '@/utils/types/FetchResponse';

const parseResponseBody = (response: Response): Promise<SuccessFetchResponseBody | undefined> => {
  return new Promise(resolve =>
    response
      .json()
      .then(resolve)
      .catch(() => resolve(undefined))
  );
};

/**
 * Handles parsing of response body to yield success JSON or error detail.
 */
export const handleResponse = async (response: Response): Promise<FetchResponse> => {
  const body = await parseResponseBody(response);

  if (response.ok) {
    return new SuccessFetchResponse(response, body);
  } else {
    return new ErrorFetchResponse(response, body);
  }
};
