
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbiutzyaxkqhqkxdciuf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZmJ0enhja2FzamFwcHZkaWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NjE0NzAsImV4cCI6MjA3OTAzNzQ3MH0.TIgWhKm6S5OSIcxFMWYCX64nYjNPx3fz3LDZD5RKmS8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function recreateAndUpdate() {
    console.log('Creating user...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'hamilton@softham.com.br',
        password: '704407',
        options: {
            data: {
                display_name: 'Hamilton',
            }
        }
    });

    if (signUpError) {
        console.error('Error creating user:', signUpError.message);
        return;
    }

    console.log('User created:', signUpData.user?.email);
    const userId = signUpData.user?.id;

    if (!userId) {
        console.error('No user ID returned');
        return;
    }

    // Wait a bit for the trigger to create the profile row (if any)
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Updating profile for user:', userId);

    const updates = {
        display_name: 'Hamilton',
        phone: '67 99607-8885',
        updated_at: new Date(),
    };

    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select();

    if (error) {
        console.error('Error updating profile:', error.message);
    } else {
        console.log('Profile updated successfully:', data);
    }
}

recreateAndUpdate();
