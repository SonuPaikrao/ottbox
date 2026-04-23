import React from 'react';
import styles from '@/app/page.module.css';

export const metadata = {
    title: 'Terms of Service - OTT Box',
};

export default function TermsPage() {
    return (
        <main className={styles.main}>
            <div className="container" style={{ paddingTop: '120px', paddingBottom: '100px', maxWidth: '800px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '30px' }}>Terms of Service</h1>
                <div style={{ color: '#ccc', lineHeight: '1.8', fontSize: '1.1rem' }}>
                    <p style={{ marginBottom: '20px' }}>By using OTT Box, you agree to the following terms and conditions.</p>
                    
                    <h2 style={{ color: 'white', marginTop: '40px', marginBottom: '15px' }}>1. Usage License</h2>
                    <p style={{ marginBottom: '20px' }}>OTT Box provides a platform for streaming content. Users are responsible for complying with local laws regarding content viewing and digital rights.</p>
                    
                    <h2 style={{ color: 'white', marginTop: '40px', marginBottom: '15px' }}>2. User Accounts</h2>
                    <p style={{ marginBottom: '20px' }}>You are responsible for maintaining the security of your account and for all activities that occur under your credentials.</p>
                    
                    <h2 style={{ color: 'white', marginTop: '40px', marginBottom: '15px' }}>3. Service Availability</h2>
                    <p style={{ marginBottom: '20px' }}>While we strive for 100% uptime, we do not guarantee uninterrupted service and reserve the right to modify or discontinue features at any time.</p>
                </div>
            </div>
        </main>
    );
}
