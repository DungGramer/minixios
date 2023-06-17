import HttpClient from './minixios-fetch';

const baseURL = 'http://localhost:8080';

const httpClient = new HttpClient({
  base: baseURL,
  getToken: '/token',
});

async function getToken() {
  const token = await httpClient.post('/login', {
    username: 'admin',
    password: 'admin',
  });
  httpClient.setAccessToken(token.accessToken);
  httpClient.setRefreshToken(token.refreshToken);
}

getToken();
