import { redirect } from "next/navigation";

type Key = 'team' | 'tournament'

export async function UseIndent<T>(params: any, key: Key): Promise<{ indent: string, result: T }> {
  const indent = !params.indent.startsWith('%40')
    ? redirect(`/${key}/@${params.indent}`)
    : params.indent.replace('%40', '@');

  const result = await get(`/api/${key}/get/${indent.replace('@', '')}`, {
    method: 'GET',
    cache: 'no-cache'
  }) || redirect(`/${key}s`);

  return { result, indent };
}
