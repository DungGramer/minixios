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

  refresh(headers?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.refreshToken) return null;
      if (this.refreshPromise) return this.refreshPromise;

      const url = new URL(this.tokenURL || '', this.baseURL);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);

      const requestHeaders = {
        ...this.headers,
        ...headers,
      };

      for (const k in requestHeaders) {
        xhr.setRequestHeader(k, requestHeaders[k]);
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            this.setToken(data);
            resolve(data);
          } else {
            const error = new Error(
              xhr.statusText || 'Failed to refresh token'
            );
            console.error('Failed to refresh token:', error);
            reject(error);
          }
          return;
        }
      };
      const requestBody = JSON.stringify({token: this.refreshToken});
      xhr.send(requestBody);

      return;
    });
  }

  getToken(path: string, body: any, headers?: any) {
    return new Promise(async (resolve, reject) => {
      if (this.accessToken) {
        resolve(this.accessToken);
        return;
      }

      const url = new URL(path, this.baseURL);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);

      const requestHeaders = {
        ...this.headers,
        ...headers,
      };

      for (const k in requestHeaders) {
        xhr.setRequestHeader(k, requestHeaders[k]);
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);

            this.setToken(data);

            resolve(data);
          } else {
            const error = new Error(xhr.statusText || 'Failed to get token');
            console.error('Failed to get token:', error);
            reject(error);
          }
          return;
        }
      };

      const requestBody = JSON.stringify(body);
      xhr.send(requestBody);
    });
  }

  request({method, path, headers, body}: any) {
    return new Promise(async (resolve, reject) => {
      const token = this.accessToken;
      if (!token) {
        reject(new Error('No access token found, please log in first'));
        return;
      }

      const requestHeaders = {
        ...this.headers,
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
        ...headers,
      };

      const url = new URL(path, this.baseURL);

      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      for (const k in requestHeaders) {
        xhr.setRequestHeader(k, requestHeaders[k]);
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 401) {
            // Token is invalid, try to refresh it
            this.refresh()
              .then(token => {
                this.request({method, path, headers, body})
                  .then(resolve)
                  .catch(reject);
              })
              .catch(() => {
                const error = new Error(
                  'Failed to refresh token, please log in again'
                );
                console.error('Failed to refresh token:', error);
                reject(error);
              });
          } else if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } else {
            const error = new Error(
              xhr.statusText || `Request failed with status ${xhr.status}`
            );
            console.error(error.message);
            reject(error);
          }
        }
      };

      const requestBody = JSON.stringify(body);
      xhr.send(requestBody);
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

const baseURL = 'http://localhost:8080';

const httpClient = new HttpClient({
  base: baseURL,
  getToken: '/token',
});

async function getToken() {
  const token = await httpClient.getToken('/login', {
    username: 'admin',
    password: 'admin',
  }) as any;

  // await httpClient.refresh().then(token => {
  //   console.log('token:', token);
  // });

  await httpClient
    .post('/logout', {
      token: token.refreshToken,
    })
    .then(token => {
      console.log('token:', token);
    });
}

getToken(); //?
