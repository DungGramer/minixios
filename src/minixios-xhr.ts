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
    } else {
      this.baseURL = baseURL.base;
      this.refreshURL = baseURL.refreshToken;
      this.tokenURL = baseURL.getToken;
    }
  }

  setAccessToken(token: HttpClient['accessToken']) {
    if (!token) return;
    this.accessToken = token;
  }

  setRefreshToken(token: HttpClient['refreshToken']) {
    if (!token) return;
    this.refreshToken = token;
  }

  refresh(refreshURL?: HttpClient['refreshURL'], headers?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.refreshToken) return null;
      if (this.refreshPromise) return this.refreshPromise;

      const url = new URL(refreshURL || this.refreshURL || '', this.baseURL);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.setRequestHeader('Content-Type', 'application/json');
      for (let k in headers) {
        xhr.setRequestHeader(k, headers[k]);
      }
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            this.setAccessToken(data.accessToken);
            this.setRefreshToken(data.refreshToken);
            resolve(data.accessToken);
          } else {
            const error = new Error(
              xhr.statusText || 'Failed to refresh token'
            );
            console.error('Failed to refresh token:', error);
            reject(error);
          }
        }
      };
      const requestBody = JSON.stringify({refreshToken: this.refreshToken});
      xhr.send(requestBody);

      return;
    });
  }

  getToken(tokenURL?: HttpClient['tokenURL'], headers?: any) {
    return new Promise(async (resolve, reject) => {
      if (!this.accessToken) {
        resolve(null);
        return;
      }

      const token = this.accessToken;
      const url = new URL(tokenURL || this.tokenURL || '', this.baseURL);

      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      for (let k in headers) {
        xhr.setRequestHeader(k, headers[k]);
      }
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 401) {
            // Token is invalid, try to refresh it
            this.refresh()
              .then(token => {
                resolve(token);
              })
              .catch(() => {
                const error = new Error(
                  'Failed to refresh token, please log in again'
                );
                console.error('Failed to refresh token:', error);
                reject(error);
              });
          } else if (xhr.status === 200) {
            resolve(token);
          } else {
            const error = new Error(
              xhr.statusText || `Request failed with status ${xhr.status}`
            );
            console.error(error.message);
            reject(error);
          }
        }
      };
      xhr.send();
    });
  }

  request({method, path, headers, body}: any) {
    return new Promise(async (resolve, reject) => {
      const token = await this.getToken();

      const requestHeaders = {
        'Content-Type': headers?.contentType || 'application/json',
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
        ...headers,
      };

      const url = new URL(path, this.baseURL);

      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      for (let k in requestHeaders) {
        xhr.setRequestHeader(k, requestHeaders[k]);
      }
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 401) {
            const error = new Error('Invalid token, please log in again');
            console.error(error.message);
            reject(error);
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
