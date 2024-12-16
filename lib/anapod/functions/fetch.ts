import { Anapod } from '../index';

export namespace Fetch {
  export interface Params {
    filter?: string;
    skip?: number;
    limit?: number;
  }

  export async function Fetch({ limit = Anapod.Internal.defaultLimit, filter, skip }: Params = {}): Promise<Anapod.Log[]> {
    const normalized: Record<string, string> = {
      limit: limit.toString(),
      skip: (skip ||  0).toString()
    };

    if (filter) {
      normalized.filter = filter;
    }

    const query = new URLSearchParams(normalized);

    try {
      const response = await fetch(
        `${Anapod.Internal.url}/logs?${query}`
      );
  
      if (!response.ok) {
        return [];
      }
  
      const { data } = await response.json();
  
      return data;
    } catch (error) {
      return [];
    }
  }
}
