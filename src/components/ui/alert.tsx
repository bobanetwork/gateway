import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils/class-merge";
import { IconAlertCircle, IconAlertTriangle, IconCircleCheck } from "@tabler/icons-react";

const alertVariants = cva(
  "relative w-full border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "border-0 bg-information-50 text-information-500 dark:bg-dark-information-500 dark:text-dark-information-100",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        info: "border-0 bg-information-50 text-information-500 dark:bg-dark-information-500 dark:text-dark-information-100",
        error: "border-0 bg-red-50 text-red-500 dark:bg-dark-red-500 dark:text-dark-red-300",
        success: "border-0 bg-green-50 text-green-500 dark:bg-dark-green-500 dark:text-dark-green-50",
        warning: "border-0 bg-yellow-50 text-yellow-500 dark:bg-dark-yellow-500 dark:text-dark-yellow-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const alertIcons = {
  success: <IconCircleCheck className="w-6 h-6 mr-2 text-green-500 dark:text-dark-green-50" />,
  error: <IconAlertCircle className="w-6 h-6 mr-2 text-red-500 dark:text-dark-red-300" />,
  warning: <IconAlertTriangle className="w-6 h-6 mr-2 text-yellow-500 dark:text-dark-yellow-50" />,
  info: <IconAlertCircle className="w-6 h-6 mr-2 text-information-500 dark:text-dark-information-100" />,
  default: <IconAlertCircle className="w-6 h-6 mr-2 text-information-500 dark:text-dark-information-100" />
};

const AlertContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
AlertContainer.displayName = "AlertContainer"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

type AlertVariant = 'success' | 'error' | 'warning' | 'info' | 'default';

interface AlertProps {
  className?: string
  variant?: AlertVariant
  title: React.ReactNode
  description?: React.ReactNode
}

const Alert: React.FC<AlertProps> = ({ className, variant = 'default', title, description }) => (
  <AlertContainer className={className} variant={variant}>
    {alertIcons[variant] && alertIcons[variant]}
    {title && <AlertTitle>{title}</AlertTitle>}
    {description && <AlertDescription>{description}</AlertDescription>}
  </AlertContainer>
)
AlertContainer.displayName = "Alert"


export { Alert, AlertContainer, AlertDescription, AlertTitle };

