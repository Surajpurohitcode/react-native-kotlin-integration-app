import React, { useState, useEffect } from "react";
import {
    Text,
    SafeAreaView,
    StyleSheet,
    FlatList,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    StatusBar,
    ActivityIndicator,
    ToastAndroid,
} from "react-native";
import SearchIcon from "../src/assets/search_icon_ic 1.svg";
import UserNotFoundIcon from "../src/assets/user_not_found_state.svg";
import { Result } from "../src/types/Result"; // your Result<T> file
import LottieView from "lottie-react-native";
import { NativeModules } from "react-native";
const { BatteryModule } = NativeModules;

// User interface
interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
    department: string;
    location: string;
}

interface UserCardProps {
    user: User;
    onPress: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => (
    <TouchableOpacity style={styles.userCard} onPress={() => onPress(user)}>
        <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
        </View>

        <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.departmentBadge}>
                <Text style={styles.departmentText}>{user.department || "N/A"}</Text>
            </View>
        </View>
    </TouchableOpacity>
);

export default function ListScreen({ navigation }: any): React.JSX.Element {
    const [result, setResult] = useState<Result<User[]>>({ status: "loading" });
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setResult({ status: "loading" });

            try {
                const response = await fetch("https://dummyjson.com/users");
                const data = await response.json();

                const users: User[] = data.users.map((u: any) => ({
                    id: String(u.id),
                    name: `${u.firstName} ${u.lastName}`,
                    email: u.email,
                    role: u.company?.title || "N/A",
                    avatar: u.image,
                    department: u.company?.department || "N/A",
                    location: u.address?.city || "Unknown",
                }));

                setAllUsers(users);
                setResult({ status: "success", data: users });
            } catch (error) {
                setResult({
                    status: "error",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const getBattery = async () => {
            try {
                const level = await BatteryModule.getBatteryLevel(); // call native module
                setBatteryLevel(level);
            } catch (e) {
                console.log("Battery fetch error:", e);
            }
        };

        getBattery();

        const interval = setInterval(getBattery, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = (query: string): void => {
        setSearchQuery(query);

        if (query.trim() === "") {
            setResult({ status: "success", data: allUsers });
            return;
        }

        const filtered = allUsers.filter(
            (user) =>
                user.name.toLowerCase().includes(query.toLowerCase()) ||
                user.email.toLowerCase().includes(query.toLowerCase()) ||
                user.role.toLowerCase().includes(query.toLowerCase()) ||
                user.department.toLowerCase().includes(query.toLowerCase()) ||
                user.location.toLowerCase().includes(query.toLowerCase())
        );

        setResult({ status: "success", data: filtered });
    };

    const handleUserPress = (user: User): void => {
        console.log("User selected:", user.name);
        ToastAndroid.show(`User selected: ${user.name}`, ToastAndroid.SHORT);
        navigation.navigate("Details", { user });
    };

    const renderHeader = (): React.JSX.Element => (
        <View style={styles.header}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View>
                    <Text style={styles.title}>Directory</Text>
                    {result.status === "success" && (
                        <Text style={styles.subtitle}>{result.data.length} users</Text>
                    )}
                </View>

                <View style={styles.batteryContainer}>
                    <Text style={{ marginRight: 6 }}>🔋</Text>
                    <Text style={styles.batteryText}>
                        {batteryLevel !== null ? `${batteryLevel}%` : "--"}
                    </Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {renderHeader()}

            {/* Search */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <SearchIcon width={24} height={24} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by name, role, department..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                </View>
            </View>

            {/* Loading */}
            {result.status === "loading" && (
                <LottieView
                    source={require('../src/assets/animations/loading.json')}
                    autoPlay
                    loop
                    style={{ width: 350, height: 350 }}
                />
            )}

            {/* Error */}
            {result.status === "error" && (
                <View style={{ marginTop: 50, alignItems: "center" }}>
                     <UserNotFoundIcon width={250} height={250} />
                    <Text>{result.error}</Text>
                </View>
            )}

            {/* Success */}
            {result.status === "success" && (
                <FlatList
                    data={result.data}
                    keyExtractor={(item: User) => item.id}
                    renderItem={({ item }) => (
                        <UserCard user={item} onPress={handleUserPress} />
                    )}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={{ marginTop: 50, alignItems: "center" }}>
                            <Text>No users found</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F1F5F9" },
    header: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 20,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E2E8F0",
    },
    title: { fontSize: 32, fontWeight: "800", color: "#0F172A", marginBottom: 4 },
    subtitle: { fontSize: 16, color: "#64748B", fontWeight: "500" },
    searchContainer: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E2E8F0",
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        borderRadius: 16,
        paddingHorizontal: 20,
        height: 56,
        borderWidth: 2,
        borderColor: "#E2E8F0",
    },
    searchIcon: { marginRight: 16, opacity: 0.6 },
    searchInput: { flex: 1, fontSize: 16, color: "#0F172A", paddingVertical: 0 },
    listContainer: { paddingTop: 12, paddingBottom: 32 },
    userCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingVertical: 20,
        paddingHorizontal: 24,
        marginHorizontal: 16,
        marginVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e0e0e0ff",
    },
    avatarContainer: { marginRight: 16 },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#F8FAFC",
    },
    userInfo: { flex: 1, marginRight: 16 },
    userName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#0F172A",
        marginBottom: 4,
    },
    userEmail: { fontSize: 13, color: "#94A3B8", fontWeight: "400" },
    departmentBadge: {
        backgroundColor: "#F1F5F9",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: "flex-start",
        marginTop: 8,
    },
    departmentText: { fontSize: 14, color: "#64748B", fontWeight: "500" },
    batteryContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F1F5F9",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    batteryText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#0F172A",
    },

});
