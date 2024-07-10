'use client'

import { CldImage } from "next-cloudinary"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

function CloudinaryImage(
  {secure_url, filename, height, objectFit, aspectRatio}: {secure_url: string, filename: string, height: string, objectFit: string, aspectRatio: string}) {
  return (
    <div className="flex flex-1 justify-center items-start relative w-full hover:opacity-40">
      <Image
          width="300"
          height="400"
          src={secure_url}
          sizes="100vw"
          alt={filename}
          className={`inline-block w-full ${height} ${objectFit} ${aspectRatio}`}
      /> 
    </div>
  )
}

export default CloudinaryImage