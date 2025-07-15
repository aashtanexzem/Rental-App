"use client";

import Card from '@/components/Card';
import Header from '@/components/Header';
import Loading from '@/components/Loading';
import { useGetAuthUserQuery, useGetTenantQuery, useGetPropertiesQuery } from '@/state/api';
import React from 'react';

const Favorites = () => {
  const { data: authUser } = useGetAuthUserQuery();

  const { data: tenant } = useGetTenantQuery(
    authUser?.cognitoInfo?.userId || "",
    {
      skip: !authUser?.cognitoInfo?.userId,
    }
  );

  const {
    data: favoriteProperties,
    isLoading,
    error
  } = useGetPropertiesQuery(
    {
      favoriteIds: tenant?.favorites?.map((fav: { id: number }) => fav.id),
    },
    {
      skip: !tenant?.favorites || tenant?.favorites.length === 0,
    }
  );

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading favorites</div>;

  return (
    <div className='pt-8 pb-5 px-8'>
      <Header
        title="Favorite Properties"
        subtitle="Browse and manage your favorite properties."
      />
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
        {favoriteProperties?.map((property) => (
          <Card
            key={property.id}
            property={property}
            isFavorite={true}
            onFavoriteToggle={() => {}}
            showFavoriteButton={false}
            propertyLink={`/tenants/residences/${property.id}`}
          />
        ))}
      </div>
      {(!favoriteProperties || favoriteProperties.length === 0) && (
        <p>You don&apos;t have any favorited properties.</p>
      )}
    </div>
  );
};

export default Favorites;
