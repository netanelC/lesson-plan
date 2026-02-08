import axios from 'axios';

export const api = axios.create({
  // Since we set up the proxy in vite.config.ts, 
  // we just use /api as the base.
  baseURL: '/api',
});