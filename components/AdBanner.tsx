"use client"

import { useEffect, useRef } from "react"
import { useMediaQuery } from "@/hooks/useMediaQuery"

interface AdBannerProps {
  type: "banner" | "social"
  className?: string
}

export default function AdBanner({ type = "banner", className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    if (type === "banner") {
      // Load Adsterra banner script
      const script = document.createElement("script")
      script.type = "text/javascript"
      
      // Different options for mobile and desktop
      if (isMobile) {
        script.innerHTML = `
          atOptions = {
            'key' : '32e7e5d85d7696594e653caed83b8137',
            'format' : 'iframe',
            'height' : 60,
            'width' : 468,
            'params' : {}
          };
        `
      } else {
        script.innerHTML = `
          atOptions = {
            'key' : 'a8d0ae92e92f7047c257074e3baf076e',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        `
      }

      const script2 = document.createElement("script")
      script2.type = "text/javascript"
      script2.src = isMobile 
        ? "//www.highperformanceformat.com/32e7e5d85d7696594e653caed83b8137/invoke.js"
        : "//www.highperformanceformat.com/a8d0ae92e92f7047c257074e3baf076e/invoke.js"

      if (adRef.current) {
        // Clear previous scripts
        adRef.current.innerHTML = ""
        adRef.current.appendChild(script)
        adRef.current.appendChild(script2)
      }
    } else if (type === "social") {
      // Load social bar script
      const script = document.createElement("script")
      script.type = "text/javascript"
      script.src = "//pl27382845.profitableratecpm.com/64/89/f4/6489f424275f690b940de01174ab867d.js"

      if (adRef.current) {
        adRef.current.innerHTML = ""
        adRef.current.appendChild(script)
      }
    }

    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = ""
      }
    }
  }, [type, isMobile])

  return (
    <div className={`flex justify-center items-center rounded-lg ${className}`}>
      <div 
        ref={adRef} 
        className={`flex items-center justify-center ${
          type === "banner" 
            ? isMobile 
              ? "min-h-[60px] max-w-[390px]" 
              : "min-h-[90px] max-w-[728px]"
            : "w-full"
        }`}
      />
    </div>
  )
}
