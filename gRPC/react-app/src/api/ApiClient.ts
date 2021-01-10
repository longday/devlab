/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-param-reassign */

type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

export class ApiClient {
  private baseUrl: string;

  private readonly authToken?: string;

  constructor(baseUrl: string, authToken?: string) {
    this.authToken = authToken;
    this.baseUrl = baseUrl;
  }

  private async CreateHttpData(method: HttpMethod): Promise<RequestInit> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (this.authToken) {
      headers.append('Authorization', `Bearer ${this.authToken}`);
    }
    const init: RequestInit = {
      method,
      headers,
    };
    return init;
  }

  private static async validateSuccess(res: Response): Promise<Response> {
    if (!res.ok) {
      throw new Error(`response error: ${res.status} ${res.statusText}`);
    }
    return res;
  }

  private static sanitizeUrl(url: string): string {
    return `/${url.replace(/^\/*/, '')}`;
  }

  public httpJson<R>(
    method: HttpMethod,
    url: string,
    body?: object,
    signal?: AbortSignal,
  ): Promise<R> {
    return this.CreateHttpData(method)
      .then((c) => {
        if (body) {
          c.body = JSON.stringify(body);
        }
        if (signal) {
          c.signal = signal;
        }
        return fetch(this.baseUrl + ApiClient.sanitizeUrl(url), c);
      })
      .then(ApiClient.validateSuccess)
      .then((x) => {
        if (x.status === 204) {
          return;
        }
        // eslint-disable-next-line consistent-return
        return x.json();
      });
  }

  public getJson<R>(url: string): [Promise<R>, () => void] {
    const controller = new AbortController();
    return [
      this.httpJson('GET', url, undefined, controller.signal),
      () => controller.abort(),
    ];
  }

  public postJson<R>(url: string, body: object): [Promise<R>, () => void] {
    const controller = new AbortController();
    return [
      this.httpJson('POST', url, body, controller.signal),
      () => controller.abort(),
    ];
  }

  public putJson<R>(url: string, body?: object): [Promise<R>, () => void] {
    const controller = new AbortController();
    return [
      this.httpJson('PUT', url, body, controller.signal),
      () => controller.abort(),
    ];
  }

  public patchJson<R>(url: string, body?: object): [Promise<R>, () => void] {
    const controller = new AbortController();
    return [
      this.httpJson('PATCH', url, body, controller.signal),
      () => controller.abort(),
    ];
  }

  public deleteJson<R>(url: string, body?: object): [Promise<R>, () => void] {
    const controller = new AbortController();
    return [
      this.httpJson('DELETE', url, body, controller.signal),
      () => controller.abort(),
    ];
  }
}
