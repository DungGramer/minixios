export interface Config {
  baseURL: string;
  headers?: Record<string, string>;
  transformRequest?: ((data: any, headers?: Record<string, string>) => any)[];
  transformResponse?: ((data: any) => any)[];
  paramsSerializer?: (params: Record<string, any>) => string;
  timeout?: number;
  withCredentials?: boolean;
}

export type Interceptor = (config: RequestInit) => RequestInit;

export type Request = RequestInit & {data: any};

class HttpClient {
  baseURL: string;
  defaultHeaders: Record<string, string>;
  transformRequest: ((data: any, headers?: Record<string, string>) => any)[];
  transformResponse: ((data: any) => any)[];
  paramsSerializer: (params: Record<string, any>) => string;
  timeout: number;
  withCredentials?: boolean;
  interceptors: {
    request: Interceptor[];
    response: Interceptor[];
  };

  constructor(config: Config) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = config.headers || {};
    this.transformRequest = config.transformRequest || [data => data];
    this.transformResponse = config.transformResponse || [data => data];
    this.paramsSerializer =
      config.paramsSerializer ||
      (params => new URLSearchParams(params).toString());
    this.timeout = config.timeout || 0; // 0 means no timeout
    this.withCredentials = config.withCredentials;
    // Initialize interceptors
    this.interceptors = {
      request: [],
      response: [],
    };
    // Other configurations like `auth`, `responseType`, etc., can be stored similarly
  }

  // Add a request interceptor
  addRequestInterceptor(interceptor: Interceptor) {
    this.interceptors.request.push(interceptor);
  }

  // Add a response interceptor
  addResponseInterceptor(interceptor: Interceptor) {
    this.interceptors.response.push(interceptor);
  }

  // Utility function to merge custom config with default config
  mergeConfig(customConfig: RequestInit): RequestInit {
    return {
      headers: {...this.defaultHeaders, ...customConfig.headers},
      method: customConfig.method || 'GET',
      body:
        customConfig.method && customConfig.method !== 'GET'
          ? JSON.stringify(customConfig.body)
          : null,
    };
  }

  // Main request method
  async request(url: string, config: RequestInit = {}): Promise<any> {
    const fullUrl = this.baseURL + url;
    let mergedConfig = this.mergeConfig(config);

    // Apply request interceptors
    this.interceptors.request.forEach(interceptor => {
      mergedConfig = {
        ...mergedConfig,
        ...interceptor(mergedConfig),
      };
    });

    // Apply transformRequest functions
    let requestData = mergedConfig.body;
    this.transformRequest.forEach(transform => {
      requestData = transform(
        requestData,
        this.convertHeadersToObject(mergedConfig.headers)
      );
    });

    mergedConfig.body = requestData;

    // Handling fetch with timeout
    const abortController = new AbortController();
    if (this.timeout > 0) {
      setTimeout(() => abortController.abort(), this.timeout);
    }
    mergedConfig.signal = abortController.signal;

    try {
      const response = await fetch(fullUrl, mergedConfig);
      const responseData = await response.json(); // Assuming JSON response. Adjust based on responseType.
      const {status, statusText, headers} = response;

      // Apply transformResponse functions
      let transformedResponseData = responseData;
      this.transformResponse.forEach(transform => {
        transformedResponseData = transform(responseData);
      });

      // Apply response interceptors
      this.interceptors.response.forEach(interceptor => {
        transformedResponseData = interceptor(transformedResponseData);
      });

      return {
        data: transformedResponseData,
        status,
        statusText,
        headers,
        config: mergedConfig,
      };
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        throw error;
      }

      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }

      throw error;
    }
  }

  // Convenience methods
  get(url: string, config: RequestInit = {}): Promise<any> {
    return this.request(url, {...config, method: 'GET'});
  }

  delete(url: string, config: RequestInit = {}): Promise<any> {
    return this.request(url, {...config, method: 'DELETE'});
  }

  head(url: string, config: RequestInit = {}): Promise<any> {
    return this.request(url, {...config, method: 'HEAD'});
  }

  options(url: string, config: RequestInit = {}): Promise<any> {
    return this.request(url, {...config, method: 'OPTIONS'});
  }

  post(
    url: string,
    body: RequestInit['body'],
    config: RequestInit = {}
  ): Promise<any> {
    return this.request(url, {...config, body, method: 'POST'});
  }

  put(
    url: string,
    body: RequestInit['body'],
    config: RequestInit = {}
  ): Promise<any> {
    return this.request(url, {...config, body, method: 'PUT'});
  }

  patch(
    url: string,
    body: RequestInit['body'],
    config: RequestInit = {}
  ): Promise<any> {
    return this.request(url, {...config, body, method: 'PATCH'});
  }

  // Methods for form data need special handling for Content-Type
  postForm(
    url: string,
    data: Record<string, any>,
    config: RequestInit = {}
  ): Promise<any> {
    const formData = new URLSearchParams(data).toString();
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...config.headers,
    };
    return this.post(url, formData, {...config, headers});
  }

  putForm(
    url: string,
    data: Record<string, any>,
    config: RequestInit = {}
  ): Promise<any> {
    const formData = new URLSearchParams(data).toString();
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...config.headers,
    };
    return this.put(url, formData, {...config, headers});
  }

  patchForm(
    url: string,
    data: Record<string, any>,
    config: RequestInit = {}
  ): Promise<any> {
    const formData = new URLSearchParams(data).toString();
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...config.headers,
    };
    return this.patch(url, formData, {...config, headers});
  }

  convertHeadersToObject(
    headersInit: HeadersInit | undefined
  ): Record<string, string> {
    const headers = {} as Record<string, string>;
    if (headersInit instanceof Headers) {
      headersInit.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(headersInit)) {
      headersInit.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      return {};
    }
    return headers;
  }
}

export default HttpClient;
