import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, StatusBar } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";

type RootStackParamList = {
  Details: { user: User };
};

type DetailsScreenRouteProp = RouteProp<RootStackParamList, "Details">;

// This matches the simplified user object from your ListScreen
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  department: string;
  location: string;
}

export default function UserDetailsScreen() {
  const route = useRoute<DetailsScreenRouteProp>();
  const { user } = route.params;

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1E293B" />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: user.avatar }} style={styles.profileImage} />
            <View style={styles.statusIndicator} />
          </View>
          
          <View style={styles.headerInfo}>
            <Text style={styles.fullName}>{user.name}</Text>
            <Text style={styles.userId}>ID: {user.id}</Text>
            {user.role && user.role !== "N/A" && (
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{user.role.toUpperCase()}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Contact Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.card}>
            <InfoRow label="Email Address" value={user.email} isEmail />
          </View>
        </View>

        {/* Professional Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Information</Text>
          <View style={styles.card}>
            <InfoRow label="Position" value={user.role !== "N/A" ? user.role : "Not specified"} />
            <InfoRow label="Department" value={user.department !== "N/A" ? user.department : "Not specified"} />
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.card}>
            <InfoRow label="Current Location" value={user.location !== "Unknown" ? user.location : "Not specified"} isLocation />
          </View>
        </View>

        {/* Additional Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>User ID</Text>
                <Text style={styles.summaryValue}>{user.id}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Status</Text>
                <View style={styles.statusContainer}>
                  <View style={styles.activeStatus} />
                  <Text style={styles.summaryValue}>Active</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

function InfoRow({ 
  label, 
  value, 
  isEmail = false, 
  isLocation = false 
}: { 
  label: string; 
  value: string; 
  isEmail?: boolean; 
  isLocation?: boolean; 
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[
        styles.value, 
        isEmail && styles.emailValue,
        isLocation && styles.locationValue
      ]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  contentContainer: {
    paddingBottom: 32,
  },
  headerSection: {
    backgroundColor: "#1E293B",
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  statusIndicator: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#10B981",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  headerInfo: {
    alignItems: "center",
  },
  fullName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
    textAlign: "center",
  },
  userId: {
    fontSize: 16,
    color: "#94A3B8",
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 20,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  infoRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1E293B",
    lineHeight: 22,
  },
  emailValue: {
    color: "#3B82F6",
  },
  locationValue: {
    color: "#10B981",
  },
});