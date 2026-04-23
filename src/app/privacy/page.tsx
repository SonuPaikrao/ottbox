import React from 'react';
import styles from '@/app/page.module.css';

export const metadata = {
    title: 'Privacy Policy - OTT Box',
};

export default function PrivacyPage() {
    return (
        <main className={styles.main}>
            <div className="container" style={{ paddingTop: '120px', paddingBottom: '100px', maxWidth: '800px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '30px' }}>Privacy Policy</h1>
                <div style={{ color: '#ccc', lineHeight: '1.8', fontSize: '1.1rem' }}>
                    <p style={{ marginBottom: '20px' }}>At OTT Box, we take your privacy seriously. This policy describes how we collect and use your data.</p>
                    
                    <h2 style={{ color: 'white', marginTop: '40px', marginBottom: '15px' }}>1. Information We Collect</h2>
                    <p style={{ marginBottom: '20px' }}>We only collect essential information needed to provide our streaming service, including your email address for authentication and your watchlist preferences.</p>
                    
                    <h2 style={{ color: 'white', marginTop: '40px', marginBottom: '15px' }}>2. How We Use Data</h2>
                    <p style={{ marginBottom: '20px' }}>Your data is used to personalize your experience, synchronize your watchlist across devices, and improve our content recommendations.</p>
                    
                    <h2 style={{ color: 'white', marginTop: '40px', marginBottom: '15px' }}>3. Data Security</h2>
                    <p style={{ marginBottom: '20px' }}>We use enterprise-grade encryption and secure authentication via Supabase to ensure your account remains protected.</p>
                </div>
            </div>
        </main>
    );
}
