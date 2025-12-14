
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbiutzyaxkqhqkxdciuf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZmJ0enhja2FzamFwcHZkaWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NjE0NzAsImV4cCI6MjA3OTAzNzQ3MH0.TIgWhKm6S5OSIcxFMWYCX64nYjNPx3fz3LDZD5RKmS8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugToken() {
    console.log('Authenticating...');
    const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
        email: 'hamilton@softham.com.br',
        password: '704407',
    });

    if (authError) {
        console.error('Authentication failed:', authError.message);
        return;
    }

    const token = session.access_token;
    console.log('Token length:', token.length);

    // Decode JWT (middle part)
    const parts = token.split('.');
    if (parts.length !== 3) {
        console.error('Invalid JWT format');
        return;
    }

    const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
    const data = JSON.parse(payload);

    console.log('User ID from Token:', data.sub);
    console.log('Email from Token:', data.email);
    console.log('Metadata keys:', Object.keys(data.user_metadata || {}));

    if (data.user_metadata) {
        for (const [key, value] of Object.entries(data.user_metadata)) {
            const len = JSON.stringify(value).length;
            if (len > 100) {
                console.log(`Key '${key}' size: ${len} bytes`);
                if (key === 'avatar_url' || key === 'avatarUrl') {
                    console.log('Avatar URL start:', JSON.stringify(value).substring(0, 50));
                }
            }
        }
    }
}

debugToken();
