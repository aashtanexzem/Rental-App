"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { SettingsFormData, settingsSchema} from '@/lib/schemas'
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from './ui/form';
import { CustomFormField } from './FormField';
import { Button } from './ui/button';

const SettingForm = ({initialData, onSubmit, userType} : SettingsFormProps) => {
    const [editMode, setEditMode] = useState(false);
    const form = useForm<SettingsFormData>({
       resolver: zodResolver(settingsSchema),
         defaultValues: initialData,
    });

    const toggleEditMode = () =>{
        setEditMode(!editMode);
        if(editMode){
            form.reset(initialData);
        }
    }

    const handleSubmit = async (data: SettingsFormData) => {
        await onSubmit(data);
        setEditMode(false);
    }
  return (
    <div className='pt-8 pb-5 px-8'>
        <div className='mb-5'>
            <h1 className='text-xl font-semibold'>
                {`${userType.charAt(0).toUpperCase() + userType.slice(1)} Settings`}
           
            </h1>
            <p className='text-sm text-gray-500 mt-1'>
                {`Manage your ${userType} profile settings and preferences.`}
            </p>
        </div>

        <div className='bg-gray-100 rounded-xl p-6'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
                    <CustomFormField name= "name" label="Name" placeholder="Enter your name" disabled={editMode} />
                    <CustomFormField name= "email" label="Email" placeholder="Enter your email" type='email' disabled={editMode} />
                    <CustomFormField name= "phoneNumber" label="Phone Number" placeholder="Enter your phone number" disabled={editMode} />

                    <div className='pt-4 flex justify-between'>
                        <Button type="button" onClick={toggleEditMode}
                        className='bg-red-400  hover:bg-red-600 text-white'>{editMode ? "Cancel" : "Edit"}</Button>

                        {editMode && (
                              <Button type="submit" onClick={toggleEditMode}
                        className='text-white bg-black '>Save Changes </Button>
                        )}
                    </div>

                </form>
            </Form>
        </div>
      
    </div>
  )
}

export default SettingForm
