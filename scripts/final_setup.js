
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbiutzyaxkqhqkxdciuf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZmJ0enhja2FzamFwcHZkaWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NjE0NzAsImV4cCI6MjA3OTAzNzQ3MH0.TIgWhKm6S5OSIcxFMWYCX64nYjNPx3fz3LDZD5RKmS8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function finalSetup() {
    console.log('Creating user...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'hamilton@softham.com.br',
        password: '704407',
        options: {
            data: {
                display_name: 'Hamilton', // This goes to metadata
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

    console.log('User ID:', userId);

    // Wait for trigger to create profile
    console.log('Waiting for profile creation...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Checking profile...');
    const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

    if (fetchError) {
        console.error('Error fetching profile:', fetchError.message);
    }

    if (profile) {
        console.log('Profile exists. Updating...');
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
            console.log('Profile updated successfully:', updateData);
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
            console.log('Profile inserted successfully:', insertData);
        }
    }
}

finalSetup();
