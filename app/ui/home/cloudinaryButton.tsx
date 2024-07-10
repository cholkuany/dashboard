'use client'

import { CldUploadButton } from 'next-cloudinary'
import { ChangeEvent, useState } from "react";
import { useFormState } from 'react-dom';
import Link from 'next/link';
import { CameraIcon } from "@heroicons/react/24/outline";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { imageUpload } from '@/app/lib/upload';

export function UploadButton(){

  const [imageId, setImageId] = useState('')
  const [IsUploading, setIsUploading] = useState(false)
  const [desc, setDesc] = useState('')
  const [images, setImages] = useState('')

  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(imageUpload, initialState);

  async function uploadImage(ev: ChangeEvent<HTMLInputElement>) {
    const files = ev.target?.files;
    console.log(files)
    if (files && files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of Array.from(files)) {
        data.append('file', file);
      }
      // const res = await axios.post('/api/upload', data);
      // setImages(oldImages => {
      //   return [...oldImages, ...res.data.links];
      // });
      setImages(files[0].name);
      setIsUploading(false);
    }
  }

  const handleSubmit = async(formData: FormData) => {
      // e.preventDefault()
      // const formData = new FormData(e.currentTarget)
      // const response = await fetch('api/signup', {
      //   method: 'POST',
      //   headers: {'Content-Type': 'application/json'},
      //   body: JSON.stringify({
      //     username: formData.get('username'),
      //     email: formData.get('email'),
      //     password: formData.get('pass'),
      //     confirmPass: formData.get('confirmPass')
      //   })
      // })
      // console.log(`RESPONSE:::::: ${response}`)
      console.log("image uploaded...")
    }
      
  return (
    <div>
      <form action={dispatch} className='flex flex-col gap-4 items-start'>
        <input type="file" name='image' />
        <Textarea placeholder='Add description' className='resize-none' name='desc' />
        <Button>Submit</Button>
      </form>

    </div>
  )
}