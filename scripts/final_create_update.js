
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbiutzyaxkqhqkxdciuf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZmJ0enhja2FzamFwcHZkaWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NjE0NzAsImV4cCI6MjA3OTAzNzQ3MH0.TIgWhKm6S5OSIcxFMWYCX64nYjNPx3fz3LDZD5RKmS8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function finalCreateUpdate() {
    const email = 'hamilton.complete@softham.com.br';
    const password = '704407';

    console.log(`Creating user ${email}...`);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                // display_name: 'Hamilton', // Metadata might still use display_name if auth expects it, but profile needs name
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

    console.log('Updating profile...');

    // We know schema has 'name', 'phone', 'bio', 'avatar_url'
    // And NO 'updated_at' (based on previous error)

    const updates = {
        name: 'Hamilton',
        phone: '67 99607-8885',
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

finalCreateUpdate();
