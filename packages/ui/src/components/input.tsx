import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@albatroaz/ui/lib/utils"

const inputVariants = cva(
  "w-full min-w-0 rounded-md border border-input bg-input/20 px-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 file:inline-flex file:border-0 file:bg-transparent file:font-medium file:text-foreground",
  {
    variants: {
      size: {
        default:
          "h-7 py-0.5 text-sm file:h-6 file:text-xs/relaxed md:text-xs/relaxed",
        sm: "h-6 py-0.5 text-xs file:h-5 file:text-xs",
        lg: "h-8 py-1 text-sm file:h-7 file:text-sm",
        xl: "h-12 rounded-lg border-0 bg-muted px-4 py-2 text-sm focus-visible:border-0 dark:bg-muted/70 file:h-10 file:text-sm",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Input({
  className,
  type,
  size,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }
