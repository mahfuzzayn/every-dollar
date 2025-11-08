import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold border-4 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none transition-transform",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-gray-800",
        destructive:
          "bg-destructive text-white hover:bg-red-600",
        outline:
          "bg-white text-black hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-yellow-300",
        ghost:
          "bg-transparent border-transparent hover:bg-accent hover:text-accent-foreground shadow-none",
        link: "text-black underline-offset-4 hover:underline border-0 shadow-none",
      },
      size: {
        default: "h-12 px-6 py-3 has-[>svg]:px-4",
        sm: "h-10 gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-14 px-8 has-[>svg]:px-6",
        icon: "size-12",
        "icon-sm": "size-10",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  style,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  const isNeoVariant = variant !== "ghost" && variant !== "link"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      style={{
        ...style,
        ...(isNeoVariant && {
          borderColor: 'var(--neo-border)',
          boxShadow: variant === "default" || variant === "destructive" || variant === "outline" || variant === "secondary"
            ? '4px 4px 0px 0px var(--shadow-color)'
            : undefined,
        }),
      }}
      {...props}
    />
  )
}

export { Button, buttonVariants }
