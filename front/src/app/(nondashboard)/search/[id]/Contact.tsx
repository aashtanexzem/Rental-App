import { Button } from '@/components/ui/button';
import { useGetAuthUserQuery } from '@/state/api'
import { Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'

const ContactWidget = ({ onOpenModal }: ContactWidgetProps) => {
    const { data: authUser } = useGetAuthUserQuery();
    const router = useRouter();

    const handleButtonClick = () => {
        if (authUser) {
            onOpenModal();
        } else {
            router.push("/signin")
        }
    }
    return (
        <div className='bg-white border border-gray-200 rounded-2xl p-7 h-fit min-w-[300px]'>
            <div className='flex items-center gap-5 mb-4 border norder-gray-200 p-4 rounded-xl'>
                <div className='flex items-center p-4 bg-black rounded-full'>
                    <Phone className='text-white' size={15} />
                </div>
                <div>
                    <p>Contact This Property.</p>
                    <div className='text-lg font-bold text-black'>(424) 367-567</div>
                </div>
            </div>
            <Button className='w-full bg-black text-white hover:bg-slate-900' onClick={handleButtonClick}>
                {authUser ? "Submit Application" : "Sign In to Apply"}
            </Button>

            <hr className='my-4' />
            <div className='text-sm'>
                <div className='text-gray-700 mb-1'>Langauge: English, Bahasa.</div>
                <div className='text-gray-700'>
                    Open by appointment on Monday - Sunday.
                </div>
            </div>
        </div>
    )
}

export default ContactWidget
