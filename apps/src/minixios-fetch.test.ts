import HttpClient, { Config } from './minixios-fetch';

// Mock fetch function for testing purposes
const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

// Sample config for testing
const config: Config = {
  baseURL: 'https://api.example.com',
};

describe('HttpClient', () => {
  let httpClient: HttpClient;

  beforeEach(() => {
    // Create a new instance of HttpClient before each test
    httpClient = new HttpClient(config);
  });

  afterEach(() => {
    // Reset mock fetch function after each test
    mockFetch.mockClear();
  });

  describe('request method', () => {
    it('should make a GET request with default configuration', async () => {
      mockFetch.mockResolvedValueOnce({ json: async () => ({ data: 'response' }) });

      const response = await httpClient.request('/endpoint');

      expect(response).toEqual({ data: 'response' });
      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/endpoint', {
        headers: {},
        method: 'GET',
        body: null,
      });
    });

    it('should make a POST request with provided body and headers', async () => {
      mockFetch.mockResolvedValueOnce({ json: async () => ({ data: 'response' }) });

      const requestBody = { key: 'value' };
      const requestHeaders = { 'Content-Type': 'application/json' };
      const response = await httpClient.request('/endpoint', {
        method: 'POST',
        body: requestBody,
        headers: requestHeaders,
      });

      expect(response).toEqual({ data: 'response' });
      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/endpoint', {
        headers: requestHeaders,
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
    });

    // Add more test cases to cover other scenarios
  });

  // Add more describe blocks for other methods like get, post, put, etc.
});

