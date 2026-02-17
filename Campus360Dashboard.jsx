/**
 * Campus360 Dashboard — React Native
 *
 * Responsive layout:
 *  • Desktop (width >= 768px) → Sidebar always visible on the left
 *  • Mobile  (width <  768px) → Hamburger (☰) button; tap to slide sidebar in
 *
 * No third-party libraries required — pure React Native core.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  bg:          '#0F1117',
  sidebar:     '#131929',
  sidebarBrd:  '#1E2840',
  card:        '#181F33',
  cardAlt:     '#1A2236',
  accent:      '#5B5FEF',
  accentHov:   '#7B7FFF',
  accentDim:   '#252A5E',
  accentBrd:   '#3B3F8C',
  purple:      '#6C63FF',
  text:        '#F0F2FF',
  textSub:     '#8892B0',
  textMuted:   '#4A5278',
  border:      '#1E2840',
  amber:       '#F59E0B',
  greenDark:   '#14532D',
  greenText:   '#4ADE80',
  white:       '#FFFFFF',
};

const SIDEBAR_W = 230;
const DESKTOP_BP = 768;

// ─────────────────────────────────────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'dashboard',   icon: '⊞', label: 'Dashboard'          },
  { id: 'attendance',  icon: '👤', label: 'Attendance Marking' },
  { id: 'analytics',   icon: '📈', label: 'Analytics'          },
  { id: 'assignments', icon: '📋', label: 'Assignments'         },
  { id: 'planner',     icon: '📖', label: 'Lesson Planner'     },
  { id: 'exam',        icon: '📝', label: 'Exam Mgmt'          },
];

const SECTIONS = [
  { id: 'A', label: 'Section A', h: 0.70 },
  { id: 'B', label: 'Section B', h: 0.52 },
  { id: 'C', label: 'Section C', h: 0.88 },
  { id: 'D', label: 'Section D', h: 0.63 },
];

const MESSAGES = [
  { id: '1', name: 'Liam Johnson',      preview: 'Can we reschedule...',  time: '2m ago' },
  { id: '2', name: 'Prof. Elena Grace', preview: 'The faculty meeting...', time: '1h ago' },
];

const QUICK_ACTIONS = [
  { id: 'notes',      icon: '📄', label: 'Upload Notes' },
  { id: 'reschedule', icon: '📅', label: 'Reschedule'   },
  { id: 'grading',    icon: '📋', label: 'Grading Desk' },
  { id: 'advisory',   icon: '👥', label: 'Advisory'     },
];

const SCHEDULE = [
  {
    id: '1', status: 'now',
    title: 'Data Structures & Algos',
    sub:   'CS101 • Section A • Room 402',
    badge: '82% Present',
  },
  {
    id: '2', status: 'soon',
    title: 'Systems Design',
    sub:   'CS304 • Section C • Lab 02',
    time:  '11:30 AM – 12:45 PM',
  },
  {
    id: '3', status: 'later',
    title: 'Faculty Seminar',
    sub:   'Conference Hall B',
    time:  '02:00 PM – 03:00 PM',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SMALL HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const Initials = ({ name, size = 38 }) => (
  <View style={[s.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
    <Text style={[s.avatarTxt, { fontSize: size * 0.34 }]}>
      {name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
    </Text>
  </View>
);

const HRule = () => <View style={s.hRule} />;

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR CONTENT  (reused in both desktop panel and mobile drawer)
// ─────────────────────────────────────────────────────────────────────────────
const SidebarContent = ({ activeNav, setActiveNav, onNavPress }) => (
  <View style={s.sidebarInner}>
    {/* Logo */}
    <View style={s.logoRow}>
      <Text style={s.logoStar}>✦</Text>
      <Text style={s.logoLabel}>Campus360</Text>
    </View>

    {/* Nav list */}
    <View style={s.navList}>
      {NAV.map(item => {
        const active = item.id === activeNav;
        return (
          <TouchableOpacity
            key={item.id}
            style={[s.navItem, active && s.navItemOn]}
            onPress={() => { setActiveNav(item.id); onNavPress?.(); }}
            activeOpacity={0.75}
          >
            {active && <View style={s.navPill} />}
            <Text style={s.navIcon}>{item.icon}</Text>
            <Text style={[s.navLabel, active && s.navLabelOn]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>

    {/* Profile footer */}
    <View style={s.profileRow}>
      <Initials name="Dr. Sarah S" size={38} />
      <View style={s.profileTxt}>
        <Text style={s.profileName}>Dr. Sarah S.</Text>
        <Text style={s.profileRole}>Senior Professor</Text>
      </View>
      <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={s.logoutIco}>↪</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// ─────────────────────────────────────────────────────────────────────────────
// BAR CHART
// ─────────────────────────────────────────────────────────────────────────────
const PerfChart = ({ activeBatch }) => {
  const MAX = 120;
  return (
    <View style={s.chartWrap}>
      {SECTIONS.map(sec => (
        <View key={sec.id} style={s.chartCol}>
          {/* ghost (2023) bar sitting below main bar */}
          <View style={[s.barGhost, { height: MAX * sec.h * 0.74 }]} />
          {/* primary bar */}
          <View style={[s.bar, { height: MAX * sec.h }]} />
          <Text style={s.chartLbl}>{sec.label}</Text>
        </View>
      ))}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export default function Campus360Dashboard() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BP;

  const [activeNav,   setActiveNav]   = useState('dashboard');
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [activeBatch, setActiveBatch] = useState('2024');

  // Animated values for mobile drawer
  const slideX = useRef(new Animated.Value(-SIDEBAR_W)).current;
  const scrimO = useRef(new Animated.Value(0)).current;

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.parallel([
      Animated.spring(slideX, { toValue: 0, useNativeDriver: true, bounciness: 0, speed: 14 }),
      Animated.timing(scrimO, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(slideX, { toValue: -SIDEBAR_W, duration: 200, useNativeDriver: true }),
      Animated.timing(scrimO, { toValue: 0,          duration: 200, useNativeDriver: true }),
    ]).start(() => setDrawerOpen(false));
  };

  // Auto-close if viewport grows to desktop size
  useEffect(() => { if (isDesktop && drawerOpen) closeDrawer(); }, [isDesktop]);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <View style={s.root}>

        {/* ════════════════════════════════════════════════════════
            DESKTOP — permanent sidebar
        ════════════════════════════════════════════════════════ */}
        {isDesktop && (
          <View style={s.desktopSidebar}>
            <SidebarContent
              activeNav={activeNav}
              setActiveNav={setActiveNav}
            />
          </View>
        )}

        {/* ════════════════════════════════════════════════════════
            MOBILE — animated drawer
        ════════════════════════════════════════════════════════ */}
        {!isDesktop && drawerOpen && (
          <>
            {/* Semi-transparent scrim */}
            <TouchableWithoutFeedback onPress={closeDrawer}>
              <Animated.View style={[s.scrim, { opacity: scrimO }]} />
            </TouchableWithoutFeedback>

            {/* Sliding panel */}
            <Animated.View
              style={[s.mobileDrawer, { transform: [{ translateX: slideX }] }]}
            >
              <SidebarContent
                activeNav={activeNav}
                setActiveNav={setActiveNav}
                onNavPress={closeDrawer}
              />
            </Animated.View>
          </>
        )}

        {/* ════════════════════════════════════════════════════════
            MAIN CONTENT AREA
        ════════════════════════════════════════════════════════ */}
        <View style={s.main}>

          {/* ── Top bar ── */}
          <View style={s.topBar}>
            <View style={s.topLeft}>
              {/* ☰ Hamburger — only on mobile */}
              {!isDesktop && (
                <TouchableOpacity
                  onPress={openDrawer}
                  style={s.hamburger}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <View style={s.hamLine} />
                  <View style={[s.hamLine, { width: 16 }]} />
                  <View style={s.hamLine} />
                </TouchableOpacity>
              )}
              <View>
                <Text style={s.greetName}>Good Morning, Dr. Smith</Text>
                <Text style={s.greetDate}>Monday, October 23rd • Semester Fall 2024</Text>
              </View>
            </View>

            <View style={s.topRight}>
              <TouchableOpacity style={s.bellBtn}>
                <Text style={{ fontSize: 16 }}>🔔</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.liveBtn}>
                <Text style={s.liveTxt}>▶  Start Live Class</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Scrollable page body ── */}
          <ScrollView
            style={s.scroll}
            contentContainerStyle={s.scrollPad}
            showsVerticalScrollIndicator={false}
          >
            {/*
              Two-column split on desktop:
                left  → performance chart + messages + quick actions
                right → doubts + schedule + announcement
            */}
            <View style={[s.columns, isDesktop && s.columnsRow]}>

              {/* ─── LEFT COLUMN ─── */}
              <View style={[s.colLeft, isDesktop && s.colLeftDesk]}>

                {/* Performance Card */}
                <View style={s.card}>
                  <View style={s.cardHead}>
                    <View>
                      <Text style={s.cardTitle}>Class Average Performance</Text>
                      <Text style={s.cardSub}>Mid-term Comparison (2024)</Text>
                    </View>
                    <View style={s.batchToggle}>
                      {['2024','2023'].map(b => (
                        <TouchableOpacity
                          key={b}
                          style={[s.batchBtn, activeBatch === b && s.batchBtnOn]}
                          onPress={() => setActiveBatch(b)}
                        >
                          <Text style={[s.batchTxt, activeBatch === b && s.batchTxtOn]}>
                            Batch {b}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <PerfChart activeBatch={activeBatch} />
                </View>

                {/* Messages + Quick Actions side-by-side on desktop */}
                <View style={[s.twoUp, isDesktop && s.twoUpRow]}>

                  {/* Recent Messages */}
                  <View style={[s.card, s.half]}>
                    <View style={s.cardHead}>
                      <Text style={s.cardTitle}>💬 Recent Messages</Text>
                      <TouchableOpacity>
                        <Text style={s.viewAll}>View All</Text>
                      </TouchableOpacity>
                    </View>
                    {MESSAGES.map((m, i) => (
                      <View key={m.id}>
                        {i > 0 && <HRule />}
                        <TouchableOpacity style={s.msgRow} activeOpacity={0.7}>
                          <Initials name={m.name} size={38} />
                          <View style={s.msgBody}>
                            <View style={s.msgTop}>
                              <Text style={s.msgName} numberOfLines={1}>{m.name}</Text>
                              <Text style={s.msgTime}>{m.time}</Text>
                            </View>
                            <Text style={s.msgPrev} numberOfLines={1}>{m.preview}</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>

                  {/* Quick Actions */}
                  <View style={[s.card, s.half]}>
                    <Text style={s.cardTitle}>🔧 Quick Actions</Text>
                    <View style={s.actGrid}>
                      {QUICK_ACTIONS.map(a => (
                        <TouchableOpacity key={a.id} style={s.actBtn} activeOpacity={0.75}>
                          <Text style={s.actIco}>{a.icon}</Text>
                          <Text style={s.actLbl}>{a.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              </View>

              {/* ─── RIGHT COLUMN ─── */}
              <View style={[s.colRight, isDesktop && s.colRightDesk]}>

                {/* Pending Doubts */}
                <View style={[s.card, s.doubtCard]}>
                  <View style={s.doubtTop}>
                    <View>
                      <Text style={s.cardTitle}>Pending Doubts</Text>
                      <Text style={s.doubtNum}>12</Text>
                      <Text style={s.doubtSub}>4 urgent queries from CS201 class</Text>
                    </View>
                    <View style={s.bellCircle}>
                      <Text style={{ fontSize: 20 }}>🔔</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={s.reviewBtn} activeOpacity={0.8}>
                    <Text style={s.reviewTxt}>Review Doubts</Text>
                  </TouchableOpacity>
                </View>

                {/* Today's Schedule */}
                <View style={s.card}>
                  <View style={s.cardHead}>
                    <Text style={s.cardTitle}>📅 Today's Schedule</Text>
                    <Text style={s.dateChip}>OCT 23</Text>
                  </View>
                  {SCHEDULE.map((item, i) => {
                    const isNow  = item.status === 'now';
                    const dotClr = isNow ? C.accent : item.status === 'soon' ? C.accentDim : C.textMuted;
                    return (
                      <View
                        key={item.id}
                        style={[
                          s.schedItem,
                          i > 0 && s.schedBorder,
                          isNow && s.schedNow,
                        ]}
                      >
                        <View style={[s.schedDot, { backgroundColor: dotClr }]} />
                        <View style={s.schedBody}>
                          {isNow    && <Text style={s.nowTag}>NOW HAPPENING</Text>}
                          {item.time && <Text style={s.schedTime}>{item.time}</Text>}
                          <Text style={s.schedTitle}>{item.title}</Text>
                          <Text style={s.schedSub}>{item.sub}</Text>
                          {item.badge && (
                            <View style={s.presentBadge}>
                              <Text style={s.presentTxt}>{item.badge}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* Announcement */}
                <View style={[s.card, { marginBottom: 0 }]}>
                  <Text style={s.cardTitle}>📢 Announcement</Text>
                  <Text style={s.announceBody}>
                    End-term paper submissions are due by Friday. Please ensure all pending
                    grading is completed in the system.
                  </Text>
                </View>

              </View>
            </View>

            {/* bottom breathing room */}
            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({

  safe: { flex: 1, backgroundColor: C.bg },
  root: { flex: 1, flexDirection: 'row' },

  // ─── Desktop sidebar ───────────────────────────────────────────────────────
  desktopSidebar: {
    width: SIDEBAR_W,
    backgroundColor: C.sidebar,
    borderRightWidth: 1,
    borderRightColor: C.sidebarBrd,
  },

  // ─── Mobile scrim + drawer ────────────────────────────────────────────────
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    zIndex: 10,
  },
  mobileDrawer: {
    position:        'absolute',
    top: 0, bottom: 0, left: 0,
    width:           SIDEBAR_W,
    backgroundColor: C.sidebar,
    borderRightWidth: 1,
    borderRightColor: C.sidebarBrd,
    zIndex:          11,
    elevation:       18,
    shadowColor:     '#000',
    shadowOffset:    { width: 8, height: 0 },
    shadowOpacity:   0.55,
    shadowRadius:    18,
  },

  // ─── Sidebar inner ────────────────────────────────────────────────────────
  sidebarInner: {
    flex: 1,
    paddingTop:        30,
    paddingHorizontal: 14,
    paddingBottom:     20,
  },
  logoRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 32, paddingLeft: 4 },
  logoStar: { color: C.accent, fontSize: 20, marginRight: 8 },
  logoLabel:{ color: C.text,   fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },

  navList: { flex: 1 },
  navItem: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderRadius:   10,
    marginBottom:   3,
    overflow:       'hidden',
  },
  navItemOn:  { backgroundColor: C.accentDim },
  navPill:    { position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, backgroundColor: C.accent, borderRadius: 3 },
  navIcon:    { fontSize: 16, width: 24, textAlign: 'center', marginRight: 10 },
  navLabel:   { color: C.textSub, fontSize: 14, fontWeight: '500' },
  navLabelOn: { color: C.accent,  fontWeight: '700' },

  profileRow: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingTop:     16,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  profileTxt:  { flex: 1, marginLeft: 10 },
  profileName: { color: C.text,   fontSize: 13, fontWeight: '700' },
  profileRole: { color: C.textSub, fontSize: 11, marginTop: 1 },
  logoutIco:   { color: C.textMuted, fontSize: 18, paddingLeft: 6 },

  // ─── Avatar ───────────────────────────────────────────────────────────────
  avatar:    { backgroundColor: C.accentDim, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { color: C.accentHov, fontWeight: '800' },

  // ─── Main area ────────────────────────────────────────────────────────────
  main: { flex: 1, overflow: 'hidden' },

  // ─── Top bar ──────────────────────────────────────────────────────────────
  topBar: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingHorizontal: 18,
    paddingVertical:   13,
    backgroundColor:   C.bg,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  topLeft:  { flexDirection: 'row', alignItems: 'center', flex: 1 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  // Three-line hamburger
  hamburger: { marginRight: 14, justifyContent: 'center', gap: 5 },
  hamLine:   { height: 2, width: 22, backgroundColor: C.text, borderRadius: 2 },

  greetName: { color: C.text,     fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  greetDate: { color: C.textMuted, fontSize: 11, marginTop: 2 },

  bellBtn: {
    padding: 9,
    backgroundColor: C.card,
    borderRadius:    22,
    borderWidth:     1,
    borderColor:     C.border,
  },
  liveBtn: { backgroundColor: C.accent, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 22 },
  liveTxt: { color: C.white, fontWeight: '700', fontSize: 12, letterSpacing: 0.3 },

  // ─── Scroll ───────────────────────────────────────────────────────────────
  scroll:    { flex: 1 },
  scrollPad: { padding: 16 },

  // ─── Column layout ────────────────────────────────────────────────────────
  columns:     { flexDirection: 'column' },
  columnsRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  colLeft:     { flex: 1 },
  colLeftDesk: { flex: 3 },
  colRight:    { flex: 1 },
  colRightDesk:{ flex: 2 },

  twoUp:    { flexDirection: 'column' },
  twoUpRow: { flexDirection: 'row', gap: 14 },
  half:     { flex: 1 },

  // ─── Card ─────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: C.card,
    borderRadius:    16,
    padding:         16,
    marginBottom:    14,
    borderWidth:     1,
    borderColor:     C.border,
  },
  cardHead: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'flex-start',
    marginBottom:   14,
  },
  cardTitle: { color: C.text,     fontSize: 14, fontWeight: '700', marginBottom: 2 },
  cardSub:   { color: C.textMuted, fontSize: 11, fontStyle: 'italic' },

  // ─── Batch toggle ─────────────────────────────────────────────────────────
  batchToggle: { flexDirection: 'row', backgroundColor: C.bg, borderRadius: 20, padding: 3 },
  batchBtn:    { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  batchBtnOn:  { backgroundColor: C.accent },
  batchTxt:    { color: C.textMuted, fontSize: 11, fontWeight: '600' },
  batchTxtOn:  { color: C.white },

  // ─── Chart ────────────────────────────────────────────────────────────────
  chartWrap: {
    flexDirection:  'row',
    alignItems:     'flex-end',
    justifyContent: 'space-around',
    height:         155,
    paddingTop:     8,
  },
  chartCol:  { flex: 1, alignItems: 'center', justifyContent: 'flex-end', marginHorizontal: 4 },
  bar:       { width: '75%', backgroundColor: C.accent, borderRadius: 8, opacity: 0.88 },
  barGhost:  { width: '75%', backgroundColor: C.purple, borderRadius: 8, opacity: 0.28, marginBottom: 2 },
  chartLbl:  { color: C.textMuted, fontSize: 11, marginTop: 8 },

  // ─── Messages ─────────────────────────────────────────────────────────────
  hRule:   { height: 1, backgroundColor: C.border, marginVertical: 2 },
  viewAll: { color: C.accent, fontSize: 12, fontWeight: '600' },
  msgRow:  { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  msgBody: { flex: 1, marginLeft: 10 },
  msgTop:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  msgName: { color: C.text,     fontSize: 13, fontWeight: '600', flex: 1 },
  msgTime: { color: C.textMuted, fontSize: 10 },
  msgPrev: { color: C.textSub,  fontSize: 12 },

  // ─── Quick Actions ────────────────────────────────────────────────────────
  actGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  actBtn:  {
    width:           '47%',
    backgroundColor: C.cardAlt,
    borderRadius:    12,
    padding:         14,
    alignItems:      'center',
    borderWidth:     1,
    borderColor:     C.border,
  },
  actIco: { fontSize: 22, marginBottom: 6 },
  actLbl: { color: C.textSub, fontSize: 11, fontWeight: '600', textAlign: 'center' },

  // ─── Doubts ───────────────────────────────────────────────────────────────
  doubtCard:  { backgroundColor: C.accentDim, borderColor: C.accentBrd },
  doubtTop:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  doubtNum:   { color: C.text, fontSize: 48, fontWeight: '900', lineHeight: 56 },
  doubtSub:   { color: C.textSub, fontSize: 12, marginTop: 2 },
  bellCircle: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  reviewBtn:  { borderWidth: 1.5, borderColor: C.accentHov, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  reviewTxt:  { color: C.accentHov, fontWeight: '700', fontSize: 13 },

  // ─── Schedule ─────────────────────────────────────────────────────────────
  dateChip:   { color: C.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  schedItem:  { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12 },
  schedBorder:{ borderTopWidth: 1, borderTopColor: C.border },
  schedNow:   { backgroundColor: 'rgba(91,95,239,0.08)', marginHorizontal: -16, paddingHorizontal: 16, borderRadius: 10 },
  schedDot:   { width: 10, height: 10, borderRadius: 5, marginTop: 4, marginRight: 12 },
  schedBody:  { flex: 1 },
  nowTag:     { color: C.amber, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 3 },
  schedTime:  { color: C.textMuted, fontSize: 11, marginBottom: 2 },
  schedTitle: { color: C.text,    fontSize: 14, fontWeight: '700', marginBottom: 2 },
  schedSub:   { color: C.textSub, fontSize: 12 },
  presentBadge:{ backgroundColor: C.greenDark, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginTop: 6 },
  presentTxt: { color: C.greenText, fontSize: 11, fontWeight: '700' },

  // ─── Announcement ─────────────────────────────────────────────────────────
  announceBody: { color: C.textSub, fontSize: 13, lineHeight: 20, marginTop: 8 },
});
