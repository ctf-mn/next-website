import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { FlashMessage } from "@ctf-mn/api/types";

export function FlashAlert({ flash }: { flash: FlashMessage | null }) {
  if (!flash) {
    return null;
  }

  const title = flash.type === "success" ? "Success" : flash.type === "error" ? "Error" : "Notice";
  const variant = flash.type === "success" ? "success" : flash.type === "error" ? "destructive" : "info";

  return (
    <Alert variant={variant}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{flash.message}</AlertDescription>
    </Alert>
  );
}
