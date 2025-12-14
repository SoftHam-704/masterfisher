
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbiutzyaxkqhqkxdciuf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZmJ0enhja2FzamFwcHZkaWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NjE0NzAsImV4cCI6MjA3OTAzNzQ3MH0.TIgWhKm6S5OSIcxFMWYCX64nYjNPx3fz3LDZD5RKmS8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAndInspect() {
    const email = 'hamilton.final@softham.com.br';
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

    console.log('Fetching profile to inspect schema...');
    const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

    if (fetchError) {
        console.error('Error fetching profile:', fetchError.message);
    }

    if (profile) {
        console.log('Profile found. Keys:', Object.keys(profile));

        // Determine correct column name
        const hasDisplayName = 'display_name' in profile;
        const hasFullName = 'full_name' in profile;

        console.log(`Has display_name: ${hasDisplayName}`);
        console.log(`Has full_name: ${hasFullName}`);

        const updates = {
            phone: '67 99607-8885',
            updated_at: new Date(),
        };

        if (hasDisplayName) updates.display_name = 'Hamilton';
        if (hasFullName) updates.full_name = 'Hamilton';

        console.log('Updating profile with:', updates);

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
    } else {
        console.log('Profile does not exist. Inserting...');
        // Try to insert with minimal fields first if we don't know schema
        // But since we can't inspect schema without data, we have to guess.
        // We'll try to insert with display_name and full_name

        const insertDataPayload = {
            id: userId,
            phone: '67 99607-8885',
            updated_at: new Date(),
            display_name: 'Hamilton',
            full_name: 'Hamilton'
        };

        console.log('Inserting:', insertDataPayload);

        const { data: insertData, error: insertError } = await supabase
            .from('profiles')
            .insert(insertDataPayload)
            .select();

        if (insertError) {
            console.error('Error inserting profile:', insertError.message);
        } else {
            console.log('Profile inserted successfully:', insertData);
        }
    }
}

createAndInspect();
