
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbiutzyaxkqhqkxdciuf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZmJ0enhja2FzamFwcHZkaWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NjE0NzAsImV4cCI6MjA3OTAzNzQ3MH0.TIgWhKm6S5OSIcxFMWYCX64nYjNPx3fz3LDZD5RKmS8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixProfile() {
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
    console.log('Token length:', session.access_token.length);

    // Check if profile exists
    console.log('Checking profile...');
    const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

    if (fetchError) {
        console.error('Error fetching profile:', fetchError.message);
        // If error is schema related, we might be stuck.
    }

    if (profile) {
        console.log('Profile exists:', profile);
        console.log('Updating profile...');

        const { data: updateData, error: updateError } = await supabase
            .from('profiles')
            .update({
                display_name: 'Hamilton',
                phone: '67 99607-8885',
                updated_at: new Date(),
            })
            .eq('id', userId)
            .select();

        if (updateError) {
            console.error('Error updating profile:', updateError.message);
        } else {
            console.log('Profile updated:', updateData);
        }

    } else {
        console.log('Profile does not exist. Inserting...');

        const { data: insertData, error: insertError } = await supabase
            .from('profiles')
            .insert({
                id: userId,
                display_name: 'Hamilton',
                phone: '67 99607-8885',
                updated_at: new Date(),
            })
            .select();

        if (insertError) {
            console.error('Error inserting profile:', insertError.message);
        } else {
            console.log('Profile inserted:', insertData);
        }
    }
}

fixProfile();
