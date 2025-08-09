"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Download, Wand2, Package, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function AIGeneratorPage() {
  const [singleApp, setSingleApp] = useState('')
  const [isModded, setIsModded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [generatedData, setGeneratedData] = useState(null)
  const [popularApps, setPopularApps] = useState([])
  const [selectedApps, setSelectedApps] = useState([])
  const [bulkLoading, setBulkLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const generateSingleApp = async () => {
    if (!singleApp.trim()) {
      toast({
        title: "Error",
        description: "Please enter an app name",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/ai-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          appName: singleApp,
          isModded
        })
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedData(data.appData)
        toast({
          title: "Success",
          description: "App data generated successfully!"
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate app data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const saveGeneratedApp = async () => {
    if (!generatedData) return

    try {
      const response = await fetch('/api/admin/apps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(generatedData)
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "App saved successfully!"
        })
        setGeneratedData(null)
        setSingleApp('')
        router.push('/admin/dashboard')
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save app",
        variant: "destructive"
      })
    }
  }

  const fetchPopularApps = async () => {
    try {
      const response = await fetch('/api/admin/ai-generate?action=popular-apps&limit=50', {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      })

      const data = await response.json()

      if (data.success) {
        setPopularApps(data.apps)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch popular apps",
        variant: "destructive"
      })
    }
  }

  const bulkGenerateApps = async () => {
    if (selectedApps.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one app",
        variant: "destructive"
      })
      return
    }

    setBulkLoading(true)
    try {
      const response = await fetch('/api/admin/ai-generate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          appNames: selectedApps,
          isModded
        })
      })

      const data = await response.json()

      if (data.success) {
        const created = data.results.filter(r => r.status === 'created').length
        const existing = data.results.filter(r => r.status === 'exists').length
        const errors = data.results.filter(r => r.status === 'error').length

        toast({
          title: "Bulk Generation Complete",
          description: `Created: ${created}, Already exists: ${existing}, Errors: ${errors}`
        })
        setSelectedApps([])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate apps",
        variant: "destructive"
      })
    } finally {
      setBulkLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          AI App Generator
        </h1>
        <p className="text-gray-600 mt-2">
          Generate app data automatically using AI or bulk import popular apps
        </p>
      </div>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Single App Generator</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Single App</CardTitle>
              <CardDescription>
                Enter an app name and let AI generate all the details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app-name">App Name</Label>
                <Input
                  id="app-name"
                  placeholder="e.g., WhatsApp, Instagram, PUBG Mobile"
                  value={singleApp}
                  onChange={(e) => setSingleApp(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="modded"
                  checked={isModded}
                  onCheckedChange={setIsModded}
                />
                <Label htmlFor="modded">MOD APK Version</Label>
              </div>

              <Button 
                onClick={generateSingleApp} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate App Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {generatedData && (
            <Card>
              <CardHeader>
                <CardTitle>Generated App Data</CardTitle>
                <CardDescription>
                  Review and save the generated app information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Title</Label>
                    <p className="font-medium">{generatedData.title}</p>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Badge variant="secondary">{generatedData.category}</Badge>
                  </div>
                  <div>
                    <Label>Developer</Label>
                    <p>{generatedData.developer}</p>
                  </div>
                  <div>
                    <Label>Version</Label>
                    <p>{generatedData.version}</p>
                  </div>
                  <div>
                    <Label>Rating</Label>
                    <p>{generatedData.rating}/5</p>
                  </div>
                  <div>
                    <Label>Size</Label>
                    <p>{generatedData.size}</p>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-gray-600">{generatedData.description}</p>
                </div>

                <div>
                  <Label>Features</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {generatedData.features?.map((feature, index) => (
                      <Badge key={index} variant="outline">{feature}</Badge>
                    ))}
                  </div>
                </div>

                {generatedData.modFeatures && (
                  <div>
                    <Label>MOD Features</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {generatedData.modFeatures.map((feature, index) => (
                        <Badge key={index} variant="destructive">{feature}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button onClick={saveGeneratedApp} className="w-full">
                  <Package className="w-4 h-4 mr-2" />
                  Save App to Database
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk App Generator</CardTitle>
              <CardDescription>
                Generate multiple popular apps at once
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="bulk-modded"
                    checked={isModded}
                    onCheckedChange={setIsModded}
                  />
                  <Label htmlFor="bulk-modded">Generate as MOD APKs</Label>
                </div>
                <Button onClick={fetchPopularApps} variant="outline">
                  Load Popular Apps
                </Button>
              </div>

              {popularApps.length > 0 && (
                <div>
                  <Label className="text-base font-semibold">
                    Select Apps to Generate ({selectedApps.length} selected)
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2 max-h-60 overflow-y-auto border rounded p-4">
                    {popularApps.map((app) => (
                      <label key={app} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedApps.includes(app)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedApps([...selectedApps, app])
                            } else {
                              setSelectedApps(selectedApps.filter(a => a !== app))
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{app}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                onClick={bulkGenerateApps} 
                disabled={bulkLoading || selectedApps.length === 0}
                className="w-full"
              >
                {bulkLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating {selectedApps.length} apps...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Generate Selected Apps ({selectedApps.length})
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}