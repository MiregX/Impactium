import { redirect } from "next/navigation";

type Key = 'team' | 'tournament'

export async function useIndent<T>(params: any, key: Key): Promise<{ indent: string, result: T }> {
  const indent = !params.indent.startsWith('%40')
  ? redirect(`/${key}/@${params.indent}`)
  : params.indent.replace('%40', '@');
  
  const result = await api<T>(`/${key}/get/${indent.replace('@', '')}`, {
    raw: true
  });

  console.log(result);

  return result.isSuccess() ? { result: result.data, indent } : redirect('/');
}
