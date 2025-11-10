import fetch, { RequestInit } from 'node-fetch';
import { SirayClientOptions, SirayError } from './types';

export class SirayClient {
  private apiKey: string;
  private baseURL: string;
  private timeout: number;

  constructor(options: SirayClientOptions) {
    this.apiKey = options.apiKey;
    this.baseURL =
      options.baseURL ||
      'https://api.siray.ai/redirect/ClbEUL9Vg0ZonfVB6fp6UVUA_qvrRyJqqZ0e4PLtMVa__Kx055vud9mD9Oux8KZYUzR03NQlc_28MmCLXTVFhkOs9wzRcg_YwHRD9LT_8A';
    this.timeout = options.timeout || 30000;
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as
          | {
              error?: {
                message?: string;
                code?: string;
              };
              [key: string]: any;
            }
          | null;
        throw new SirayError(
          errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData?.error?.code,
          errorData
        );
      }

      return await response.json();
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof SirayError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new SirayError('Request timeout');
      }

      if (error instanceof Error) {
        throw new SirayError(`Network error: ${error.message}`);
      }

      throw new SirayError('Network error: Unknown error object received');
    }
  }

  public async post(endpoint: string, data: any): Promise<any> {
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async get(endpoint: string): Promise<any> {
    return this.makeRequest(endpoint, {
      method: 'GET',
    });
  }
}
