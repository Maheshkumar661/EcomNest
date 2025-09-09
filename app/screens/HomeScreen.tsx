import React, { useEffect, useState, useCallback, useRef } from "react";
import { StyleSheet, View, FlatList, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { loadFavoritesFromStorage, toggleFavorite } from "../redux/favoritesSlice";
import CustomSafeAreaView from "../components/CustomSafeAreaView";
import { MediumText } from "../components/Text";
import productStore from "../service/Products";
import color from "../modules/Color";
import { getStringForKey, keys } from "../modules/Strings";
import ProductCard from "../components/ProductCard";

const useDebounce = (func: (...args: any[]) => void, delay: number) => {
    const timeoutRef = useRef<any>(null);
    return useCallback((...args: any[]) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => func(...args), delay);
    }, [func, delay]);
};

const HomeScreen = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState(getStringForKey(keys.kTrendingNow));
    const [searchQuery, setSearchQuery] = useState("");

    const navigation = useNavigation<any>();
    const dispatch = useDispatch<AppDispatch>();
    const favorites = useSelector((state: RootState) => state.favorites.items);

    useEffect(() => {
        dispatch(loadFavoritesFromStorage());
    }, [dispatch]);

    useEffect(() => {
        productStore.getProductList({}, (status, result) => {
            if (status) {
                const enriched = result.map((item: any, index: number) => ({
                    ...item,
                    isTrending: index % 2 === 0,
                    isNew: index % 3 === 0,
                }));
                setProducts(enriched);
                setFilteredProducts(enriched);
            }
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        let updated = [...products];
        if (selectedFilter === getStringForKey(keys.kTrendingNow)) updated = updated.filter(p => p.isTrending);
        else if (selectedFilter === getStringForKey(keys.kNew)) updated = updated.filter(p => p.isNew);

        if (searchQuery.trim()) {
            updated = updated.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        setFilteredProducts(updated);
    }, [selectedFilter, products, searchQuery]);

    const handleSearch = useDebounce((text: string) => setSearchQuery(text), 400);

    const renderHeader = useCallback(() => (
        <View style={styles.header}>
            <MediumText style={styles.title}>{getStringForKey(keys.kMatchYourStyle)}</MediumText>
            <TouchableOpacity style={styles.favoriteButton} onPress={() => navigation.navigate("HomeFavorite")}>
                <MediumText style={styles.favoriteText}>{getStringForKey(keys.kFavorites)}</MediumText>
            </TouchableOpacity>
        </View>
    ), [navigation]);

    const renderSearchBox = useCallback(() => (
        <View style={styles.searchBox}>
            <TextInput
                placeholder={getStringForKey(keys.kSearchPlaceholder)}
                placeholderTextColor="#aaa"
                style={styles.searchInput}
                defaultValue={searchQuery}
                onChangeText={handleSearch}
            />
        </View>
    ), [searchQuery, handleSearch]);

    const renderFilters = useCallback(() => (
        <View style={styles.filterRow}>
            {[getStringForKey(keys.kTrendingNow), getStringForKey(keys.kAll), getStringForKey(keys.kNew)].map(filterKey => (
                <TouchableOpacity
                    key={filterKey}
                    style={[styles.filterButton, selectedFilter === filterKey && styles.activeFilter]}
                    onPress={() => setSelectedFilter(filterKey)}
                >
                    <MediumText style={[styles.filterText, selectedFilter === filterKey && styles.activeFilterText]}>
                        {getStringForKey(filterKey)}
                    </MediumText>
                </TouchableOpacity>
            ))}
        </View>
    ), [selectedFilter]);

    const renderProduct = useCallback(({ item }: { item: any }) => {
        const isFavorite = favorites.some(fav => fav.id === item.id);
        return <ProductCard
            item={item}
            isFavorite={isFavorite}
            onToggleFavorite={() => dispatch(toggleFavorite(item))} />;
    }, [favorites, dispatch]);

    const renderProductList = useCallback(() => {
        if (loading) return <MediumText style={styles.centerText}>{getStringForKey(keys.kLoading)}</MediumText>;
        if (!filteredProducts.length) return <MediumText style={styles.centerText}>{getStringForKey(keys.kNoProducts)}</MediumText>;

        return (
            <FlatList
                data={filteredProducts}
                keyExtractor={item => item.id}
                renderItem={renderProduct}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        );
    }, [filteredProducts, loading, renderProduct]);

    return (
        <CustomSafeAreaView style={styles.container}>
            {renderHeader()}
            {renderSearchBox()}
            {renderFilters()}
            {renderProductList()}
        </CustomSafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
        paddingHorizontal: 16,
    },
    header: {
        marginTop: 10,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        color: color.black,
    },
    favoriteButton: {
        backgroundColor: color.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    favoriteText: {
        fontSize: 13,
        color: color.white,
    },
    searchBox: {
        marginBottom: 15,
    },
    searchInput: {
        backgroundColor: "#f2f2f2",
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        fontSize: 14,
        color: color.black,
    },
    filterRow: {
        flexDirection: "row",
        marginBottom: 15,
    },
    filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: "#eee",
        marginRight: 8,
    },
    activeFilter: {
        backgroundColor: color.primary,
    },
    filterText: {
        fontSize: 13,
        color: "#555",
    },
    activeFilterText: {
        color: "#fff",
    },
    centerText: {
        textAlign: "center",
        marginTop: 20,
    },
});

