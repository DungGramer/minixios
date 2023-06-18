class HttpClient {
  accessToken: string | null;
  refreshToken: string | null;
  refreshPromise: Promise<any> | null;
  baseURL: string;
  tokenURL?: string;
  headers: any;

  constructor(
    baseURL:
      | {
          base: string;
          getToken: string;
        }
      | string,
    headers?: any
  ) {
    this.accessToken = null;
    this.refreshToken = null;

    this.refreshPromise = null;

    if (typeof baseURL === 'string') {
      this.baseURL = baseURL;
    } else {
      this.baseURL = baseURL.base;
      this.tokenURL = baseURL.getToken;
    }

    this.headers = headers || {
      'Content-Type': 'application/json',
    };
  }

  setToken(token: {
    accessToken?: HttpClient['accessToken'];
    refreshToken?: HttpClient['refreshToken'];
  }) {
    if (!token) return;
    this.accessToken = token.accessToken || null;
    this.refreshToken = token.refreshToken || null;

    return this;
  }

  async refresh(headers?: any, body?: any) {
    if (!this.refreshToken) return null;
    if (this.refreshPromise) return this.refreshPromise;

    const url = new URL(this.tokenURL || '', this.baseURL);

    this.refreshPromise = fetch(url, {
      method: 'POST',
      headers: {
        ...this.headers,
        Authorization: `Bearer ${this.accessToken}`,
        ...headers,
      },
      ...(body
        ? {body: JSON.stringify(body)}
        : {
            body: JSON.stringify({refreshToken: this.refreshToken}),
          }),
    })
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then(data => {
        this.setToken(data);

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

  async isTokenExpired() {
    if (!this.accessToken) return true;

    const token = this.accessToken.split('.')[1];
    const decoded = JSON.parse(atob(token));

    return decoded.exp * 1000 < Date.now();
  }

  async getToken(path: string, body: any, headers?: any) {
    const url = new URL(path, this.baseURL);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...this.headers,
        ...headers,
      },
      ...(body ? {body: JSON.stringify(body)} : {}),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    this.setToken(data);

    return data;
  }

  async request({method, path, headers, body}: any): Promise<any> {
    const token = this.accessToken;

    if (!token) {
      throw new Error('No access token found, please log in first');
    }

    const requestHeaders = {
      ...(token ? {Authorization: `Bearer ${token}`} : {}),
      ...this.headers,
      ...headers,
    };

    const options = {
      method,
      headers: requestHeaders,
      ...(body ? {body: JSON.stringify(body)} : {}),
    };

    const url = new URL(path, this.baseURL);

    const response = await fetch(url, options);

    if (response.status === 401) {
      await this.refresh();
      return this.request({method, path, headers, body});
    } else if (!response.ok) {
      throw new Error(response.statusText);
    } else {
      return JSON.parse(await response.text());
    }
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

const baseURL = 'http://localhost:8080';

const httpClient = new HttpClient({
  base: baseURL,
  getToken: '/refreshToken',
});

async function getToken() {
  const token: {
    accessToken: string;
    refreshToken: string;
  } = await httpClient.getToken('/login', {
    username: 'admin',
    password: 'admin',
  }); //?

  const data = await httpClient.get('/users');
  console.log(`📕 data - 184:minixios-fetch.ts \n`, data);

  // await httpClient.refresh().then(token => {
  //   console.log('token:', token);
  // });

  // await httpClient
  //   .post('/logout', {
  //     token: token.refreshToken,
  //   })
  //   .then(token => {
  //     console.log('token:', token);
  //   });
}

// await getToken(); //?
