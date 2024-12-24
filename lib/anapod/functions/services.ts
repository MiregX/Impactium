import { Anapod } from '../index';

export namespace Services {
  export async function Services(): Promise<Anapod.Overall[]> {
    try {
      const response = await fetch(`${Anapod.Internal.url}/services`);
  
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
