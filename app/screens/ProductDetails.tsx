import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { toggleFavorite } from "../redux/favoritesSlice";
import Icon from "react-native-vector-icons/MaterialIcons";
import color from "../modules/Color";
import CustomSafeAreaView from "../components/CustomSafeAreaView";
import productStore from "../service/Products";
import { getStringForKey, keys } from "../modules/Strings";

const ProductDetails = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const dispatch = useDispatch<AppDispatch>();
    const favorites = useSelector((state: RootState) => state.favorites.items);

    const { item: routeItem } = route.params;
    const [item, setItem] = useState(routeItem || null);
    const [loading, setLoading] = useState(!routeItem);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!routeItem) {
            productStore.getProductList({}, (status, result) => {
                if (status) {
                    const found = result.find((p: any) => p.id === route.params.id);
                    if (found) setItem(found);
                    else setError(getStringForKey(keys.kNoProducts));
                } else {
                    setError(result);
                }
                setLoading(false);
            });
        }
    }, [routeItem, route.params.id]);

    if (loading) {
        return (
            <CustomSafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color={color.primary} />
            </CustomSafeAreaView>
        );
    }

    if (error) {
        return (
            <CustomSafeAreaView style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color={color.primary} />
                    <Text style={{ color: color.primary, marginLeft: 5 }}>Go Back</Text>
                </TouchableOpacity>
            </CustomSafeAreaView>
        );
    }

    const isFavorite = favorites.some(fav => fav.id === item.id);

    const handleToggleFavorite = () => {
        dispatch(toggleFavorite(item));
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-back" size={24} color={color.black} />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
                {item.name}
            </Text>
        </View>
    );

    const renderImage = () => (
        <Image source={{ uri: item.image }} style={styles.image} />
    );

    const renderDetails = () => (
        <View style={styles.detailsContainer}>
            <View style={styles.headerRow}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>${item.price}</Text>
            </View>

            <Text style={styles.description}>
                {item.description || "No description available for this product."}
            </Text>
        </View>
    );

    const renderBottomButtons = () => (
        <View style={styles.bottomButtons}>
            <TouchableOpacity
                style={[styles.favoriteBtn, isFavorite && styles.favoriteBtnActive]}
                onPress={handleToggleFavorite}
            >
                <Icon
                    name={isFavorite ? "favorite" : "favorite-border"}
                    size={20}
                    color={isFavorite ? "red" : "#fff"}
                    style={{ marginRight: 8 }}
                />
                <Text style={styles.favoriteBtnText}>
                    {isFavorite ? "Remove from Favorite" : "Add to Favorite"}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <CustomSafeAreaView style={styles.container}>
            {renderHeader()}
            {renderImage()}
            {renderDetails()}
            {renderBottomButtons()}
        </CustomSafeAreaView>
    );
};

export default ProductDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
        paddingHorizontal: 16,
    },
    errorText: {
        color: "red",
        fontSize: 16,
        textAlign: "center",
        marginVertical: 20,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        marginTop: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: color.black,
        flex: 1,
    },
    image: {
        width: "100%",
        height: 300,
        borderRadius: 10,
        marginTop: 10,
    },
    detailsContainer: {
        flex: 1,
        marginTop: 20,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    name: {
        fontSize: 22,
        fontWeight: "600",
        color: color.black,
        flex: 1,
    },
    price: {
        fontSize: 18,
        fontWeight: "500",
        color: color.primary,
        marginLeft: 10,
    },
    description: {
        marginTop: 15,
        fontSize: 14,
        color: "#555",
        lineHeight: 20,
    },
    bottomButtons: {
        marginBottom: 20,
    },
    favoriteBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#888",
        paddingVertical: 12,
        borderRadius: 10,
    },
    favoriteBtnActive: {
        backgroundColor: "#ffe5e5",
    },
    favoriteBtnText: {
        fontSize: 15,
        color: "#000",
        fontWeight: "500",
    },
});
