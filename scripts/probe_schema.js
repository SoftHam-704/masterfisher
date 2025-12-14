
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbiutzyaxkqhqkxdciuf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZmJ0enhja2FzamFwcHZkaWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NjE0NzAsImV4cCI6MjA3OTAzNzQ3MH0.TIgWhKm6S5OSIcxFMWYCX64nYjNPx3fz3LDZD5RKmS8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function probeSchema() {
    console.log('Authenticating...');
    const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
        email: 'hamilton@softham.com.br',
        password: '704407',
    });

    if (authError) {
        console.error('Authentication failed:', authError.message);
        return;
    }

    const userId = session.user.id;
    console.log('User ID:', userId);

    // Probe 1: Try inserting with 'user_id' (assuming schema has user_id column)
    console.log('Probe 1: Inserting { user_id: userId }');
    const { error: error1 } = await supabase
        .from('profiles')
        .insert({ user_id: userId });

    if (error1) {
        console.log('Probe 1 failed:', error1.message);
    } else {
        console.log('Probe 1 success!');
    }

    // Probe 2: Try inserting with 'id' as userId (assuming id is the FK/PK)
    console.log('Probe 2: Inserting { id: userId }');
    const { error: error2 } = await supabase
        .from('profiles')
        .insert({ id: userId });

    if (error2) {
        console.log('Probe 2 failed:', error2.message);
    } else {
        console.log('Probe 2 success!');
    }

    // Probe 3: Try inserting with 'display_name'
    console.log('Probe 3: Inserting { id: userId, display_name: "Test" }');
    const { error: error3 } = await supabase
        .from('profiles')
        .insert({ id: userId, display_name: 'Test' });

    if (error3) {
        console.log('Probe 3 failed:', error3.message);
    } else {
        console.log('Probe 3 success!');
    }
}

probeSchema();
