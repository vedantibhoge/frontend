import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Modal,
  Dimensions,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart, LineChart, PieChart, PopulationPyramid, RadarChart, BubbleChart } from "react-native-gifted-charts";
const { width, height } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const isMobile = !isWeb || width < 768;
const isTablet = isWeb && width >= 768 && width < 1100;
const isDesktop = isWeb && width >= 1100;
const showSidebar = isWeb && width >= 1000;
const data=[ {value:50}, {value:80}, {value:90}, {value:70} ]

// Responsive values
const getResponsiveValue = (mobile, tablet, desktop, webDefault) => {
  if (isDesktop) return desktop;
  if (isTablet) return tablet;
  if (isMobile) return mobile;
  return webDefault || tablet;
};

export default function StudentDashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <StatusBar barStyle="light-content" />
      
      {/* Mobile Header with Hamburger */}
      {isMobile && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity 
            style={styles.hamburgerBtn}
            onPress={() => setSidebarVisible(true)}
          >
            <Icon name="menu" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.mobileLogo}>Campus360</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Icon name="notifications" size={22} color="#cbd5f1" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={{ flex: 1, flexDirection: showSidebar ? "row" : "column" }}>
        {/* Sidebar for Desktop */}
        {showSidebar && <Sidebar />}

        {/* Mobile Sidebar Modal */}
        <Modal
          visible={sidebarVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSidebarVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={styles.modalBackdrop}
              onPress={() => setSidebarVisible(false)}
            />
            <View style={styles.mobileSidebar}>
              <View style={styles.mobileSidebarHeader}>
                <Text style={styles.mobileSidebarLogo}>Campus360</Text>
                <TouchableOpacity 
                  onPress={() => setSidebarVisible(false)}
                  style={styles.closeBtn}
                >
                  <Icon name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <SidebarContent onSelect={() => setSidebarVisible(false)} />
            </View>
          </View>
        </Modal>

        <View style={styles.container}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Desktop Header */}
            {!isMobile && (
              <View style={styles.header}>
                <View style={styles.profileRow}>
                  <Image
                    source={{
                      uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7sbVITDIt38IRi2s8it-MpyERkNvfFhc6oqO4OZtO0yoypoF8OfOZcJI6m-6cXnNH67zGXdHDQ6Tik9pkRyI-u80EsI3kNGLF_tZTr1KqzGcfwObpnrh3dcPOGs5bADGILre8oyzQGYCK2enZpX5g-AFNGgFBQU6Yj4mDHI4ff9rlzvAv-wNIaK_iS8Y9ZE8dr8qlKSG6CP_bux3QrpKBhUr9FkOHTDltLMc0RKUaD6Spr41Bw0ooqsn6IgHt4EHjp_BpoVmYh4H_",
                    }}
                    style={styles.avatar}
                  />
                  <View>
                    <Text style={styles.welcome}>Welcome back, Alex</Text>
                    <Text style={styles.subText}>Computer Science • Year 3</Text>
                  </View>
                </View>

                <View style={styles.headerIcons}>
                  <TouchableOpacity style={styles.iconBtn}>
                    <Icon name="notifications" size={22} color="#cbd5f1" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconBtn}>
                    <Icon name="settings" size={22} color="#cbd5f1" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Mobile Profile Card */}
            {isMobile && (
              <View style={styles.mobileProfileCard}>
                <Image
                  source={{
                    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7sbVITDIt38IRi2s8it-MpyERkNvfFhc6oqO4OZtO0yoypoF8OfOZcJI6m-6cXnNH67zGXdHDQ6Tik9pkRyI-u80EsI3kNGLF_tZTr1KqzGcfwObpnrh3dcPOGs5bADGILre8oyzQGYCK2enZpX5g-AFNGgFBQU6Yj4mDHI4ff9rlzvAv-wNIaK_iS8Y9ZE8dr8qlKSG6CP_bux3QrpKBhUr9FkOHTDltLMc0RKUaD6Spr41Bw0ooqsn6IgHt4EHjp_BpoVmYh4H_",
                  }}
                  style={styles.mobileAvatar}
                />
                <View style={styles.mobileProfileInfo}>
                  <Text style={styles.welcome}>Welcome back, Alex</Text>
                  <Text style={styles.subText}>Computer Science • Year 3</Text>
                </View>
              </View>
            )}

            {/* Next Class Card */}
            <View style={styles.primaryCard}>
              <Text style={styles.badge}>UP NEXT</Text>
              <Text style={styles.primaryTitle}>Advanced Algorithms</Text>

              <View style={styles.row}>
                <Icon name="schedule" size={16} color="#c7d2fe" />
                <Text style={styles.primaryText}>10:30 AM - 12:00 PM</Text>
              </View>

              <View style={styles.row}>
                <Icon name="place" size={16} color="#c7d2fe" />
                <Text style={styles.primaryText}>Block C, Room 402</Text>
              </View>

              <TouchableOpacity style={styles.joinBtn}>
                <Text style={styles.joinText}>Join Session</Text>
              </TouchableOpacity>
            </View>

            {/* Assignments */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Assignments Due</Text>

              <AssignmentItem
                icon="description"
                title="OS Final Project"
                subject="CS-302 Operating Systems"
                due="2h Left"
                color="#ef4444"
              />

              <AssignmentItem
                icon="quiz"
                title="Database Quiz II"
                subject="CS-305 Databases"
                due="Tomorrow"
                color="#f59e0b"
              />
            </View>

            {/* AI Shortcut */}
            <View style={styles.aiCard}>
              <Icon name="auto-awesome" size={34} color="#fff" />
              <Text style={styles.aiTitle}>Stuck on a topic?</Text>
              <Text style={styles.aiDesc}>
                Our AI Assistant is ready to help
              </Text>

              <TouchableOpacity style={styles.aiBtn}>
                <Text style={styles.aiBtnText}>ASK AI NOW</Text>
              </TouchableOpacity>
            </View>
{/* Performance Chart */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Performance</Text>
              <LineChart 
                data={data}
                areaChart
                width={getResponsiveValue(width - 80, width - 200, width - 400, width - 200)}
                height={130}
                color="#3B82F6"
                curved
                hideDataPoints
                spacing={getResponsiveValue(40, 50, 60, 50)}
                hideRules
                hideYAxisText
                noOfSections={4}
                maxValue={100}
                yAxisColor="transparent"
                xAxisColor="#334155"
              />
            </View>

            {/* Achievements */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Achievements</Text>

              <View style={styles.achGrid}>
                <Badge icon="workspace-premium" label="Early Bird" />
                <Badge icon="psychology" label="Solver" />
                <Badge icon="trending-up" label="Top Scorer" />
                <Badge icon="groups" label="Team Lead" />
              </View>
            </View>

            {/* Announcement */}
            <View style={styles.announce}>
              <Icon name="campaign" size={22} color="#1e3a8a" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.announceTitle}>
                  New Campus Announcement
                </Text>
                <Text style={styles.announceText}>
                  Library will be open 24/7 during finals week.
                </Text>
              </View>
            </View>

          </ScrollView>
        </View>
      </View>

      {/* Mobile Bottom Navigation */}
      {isMobile && <BottomNav />}
    </SafeAreaView>
  );
}

