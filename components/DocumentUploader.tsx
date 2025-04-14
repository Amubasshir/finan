"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, File, X, CheckCircle } from "lucide-react"

interface DocumentFile {
  id: string
  name: string
  size: number
  uploadDate: string
}

interface DocumentUploaderProps {
  document: {
    id: string
    name: string
    description: string
    required: boolean
    multipleAllowed: boolean
    downloadLink?: string
    uploadedFiles: DocumentFile[]
  }
  onFileUpload: (docId: string, file: File) => void
  onFileRemove: (docId: string, fileId: string) => void
}

export function DocumentUploader({ document, onFileUpload, onFileRemove }: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    // Check file type
    const file = files[0]
    const validTypes = [".pdf", ".jpg", ".jpeg", ".png", "application/pdf", "image/jpeg", "image/png"]
    const isValidType = validTypes.some((type) => file.name.toLowerCase().endsWith(type) || file.type.includes(type))

    if (!isValidType) {
      setError("Please upload a PDF or image file (JPG, JPEG, PNG)")
      return
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit")
      return
    }

    setError(null)
    uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + 5
      })
    }, 100)

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    clearInterval(interval)
    setUploadProgress(100)

    // Call the onFileUpload callback
    onFileUpload(document.id, file)

    // Reset the state after a short delay
    setTimeout(() => {
      setIsUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }, 500)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        id={`file-upload-${document.id}`}
        onChange={handleFileInputChange}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
      />

      {/* Drag and drop area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : document.uploadedFiles.length > 0
              ? "border-green-300 bg-green-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {document.uploadedFiles.length > 0 ? (
          <div className="flex flex-col items-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
            <p className="text-lg font-medium text-green-700">Document Uploaded</p>
            <p className="text-sm text-gray-500 mt-1">Click or drag to replace</p>
          </div>
        ) : isUploading ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium text-blue-700">Uploading...</p>
            <Progress value={uploadProgress} className="h-2 w-full max-w-xs mx-auto mt-2" />
            <p className="text-sm text-gray-500 mt-1">{uploadProgress}%</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-blue-500 mb-2" />
            <p className="text-lg font-medium">Drag and drop your {document.name} here</p>
            <p className="text-sm text-gray-500 mt-1">
              or <span className="text-blue-500 font-medium">click to browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-4">Accepted formats: PDF, JPG, PNG (Max 10MB)</p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200">
          <p className="flex items-center">
            <X className="h-4 w-4 mr-2" />
            {error}
          </p>
        </div>
      )}

      {/* Display uploaded files */}
      {document.uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Uploaded Files:</h3>
          {document.uploadedFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between bg-white p-3 rounded-md border">
              <div className="flex items-center">
                <File className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • Uploaded {new Date(file.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => onFileRemove(document.id, file.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {document.downloadLink && (
        <div className="mt-4">
          <Button variant="outline" size="sm" asChild>
            <a href={document.downloadLink} target="_blank" rel="noopener noreferrer">
              Download Template
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}
