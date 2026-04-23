'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import styles from './page.module.css';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PRESET_AVATARS = [
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Max',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Maya',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Jack',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe',
];

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const [fullName, setFullName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            setFullName(user.user_metadata?.full_name || '');
            setSelectedAvatar(user.user_metadata?.avatar_url || PRESET_AVATARS[0]);
        }
    }, [user]);

    if (authLoading) {
        return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 className="animate-spin" size={40} color="#e50914" />
        </div>;
    }

    if (!user) {
        router.push('/');
        return null;
    }

    const handleSave = async () => {
        setIsSaving(true);
        setShowSuccess(false);

        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    avatar_url: selectedAvatar
                }
            });

            if (error) throw error;
            
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            
            // Refresh page to update navbar etc
            window.location.reload();
        } catch (err) {
            console.error('Failed to update profile:', err);
            alert('Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Account Settings</h1>

            <div className={styles.profileCard}>
                {showSuccess && (
                    <div className={styles.successMsg}>
                        <CheckCircle2 size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                        Profile updated successfully!
                    </div>
                )}

                <div className={styles.section}>
                    <span className={styles.sectionTitle}>Choose your Avatar</span>
                    <div className={styles.avatarGrid}>
                        {PRESET_AVATARS.map((url) => (
                            <div 
                                key={url} 
                                className={`${styles.avatarItem} ${selectedAvatar === url ? styles.avatarActive : ''}`}
                                onClick={() => setSelectedAvatar(url)}
                            >
                                <Image 
                                    src={url} 
                                    alt="Avatar" 
                                    fill 
                                    unoptimized
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Display Name</label>
                        <input 
                            type="text" 
                            className={styles.input} 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Your name"
                        />
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email Address</label>
                        <input 
                            type="text" 
                            className={styles.input} 
                            value={user.email} 
                            disabled 
                            style={{ opacity: 0.6, cursor: 'not-allowed' }}
                        />
                    </div>
                </div>

                <button 
                    className={styles.saveBtn} 
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : 'Save Changes'}
                </button>
            </div>
        </main>
    );
}
