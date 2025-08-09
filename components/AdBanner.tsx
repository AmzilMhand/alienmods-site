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
        'key' : 'your-adsterra-key-here',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `

    const script2 = document.createElement("script")
    script2.type = "text/javascript"
    script2.src = "//www.topcreativeformat.com/your-adsterra-key-here/invoke.js"

    if (adRef.current) {
      adRef.current.appendChild(script)
      adRef.current.appendChild(script2)
    }

    return () => {
      // Cleanup scripts if needed
    }
  }, [])

  return (
    <div className={`flex justify-center items-center bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}>
      <div ref={adRef} className="min-h-[250px] flex items-center justify-center">
        {/* Fallback content */}
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="w-64 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-sm">Advertisement</span>
          </div>
        </div>
      </div>
    </div>
  )
}
