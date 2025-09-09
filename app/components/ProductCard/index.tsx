import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import { MediumText } from "../Text";
import color from "../../modules/Color";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

interface ProductCardProps {
    item: any;
    isFavorite: boolean;
    onToggleFavorite: (item: any) => void;
}

const ProductCard = ({ item, isFavorite, onToggleFavorite }: ProductCardProps) => {
    const navigation = useNavigation<any>();

    const onCardPress = () => {
        navigation.navigate("ProductDetails", { id: item.id });
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onCardPress}>
            <FastImage
                source={{ uri: item.image, priority: FastImage.priority.normal }}
                style={styles.image}
                resizeMode={FastImage.resizeMode.cover}
            />

            <View style={styles.cardContent}>
                <MediumText style={styles.name}>{item.name}</MediumText>
                <MediumText style={styles.price}>${item.price}</MediumText>
            </View>

            <TouchableOpacity
                style={styles.heartButton}
                onPress={() => onToggleFavorite(item)}
            >
                <Icon
                    name={isFavorite ? "favorite" : "favorite-border"}
                    size={20}
                    color={isFavorite ? "red" : "black"}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

export default memo(ProductCard);

const styles = StyleSheet.create({
    card: {
        width: "48%",
        backgroundColor: "#fafafa",
        borderRadius: 12,
        marginBottom: 15,
        overflow: "hidden",
        position: "relative",
    },
    image: {
        width: "100%",
        height: 160,
    },
    cardContent: {
        padding: 10,
    },
    name: {
        fontSize: 14,
        marginBottom: 4,
        color: color.black,
    },
    price: {
        fontSize: 13,
        color: color.primary,
    },
    heartButton: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 4,
        elevation: 2,
    },
});
