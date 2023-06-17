/* class HttpClient {
  constructor(baseUrl, headers) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.headers = headers || {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    this.xhr = new XMLHttpRequest();
    this.requestInterceptors = {
      request: {
        interceptors: [],
        use: function(onFulfilled, onRejected, options) {
          const interceptor = {
            onFulfilled,
            onRejected,
            options,
          };
          this.interceptors.push(interceptor);
          return interceptor;
        },
        eject: function(id) {
          this.interceptors = this.interceptors.filter(int => int.id !== id);
        },
        clear: function() {
          this.interceptors = [];
        }
      }
    };
    this.responseInterceptors = this.requestInterceptors;
  }

  static create(baseUrl, headers) {
    return new HttpClient(baseUrl, headers);
  }

  getXhr() {
    return this.xhr;
  }

  _fetcher(endpoint, options) {
    return new Promise((resolve, reject) => {
      const requestInterceptorChain = this.requestInterceptors.request.interceptors.reduceRight((prev, curr) => {
        return (value) => {
          const result = curr.onFulfilled(value);
          return result ? result : prev(value);
        };
      }, (value) => value);

      const requestConfig = {
        method: options.method,
        url: `${this.baseUrl}${endpoint}`,
        headers: Object.assign({}, this.headers, options.headers || {}),
        body: options.body
      };

      const runRequest = () => {
        this.xhr.open(options.method, `${this.baseUrl}${endpoint}`, true);

        for (const header in { ...this.headers, ...options.headers }) {
          this.xhr.setRequestHeader(header, String(this.headers[header]));
        }
        
        this.xhr.onload = () => {
          const responseInterceptorChain = this.responseInterceptors.response.interceptors.reduceRight((prev, curr) => {
            return (value) => {
              const result = curr.onFulfilled(value);
              return result ? result : prev(value);
            };
          }, (value) => value);

          const response = {
            data: this.xhr.response,
            status: this.xhr.status,
            statusText: this.xhr.statusText,
            headers: this.xhr.headers,
          };

          if (this.xhr.status >= 200 && this.xhr.status < 300) {
            resolve(responseInterceptorChain(response));
          } else {
            reject(this.xhr.statusText);
          }
        };

        this.xhr.onerror = () => {
          reject(this.xhr.statusText);
        };
        this.xhr.send(requestConfig.body);
      }

      const runRequestSync = () => {
        runRequest();
        return requestConfig;
      };

      const runWhenCondition = options.runWhen ? options.runWhen(requestConfig) : true;      
      const value = runWhenCondition ? (options.synchronous ? runRequestSync() : runRequest()) : requestConfig;
      // Apply request interceptors
      return requestInterceptorChain(value);
    });
  }

  // Add interceptors for all requests
  getRequestInterceptors() {
    return this.requestInterceptors.request;
  }

  getResponseInterceptors() {
    return this.responseInterceptors.response;
  }

  onUploadProgress() {
    this.xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        console.log(`${Math.round(percentComplete, 2)}% uploaded`);
      }
    };
  }

  onDownloadProgress() {
    this.xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        console.log(`${Math.round(percentComplete, 2)}% downloaded`);
      }
    };
  }

  get(endpoint, options) {
    return this._fetcher(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  post(endpoint, body, options) {
    return this._fetcher(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body, options) {
    return this._fetcher(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint, options) {
    return this._fetcher(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  patch(endpoint, body, options) {
    return this._fetcher(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }
}

// Create an instance of HttpClient with a base URL and default headers
const client = new HttpClient('http://jsonplaceholder.typicode.com', {
  'Content-Type': 'application/json',
});

// Add a request interceptor that logs the request URL and headers
// client.getRequestInterceptors().use(
//   (config) => {
//     console.log(`Making request to ${config?.url}`);
//     console.log('Request headers:', config?.headers);
//     return config;
//   }
// );

// // Add a response interceptor that logs the response status and data
// client.getResponseInterceptors()?.use(
//   (response) => {
//     console.log(`Received response with status ${response.status}`);
//     console.log('Response data:', response.data);
//     return response;
//   }
// );

// Make a GET request to the /todos endpoint
client.get('/todos')
  .then((data) => console.log('Response data:', data))
  .catch((error) => console.error('Error:', error)); //?

// Make a POST request to the /todos endpoint with a request body
client.post('/todos', { title: 'New Todo', completed: false })
  .then((data) => console.log('Response data:', data))
  .catch((error) => console.error('Error:', error)); //? */