import axios, { AxiosInstance, AxiosError } from 'axios';

const BASE_URL = 'https://api.gong.io/v2';

export const createGongClient = (accessKey: string, secretKey: string): AxiosInstance => {
  const authToken = Buffer.from(`${accessKey}:${secretKey}`).toString('base64');

  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'Authorization': `Basic ${authToken}`,
      'Content-Type': 'application/json'
    }
  });
};

export const makeGongRequest = async <T>(
  client: AxiosInstance,
  method: 'get' | 'post',
  endpoint: string,
  data?: any
): Promise<T> => {
  try {
    const response = await client[method](endpoint, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      throw new Error(`Rate limited. Retry after ${retryAfter} seconds`);
    }
    if (axios.isAxiosError(error)) {
      throw new Error(`Gong API error: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
};