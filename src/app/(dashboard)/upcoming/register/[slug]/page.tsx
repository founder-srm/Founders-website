import { z } from "zod";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import type { eventsInsertType } from "../../../../../../schema.zod";
import { TypeformMultiStep } from "./multistep-typeform";

export default function TypeformPage({ params }: { params: { slug: string } }) {
  const [event, setEvent] = useState<eventsInsertType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    async function fetchEvent() {
      const supabase = createClient();
      const { data, error } = await supabase.from("events").select("*").eq("slug", params.slug).single();
      if (error) {
        setError(error.message);
      } else {
        setEvent(data);
      }
      setLoading(false);
    }
    fetchEvent();
  }, [params.slug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const typeformSchema = z.object({
    // ...detailed structure for each potential form field...
  });
  const parseResult = typeformSchema.safeParse(event?.typeform_config);
  if (!parseResult.success) {
    return <div>Invalid form configuration</div>;
  }

  return (
    <>
      <TypeformMultiStep fields={parseResult.data} />
    </>
  );
}