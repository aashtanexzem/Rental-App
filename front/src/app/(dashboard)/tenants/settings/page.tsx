"use client";
import SettingForm from '@/components/SettingForm';
import { useGetAuthUserQuery, useUpdateTenantSettingsMutation } from '@/state/api';
import React from 'react';

const TenantSettings = () => {
    const { data: authUser, isLoading } = useGetAuthUserQuery();
    const [updateTenant] = useUpdateTenantSettingsMutation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-gray-500 text-xl font-medium animate-pulse">
                    Loading your settings...
                </div>
            </div>
        );
    }

    const initialData = {
        name: authUser?.userInfo?.name,
        email: authUser?.userInfo?.email,
        phoneNumber: authUser?.userInfo?.phoneNumber,
    };

    const handleSubmit = async (data: typeof initialData) => {
        await updateTenant({
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
                        userType="tenant"
                    />
                </div>
            </div>
        </div>
    );
};

export default TenantSettings;
