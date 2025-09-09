import React, { useCallback } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { toggleFavorite } from "../redux/favoritesSlice";
import CustomSafeAreaView from "../components/CustomSafeAreaView";
import { MediumText } from "../components/Text";
import color from "../modules/Color";
import { getStringForKey, keys } from "../modules/Strings";
import ProductCard from "../components/ProductCard";

const FavoriteScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => state.favorites.items);

  const handleToggleFavorite = useCallback(
    (item: any) => {
      dispatch(toggleFavorite(item));
    },
    [dispatch]
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <MediumText style={styles.title}>{getStringForKey(keys.kYourFavorites)}</MediumText>
    </View>
  );

  const renderEmptyState = () => (
    <MediumText style={styles.emptyText}>{getStringForKey(keys.kNoFavorites)}</MediumText>
  );

  const renderProductList = () => (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProductCard
          item={item}
          isFavorite={true}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );

  return (
    <CustomSafeAreaView style={styles.container}>
      {renderHeader()}
      {favorites.length === 0 ? renderEmptyState() : renderProductList()}
    </CustomSafeAreaView>
  );
};

export default FavoriteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: color.black,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
});
