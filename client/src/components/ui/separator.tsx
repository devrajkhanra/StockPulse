import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

// import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={[
        "separator-root",
        orientation === "horizontal" ? "separator-horizontal" : "separator-vertical",
        className || ""
      ].filter(Boolean).join(" ")}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
