export default async function AdminRegistrations({
    params,
  }: { params: Promise<{ slug: string }> }) {
    return(
        <div>
            <h1>Admin Registrations: {(await params).slug}</h1>
        </div>
    );
  }