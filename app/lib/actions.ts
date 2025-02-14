'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';


 
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
      invalid_type_error: 'Selezionare un cliente per proseguire.',
    }),
    type: z.string({
      invalid_type_error: 'Inserire la tipologia per continuare.',
    }),
    number: z.string({
      invalid_type_error: 'Selezionare un numero valido.',
    }),
    date: z.string(),
  });
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
    errors?: {
      customerId?: string[];
      type?: string[];
      number?: string[];
    };
    message?: string | null;
};


export async function createFascicolo(prevState: State, formData: FormData) {
    // Validate form using Zod

    const validatedFields = CreateInvoice.safeParse({
      customerId: formData.get('customerId'),
      type: formData.get('type'),
      number: formData.get('number'),
    });
   
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Impossibile creacre il fascicolo. Riprovare',
      };
    }
    // Prepare data for insertion into the database
    const { customerId, type, number } = validatedFields.data;
    const date = new Date().toISOString().split('T')[0];
   
    // Insert data into the database
    try {
      await sql`
        INSERT INTO fascicoli ("customer_id", type, number, date)
        VALUES (${customerId}, ${type}, ${number}, ${date})
      `;
    } catch (error) {
      console.log(error.code)// If a database error occurs, return a more specific error.
      if(error.code == "23505") return{
        errors: {
          number: ["Numero di fascicolo gia esistente"],
        },
        message:"Il numero del fascicolo è gia esistente",
      }
      return {
        message: 'Database Error: Failed to Create Invoice.',
      };
    }
   
    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/fascicoli');
    redirect('/dashboard/fascicoli');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
    id: string,
    prevState: State,
    formData: FormData,
  ) {
    const validatedFields = UpdateInvoice.safeParse({
      customerId: formData.get('customerId'),
      number: formData.get('number'),
      type: formData.get('type'),
    });
   
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Update Invoice.',
      };
    }
   
    const { customerId, number, type } = validatedFields.data;
   
    try {
       await sql`
         UPDATE fascicoli
         SET customer_Id = ${customerId}, type = ${type}, number = ${number}
         WHERE id = ${id}
        `;
    } catch (error) {
      return { 
        message: 'Database Error: Failed to Update Invoice.' 
      };
    }
   
    revalidatePath('/dashboard/fascicoli');
    redirect('/dashboard/fascicoli');
}

export async function deleteInvoice(id: string) {
    try{
        //await sql`DELETE FROM invoices WHERE id = ${id}`;
        
    } catch(e){
        console.log(e)
    }

    revalidatePath('/dashboard/fascicoli');

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
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
}


const addUserFormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Please select add your name.',
  }),
  email: z.string().email({
    message: 'Please select use a valid email.',
  }),
  password: z.string({
    invalid_type_error: 'Please select a valid password.',
  }),
  confirmPassword: z.string({
    invalid_type_error: 'Invalid password',
  })
  
});
const AddUser = addUserFormSchema.omit({ id: true });


export type UserState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
};

export async function addUser(
  prevState: UserState,
  formData: FormData,
) {
  // Validate form using Zod
  const validatedFields = AddUser.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword')
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log("blablalbalba")
    console.error(validatedFields.error.flatten().fieldErrors)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields.',
    };
    
  }
  
  bcrypt.hash(validatedFields.data.password, 10, async function(err, hash) {
    try {
      await sql`
          INSERT INTO users (name, email, password)
          VALUES (${validatedFields.data.name}, ${validatedFields.data.email}, ${hash})
        `;
        console.log(`New user added ${validatedFields.data.name}, ${validatedFields.data.email}`)
    } catch (error) {
      if (error) return 'Invalid credentials.';
      console.error(error)
      throw error;
    }
  });
  
  return prevState;
};

const CustomerFormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Inserire un nome idoneo',
  }),
  email: z.string().email({
      message: 'email invalida'
    }),
  date: z.string(),
});

const CreateCustomer = CustomerFormSchema.omit({ id: true, date: true });

export type CustomerState = {
  errors?: {
    name?: string[];
    email?: string[];
  };
  message?: string | null;
};

export async function createCustomer(prevState: CustomerState, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
  // Prepare data for insertion into the database
  const { name, email } = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];
  const image_url = '/customers/evil-rabbit.png';
 
  // Insert data into the database
  try {
    await sql`
      INSERT INTO customers (name, email, image_url)
      VALUES (${name}, ${email}, ${image_url})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Customer.',
    };
  }
  
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
  return prevState;
}
