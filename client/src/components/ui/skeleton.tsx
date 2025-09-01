// import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={className ? `skeleton-root ${className}` : "skeleton-root"}
      {...props}
    />
  )
}

export { Skeleton }
