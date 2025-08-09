"use client"

import { useEffect, useRef } from "react"

interface AdBannerProps {
  slot?: string
  className?: string
}

export default function AdBanner({ slot = "default", className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Adsterra banner script
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.innerHTML = `
      atOptions = {
        'key' : 'a8d0ae92e92f7047c257074e3baf076e',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `

    const script2 = document.createElement("script")
    script2.type = "text/javascript"
    script2.src = "//www.highperformanceformat.com/a8d0ae92e92f7047c257074e3baf076e/invoke.js"

    if (adRef.current) {
      adRef.current.appendChild(script)
      adRef.current.appendChild(script2)
    }

    return () => {
      // Cleanup scripts if needed
    }
  }, [])

  return (
    <div className={`flex justify-center items-center  rounded-lg `}>
      <div ref={adRef} className="min-h-[90px] w-full max-w-[728px] flex items-center justify-center ">
        {/* Fallback content */}
        
      </div>
    </div>
  )
}
