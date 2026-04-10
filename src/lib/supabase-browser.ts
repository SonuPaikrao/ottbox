import { createBrowserClient } from '@supabase/ssr';

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
    if (browserClient) {
        return browserClient;
    }

    browserClient = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    if (typeof document === 'undefined') return '';
                    const value = document.cookie
                        .match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')
                        ?.pop() || '';
                    return value;
                },
                set(name: string, value: string, options: any) {
                    if (typeof document === 'undefined') return;
                    const cookieOptions = [
                        `${name}=${value}`,
                        'path=/',
                        `max-age=${options.maxAge || 3600}`,
                        'SameSite=Lax',
                    ];
                    if (options.domain) cookieOptions.push(`domain=${options.domain}`);
                    if (options.secure) cookieOptions.push('secure');
                    document.cookie = cookieOptions.join('; ');
                },
                remove(name: string, options: any) {
                    if (typeof document === 'undefined') return;
                    document.cookie = `${name}=; path=/; max-age=0`;
                }
            }
        }
    );

    return browserClient;
}
