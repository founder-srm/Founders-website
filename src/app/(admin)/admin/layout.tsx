import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AdminLayout({children}: {children: React.ReactNode}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        return null;
    }
    const { count, error } = await supabase
      .from('adminuseraccount')
      .select('*', { count: 'exact' })
      .eq('user_id', user?.id);

    if (!count || count === 0){
        redirect('/');
    }
    
    if (error) {
        console.error(error);
    }
    return(
        <Suspense fallback={<div>Loading...</div>}>
            {children}
        </Suspense>
    )
}