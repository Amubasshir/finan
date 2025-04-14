"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileUploader } from "@/components/FileUploader"
import { CheckCircle, Download, File, X } from "lucide-react"
import Link from "next/link"

interface DocumentFile {
  id: string
  name: string
  size: number
  uploadDate: string
}

interface DocumentProps {
  id: string
  name: string
  description: string
  required: boolean
  multipleAllowed: boolean
  downloadLink?: string
  onFileUpload: (docId: string, file: File) => void
  onFileRemove: (docId: string, fileId: string) => void
  uploadedFiles: DocumentFile[]
}

export function DocumentUploadSection({
  id,
  name,
  description,
  required,
  multipleAllowed,
  downloadLink,
  onFileUpload,
  onFileRemove,
  uploadedFiles,
}: DocumentProps) {
  const hasUploadedFiles = uploadedFiles.length > 0

  return (
    <Card className={`overflow-hidden ${hasUploadedFiles ? "border-green-300 bg-green-50" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              {name}
              {required && <Badge className="ml-2 bg-red-100 text-red-800">Required</Badge>}
              {multipleAllowed && <Badge className="ml-2 bg-blue-100 text-blue-800">Multiple Allowed</Badge>}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {hasUploadedFiles && (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" /> Uploaded
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hasUploadedFiles && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Uploaded Files:</h4>
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between bg-white p-2 rounded-md border">
                    <div className="flex items-center">
                      <File className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => onFileRemove(id, file.id)} className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {multipleAllowed || !hasUploadedFiles ? (
            <FileUploader
              onFileSelect={(file) => onFileUpload(id, file)}
              acceptedFileTypes=".pdf,.jpg,.jpeg,.png"
              maxFileSize={10 * 1024 * 1024} // 10MB
              label={`Upload ${name}`}
              multiple={multipleAllowed}
            />
          ) : null}

          {downloadLink && (
            <Button variant="outline" className="w-full" asChild>
              <Link href={downloadLink}>
                <Download className="mr-2 h-4 w-4" /> Download Template
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
