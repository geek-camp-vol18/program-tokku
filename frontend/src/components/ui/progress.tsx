"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      // 土台: うすいミント系
      "relative h-2.5 w-full overflow-hidden rounded-full bg-[#E7F6EF]",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      // 本体: 左が緑〜右が黄色のグラデ
      className="h-full w-full flex-1 transition-all"
      style={{
        transform: `translateX(-${100 - (value || 0)}%)`,
        background:
          "linear-gradient(90deg, #32C58D 0%, #6AD68C 40%, #F7CF4A 100%)",
      }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };