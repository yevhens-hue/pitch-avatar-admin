const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: p } = await supabase.from('presenters').select('*').limit(1);
  console.log('Presenters:', p);
  const { data: s } = await supabase.from('listener_seats').select('*').limit(1);
  console.log('Listener Seats:', s);
  const { data: u } = await supabase.auth.admin.listUsers();
  console.log('Auth users count:', u?.users?.length);
}
check();
