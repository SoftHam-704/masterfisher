
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbiutzyaxkqhqkxdciuf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZmJ0enhja2FzamFwcHZkaWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NjE0NzAsImV4cCI6MjA3OTAzNzQ3MH0.TIgWhKm6S5OSIcxFMWYCX64nYjNPx3fz3LDZD5RKmS8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createCleanUser() {
    const email = 'hamilton.new@softham.com.br';
    const password = '704407';

    console.log(`Creating user ${email}...`);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
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

    const userId = signUpData.user?.id;
    console.log('User created:', userId);

    if (!userId) {
        console.error('No user ID returned');
        return;
    }

    // Wait for trigger
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Checking profile...');
    const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

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
        // Try inserting with all fields
        const { data: insertData, error: insertError } = await supabase
            .from('profiles')
            .insert({
                id: userId,
                display_name: 'Hamilton',
                full_name: 'Hamilton',
                phone: '67 99607-8885',
                updated_at: new Date(),
            })
            .select();

        if (insertError) {
            console.error('Error inserting profile:', insertError.message);

            // Retry without display_name if that was the issue
            if (insertError.message.includes('display_name')) {
                console.log('Retrying insert without display_name...');
                const { data: retryData, error: retryError } = await supabase
                    .from('profiles')
                    .insert({
                        id: userId,
                        full_name: 'Hamilton',
                        phone: '67 99607-8885',
                        updated_at: new Date(),
                    })
                    .select();

                if (retryError) {
                    console.error('Retry failed:', retryError.message);
                } else {
                    console.log('Profile inserted successfully (retry):', retryData);
                }
            }
        } else {
            console.log('Profile inserted successfully:', insertData);
        }
    }
}

createCleanUser();
