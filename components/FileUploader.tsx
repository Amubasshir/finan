"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, File, X } from "lucide-react"

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  acceptedFileTypes?: string
  maxFileSize?: number // in bytes
  label?: string
  multiple?: boolean
}

export function FileUploader({
  onFileSelect,
  acceptedFileTypes = ".pdf,.jpg,.jpeg,.png",
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  label = "Upload File",
  multiple = false,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const validateFile = (file: File): boolean => {
    // Check file type
    const fileType = file.type
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
    const acceptedTypesArray = acceptedFileTypes.split(",")

    const isValidType = acceptedTypesArray.some((type) => {
      if (type.startsWith(".")) {
        // Check by extension
        return fileExtension === type.toLowerCase()
      } else {
        // Check by MIME type
        return fileType.includes(type)
      }
    })

    if (!isValidType) {
      setError(`Invalid file type. Accepted types: ${acceptedFileTypes}`)
      return false
    }

    // Check file size
    if (file.size > maxFileSize) {
      setError(`File is too large. Maximum size: ${maxFileSize / (1024 * 1024)}MB`)
      return false
    }

    setError(null)
    return true
  }

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (multiple) {
        // Process each file
        Array.from(e.dataTransfer.files).forEach((file) => {
          if (validateFile(file)) {
            onFileSelect(file)
          }
        })
      } else {
        // Process single file
        const file = e.dataTransfer.files[0]
        handleFileSelect(file)
      }
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (multiple) {
        // Process each file
        Array.from(e.target.files).forEach((file) => {
          if (validateFile(file)) {
            onFileSelect(file)
          }
        })
      } else {
        // Process single file
        const file = e.target.files[0]
        handleFileSelect(file)
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

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

    // Call the onFileSelect callback
    onFileSelect(selectedFile)

    // Reset the state after a short delay
    setTimeout(() => {
      setIsUploading(false)
      setSelectedFile(null)
      setUploadProgress(0)
    }, 500)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={acceptedFileTypes}
        multiple={multiple}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Upload className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-700">{label}</p>
              <p className="text-sm text-gray-500 mt-1">
                {multiple
                  ? "Drag and drop files here, or click to browse"
                  : "Drag and drop your file here, or click to browse"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Accepted file types: {acceptedFileTypes} (Max size: {maxFileSize / (1024 * 1024)}MB)
                {multiple && " • Multiple files allowed"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full mr-3">
                <File className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-700 truncate max-w-[200px] sm:max-w-xs">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            {!isUploading && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {isUploading ? (
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 text-right">
                {uploadProgress < 100 ? "Uploading..." : "Upload complete!"}
              </p>
            </div>
          ) : (
            <Button onClick={handleUpload} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  )
}
