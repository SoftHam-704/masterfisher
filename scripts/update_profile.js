
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbiutzyaxkqhqkxdciuf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZmJ0enhja2FzamFwcHZkaWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NjE0NzAsImV4cCI6MjA3OTAzNzQ3MH0.TIgWhKm6S5OSIcxFMWYCX64nYjNPx3fz3LDZD5RKmS8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateProfile() {
    console.log('Authenticating...');
    const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
        email: 'hamilton@softham.com.br',
        password: '704407',
    });

    if (authError) {
        console.error('Authentication failed:', authError.message);
        return;
    }

    if (!session) {
        console.error('No session created');
        return;
    }

    console.log('Authenticated as:', session.user.email);
    const userId = session.user.id;
    const accessToken = session.access_token;

    console.log('Token length:', accessToken.length);

    // Inspect metadata
    const metadata = session.user.user_metadata;
    console.log('Metadata keys:', Object.keys(metadata));

    // Check for large values
    for (const [key, value] of Object.entries(metadata)) {
        const len = JSON.stringify(value).length;
        if (len > 1000) {
            console.log(`Key '${key}' is huge: ${len} bytes`);
        }
    }

    // Clean up metadata if needed
    if (accessToken.length > 4000) {
        console.log('Token is too large. Cleaning up metadata...');

        // Create a clean metadata object, keeping only essential fields
        // Assuming 'display_name' is essential. Remove 'avatar_url' if it's huge.
        const cleanMetadata = {
            display_name: metadata.display_name || 'Hamilton',
            // Reset avatar_url if it was the culprit (likely base64)
            avatar_url: null
        };

        const { data: userUpdateData, error: userUpdateError } = await supabase.auth.updateUser({
            data: cleanMetadata
        });

        if (userUpdateError) {
            console.error('Error cleaning metadata:', userUpdateError.message);
            return;
        }

        console.log('Metadata cleaned. New metadata:', userUpdateData.user.user_metadata);

        // We might need to refresh the session to get a new smaller token?
        // updateUser returns the updated user, but maybe not a new session immediately usable if we use the old client?
        // Actually, supabase client should update its internal session.

        // Let's try to update the profile now using the client (which should have the new token if it auto-refreshed)
        // Or we might need to sign in again to get a clean token if the current session object is still stale.

        console.log('Re-authenticating to get fresh token...');
        const { data: { session: newSession }, error: reAuthError } = await supabase.auth.signInWithPassword({
            email: 'hamilton@softham.com.br',
            password: '704407',
        });

        if (reAuthError) {
            console.error('Re-authentication failed:', reAuthError.message);
            return;
        }

        console.log('New token length:', newSession.access_token.length);

        // Now update the profile table
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

    } else {
        // Proceed with update if token was small enough (unlikely given previous error)
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
}

updateProfile();
