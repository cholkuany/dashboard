'use server';

import { z } from 'zod'
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';


const bcrypt = require('bcrypt');
const { db } = require('@vercel/postgres');

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
      required_error: 'Select a customer.',
      invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
      .number()
      .gt(0, { message: 'Please enter an amount greater than $0.'}),
    status: z.enum(['pending', 'paid'], {
      required_error: 'Select an invoice status.',
      invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string()
})

const CreateImageSchema = z.object({
  cloudinary_id: z.string({
    required_error: 'Add image'
  }),
  owner_id: z.string(),
  description: z.string()
})

const SignUpSchema = z.object({
  name: z.string().min(4, {
    message: 'Enter a username.',
  }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, {
    message: 'Enter a password at least 8 characters long.',
  }),
})

export type ImageState = {
  errors?: {
    id?: string[]
  },
  message?: string | null
}

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export type FormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success){
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.'
    }
  }
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
  
  try{
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
  }catch(err){
    return {
      message: 'Database Error: Failed to Create Invoice.',
    }
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');

}

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  if (!validatedFields.success){
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Edit Invoice.'
    }
  }
  const { customerId, amount, status } = validatedFields.data
  const amountInCents = amount * 100;

  try{
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  }catch(err){
    return {message: 'Database Error: Failed to update Invoice.',}
  }
  
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try{
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  }
  catch(err){
    return {
      message: 'Database Error: Failed to delete Invoice.',
    }
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error;
  }
}

export async function signUpUser(  
  prevState: FormState,
  formData: FormData,
) {
  const validatedFields = SignUpSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success){
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Account.'
    }
  }

  const { name, email, password } = validatedFields.data 
  const client = await db.connect();
    
  try{
    const hashedPassword = await bcrypt.hash(password, 10);
    const userExists = await client.sql`SELECT email, name FROM users WHERE email = ${email} OR name = ${name}`

    if(userExists.rows.length > 0){
      if(userExists.rows[0].email === email){
        return {
          errors: {},
          message: 'This email already exists.'
        }
      }else if(userExists.rows[0].name === name){
        return {
          errors: {},
          message: 'This username is taken'
      }
      }
    }

    const user = await client.sql`
    INSERT INTO users (name, email, password)
    VALUES (${name}, ${email}, ${hashedPassword})
    ON CONFLICT (id) DO NOTHING;
  `;

  var form_data = new FormData();

  form_data.append('email', email);
  form_data.append('password', hashedPassword);

  // await signIn('credentials', form_data, {callbackUrl: '/'});

  }catch(err){
    return {
      errors: {},
      message: 'Database Error: Failed to Sign Up User.',
    }
  }

}

export async function createImage(  
  prevState: ImageState,
  formData: FormData,
) {
  const validatedFields = CreateImageSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success){
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Upload Image.'
    }
  }

  const { cloudinary_id, owner_id, description } = validatedFields.data 
  const client = await db.connect();
    
  try{

    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "images" table if it doesn't exist
    const createImages = await client.sql`
      CREATE TABLE IF NOT EXISTS images (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        cloudinaryId VARCHAR(250) NOT NULL
        owner_id VARCHAR(250) NOT NULL
      );
    `;

    const user = await client.sql`
    INSERT INTO images (cloudinaryID)
    VALUES (${cloudinary_id}, ${owner_id}, ${description})
    ON CONFLICT (id) DO NOTHING;
  `;
  return {
    message: 'Image uploaded', errors: {}
  };

  }catch(err){
    return {
      errors: {},
      message: 'Database Error: Failed to Upload Image.',
    }
  }

}

export async function addComment(  
  prevState: ImageState,
  formData: FormData,
) {
  const validatedFields = Object.fromEntries(formData.entries())

  // if (!validatedFields.success){
  //   return {
  //     errors: validatedFields.error.flatten().fieldErrors,
  //     message: 'Missing Fields. Failed to Upload Image.'
  //   }
  // }

  const { imageId, text, owner_id } = validatedFields
  const client = await db.connect();
    
  try{

    // await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "images" table if it doesn't exist
    // const createImages = await client.sql`
    //   CREATE TABLE IF NOT EXISTS comments (
    //     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    //     imageID VARCHAR(250) NOT NULL
    //     text VARCHAR(250) NOT NULL
    //   );
    // `;

    const user = await client.sql`
    INSERT INTO comments (comment, imageId, owner_id, dislikes, likes)
    VALUES (${text}, ${imageId}, ${owner_id}, ${0}, ${0})
    ON CONFLICT (id) DO NOTHING;
  `;
    return {
      message: 'Image uploaded', errors: {}
    };

  }catch(err){
    return {
      errors: {},
      message: 'Database Error: Failed to Upload Image.',
    }
  }

}