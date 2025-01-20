import React, { useState, useCallback, useEffect } from "react";
import { Button, ButtonProps } from "@/components/ui/button";

interface RateLimitedButtonProps extends ButtonProps {
  onRateLimitedClick: () => void | Promise<void>;
  cooldownMs?: number;
}

const RateLimitedButton = React.forwardRef<HTMLButtonElement, RateLimitedButtonProps>(
  (
    {
      onRateLimitedClick,
      cooldownMs = 2000, // Default 2 second cooldown
      children,
      disabled = false,
      ...buttonProps
    },
    ref
  ) => {
    const [isInCooldown, setIsInCooldown] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);

    useEffect(() => {
      return () => {
        setIsInCooldown(false);
        setRemainingTime(0);
      };
    }, []);

    const handleClick = useCallback(async () => {
      if (isInCooldown || disabled) return;

      try {
        setIsInCooldown(true);
        await onRateLimitedClick();

        const startTime = Date.now();
        const countdownInterval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const remaining = cooldownMs - elapsed;

          if (remaining <= 0) {
            setIsInCooldown(false);
            setRemainingTime(0);
            clearInterval(countdownInterval);
          } else {
            setRemainingTime(Math.ceil(remaining / 1000));
          }
        }, 100);

        setTimeout(() => {
          clearInterval(countdownInterval);
          setIsInCooldown(false);
          setRemainingTime(0);
        }, cooldownMs);
      } catch (error) {
        console.error("Error in button click handler:", error);
        setIsInCooldown(false);
        setRemainingTime(0);
      }
    }, [onRateLimitedClick, cooldownMs, isInCooldown, disabled]);

    return (
      <Button {...buttonProps} ref={ref} onClick={handleClick} disabled={isInCooldown || disabled}>
        {children}
        {isInCooldown && remainingTime > 0 && ` (${remainingTime}s)`}
      </Button>
    );
  }
);

RateLimitedButton.displayName = "RateLimitedButton";

export default RateLimitedButton;
