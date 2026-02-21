"use client";

import { X } from "lucide-react";
import { type ReactNode, useEffect, useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";

const OPEN_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const CLOSE_EASE: [number, number, number, number] = [0.4, 0, 1, 1];

export function MobileDrawerShell({
  id,
  title,
  open,
  onOpenChange,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  const titleId = useId();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("keydown", onEscape);
    };
  }, [onOpenChange, open]);

  if (typeof document === "undefined") return null;

  const openTransition = shouldReduceMotion ? { duration: 0 } : { duration: 0.28, ease: OPEN_EASE };
  const closeTransition = shouldReduceMotion ? { duration: 0 } : { duration: 0.22, ease: CLOSE_EASE };

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[9999]">
          <motion.button
            type="button"
            aria-label="Close menu overlay"
            className="absolute inset-0 z-[9999] bg-background/70 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: openTransition }}
            exit={{ opacity: 0, transition: closeTransition }}
          />
          <motion.section
            id={id}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="fixed inset-y-0 right-0 z-[10000] flex h-dvh w-72 max-w-[85vw] flex-col gap-5 border-l border-border bg-card p-4 shadow-xl"
            initial={{ x: shouldReduceMotion ? 0 : "100%" }}
            animate={{ x: 0, transition: openTransition }}
            exit={{ x: shouldReduceMotion ? 0 : "100%", transition: closeTransition }}
          >
            <div className="flex items-center justify-between">
              <h2 id={titleId} className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                {title}
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0"
                aria-label="Close menu"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" aria-hidden />
              </Button>
            </div>

            {children}
          </motion.section>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
