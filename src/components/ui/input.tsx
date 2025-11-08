import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, style, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground h-12 w-full min-w-0 border-4 bg-white px-4 py-2 text-base font-medium outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-bold disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:translate-x-[-2px] focus-visible:translate-y-[-2px] transition-all",
        "aria-invalid:border-destructive",
        className
      )}
      style={{
        ...style,
        borderColor: 'var(--neo-border)',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'var(--neo-border)';
        e.currentTarget.style.boxShadow = '4px 4px 0px 0px var(--shadow-color)';
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        props.onBlur?.(e);
      }}
      {...props}
    />
  )
}

export { Input }
