
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, Upload, Image } from "lucide-react"
import Link from "next/link"

 
interface App {
  _id?: string
  title: string
  icon: string
  category: string
  rating: number
  reviews: string
  downloads: string
  size: string
  version: string
  developer: string
  lastUpdated: string
  description: string
  fullDescription: string
  screenshots: string[]
  downloadUrl: string
  trending: boolean
}

const categories = ["Action", "Racing", "Premium Apps", "Strategy", "Entertainment", "Productivity"]

export default function AdminDashboard() {
  const [apps, setApps] = useState<App[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<App | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState<App>({
    title: "",
    icon: "",
    category: "",
    rating: 0,
    reviews: "",
    downloads: "",
    size: "",
    version: "",
    developer: "",
    lastUpdated: "",
    description: "",
    fullDescription: "",
    screenshots: [],
    downloadUrl: "",
    trending: false
  })

  useEffect(() => {
    fetchApps()
  }, [])

  const fetchApps = async () => {
    try {
      const response = await fetch("/api/admin/apps")
      const data = await response.json()
      setApps(data.apps || [])
    } catch (error) {
      setError("Failed to fetch apps")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const url = editingApp ? `/api/admin/apps/${editingApp._id}` : "/api/admin/apps"
      const method = editingApp ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(editingApp ? "App updated successfully!" : "App created successfully!")
        setIsDialogOpen(false)
        resetForm()
        fetchApps()
      } else {
        setError(data.error || "Operation failed")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this app?")) return

    try {
      const response = await fetch(`/api/admin/apps/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSuccess("App deleted successfully!")
        fetchApps()
      } else {
        setError("Failed to delete app")
      }
    } catch (error) {
      setError("An error occurred while deleting")
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        if (field === "screenshots") {
          setFormData(prev => ({
            ...prev,
            screenshots: [...prev.screenshots, data.url]
          }))
        } else {
          setFormData(prev => ({
            ...prev,
            [field]: data.url
          }))
        }
      } else {
        setError("Failed to upload image")
      }
    } catch (error) {
      setError("Upload failed")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      icon: "",
      category: "",
      rating: 0,
      reviews: "",
      downloads: "",
      size: "",
      version: "",
      developer: "",
      lastUpdated: "",
      description: "",
      fullDescription: "",
      screenshots: [],
      downloadUrl: "",
      trending: false
    })
    setEditingApp(null)
  }

  const openEditDialog = (app: App) => {
    setFormData(app)
    setEditingApp(app)
    setIsDialogOpen(true)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/ai-generator">
               <Button >
              <Plus className="w-4 h-4 mr-2" />
              Add New App
            </Button>
            </Link>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add New App
            </Button>
            
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingApp ? "Edit App" : "Add New App"}</DialogTitle>
              <DialogDescription>
                {editingApp ? "Update the app information below." : "Fill in the details for the new app."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Icon URL or upload image"
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "icon")}
                    className="hidden"
                    id="icon-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("icon-upload")?.click()}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                {formData.icon && (
                  <img src={formData.icon} alt="Icon preview" className="w-16 h-16 rounded" />
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviews">Reviews</Label>
                  <Input
                    id="reviews"
                    placeholder="e.g., 2.1M"
                    value={formData.reviews}
                    onChange={(e) => setFormData(prev => ({ ...prev, reviews: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="downloads">Downloads</Label>
                  <Input
                    id="downloads"
                    placeholder="e.g., 500M+"
                    value={formData.downloads}
                    onChange={(e) => setFormData(prev => ({ ...prev, downloads: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    placeholder="e.g., 95MB"
                    value={formData.size}
                    onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    placeholder="e.g., 3.12.0"
                    value={formData.version}
                    onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="developer">Developer</Label>
                  <Input
                    id="developer"
                    value={formData.developer}
                    onChange={(e) => setFormData(prev => ({ ...prev, developer: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastUpdated">Last Updated</Label>
                  <Input
                    id="lastUpdated"
                    placeholder="e.g., Dec 15, 2024"
                    value={formData.lastUpdated}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastUpdated: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="downloadUrl">Download URL</Label>
                  <Input
                    id="downloadUrl"
                    value={formData.downloadUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, downloadUrl: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullDescription">Full Description</Label>
                <Textarea
                  id="fullDescription"
                  rows={4}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullDescription: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Screenshots</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add screenshot URL"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const url = e.currentTarget.value
                        if (url) {
                          setFormData(prev => ({
                            ...prev,
                            screenshots: [...prev.screenshots, url]
                          }))
                          e.currentTarget.value = ""
                        }
                      }
                    }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "screenshots")}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("screenshot-upload")?.click()}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.screenshots.map((screenshot, index) => (
                    <div key={index} className="relative">
                      <img src={screenshot} alt={`Screenshot ${index + 1}`} className="w-20 h-20 rounded object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            screenshots: prev.screenshots.filter((_, i) => i !== index)
                          }))
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="trending"
                  checked={formData.trending}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, trending: checked }))}
                />
                <Label htmlFor="trending">Trending</Label>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : (editingApp ? "Update App" : "Create App")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {success && (
        <Alert className="mb-4">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {apps.map((app) => (
          <Card key={app._id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img src={app.icon} alt={app.title} className="w-12 h-12 rounded" />
                  <div>
                    <h3 className="font-semibold">{app.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{app.category} • {app.downloads}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(app)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(app._id!)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
