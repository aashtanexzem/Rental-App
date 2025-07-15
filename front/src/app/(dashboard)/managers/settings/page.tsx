"use client"
import Loading from '@/components/Loading';
import SettingForm from '@/components/SettingForm';
import { useGetAuthUserQuery, useUpdateManagerSettingsMutation } from '@/state/api'
import React from 'react';

const ManagersSettings = () => {
    const { data: authUser, isLoading } = useGetAuthUserQuery();
    const [updateManagers] = useUpdateManagerSettingsMutation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div><Loading/></div>
            </div>
        );
    }

    const initialData = {
        name: authUser?.userInfo?.name,
        email: authUser?.userInfo?.email,
        phoneNumber: authUser?.userInfo?.phoneNumber,
    };

    const handleSubmit = async (data: typeof initialData) => {
        await updateManagers({
            cognitoId: authUser?.cognitoInfo?.userId,
            ...data,
        });
    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-6">
            <div className="max-w-3xl mx-auto">

                <div className="bg-white rounded-xl shadow-xl p-10 border border-gray-200">
                    <SettingForm
                        initialData={initialData}
                        onSubmit={handleSubmit}
                        userType="manager"
                    />
                </div>
            </div>
        </div>

    );
};

export default ManagersSettings;
