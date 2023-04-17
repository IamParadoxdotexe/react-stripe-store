abstract class BaseFetchResponse {
  public url: string;
  public status: number;
  public statusText: string;

  constructor(response: Response) {
    this.url = response.url;
    this.status = response.status;
    this.statusText = response.statusText;
  }
}

export type SuccessFetchResponseBody = { [key: string]: any };

export class SuccessFetchResponse extends BaseFetchResponse {
  public body?: SuccessFetchResponseBody;

  constructor(response: Response, body?: SuccessFetchResponseBody) {
    super(response);

    this.body = body;
  }

  public isOk = (): this is SuccessFetchResponse => true;
}

export class ErrorFetchResponse extends BaseFetchResponse {
  public detail: string = 'An unexpected error occurred.';

  constructor(response: Response, body?: SuccessFetchResponseBody) {
    super(response);

    if (body?.detail) {
      this.detail = body.detail;
    }

    console.error(this.detail);
  }

  public isOk = (): this is SuccessFetchResponse => false;
}

export type FetchResponse = SuccessFetchResponse | ErrorFetchResponse;
