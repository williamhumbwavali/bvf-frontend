const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:3333/api';

type RequestOptions = RequestInit & {
  auth?: boolean;
};

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return localStorage.getItem('accessToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const {
      auth = false,
      headers,
      ...requestOptions
    } = options;

    const requestHeaders = new Headers(headers);

    requestHeaders.set(
      'Content-Type',
      'application/json',
    );

    if (auth) {
      const token = this.getToken();

      if (token) {
        requestHeaders.set(
          'Authorization',
          `Bearer ${token}`,
        );
      }
    }

    const response = await fetch(
      `${this.baseUrl}${endpoint}`,
      {
        ...requestOptions,
        headers: requestHeaders,
      },
    );

    const contentType =
      response.headers.get('content-type');

    const data =
      contentType?.includes('application/json')
        ? await response.json()
        : await response.text();

    if (!response.ok) {
      const message =
        typeof data === 'object' && data?.message
          ? data.message
          : 'Ocorreu um erro na requisição';

      throw new Error(message);
    }

    return data as T;
  }

  get<T>(
    endpoint: string,
    options?: RequestOptions,
  ) {
    return this.request<T>(
      endpoint,
      {
        ...options,
        method: 'GET',
      },
    );
  }

  post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ) {
    return this.request<T>(
      endpoint,
      {
        ...options,
        method: 'POST',
        body: body
          ? JSON.stringify(body)
          : undefined,
      },
    );
  }

  patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ) {
    return this.request<T>(
      endpoint,
      {
        ...options,
        method: 'PATCH',
        body: body
          ? JSON.stringify(body)
          : undefined,
      },
    );
  }

  delete<T>(
    endpoint: string,
    options?: RequestOptions,
  ) {
    return this.request<T>(
      endpoint,
      {
        ...options,
        method: 'DELETE',
      },
    );
  }
}

export const api = new ApiClient();