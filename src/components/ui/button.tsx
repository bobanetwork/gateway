import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/class-merge"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-gray-800 shadow hover:bg-green-400 dark:hover:bg-dark-green-400 disabled:bg-green-300 disabled:text-gray-600",
        select:
          "gap-2 border border-gray-500 text-gray-800 bg-gray-50 dark:text-dark-gray-50 dark:border-dark-gray-200 dark:bg-dark-gray-400",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 disabled:opacity-50",
        outline:
          "border border-input bg-background shadow-sm border-gray-500 dark:border-dark-gray-200 hover:border-gray-600 hover:bg-gray-100 dark:hover:bg-background dark:hover:border-dark-gray-50 dark:md:hover:text-dark-gray-50 hover:text-gray-800 disabled:opacity-50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 disabled:opacity-50",
        ghost: "hover:bg-accent hover:text-gray-800 dark:hover:text-dark-gray-50 hover:bg-gray-100 dark:hover:bg-dark-gray-400 disabled:opacity-50",
        link: "text-primary underline-offset-4 hover:underline disabled:opacity-50",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: 'px-2.5 py-4 text-sm h-9', // 10 16 10 16 | size 14, lh 17.07
        md: 'px-3 py-5 text-base h-9', // 12 24 12 24 | size 14, lh 17.5
        lg: 'px-3.5 py-6 text-lg h-9', // 14 28 14 28  | size 18, lh 25
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
