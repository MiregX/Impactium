import { Anapod } from '../index';

export function Count(filter: string = ""): Promise<number> {
  const params = new URLSearchParams({ filter });

  try {
    const amount = fetch(`${Anapod.Internal.url}/logs/count?${params}`, {
      method: "GET",
    }).then(async (res) => {
      const body = await res.json();

      return body.data;
    });

    return amount;
  } catch (err) {
    return new Promise((resolve) => resolve(0))
  }
}
