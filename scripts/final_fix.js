
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbiutzyaxkqhqkxdciuf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZmJ0enhja2FzamFwcHZkaWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NjE0NzAsImV4cCI6MjA3OTAzNzQ3MH0.TIgWhKm6S5OSIcxFMWYCX64nYjNPx3fz3LDZD5RKmS8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function finalFix() {
    const email = 'hamilton.final@softham.com.br';
    const password = '704407';

    console.log(`Authenticating as ${email}...`);
    const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (authError) {
        console.error('Authentication failed:', authError.message);
        return;
    }

    const userId = session.user.id;
    console.log('User ID:', userId);

    console.log('Updating profile with correct schema...');
    const updates = {
        name: 'Hamilton',
        phone: '67 99607-8885',
        // updated_at removed as it's not in schema
    };

    const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select();

    if (updateError) {
        console.error('Error updating profile:', updateError.message);
    } else {
        console.log('Profile updated successfully:', updateData);
    }
}

finalFix();
