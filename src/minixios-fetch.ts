class HttpClient {
  accessToken: string | null;
  refreshToken: string | null;
  refreshPromise: Promise<any> | null;
  baseURL: string;
  refreshURL?: string;
  tokenURL?: string;

  constructor(
    baseURL:
      | {
          base: string;
          refreshToken: string;
          getToken: string;
        }
      | string
  ) {
    this.accessToken = null;
    this.refreshToken = null;

    this.refreshPromise = null;

    if (typeof baseURL === 'string') {
      this.baseURL = baseURL;
      return;
    }
    this.baseURL = baseURL.base;
    this.refreshURL = baseURL.refreshToken;
    this.tokenURL = baseURL.getToken;
  }

  setAccessToken(token: HttpClient['accessToken']) {
    if (!token) return;

    this.accessToken = token;
  }

  setRefreshToken(token: HttpClient['refreshToken']) {
    if (!token) return;

    this.refreshToken = token;
  }

  async refresh(refreshURL?: HttpClient['refreshURL'], headers?: any) {
    if (!this.refreshToken) return null;
    if (this.refreshPromise) return this.refreshPromise;

    const url = new URL(refreshURL || this.refreshURL || this.accessToken || '', this.baseURL);

    this.refreshPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({refreshToken: this.refreshToken}),
    })
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then(data => {
        this.setAccessToken(data.accessToken);
        this.setRefreshToken(data.refreshToken);

        return data.accessToken;
      })
      .catch(error => {
        console.error('Failed to refresh token:', error);
        throw error;
      })
      .finally(() => {
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  async getToken(tokenURL?: HttpClient['tokenURL'], headers?: any) {
    if (!this.accessToken) {
      return null;
    }

    const token = this.accessToken;
    const url = new URL(tokenURL || this.tokenURL || '', this.baseURL);

    try {
      await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...headers,
        },
      });
      return token;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        // Token is invalid, try to refresh it
        try {
          return await this.refresh();
        } catch (error) {
          console.error('Failed to refresh token:', error);
          throw new Error('Failed to refresh token, please log in again');
        }
      } else {
        throw error;
      }
    }
  }

  async request({method, path, headers, body}: any) {
    const token = await this.getToken();

    const requestHeaders = {
      'Content-Type': headers?.contentType || 'application/json',
      ...(token ? {Authorization: `Bearer ${token}`} : {}),
      ...headers,
    };

    const options = {
      method,
      headers: requestHeaders,
      ...(body ? {body: JSON.stringify(body)} : {}),
    };

    const url = new URL(path, this.baseURL);

    return fetch(url, options).then(response => {
      if (response.status === 401) {
        throw new Error('Invalid token, please log in again');
      } else if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      } else {
        return response.json();
      }
    });
  }

  async get(path: string, headers?: any) {
    return this.request({method: 'GET', path, headers});
  }

  async post(path: string, body: any, headers?: any) {
    return this.request({method: 'POST', path, body, headers});
  }

  async put(path: string, body: any, headers?: any) {
    return this.request({method: 'PUT', path, body, headers});
  }

  async patch(path: string, body: any, headers?: any) {
    return this.request({method: 'PATCH', path, body, headers});
  }

  async delete(path: string, headers?: any) {
    return this.request({method: 'DELETE', path, headers});
  }
}

export default HttpClient;

const jsonPlaceholder = new HttpClient('https://jsonplaceholder.typicode.com');

jsonPlaceholder.get('/todos/1').then(data => {
  console.log(data);
});

