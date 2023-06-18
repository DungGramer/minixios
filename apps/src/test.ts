// import HttpClient from './minixios-xhr';

// const baseURL = 'http://localhost:8080';

// const httpClient = new HttpClient({
//   base: baseURL,
//   getToken: '/token',
// });

// async function getToken() {
//   const token: {
//     accessToken: string;
//     refreshToken: string;
//   } = await httpClient.post('/login', {
//     username: 'admin',
//     password: 'admin',
//   });
//   httpClient.setAccessToken(token.accessToken);
//   httpClient.setRefreshToken(token.refreshToken);

//   // await httpClient.refresh().then(token => {
//   //   console.log('token:', token);
//   // });

//   await httpClient
//     .post('/logout', {
//       token: token.refreshToken,
//     })
//     .then(token => {
//       console.log('token:', token);
//     });
// }

// getToken();

const xhr = new XMLHttpRequest();

xhr.open('POST', 'http://localhost:8080/login');

xhr.setRequestHeader('Content-Type', 'application/json');
xhr.setRequestHeader('Accept', 'application/json');
xhr.setRequestHeader('Access-Control-Allow-Origin', '*');

xhr.send(JSON.stringify({username: 'admin', password: 'admin'}));

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      console.log('response:', xhr.response);
    }
  }
}

xhr.onerror = function() {
  console.error('error:', xhr.statusText);
}

xhr.onload = function() {
  console.log('load:', xhr.response);
}

xhr.onprogress = function(event) {
  console.log('progress:', event);
}

xhr.onabort = function() {
  console.log('abort:', xhr.statusText);
}

xhr.ontimeout = function() {
  console.log('timeout:', xhr.statusText);
}

xhr.onloadend = function() {
  console.log('loadend:', xhr.statusText);
}

xhr.onloadstart = function() {
  console.log('loadstart:', xhr.statusText);
}
