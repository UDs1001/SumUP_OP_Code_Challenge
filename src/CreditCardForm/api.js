import { fetchRetry } from '../services/ApiService';

const cardSchemesApi = (url, options, retries) => fetchRetry(url, options, retries);

export { cardSchemesApi };