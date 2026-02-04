import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data } = await supabase.from('books').select('id').limit(1)

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