function Sidebar() {
  return (
    <View style={styles.sidebar}>
      <Text style={styles.logo}>Campus360</Text>
      <SidebarContent />
    </View>
  );
}

function SidebarContent({ onSelect }) {
  const [active, setActive] = useState("Dashboard");

  const menuItems = [
    { icon: "dashboard", label: "Dashboard" },
    { icon: "event-note", label: "Attendance" },
    { icon: "assignment", label: "Assignments" },
    { icon: "menu-book", label: "Courses" },
    { icon: "chat", label: "Messages" },
    { icon: "settings", label: "Settings" },
  ];

  return (
    <View style={isMobile ? {} : styles.sidebarMenu}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={[
            styles.sideItem,
            active === item.label && styles.sideItemActive,
          ]}
          onPress={() => {
            setActive(item.label);
            if (onSelect) onSelect();
          }}
        >
          <Icon
            name={item.icon}
            size={20}
            color={active === item.label ? "#fff" : "#94a3b8"}
          />
          <Text
            style={[
              styles.sideText,
              active === item.label && { color: "#fff" },
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function BottomNav() {
  const [active, setActive] = useState("Dashboard");

  const menuItems = [
    { icon: "dashboard", label: "Home" },
    { icon: "event-note", label: "Attendance" },
    { icon: "add-circle", label: "", isAction: true },
    { icon: "menu-book", label: "Courses" },
    { icon: "person", label: "Profile" },
  ];

  return (
    <View style={styles.bottomNav}>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={item.label || index}
          style={[
            styles.bottomNavItem,
            item.isAction && styles.bottomNavAction,
          ]}
          onPress={() => setActive(item.label)}
        >
          <Icon
            name={item.icon}
            size={item.isAction ? 32 : 24}
            color={item.isAction ? "#3B82F6" : active === item.label ? "#3B82F6" : "#94a3b8"}
          />
          {item.label && (
            <Text
              style={[
                styles.bottomNavLabel,
                active === item.label && styles.bottomNavLabelActive,
              ]}
            >
              {item.label}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function AssignmentItem({ icon, title, subject, due, color }) {
  return (
    <View style={styles.assignmentRow}>
      <View style={[styles.assignIcon, { backgroundColor: color + "22" }]}>
        <Icon name={icon} size={20} color={color} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.assignTitle}>{title}</Text>
        <Text style={styles.assignSub}>{subject}</Text>
      </View>

      <Text style={[styles.assignDue, { color }]}>{due}</Text>
    </View>
  );
}

function Badge({ icon, label }) {
  const badgeWidth = isMobile ? "48%" : isTablet ? "31%" : "23%";
  
  return (
    <View style={[styles.badgeBox, { width: badgeWidth }]}>
      <Icon name={icon} size={26} color="#1e3a8a" />
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Mobile Header
  mobileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#020617",
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  hamburgerBtn: {
    padding: 8,
  },
  mobileLogo: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    flexDirection: "row",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  mobileSidebar: {
    width: 280,
    backgroundColor: "#020617",
    paddingTop: 20,
    paddingHorizontal: 18,
  },
  mobileSidebarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  mobileSidebarLogo: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },
  closeBtn: {
    padding: 8,
  },
  sidebarMenu: {
    marginTop: 10,
  },

  // Container
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  scrollContent: {
    paddingBottom: 100,
    paddingHorizontal: getResponsiveValue(16, 20, 24, 20),
  },

  // Header
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 16,
    marginRight: 12,
  },
  welcome: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  subText: {
    color: "#94a3b8",
    fontSize: 12,
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconBtn: {
    padding: 10,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    marginLeft: 10,
  },

  // Mobile Profile Card
  mobileProfileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  mobileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 14,
    marginRight: 12,
  },
  mobileProfileInfo: {
    flex: 1,
  },

  // Primary Card
  primaryCard: {
    backgroundColor: "#1e3a8a",
    marginBottom: 20,
    borderRadius: 18,
    padding: 18,
  },
  badge: {
    color: "#c7d2fe",
    fontSize: 11,
    fontWeight: "700",
  },
  primaryTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    marginVertical: 8,
  },
  primaryText: {
    color: "#e0e7ff",
    marginLeft: 6,
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  joinBtn: {
    marginTop: 16,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  joinText: {
    color: "#1e3a8a",
    fontWeight: "700",
  },

  // Card
  card: {
    backgroundColor: "#111827",
    marginBottom: 16,
    borderRadius: 18,
    padding: 16,
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 12,
    fontSize: 16,
  },

  // Sidebar
  sidebar: {
    width: 340,
    backgroundColor: "#020617",
    paddingTop: 30,
    paddingHorizontal: 18,
    borderRightWidth: 1,
    borderRightColor: "#1e293b",
  },
  logo: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 30,
  },
  sideItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 6,
  },
  sideItemActive: {
    backgroundColor: "#1e3a8a",
  },
  sideText: {
    color: "#94a3b8",
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "600",
  },

  // Assignment
  assignmentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  
  },
  assignIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  assignTitle: {
    color: "#e5e7eb",
    fontWeight: "600",
  },
  assignSub: {
    color: "#6b7280",
    fontSize: 12,
  },
  assignDue: {
    fontWeight: "700",
    fontSize: 12,
  },

  // AI Card
  aiCard: {
    marginBottom: 16,
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#4338ca",
  },
  aiTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 10,
  },
  aiDesc: {
    color: "#c7d2fe",
    fontSize: 12,
    marginVertical: 6,
  },
  aiBtn: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#c7d2fe",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  aiBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  // charts
    chartContainer: { 
    backgroundColor: "#111827",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
   chartTitle: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 12,
    fontSize: 16,
  },  
  // Achievements
  achGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  badgeBox: {
    backgroundColor: "#0b1220",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  badgeText: {
    color: "#cbd5f1",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "600",
  },

  // Announcement
  announce: {
    flexDirection: "row",
    backgroundColor: "#e0e7ff",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  announceTitle: {
    fontWeight: "700",
    color: "#1e3a8a",
    fontSize: 13,
  },
  announceText: {
    fontSize: 12,
    color: "#334155",
  },

  // Bottom Navigation
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#020617",
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
    paddingVertical: 10,
    paddingBottom: Platform.OS === "ios" ? 30 : 10,
    justifyContent: "space-around",
    alignItems: "center",
  },
  bottomNavItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    flex: 1,
  },
  bottomNavAction: {
    marginTop: -20,
  },
  bottomNavLabel: {
    color: "#94a3b8",
    fontSize: 10,
    marginTop: 4,
  },
  bottomNavLabelActive: {
    color: "#3B82F6",
  },
});

