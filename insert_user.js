const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function add() {
  const { data, error } = await supabase.from('presenters').insert([{
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    first_name: 'Super',
    last_name: 'Admin PitchAvatar',
    email: 'admin@pitchavatar.com',
  }]);
  console.log('Inserted:', error ? error.message : 'Success');
}
add();
