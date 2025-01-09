import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useAdminCheck = () => {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function checkAdminStatus() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                
                if (!user) {
                    router.push('/auth/login');
                    return;
                }

                const { data: adminUser, error } = await supabase
                    .from('adminuseraccount')
                    .select('user_role')
                    .eq('user_id', user.id)
                    .single();

                if (error || !adminUser || adminUser.user_role === 'user') {
                    router.push('/');
                    return;
                }
            } catch (error) {
                console.error('Admin check error:', error);
                router.push('/');
            } finally {
                setIsLoading(false);
            }
        }

        checkAdminStatus();
    }, [router, supabase]);

    return { isLoading };
};
