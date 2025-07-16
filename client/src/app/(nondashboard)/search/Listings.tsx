import Card from '@/components/Card';
import CardCompact from '@/components/CardCompact';
import {
  useAddFavoritePropertyMutation,
  useGetAuthUserQuery,
  useGetPropertiesQuery,
  useRemoveFavoritePropertyMutation,
} from '@/state/api';
import { useAppSelector } from '@/state/redux';
import { Property } from '@/types/prismaTypes';
import React from 'react';

const Listings = () => {
  const [_, forceRerender] = React.useState(0);

  const {
    data: authUser,
    refetch: refetchAuthUser, // 👈 grab refetch function here
  } = useGetAuthUserQuery();

  const [addFavorite] = useAddFavoritePropertyMutation();
  const [removeFavorite] = useRemoveFavoritePropertyMutation();

  const viewMode = useAppSelector((state) => state.global.viewMode);
  const filters = useAppSelector((state) => state.global.filters);

  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  const handleFavoriteToggle = async (propertyId: number) => {
    console.log("🔄 Toggling favorite for property:", propertyId);

    if (!authUser || !authUser.userInfo || !authUser.userInfo.favorites) {
      console.warn("❌ No authUser or favorites list found");
      return;
    }

    const isFavorite = authUser.userInfo.favorites.some(
      (fav: Property) => fav.id === propertyId
    );

    console.log("❤️ Is Favorite BEFORE:", isFavorite);

    try {
      if (isFavorite) {
        const res = await removeFavorite({
          cognitoId: authUser.cognitoInfo.userId,
          propertyId,
        });
        console.log("🗑 Removed favorite:", res);
      } else {
        const res = await addFavorite({
          cognitoId: authUser.cognitoInfo.userId,
          propertyId,
        });
        console.log("➕ Added favorite:", res);
      }

      console.log("🔁 Refetching user after toggle...");
      const refetchResult = await refetchAuthUser();
      forceRerender((prev) => prev + 1);
      console.log("✅ Refetched User Result:", refetchResult);

    } catch (error) {
      console.error("⚠️ Favorite toggle failed:", error);
    }
  };


  if (isLoading) return <>Loading...</>;
  if (isError || !properties) return <div>Failed to Fetch properties.</div>;

  return (
    <div className="w-full">
      <h3 className="text-sm px-4 font-bold">
        {properties.length}{" "}
        <span className="text-gray-700 font-normal">
          Places in {filters.location}
        </span>
      </h3>
      <div className="flex">
        <div className="p-4 w-full">
          {properties?.map((property) =>
            viewMode === "grid" ? (
              <Card
                key={property.id}
                property={property}
                isFavorite={
                  authUser?.userInfo?.favorites?.some(
                    (fav: Property) => fav.id === property.id
                  ) || false
                }
                onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                showFavoriteButton={!!authUser}
                propertyLink={`/search/${property.id}`}
              />
            ) : (
              <CardCompact
                key={property.id}
                property={property}
                isFavorite={
                  authUser?.userInfo?.favorites?.some(
                    (fav: Property) => fav.id === property.id
                  ) || false
                }
                onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                showFavoriteButton={!!authUser}
                propertyLink={`/search/${property.id}`} />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;
