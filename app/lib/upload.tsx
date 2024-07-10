'use server'
// import multiparty from 'multiparty';
// import fs from 'fs';
// import mime from 'mime-types';

import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';
const { db } = require('@vercel/postgres');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

export type State = {
    errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
};

export async function imageUpload(prevState: State, formData: FormData) {
    // const { resources: sneakers } = await cloudinary.api.resources_by_tag('nextjs-server-actions-upload-sneakers', { context: true, folder: 'cholkuany' });

    const file = formData.get('image') as File
    const desc = formData.get('desc') as string
    const imageArrayBuffer = await file.arrayBuffer()
    const imageBuffer = new Uint8Array(imageArrayBuffer)
    // const buffer = new Uint8Array(arrayBuffer);

    await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          folder: 'cholkuany',
          upload_preset: 'tg5pwssv',
          transformation: [{width: 400, crop: 'scale'}]
        }, function (error, result) {
          if (error) {
            console.log(error)
            reject(error);
            return;
          }
          resolve(result);
        })
        .end(imageBuffer);
    }).then(async (result) => {
      console.log(result)
      const client = await db.connect();
      try {
        const {asset_id, secure_url} = result as any

        const user = await client.sql`
        INSERT INTO images (cloudinaryid, owner_id, url, dislikes, likes, description)
        VALUES (${asset_id}, 'owner_id', ${secure_url}, ${0}, ${0}, ${desc})
        ON CONFLICT (id) DO NOTHING;
        `;
        revalidatePath('/')
        return {
          message: 'Image uploaded', errors: {}
        };

      }catch(err){
        return {
          errors: {},
          message: 'Database Error: Failed to Upload Image.',
        }
      }
    }).catch(err => {
      console.log("Error: " + err)
    });

    return {
        message: 'Success',
      }

}
