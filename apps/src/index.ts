// import {HTTPHeaders} from './index.d';

// /**
//  *
//  * @example
//  * Generator
//  * let httpClient = new HttpClient('https://jsonplaceholder.typicode.com');
//  * let httpClient = HttpClient.create('https://jsonplaceholder.typicode.com');
//  *
//  * httpClient.get('/posts/1').then(data => console.log(data));
//  * let data = await httpClient.get('/posts/1');
//  */

// interface Interceptors {
//   request: {
//     use: (
//       onFulfilled?: ((value: any) => any | Promise<any>) | null,
//       onRejected?: ((error: any) => any | Promise<any>) | null,
//       options?: {
//         synchronous?: boolean;
//         runWhen?: (config: {headers: HTTPHeaders}) => boolean;
//       }
//     ) => number;
//     eject(id: number): void;
//     clear(): void;
//   };
//   response: Interceptors['request'];
// }

// class HttpClient {
//   baseUrl: string;
//   headers: HTTPHeaders;
//   xhr: XMLHttpRequest;
//   requestInterceptors: Interceptors;

//   constructor(baseUrl: string, headers: HTTPHeaders) {
//     this.baseUrl = baseUrl.replace(/\/$/, '');
//     this.headers = headers || {
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//     };
//     this.xhr = new XMLHttpRequest();

//     this.requestInterceptors = {
//       request: {
//         use: (onFulfilled, onRejected, options) => {
//           return this;
//         }
//       }
//     }
//   }

//   static create(baseUrl: string, headers: HTTPHeaders) {
//     return new HttpClient(baseUrl, headers);
//   }

//   getXhr() {
//     return this.xhr;
//   }

//   _fetcher(endpoint: string, options: any) {
//     return new Promise((resolve, reject) => {
//       this.xhr.open(options.method, `${this.baseUrl}${endpoint}`, true);

//       for (const header in this.headers) {
//         this.xhr.setRequestHeader(header, String(this.headers[header]));
//       }

//       for (const header in options.headers) {
//         this.xhr.setRequestHeader(header, options.headers[header]);
//       }

//       this.xhr.onload = () => {
//         if (this.xhr.status >= 200 && this.xhr.status < 300) {
//           resolve(JSON.parse(this.xhr.response));
//         } else {
//           reject(this.xhr.statusText);
//         }
//       };

//       this.xhr.onerror = () => {
//         reject(this.xhr.statusText);
//       };

//       this.xhr.send(options.body);
//     });
//   }

//   onUploadProgress() {
//     this.xhr.upload.onprogress = event => {
//       if (event.lengthComputable) {
//         const percentComplete = (event.loaded / event.total) * 100;
//         console.log(`${percentComplete | 0}% uploaded`);
//       }
//     };
//   }

//   onDownloadProgress() {
//     this.xhr.onprogress = event => {
//       if (event.lengthComputable) {
//         const percentComplete = (event.loaded / event.total) * 100;
//         console.log(`${percentComplete | 0}% downloaded`);
//       }
//     };
//   }

//   get(endpoint: string, options: any) {
//     return this._fetcher(endpoint, {
//       ...options,
//       method: 'GET',
//     });
//   }

//   post(endpoint: string, body: any, options: any) {
//     return this._fetcher(endpoint, {
//       ...options,
//       method: 'POST',
//       body: JSON.stringify(body),
//     });
//   }

//   put(endpoint: string, body: any, options: any) {
//     return this._fetcher(endpoint, {
//       ...options,
//       method: 'PUT',
//       body: JSON.stringify(body),
//     });
//   }

//   delete(endpoint: string, options: any) {
//     return this._fetcher(endpoint, {
//       ...options,
//       method: 'DELETE',
//     });
//   }

//   patch(endpoint: string, body: any, options: any) {
//     return this._fetcher(endpoint, {
//       ...options,
//       method: 'PATCH',
//       body: JSON.stringify(body),
//     });
//   }
// }

// // function responseHandler(response) {
// //   const config = response.config;
// //   if (config.raw) return response;

// //   if (response.status >= 200 && response.status < 300) {
// //     const data = response.data;
// //     if (!data) throw new Error('No data');
// //     return data;
// //   }
// //   throw new Error(response.statusText);
// // }
// // function responseErrorHandler(response) {
// //   const config = response.config;
// //   if (config.raw) return response;

// //   if (response.status >= 200 && response.status < 300) {
// //     const data = response.data;
// //     if (!data) throw new Error('No data');
// //     return data;
// //   }
// //   throw new Error(response.statusText);
// // }

// let httpClient = HttpClient.create('https://jsonplaceholder.typicode.com');

// // POST and using onDownloadProgress and onUploadProgress
// // httpClient.xhr.upload.onprogress = (event) => {
// //   if (event.lengthComputable) {
// //     const percentComplete = (event.loaded / event.total) * 100;
// //     console.log(`${Math.round(percentComplete, 2)}% uploaded`);
// //   }
// // };
// // let result = httpClient.post('/posts', {
// //   title: 'foo',
// //   body: 'bar',
// //   userId: 99,
// // });
// // httpClient.get('/todos/1');

// export default HttpClient;

// // const http = axios.create({
// //   baseURL: 'https://jsonplaceholder.typicode.com',
// //   headers: {
// //     'Content-Type': 'application/json',
// //   },
// // });
