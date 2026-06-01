import supabase from './lib/supabaseClient.js'

async function test() {
  const { data, error } = await supabase
    .from('asset_categories')
    .select('*')

  console.log('DATA:', data)
  console.log('ERROR:', error)
}

test()
