import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "../redux/store";
import HomeScreen from "./HomeScreen";
import FavoriteScreen from "./FavoriteScreen";
import color from "../modules/Color";
import Icon from "react-native-vector-icons/MaterialIcons";
import ProductDetails from "./ProductDetails";

const linking = {
    prefixes: ["myshoplite://", "https://myshoplite.com"],
    config: {
        screens: {
            HomeTab: {
                path: "home",
                screens: {
                    HomeMain: "",
                    HomeFavorite: "favorites",
                    ProductDetails: "product/:id",
                },
            },
            FavoritesTab: "favorites",
        },
    },
};

const HomeStackNavigator = createNativeStackNavigator();

const HomeStack = () => (
    <HomeStackNavigator.Navigator screenOptions={{ headerShown: false }}>
        <HomeStackNavigator.Screen name="HomeMain" component={HomeScreen} />
        <HomeStackNavigator.Screen name="HomeFavorite" component={FavoriteScreen} />
        <HomeStackNavigator.Screen name="ProductDetails" component={ProductDetails} />
    </HomeStackNavigator.Navigator>
);

const Tab = createBottomTabNavigator();

const RootWindow = () => (
    <Provider store={store}>
        <NavigationContainer linking={linking}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: color.primary,
                    tabBarInactiveTintColor: "#888",
                    tabBarIcon: ({ color, size }) => {
                        let iconName: string = "home";
                        if (route.name === "FavoritesTab") iconName = "favorite";
                        return <Icon name={iconName} size={size} color={color} />;
                    },
                })}
            >
                <Tab.Screen
                    name="HomeTab"
                    component={HomeStack}
                    options={{ tabBarLabel: "Home" }}
                />
                <Tab.Screen
                    name="FavoritesTab"
                    component={FavoriteScreen}
                    options={{ tabBarLabel: "Favorites" }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    </Provider>
);

export default RootWindow;
