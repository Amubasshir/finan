"use client"

import { useState } from "react"
import FinanLogo from "../components/FinanLogo"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LogoGenerator() {
  const [width, setWidth] = useState(300)
  const [height, setHeight] = useState(100)
  const [backgroundColor, setBackgroundColor] = useState("#3B82F6")
  const [textColor, setTextColor] = useState("#3B82F6")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">finan Logo Generator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Logo Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                min={100}
                max={1000}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                min={50}
                max={500}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-16 h-10"
                />
                <Input type="text" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="textColor"
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-16 h-10"
                />
                <Input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col items-center justify-center">
          <FinanLogo width={width} height={height} backgroundColor={backgroundColor} textColor={textColor} />
        </div>
      </div>
    </div>
  )
}
