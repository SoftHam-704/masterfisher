
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbiutzyaxkqhqkxdciuf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZmJ0enhja2FzamFwcHZkaWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NjE0NzAsImV4cCI6MjA3OTAzNzQ3MH0.TIgWhKm6S5OSIcxFMWYCX64nYjNPx3fz3LDZD5RKmS8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectCleanProfile() {
    console.log('Authenticating...');
    const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
        email: 'hamilton.new@softham.com.br',
        password: '704407',
    });

    if (authError) {
        console.error('Authentication failed:', authError.message);
        return;
    }

    const userId = session.user.id;
    console.log('User ID:', userId);

    console.log('Fetching profile...');
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

    if (error) {
        console.error('Error fetching profile:', error.message);
        return;
    }

    if (data) {
        console.log('Profile found:', data);
        console.log('Columns:', Object.keys(data));
    } else {
        console.log('No profile found for this user.');
    }
}

inspectCleanProfile();
