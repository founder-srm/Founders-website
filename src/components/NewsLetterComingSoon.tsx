"use client";
import { Button } from "./ui/button"
import { useToast } from '@/hooks/use-toast';

const NewsLetterComingSoon = () => {

    const { toast } = useToast();

  return (
    <div>
      <Button
        variant={"default"}
        size={"lg"}
        onClick={() =>
          toast({
            title: "We\'re working on it!",
            description: "Hang on tight",
          })
        }
      >
        Subscribe to our Newsletter
      </Button>
    </div>
  )
}
export default NewsLetterComingSoon