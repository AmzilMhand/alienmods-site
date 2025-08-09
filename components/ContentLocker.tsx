"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Download, Lock, CheckCircle } from "lucide-react"

interface ContentLockerProps {
  downloadUrl: string
  appTitle: string
  children?: React.ReactNode
}

export default function ContentLocker({ downloadUrl, appTitle, children }: ContentLockerProps) {
  const [isLocked, setIsLocked] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load the content locker script
    const script1 = document.createElement("script")
    script1.type = "text/javascript"
    script1.innerHTML = `var wKulR_jNf_auQMWc={"it":4500654,"key":"e0510"};`
    document.head.appendChild(script1)

    const script2 = document.createElement("script")
    script2.src = "https://dfmpe7igjx4jo.cloudfront.net/46c44ea.js"
    script2.onload = () => {
      // Script loaded successfully
    }
    script2.onerror = () => {
      // Fallback if script fails to load
      console.warn("Content locker script failed to load")
    }
    document.head.appendChild(script2)

    // Listen for locker completion (this would be triggered by the actual locker)
    const handleLockerComplete = () => {
      setIsLocked(false)
    }

    // Simulate locker completion for demo (remove in production)
    window.addEventListener("lockerComplete", handleLockerComplete)

    return () => {
      document.head.removeChild(script1)
      document.head.removeChild(script2)
      window.removeEventListener("lockerComplete", handleLockerComplete)
    }
  }, [])

  const handleDownloadClick = () => {
    if (isLocked) {
      setIsLoading(true)
      // Trigger the content locker
      if (typeof window !== "undefined" && (window as any)._HW) {
        ;(window as any)._HW()
      } else {
        // Fallback: simulate completion after 3 seconds for demo
        setTimeout(() => {
          setIsLocked(false)
          setIsLoading(false)
        }, 3000)
      }
    }
  }

  if (!isLocked) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Download unlocked!</span>
        </div>
        <a href={downloadUrl} download className="download-btn w-full">
          <Download className="w-5 h-5" />
          <span>Download {appTitle}</span>
        </a>
        {children}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleDownloadClick}
        disabled={isLoading}
        className={`download-btn w-full ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Downloading...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Download Now</span>
          </>
        )}
      </button>

      {/* <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">How to download:</h4>
        <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>1. Click "Unlock Download" button</li>
          <li>2. Complete one quick offer</li>
          <li>3. Your download will be ready instantly</li>
        </ol>
      </div> */}
    </div>
  )
}
