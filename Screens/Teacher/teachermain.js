/**
 * Campus360 – Multi-Page Responsive Dashboard
 * ═══════════════════════════════════════════════
 * Pages:  Dashboard · Analytics · Assignments · Attendance · Lesson Planner · Exam Mgmt
 * Charts: Animated bar chart, line chart, donut chart — all pure React Native
 * Layout: Persistent sidebar on ≥768px · Slide drawer on mobile
 *
 * Run:  npx expo start   (Expo SDK 50+, zero extra deps)
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, StatusBar, SafeAreaView, useWindowDimensions,
} from 'react-native';

// ─── Constants ────────────────────────────────────────────────────────────────
const SIDEBAR_W  = 242;
const BREAKPOINT = 768;

// ─── Palette ─────────────────────────────────────────────────────────────────
const C = {
  bg:          '#0B0F1A',
  sidebar:     '#0F1629',
  card:        '#131C30',
  cardDeep:    '#0E1526',
  accent:      '#5B5FEF',
  accentLight: '#818CF8',
  accentDim:   '#1E234A',
  accentMuted: '#2D3480',
  bar:         '#6366F1',
  barGhost:    '#2E2C70',
  line:        '#06B6D4',
  lineAlt:     '#8B5CF6',
  green:       '#10B981',
  greenDim:    '#064E3B',
  amber:       '#F59E0B',
  red:         '#EF4444',
  redDim:      '#450A0A',
  text:        '#F1F5F9',
  textSec:     '#94A3B8',
  textMuted:   '#475569',
  border:      '#1A2540',
  borderSoft:  '#243055',
};

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'dashboard',   label: 'Dashboard',          icon: '⊞', color: C.accent },
  { id: 'analytics',   label: 'Analytics',           icon: '📊', color: '#06B6D4' },
  { id: 'attendance',  label: 'Attendance',          icon: '👤', color: '#10B981' },
  { id: 'assignments', label: 'Assignments',          icon: '📋', color: '#F59E0B' },
  { id: 'planner',     label: 'Lesson Planner',      icon: '📖', color: '#8B5CF6' },
  { id: 'exam',        label: 'Exam Mgmt',            icon: '📝', color: '#EF4444' },
];

// ══════════════════════════════════════════════════════════════════════════════
//  SHARED PRIMITIVES
// ══════════════════════════════════════════════════════════════════════════════

const Card = ({ children, style }) => (
  <View style={[sh.card, style]}>{children}</View>
);

const Row = ({ children, style }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>
);

const Avatar = ({ name, size = 38 }) => {
  const ini = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <View style={[sh.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[sh.avatarTxt, { fontSize: size * 0.33 }]}>{ini}</Text>
    </View>
  );
};

const Badge = ({ label, color = C.green, bg = C.greenDim }) => (
  <View style={[sh.badge, { backgroundColor: bg }]}>
    <Text style={[sh.badgeTxt, { color }]}>{label}</Text>
  </View>
);

const SectionTitle = ({ title, sub }) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={sh.pageTitle}>{title}</Text>
    {sub && <Text style={sh.pageSub}>{sub}</Text>}
  </View>
);

const sh = StyleSheet.create({
  card:      { backgroundColor: C.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: C.border, marginBottom: 14 },
  avatar:    { backgroundColor: C.accentDim, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: C.accentMuted },
  avatarTxt: { color: C.accentLight, fontWeight: '800' },
  badge:     { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start' },
  badgeTxt:  { fontSize: 10.5, fontWeight: '700' },
  pageTitle: { color: C.text, fontSize: 20, fontWeight: '900', letterSpacing: -0.4 },
  pageSub:   { color: C.textMuted, fontSize: 12, marginTop: 3 },
});

// ══════════════════════════════════════════════════════════════════════════════
//  CHARTS
// ══════════════════════════════════════════════════════════════════════════════

/** ── Animated Bar Chart ─────────────────────────────────────────────────── */
const BarChart = ({ data, comparison, maxH = 130 }) => {
  const mA = useRef(data.map(() => new Animated.Value(0))).current;
  const gA = useRef(comparison.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    mA.forEach(a => a.setValue(0));
    gA.forEach(a => a.setValue(0));
    Animated.parallel([
      ...data.map((_, i) => Animated.timing(mA[i], { toValue: 1, duration: 550, delay: i * 80, useNativeDriver: false })),
      ...comparison.map((_, i) => Animated.timing(gA[i], { toValue: 1, duration: 550, delay: i * 80 + 40, useNativeDriver: false })),
    ]).start();
  }, [data]);

  return (
    <View style={[ch.root, { height: maxH + 65 }]}>
      {[100, 75, 50, 25].map(p => (
        <View key={p} style={[ch.grid, { bottom: (p / 100) * maxH + 28 }]}>
          <Text style={ch.gridLbl}>{p}</Text>
          <View style={ch.gridLine} />
        </View>
      ))}
      <View style={[ch.barsRow, { paddingBottom: 28 }]}>
        {data.map((d, i) => {
          const mH = mA[i].interpolate({ inputRange: [0, 1], outputRange: [0, (d.val / 100) * maxH] });
          const gH = gA[i].interpolate({ inputRange: [0, 1], outputRange: [0, (comparison[i].val / 100) * maxH] });
          return (
            <View key={d.label} style={ch.group}>
              <View style={ch.stack}>
                <Animated.View style={[ch.barGhost, { height: gH }]} />
                <Animated.View style={[ch.bar, { height: mH }]} />
              </View>
              <Text style={ch.lbl}>{d.label}</Text>
              <Text style={ch.val}>{d.val}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

/** ── Animated Line Chart ────────────────────────────────────────────────── */
const LineChart = ({ data, color = C.line, label = '' }) => {
  const anim = useRef(new Animated.Value(0)).current;
  const W = 280, H = 100;
  const max = Math.max(...data.map(d => d.val));
  const min = Math.min(...data.map(d => d.val));
  const range = max - min || 1;

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: false }).start();
  }, [data]);

  const pts = data.map((d, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((d.val - min) / range) * (H - 16) - 8,
  }));

  const dotAnims = useRef(data.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    dotAnims.forEach(a => a.setValue(0));
    Animated.stagger(100, dotAnims.map(a =>
      Animated.timing(a, { toValue: 1, duration: 300, useNativeDriver: true })
    )).start();
  }, [data]);

  return (
    <View style={{ marginTop: 8 }}>
      <View style={{ height: H + 30, position: 'relative', marginHorizontal: 8 }}>
        {/* Grid lines */}
        {[0, 0.5, 1].map(f => (
          <View key={f} style={[lch.gridH, { top: f * H }]} />
        ))}
        {/* Line segments */}
        {pts.slice(0, -1).map((p, i) => {
          const nx = pts[i + 1];
          const dx = nx.x - p.x, dy = nx.y - p.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <View key={i} style={{
              position: 'absolute',
              left: p.x, top: p.y,
              width: len, height: 2.5,
              backgroundColor: color,
              borderRadius: 2,
              transform: [{ rotate: `${angle}deg` }],
              transformOrigin: 'left center',
              opacity: 0.9,
            }} />
          );
        })}
        {/* Dots */}
        {pts.map((p, i) => (
          <Animated.View key={i} style={[lch.dot, {
            left: p.x - 5, top: p.y - 5,
            backgroundColor: color,
            opacity: dotAnims[i],
            transform: [{ scale: dotAnims[i].interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) }],
          }]} />
        ))}
        {/* X Labels */}
        {data.map((d, i) => (
          <Text key={i} style={[lch.xLbl, { left: pts[i].x - 18, top: H + 6 }]}>{d.label}</Text>
        ))}
      </View>
    </View>
  );
};

/** ── Donut / Ring Chart ─────────────────────────────────────────────────── */
const DonutChart = ({ segments, size = 120 }) => {
  const r = (size - 20) / 2;
  const cx = size / 2, cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const arcs = segments.map(s => {
    const dash = (s.pct / 100) * circumference;
    const gap  = circumference - dash;
    const arc  = { color: s.color, dash, gap, offset, label: s.label, pct: s.pct };
    offset += dash;
    return arc;
  });

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: size, height: size, position: 'relative' }}>
        {/* Background ring */}
        <View style={[dc.ring, { width: size, height: size, borderRadius: size / 2, borderColor: C.border }]} />
        {/* Colored arcs using stacked borders (CSS trick via border segments) */}
        {arcs.map((arc, i) => {
          const angle = (arc.offset / circumference) * 360;
          const sweepAngle = (arc.dash / circumference) * 360;
          return (
            <View
              key={i}
              style={[
                dc.arcWrap,
                { width: size, height: size, transform: [{ rotate: `${angle}deg` }] },
              ]}
            >
              <View style={[
                dc.arcHalf,
                { width: size / 2, height: size,
                  backgroundColor: sweepAngle > 180 ? arc.color : 'transparent',
                }
              ]}>
                <View style={[dc.arcSlice, {
                  width: size, height: size,
                  borderRadius: size / 2,
                  borderColor: arc.color,
                  borderWidth: 10,
                  transform: [{ rotate: `${Math.min(sweepAngle, 180)}deg` }],
                }]} />
              </View>
            </View>
          );
        })}
        {/* Center text */}
        <View style={[dc.center, { width: size - 30, height: size - 30, borderRadius: (size - 30) / 2, left: 15, top: 15 }]}>
          <Text style={dc.centerNum}>{segments.reduce((a, b) => a + b.pct, 0) > 0 ? segments[0].pct + '%' : ''}</Text>
          <Text style={dc.centerLbl}>{segments[0]?.label || ''}</Text>
        </View>
      </View>
    </View>
  );
};

// Chart styles
const ch = StyleSheet.create({
  root:     { paddingLeft: 30, position: 'relative' },
  grid:     { position: 'absolute', left: 0, right: 0, flexDirection: 'row', alignItems: 'center' },
  gridLbl:  { color: C.textMuted, fontSize: 9, width: 24, textAlign: 'right', marginRight: 4 },
  gridLine: { flex: 1, height: 1, backgroundColor: C.border, opacity: 0.7 },
  barsRow:  { flexDirection: 'row', alignItems: 'flex-end', position: 'absolute', left: 30, right: 0, bottom: 0, top: 0, justifyContent: 'space-around' },
  group:    { alignItems: 'center', flex: 1, marginHorizontal: 3 },
  stack:    { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  bar:      { width: 22, backgroundColor: C.bar, borderTopLeftRadius: 6, borderTopRightRadius: 6, minHeight: 2 },
  barGhost: { width: 16, backgroundColor: C.barGhost, borderTopLeftRadius: 5, borderTopRightRadius: 5, minHeight: 2 },
  lbl:      { color: C.textMuted, fontSize: 9, marginTop: 6, textAlign: 'center' },
  val:      { color: C.accentLight, fontSize: 10, fontWeight: '700', marginTop: 1 },
});
const lch = StyleSheet.create({
  gridH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: C.border, opacity: 0.5 },
  dot:   { position: 'absolute', width: 10, height: 10, borderRadius: 5 },
  xLbl:  { position: 'absolute', color: C.textMuted, fontSize: 8.5, width: 36, textAlign: 'center' },
});
const dc = StyleSheet.create({
  ring:    { position: 'absolute', borderWidth: 10, borderColor: C.border },
  arcWrap: { position: 'absolute', overflow: 'hidden' },
  arcHalf: { overflow: 'hidden' },
  arcSlice:{ position: 'absolute', right: 0, top: 0, overflow: 'hidden' },
  center:  { position: 'absolute', backgroundColor: C.card, alignItems: 'center', justifyContent: 'center' },
  centerNum:{ color: C.text, fontSize: 22, fontWeight: '900' },
  centerLbl:{ color: C.textMuted, fontSize: 9 },
});

// ══════════════════════════════════════════════════════════════════════════════
//  PAGE: DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
const DASH_CHART = {
  '2024': [{ label: 'Sec A', val: 72 }, { label: 'Sec B', val: 56 }, { label: 'Sec C', val: 88 }, { label: 'Sec D', val: 64 }],
  '2023': [{ label: 'Sec A', val: 58 }, { label: 'Sec B', val: 74 }, { label: 'Sec C', val: 50 }, { label: 'Sec D', val: 80 }],
};
const SCHEDULE = [
  { id: '1', now: true,  title: 'Data Structures & Algos', sub: 'CS101 · Section A · Room 402', time: null,                  attend: '82% Present' },
  { id: '2', now: false, title: 'Systems Design',          sub: 'CS304 · Section C · Lab 02',  time: '11:30 AM – 12:45 PM', attend: null },
  { id: '3', now: false, title: 'Faculty Seminar',         sub: 'Conference Hall B',           time: '02:00 PM – 03:00 PM', attend: null },
];
const MSGS = [
  { id: '1', name: 'Liam Johnson',      preview: 'Can we reschedule...', time: '2m ago' },
  { id: '2', name: 'Prof. Elena Grace', preview: 'The faculty meeting...', time: '1h ago' },
];
const QUICK = [
  { id: 'notes', icon: '📄', label: 'Upload Notes' }, { id: 'sched', icon: '📅', label: 'Reschedule' },
  { id: 'grade', icon: '✏️',  label: 'Grading Desk' }, { id: 'adv',   icon: '👥', label: 'Advisory'   },
];

const DashboardPage = () => {
  const [batch, setBatch] = useState('2024');
  const main  = DASH_CHART[batch];
  const ghost = DASH_CHART[batch === '2024' ? '2023' : '2024'];

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      <SectionTitle title="Dashboard" sub="Monday, October 23rd  •  Fall 2024" />

      {/* Stats row */}
      <View style={pg.statsRow}>
        {[['Classes Today','4',C.accent],['Pending Doubts','12',C.amber],['Assignments','7',C.line],['Students','148',C.green]].map(([l,v,c]) => (
          <Card key={l} style={[pg.statCard, { borderTopColor: c, borderTopWidth: 3 }]}>
            <Text style={[pg.statNum, { color: c }]}>{v}</Text>
            <Text style={pg.statLbl}>{l}</Text>
          </Card>
        ))}
      </View>

      <View style={pg.grid}>
        {/* Left col */}
        <View style={pg.colLeft}>
          {/* Chart */}
          <Card>
            <View style={pg.chartHead}>
              <View style={{ flex: 1 }}>
                <Text style={pg.cardTitle}>Class Average Performance</Text>
                <Text style={pg.cardSub}>Mid-term Comparison (2024)</Text>
              </View>
              <View style={pg.toggle}>
                {['2024','2023'].map(b => (
                  <TouchableOpacity key={b} style={[pg.tBtn, batch === b && pg.tBtnA]} onPress={() => setBatch(b)}>
                    <Text style={[pg.tTxt, batch === b && pg.tTxtA]}>Batch {b}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={pg.legend}>
              {[['Batch '+batch, C.bar],['Batch '+(batch==='2024'?'2023':'2024'), C.barGhost]].map(([l,c]) => (
                <View key={l} style={pg.legItem}>
                  <View style={[pg.legDot, { backgroundColor: c }]} />
                  <Text style={pg.legTxt}>{l}</Text>
                </View>
              ))}
            </View>
            <BarChart data={main} comparison={ghost} />
          </Card>

          {/* Messages + Quick Actions */}
          <View style={pg.halfRow}>
            <Card style={{ flex: 1 }}>
              <View style={pg.rowBetween}>
                <Text style={pg.cardTitle}>💬 Messages</Text>
                <Text style={pg.viewAll}>View All</Text>
              </View>
              {MSGS.map(m => (
                <TouchableOpacity key={m.id} style={pg.msgRow}>
                  <Avatar name={m.name} size={34} />
                  <View style={{ flex: 1, marginLeft: 9 }}>
                    <View style={pg.rowBetween}>
                      <Text style={pg.msgName} numberOfLines={1}>{m.name}</Text>
                      <Text style={pg.msgTime}>{m.time}</Text>
                    </View>
                    <Text style={pg.msgPrev} numberOfLines={1}>{m.preview}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </Card>
            <Card style={{ flex: 1 }}>
              <Text style={[pg.cardTitle, { marginBottom: 12 }]}>🔧 Quick Actions</Text>
              <View style={pg.qaGrid}>
                {QUICK.map(q => (
                  <TouchableOpacity key={q.id} style={pg.qaBtn}>
                    <Text style={{ fontSize: 20, marginBottom: 4 }}>{q.icon}</Text>
                    <Text style={pg.qaLbl}>{q.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          </View>
        </View>

        {/* Right col */}
        <View style={pg.colRight}>
          {/* Doubts */}
          <Card style={{ backgroundColor: C.accentDim, borderColor: C.accent }}>
            <View style={pg.rowBetween}>
              <View>
                <Text style={pg.cardTitle}>Pending Doubts</Text>
                <Text style={pg.doubtNum}>12</Text>
                <Text style={pg.cardSub}>4 urgent from CS201</Text>
              </View>
              <View style={pg.notifRing}><Text style={{ fontSize: 18 }}>🔔</Text></View>
            </View>
            <TouchableOpacity style={pg.reviewBtn}><Text style={pg.reviewTxt}>Review Doubts</Text></TouchableOpacity>
          </Card>

          {/* Schedule */}
          <Card>
            <View style={pg.rowBetween}>
              <Text style={pg.cardTitle}>📅 Today's Schedule</Text>
              <Text style={pg.dateTag}>OCT 23</Text>
            </View>
            {SCHEDULE.map(s => (
              <View key={s.id} style={[pg.schedRow, s.now && pg.schedNow]}>
                <View style={[pg.schedDot, { backgroundColor: s.now ? C.accent : C.border }]} />
                <View style={{ flex: 1 }}>
                  {s.now  && <Text style={pg.nowLbl}>NOW HAPPENING</Text>}
                  {s.time && <Text style={pg.schedTime}>{s.time}</Text>}
                  <Text style={pg.schedTitle}>{s.title}</Text>
                  <Text style={pg.schedSub}>{s.sub}</Text>
                  {s.attend && <Badge label={s.attend} color={C.green} bg={C.greenDim} />}
                </View>
              </View>
            ))}
          </Card>

          {/* Announcement */}
          <Card>
            <Text style={pg.cardTitle}>📢 Announcement</Text>
            <Text style={pg.annoTxt}>End-term paper submissions are due by Friday. Please ensure all pending grading is completed in the system.</Text>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  PAGE: ANALYTICS
// ══════════════════════════════════════════════════════════════════════════════
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun'];
const ANALYTICS_LINE = [
  { label: 'Jan', val: 20 }, { label: 'Feb', val: 72 }, { label: 'Mar', val: 68 },
  { label: 'Apr', val: 80 }, { label: 'May', val: 75 }, { label: 'Jun', val: 88 },
];
const ANALYTICS_LINE2 = [
  { label: 'Jan', val: 55 }, { label: 'Feb', val: 60 }, { label: 'Mar', val: 70 },
  { label: 'Apr', val: 65 }, { label: 'May', val: 82 }, { label: 'Jun', val: 78 },
];
const ANALYTICS_BARS = [
  { label: 'CS101', val: 78 }, { label: 'CS201', val: 65 }, { label: 'CS304', val: 88 },
  { label: 'CS401', val: 72 }, { label: 'CS501', val: 60 },
];
const GHOST_BARS = [
  { label: 'CS101', val: 65 }, { label: 'CS201', val: 70 }, { label: 'CS304', val: 75 },
  { label: 'CS401', val: 68 }, { label: 'CS501', val: 55 },
];

const AnalyticsPage = () => (
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
    <SectionTitle title="Analytics" sub="Performance trends across all courses" />

    {/* KPI row */}
    <View style={pg.statsRow}>
      {[['Avg Score','74%',C.line],['Pass Rate','91%',C.green],['At Risk','8',C.red],['Top Scorer','96%',C.amber]].map(([l,v,c]) => (
        <Card key={l} style={[pg.statCard, { borderTopColor: c, borderTopWidth: 3 }]}>
          <Text style={[pg.statNum, { color: c }]}>{v}</Text>
          <Text style={pg.statLbl}>{l}</Text>
        </Card>
      ))}
    </View>

    {/* Line chart */}
    <Card>
      <Text style={pg.cardTitle}>Score Trend — Jan to Jun</Text>
      <Text style={pg.cardSub}>Comparing Batch 2024 vs Batch 2023</Text>
      <View style={pg.legend}>
        {[['Batch 2024',C.line],['Batch 2023',C.lineAlt]].map(([l,c])=>(
          <View key={l} style={pg.legItem}><View style={[pg.legDot,{backgroundColor:c}]}/><Text style={pg.legTxt}>{l}</Text></View>
        ))}
      </View>
      <LineChart data={ANALYTICS_LINE}  color={C.line} />
      <View style={{ marginTop: -80 }}>
        <LineChart data={ANALYTICS_LINE2} color={C.lineAlt} />
      </View>
    </Card>

    {/* Bar chart per course */}
    <Card>
      <Text style={pg.cardTitle}>Course-wise Performance</Text>
      <Text style={pg.cardSub}>Current semester avg scores</Text>
      <BarChart data={ANALYTICS_BARS} comparison={GHOST_BARS} maxH={120} />
    </Card>

    {/* Subject breakdown */}
    <View style={pg.halfRow}>
      {[
        { sub: 'Data Structures', score: 88, color: C.green },
        { sub: 'Systems Design', score: 74, color: C.line },
        { sub: 'Algorithms', score: 66, color: C.amber },
        { sub: 'OS Concepts', score: 79, color: C.accentLight },
      ].map(s => (
        <Card key={s.sub} style={[pg.statCard, { flex: 1 }]}>
          <Text style={[pg.statNum, { color: s.color, fontSize: 24 }]}>{s.score}%</Text>
          <Text style={pg.statLbl}>{s.sub}</Text>
          {/* Mini bar */}
          <View style={pg.miniBarBg}>
            <View style={[pg.miniBar, { width: `${s.score}%`, backgroundColor: s.color }]} />
          </View>
        </Card>
      ))}
    </View>
  </ScrollView>
);

// ══════════════════════════════════════════════════════════════════════════════
//  PAGE: ATTENDANCE
// ══════════════════════════════════════════════════════════════════════════════
const ATT_DATA = [
  { label: 'Mon', val: 92 }, { label: 'Tue', val: 88 }, { label: 'Wed', val: 95 },
  { label: 'Thu', val: 79 }, { label: 'Fri', val: 84 },
];
const ATT_GHOST = [
  { label: 'Mon', val: 80 }, { label: 'Tue', val: 75 }, { label: 'Wed', val: 85 },
  { label: 'Thu', val: 70 }, { label: 'Fri', val: 78 },
];
const STUDENTS = [
  { name: 'Aiden Clark',    id: 'CS101-001', status: 'Present',  pct: '94%' },
  { name: 'Maya Rodriguez', id: 'CS101-002', status: 'Absent',   pct: '72%' },
  { name: 'Ethan Brooks',   id: 'CS101-003', status: 'Present',  pct: '89%' },
  { name: 'Sofia Nguyen',   id: 'CS101-004', status: 'Late',     pct: '81%' },
  { name: 'James Wilson',   id: 'CS101-005', status: 'Present',  pct: '97%' },
];

const AttendancePage = () => (
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
    <SectionTitle title="Attendance Marking" sub="Week of Oct 21–25, 2024" />

    <View style={pg.statsRow}>
      {[['Present','38',C.green],['Absent','4',C.red],['Late','3',C.amber],['Rate','88%',C.accent]].map(([l,v,c]) => (
        <Card key={l} style={[pg.statCard, { borderTopColor: c, borderTopWidth: 3 }]}>
          <Text style={[pg.statNum, { color: c }]}>{v}</Text>
          <Text style={pg.statLbl}>{l}</Text>
        </Card>
      ))}
    </View>

    {/* Weekly bar chart */}
    <Card>
      <Text style={pg.cardTitle}>Weekly Attendance Rate</Text>
      <Text style={pg.cardSub}>CS101 · Section A  (This week vs last week)</Text>
      <BarChart data={ATT_DATA} comparison={ATT_GHOST} maxH={110} />
    </Card>

    {/* Student list */}
    <Card>
      <View style={pg.rowBetween}>
        <Text style={pg.cardTitle}>Today's Roll  –  CS101</Text>
        <TouchableOpacity style={pg.markAllBtn}><Text style={pg.markAllTxt}>Mark All Present</Text></TouchableOpacity>
      </View>
      {STUDENTS.map(s => (
        <View key={s.id} style={pg.studentRow}>
          <Avatar name={s.name} size={36} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={pg.studentName}>{s.name}</Text>
            <Text style={pg.studentId}>{s.id}</Text>
          </View>
          <Badge
            label={s.status}
            color={s.status==='Present'?C.green:s.status==='Absent'?C.red:C.amber}
            bg={s.status==='Present'?C.greenDim:s.status==='Absent'?C.redDim:'#451A03'}
          />
          <Text style={[pg.attPct, { color: parseFloat(s.pct) >= 85 ? C.green : C.amber }]}>{s.pct}</Text>
        </View>
      ))}
    </Card>
  </ScrollView>
);

// ══════════════════════════════════════════════════════════════════════════════
//  PAGE: ASSIGNMENTS
// ══════════════════════════════════════════════════════════════════════════════
const ASSIGN_DATA = [
  { label: 'HW1', val: 82 }, { label: 'HW2', val: 75 }, { label: 'HW3', val: 90 },
  { label: 'Lab1', val: 68 }, { label: 'Lab2', val: 85 },
];
const ASSIGN_GHOST = [
  { label: 'HW1', val: 70 }, { label: 'HW2', val: 80 }, { label: 'HW3', val: 78 },
  { label: 'Lab1', val: 72 }, { label: 'Lab2', val: 76 },
];
const ASSIGNMENTS = [
  { title: 'Sorting Algorithm Analysis', course: 'CS201', due: 'Oct 25', submitted: 38, total: 45, status: 'Active' },
  { title: 'System Design Doc',           course: 'CS304', due: 'Oct 28', submitted: 20, total: 45, status: 'Active' },
  { title: 'OS Memory Management',        course: 'CS401', due: 'Oct 30', submitted: 45, total: 45, status: 'Graded' },
  { title: 'Network Protocols Report',    course: 'CS501', due: 'Nov 2',  submitted: 12, total: 45, status: 'Pending' },
];

const AssignmentsPage = () => (
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
    <SectionTitle title="Assignments" sub="Track submissions & grade performance" />

    <View style={pg.statsRow}>
      {[['Active','4',C.amber],['Graded','12',C.green],['Pending','3',C.red],['Avg Score','78%',C.accent]].map(([l,v,c]) => (
        <Card key={l} style={[pg.statCard, { borderTopColor: c, borderTopWidth: 3 }]}>
          <Text style={[pg.statNum, { color: c }]}>{v}</Text>
          <Text style={pg.statLbl}>{l}</Text>
        </Card>
      ))}
    </View>

    {/* Submission rate bar chart */}
    <Card>
      <Text style={pg.cardTitle}>Submission Scores by Assignment</Text>
      <Text style={pg.cardSub}>Class avg vs expected avg</Text>
      <BarChart data={ASSIGN_DATA} comparison={ASSIGN_GHOST} maxH={110} />
    </Card>

    {/* Assignment list */}
    <Card>
      <Text style={[pg.cardTitle, { marginBottom: 12 }]}>Assignment List</Text>
      {ASSIGNMENTS.map(a => (
        <View key={a.title} style={pg.assignRow}>
          <View style={{ flex: 1 }}>
            <Text style={pg.assignTitle}>{a.title}</Text>
            <Text style={pg.assignMeta}>{a.course}  ·  Due: {a.due}</Text>
            {/* Progress bar */}
            <View style={pg.progressBg}>
              <View style={[pg.progressFill, {
                width: `${(a.submitted/a.total)*100}%`,
                backgroundColor: a.status==='Graded' ? C.green : a.status==='Active' ? C.accent : C.amber,
              }]} />
            </View>
            <Text style={pg.progressLbl}>{a.submitted}/{a.total} submitted</Text>
          </View>
          <Badge
            label={a.status}
            color={a.status==='Graded'?C.green:a.status==='Active'?C.accentLight:C.amber}
            bg={a.status==='Graded'?C.greenDim:a.status==='Active'?C.accentDim:'#451A03'}
          />
        </View>
      ))}
    </Card>
  </ScrollView>
);

// ══════════════════════════════════════════════════════════════════════════════
//  PAGE: LESSON PLANNER
// ══════════════════════════════════════════════════════════════════════════════
const PLAN_DATA = [
  { label: 'Wk1', val: 100 }, { label: 'Wk2', val: 100 }, { label: 'Wk3', val: 80 },
  { label: 'Wk4', val: 60 },  { label: 'Wk5', val: 40 }, { label: 'Wk6', val: 0 },
];
const PLAN_GHOST = [
  { label: 'Wk1', val: 90 }, { label: 'Wk2', val: 95 }, { label: 'Wk3', val: 85 },
  { label: 'Wk4', val: 70 }, { label: 'Wk5', val: 55 }, { label: 'Wk6', val: 30 },
];
const LESSONS = [
  { topic: 'Introduction to Data Structures', date: 'Oct 21', status: 'Completed', duration: '90 min' },
  { topic: 'Arrays & Linked Lists',           date: 'Oct 22', status: 'Completed', duration: '90 min' },
  { topic: 'Stacks and Queues',               date: 'Oct 23', status: 'Today',     duration: '90 min' },
  { topic: 'Trees & Binary Search Trees',     date: 'Oct 24', status: 'Upcoming',  duration: '90 min' },
  { topic: 'Graph Theory Basics',             date: 'Oct 25', status: 'Upcoming',  duration: '90 min' },
];

const LessonPlannerPage = () => (
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
    <SectionTitle title="Lesson Planner" sub="CS101 – Data Structures  ·  Week 3 of 12" />

    <View style={pg.statsRow}>
      {[['Completed','8',C.green],['Today','1',C.accent],['Upcoming','14',C.textSec],['Coverage','67%',C.amber]].map(([l,v,c]) => (
        <Card key={l} style={[pg.statCard, { borderTopColor: c, borderTopWidth: 3 }]}>
          <Text style={[pg.statNum, { color: c }]}>{v}</Text>
          <Text style={pg.statLbl}>{l}</Text>
        </Card>
      ))}
    </View>

    {/* Progress chart */}
    <Card>
      <Text style={pg.cardTitle}>Syllabus Completion Progress</Text>
      <Text style={pg.cardSub}>Weekly completion vs planned pace</Text>
      <BarChart data={PLAN_DATA} comparison={PLAN_GHOST} maxH={110} />
    </Card>

    {/* Line trend */}
    <Card>
      <Text style={pg.cardTitle}>Lesson Delivery Trend</Text>
      <Text style={pg.cardSub}>Topics covered per week over time</Text>
      <LineChart data={[
        { label: 'Wk1', val: 5 }, { label: 'Wk2', val: 5 }, { label: 'Wk3', val: 4 },
        { label: 'Wk4', val: 3 }, { label: 'Wk5', val: 2 }, { label: 'Wk6', val: 0 },
      ]} color={C.lineAlt} />
    </Card>

    {/* Lesson list */}
    <Card>
      <Text style={[pg.cardTitle, { marginBottom: 12 }]}>Lesson Schedule</Text>
      {LESSONS.map(l => (
        <View key={l.topic} style={pg.lessonRow}>
          <View style={[pg.lessonDot, {
            backgroundColor: l.status==='Completed'?C.green:l.status==='Today'?C.accent:C.border,
          }]} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={pg.lessonTitle}>{l.topic}</Text>
            <Text style={pg.lessonMeta}>{l.date}  ·  {l.duration}</Text>
          </View>
          <Badge
            label={l.status}
            color={l.status==='Completed'?C.green:l.status==='Today'?C.accentLight:C.textMuted}
            bg={l.status==='Completed'?C.greenDim:l.status==='Today'?C.accentDim:C.border}
          />
        </View>
      ))}
    </Card>
  </ScrollView>
);

// ══════════════════════════════════════════════════════════════════════════════
//  PAGE: EXAM MGMT
// ══════════════════════════════════════════════════════════════════════════════
const EXAM_SCORES = [
  { label: 'CS101', val: 74 }, { label: 'CS201', val: 68 }, { label: 'CS304', val: 82 },
  { label: 'CS401', val: 71 }, { label: 'CS501', val: 59 },
];
const EXAM_GHOST = [
  { label: 'CS101', val: 68 }, { label: 'CS201', val: 72 }, { label: 'CS304', val: 76 },
  { label: 'CS401', val: 65 }, { label: 'CS501', val: 62 },
];
const EXAMS = [
  { name: 'Mid-term Exam – CS101',   date: 'Oct 28', time: '09:00 AM', hall: 'Hall A',  status: 'Scheduled', students: 45 },
  { name: 'Mid-term Exam – CS201',   date: 'Oct 29', time: '11:00 AM', hall: 'Hall B',  status: 'Scheduled', students: 42 },
  { name: 'Lab Practical – CS304',   date: 'Nov 01', time: '02:00 PM', hall: 'Lab 02',  status: 'Scheduled', students: 38 },
  { name: 'End-term Exam – CS101',   date: 'Nov 15', time: '09:00 AM', hall: 'Main Hall', status: 'Pending', students: 45 },
];

const ExamMgmtPage = () => (
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
    <SectionTitle title="Exam Management" sub="Semester  Fall 2024  ·  Mid-term period" />

    <View style={pg.statsRow}>
      {[['Scheduled','4',C.accent],['Completed','6',C.green],['Pending','2',C.amber],['Avg Score','71%',C.line]].map(([l,v,c]) => (
        <Card key={l} style={[pg.statCard, { borderTopColor: c, borderTopWidth: 3 }]}>
          <Text style={[pg.statNum, { color: c }]}>{v}</Text>
          <Text style={pg.statLbl}>{l}</Text>
        </Card>
      ))}
    </View>

    {/* Score distribution */}
    <Card>
      <Text style={pg.cardTitle}>Course Score Distribution</Text>
      <Text style={pg.cardSub}>Mid-term average scores by course</Text>
      <BarChart data={EXAM_SCORES} comparison={EXAM_GHOST} maxH={120} />
    </Card>

    {/* Score trend */}
    <Card>
      <Text style={pg.cardTitle}>Historical Score Trend</Text>
      <Text style={pg.cardSub}>Exam performance over past 6 exams</Text>
      <LineChart data={[
        { label: 'E1', val: 66 }, { label: 'E2', val: 70 }, { label: 'E3', val: 68 },
        { label: 'E4', val: 75 }, { label: 'E5', val: 73 }, { label: 'E6', val: 79 },
      ]} color={C.amber} />
    </Card>

    {/* Exam list */}
    <Card>
      <View style={pg.rowBetween}>
        <Text style={pg.cardTitle}>Upcoming Exams</Text>
        <TouchableOpacity style={pg.markAllBtn}><Text style={pg.markAllTxt}>+ Schedule</Text></TouchableOpacity>
      </View>
      {EXAMS.map(e => (
        <View key={e.name} style={pg.examRow}>
          <View style={[pg.examIcon, { backgroundColor: e.status==='Scheduled'?C.accentDim:C.border }]}>
            <Text style={{ fontSize: 16 }}>📝</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={pg.examTitle}>{e.name}</Text>
            <Text style={pg.examMeta}>{e.date}  ·  {e.time}  ·  {e.hall}</Text>
            <Text style={pg.examStudents}>{e.students} students enrolled</Text>
          </View>
          <Badge
            label={e.status}
            color={e.status==='Scheduled'?C.accentLight:C.amber}
            bg={e.status==='Scheduled'?C.accentDim:'#451A03'}
          />
        </View>
      ))}
    </Card>
  </ScrollView>
);

// ─── Page styles ──────────────────────────────────────────────────────────────
const pg = StyleSheet.create({
  // Stats row
  statsRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  statCard:  { flex: 1, minWidth: 80, alignItems: 'center', paddingVertical: 14 },
  statNum:   { fontSize: 28, fontWeight: '900' },
  statLbl:   { color: C.textMuted, fontSize: 10, fontWeight: '600', marginTop: 3, textAlign: 'center' },

  // Grid
  grid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  colLeft: { flex: 2, minWidth: 280 },
  colRight:{ flex: 1, minWidth: 240 },
  halfRow: { flexDirection: 'row', gap: 14 },

  // Card internals
  cardTitle:   { color: C.text, fontSize: 13.5, fontWeight: '700', marginBottom: 2 },
  cardSub:     { color: C.textMuted, fontSize: 10.5, fontStyle: 'italic' },
  rowBetween:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  viewAll:     { color: C.accent, fontSize: 11.5, fontWeight: '600' },

  // Toggle
  toggle:  { flexDirection: 'row', backgroundColor: C.bg, borderRadius: 20, padding: 3 },
  tBtn:    { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  tBtnA:   { backgroundColor: C.accent },
  tTxt:    { color: C.textMuted, fontSize: 10.5, fontWeight: '600' },
  tTxtA:   { color: '#fff' },

  // Chart legend
  chartHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  legend:    { flexDirection: 'row', gap: 16, paddingLeft: 30, marginBottom: 2 },
  legItem:   { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legDot:    { width: 8, height: 8, borderRadius: 4 },
  legTxt:    { color: C.textSec, fontSize: 10 },

  // Messages
  msgRow:  { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, borderTopWidth: 1, borderTopColor: C.border },
  msgName: { color: C.text, fontSize: 12, fontWeight: '600', flex: 1 },
  msgTime: { color: C.textMuted, fontSize: 10 },
  msgPrev: { color: C.textSec, fontSize: 11, marginTop: 1 },

  // Quick actions
  qaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  qaBtn:  { width: '47%', backgroundColor: C.cardDeep, borderRadius: 10, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  qaLbl:  { color: C.textSec, fontSize: 10.5, fontWeight: '600', textAlign: 'center' },

  // Doubts
  doubtNum:  { color: C.text, fontSize: 44, fontWeight: '900', lineHeight: 52 },
  notifRing: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  reviewBtn: { borderWidth: 1.5, borderColor: C.accentLight, borderRadius: 10, paddingVertical: 10, alignItems: 'center', marginTop: 10 },
  reviewTxt: { color: C.accentLight, fontWeight: '700', fontSize: 13 },

  // Schedule
  dateTag:    { color: C.textMuted, fontSize: 11.5, fontWeight: '700', letterSpacing: 1 },
  schedRow:   { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.border },
  schedNow:   { backgroundColor: 'rgba(99,102,241,0.08)', marginHorizontal: -14, paddingHorizontal: 14, borderRadius: 10, borderTopColor: 'transparent' },
  schedDot:   { width: 9, height: 9, borderRadius: 5, marginTop: 5, marginRight: 10 },
  nowLbl:     { color: C.amber, fontSize: 9, fontWeight: '800', letterSpacing: 1.2, marginBottom: 2 },
  schedTime:  { color: C.textMuted, fontSize: 10.5, marginBottom: 2 },
  schedTitle: { color: C.text, fontSize: 13, fontWeight: '700', marginBottom: 2 },
  schedSub:   { color: C.textSec, fontSize: 11 },
  annoTxt:    { color: C.textSec, fontSize: 12.5, lineHeight: 19, marginTop: 8 },

  // Attendance
  studentRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.border, gap: 4 },
  studentName:{ color: C.text, fontSize: 13, fontWeight: '600' },
  studentId:  { color: C.textMuted, fontSize: 10.5 },
  attPct:     { fontSize: 12, fontWeight: '700', marginLeft: 8, width: 34, textAlign: 'right' },

  // Assignments
  assignRow:   { paddingVertical: 12, borderTopWidth: 1, borderTopColor: C.border, flexDirection: 'row', alignItems: 'center', gap: 10 },
  assignTitle: { color: C.text, fontSize: 13, fontWeight: '600', marginBottom: 2 },
  assignMeta:  { color: C.textMuted, fontSize: 10.5, marginBottom: 6 },
  progressBg:  { height: 5, backgroundColor: C.border, borderRadius: 3, marginBottom: 3 },
  progressFill:{ height: 5, borderRadius: 3 },
  progressLbl: { color: C.textMuted, fontSize: 9.5 },
  markAllBtn:  { backgroundColor: C.accentDim, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  markAllTxt:  { color: C.accentLight, fontSize: 11, fontWeight: '700' },

  // Lesson Planner
  lessonRow:  { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.border },
  lessonDot:  { width: 10, height: 10, borderRadius: 5 },
  lessonTitle:{ color: C.text, fontSize: 13, fontWeight: '600', marginBottom: 2 },
  lessonMeta: { color: C.textMuted, fontSize: 10.5 },

  // Mini bar
  miniBarBg:  { height: 4, backgroundColor: C.border, borderRadius: 2, marginTop: 6 },
  miniBar:    { height: 4, borderRadius: 2 },

  // Exams
  examRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderTopWidth: 1, borderTopColor: C.border },
  examIcon:    { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  examTitle:   { color: C.text, fontSize: 13, fontWeight: '600', marginBottom: 2 },
  examMeta:    { color: C.textMuted, fontSize: 10.5, marginBottom: 1 },
  examStudents:{ color: C.textSec, fontSize: 10.5 },
});

// ══════════════════════════════════════════════════════════════════════════════
//  SIDEBAR
// ══════════════════════════════════════════════════════════════════════════════
const SidebarContent = ({ active, onSelect, onClose, isDesktop }) => (
  <SafeAreaView style={sb.wrap}>
    <View style={sb.logoRow}>
      <View style={sb.mark}><Text style={{ color: C.accent, fontSize: 14 }}>✦</Text></View>
      <Text style={sb.logoTxt}>Campus360</Text>
      {!isDesktop && (
        <TouchableOpacity style={sb.closeBtn} onPress={onClose}>
          <Text style={sb.closeTxt}>✕</Text>
        </TouchableOpacity>
      )}
    </View>

    <Text style={sb.sectionLbl}>MAIN MENU</Text>

    <View style={{ gap: 2 }}>
      {NAV.map(item => {
        const isActive = active === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={[sb.item, isActive && sb.itemActive]}
            onPress={() => { onSelect(item.id); if (!isDesktop) onClose(); }}
            activeOpacity={0.75}
          >
            {isActive && <View style={[sb.bar, { backgroundColor: item.color }]} />}
            <View style={[sb.icon, isActive && { backgroundColor: item.color }]}>
              <Text style={{ fontSize: 13 }}>{item.icon}</Text>
            </View>
            <Text style={[sb.lbl, isActive && sb.lblActive]}>{item.label}</Text>
            {isActive && <Text style={[sb.chevron, { color: item.color }]}>›</Text>}
          </TouchableOpacity>
        );
      })}
    </View>

    <View style={{ flex: 1 }} />
    <View style={sb.divider} />

    <View style={sb.profile}>
      <Avatar name="Dr Sarah S" size={40} />
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text style={sb.profName}>Dr. Sarah S.</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={sb.onlineDot} />
          <Text style={sb.profRole}>Senior Professor</Text>
        </View>
      </View>
      <TouchableOpacity style={sb.logout}><Text style={{ color: C.textMuted, fontSize: 13 }}>↪</Text></TouchableOpacity>
    </View>
  </SafeAreaView>
);

const sb = StyleSheet.create({
  wrap:      { flex: 1, paddingHorizontal: 14, paddingTop: 14, paddingBottom: 20 },
  logoRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 24, paddingTop: 6 },
  mark:      { width: 28, height: 28, borderRadius: 7, backgroundColor: C.accentDim, alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  logoTxt:   { color: C.text, fontSize: 15, fontWeight: '800', flex: 1 },
  closeBtn:  { width: 26, height: 26, borderRadius: 13, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center' },
  closeTxt:  { color: C.textMuted, fontSize: 11, fontWeight: '700' },
  sectionLbl:{ color: C.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 1.8, marginBottom: 8, paddingLeft: 4 },
  item:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, paddingHorizontal: 8, borderRadius: 10, position: 'relative', overflow: 'hidden' },
  itemActive:{ backgroundColor: C.accentDim },
  bar:       { position: 'absolute', left: 0, top: '18%', bottom: '18%', width: 3, borderRadius: 2 },
  icon:      { width: 28, height: 28, borderRadius: 7, backgroundColor: '#1C2240', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  lbl:       { color: C.textSec, fontSize: 12.5, fontWeight: '500', flex: 1 },
  lblActive: { color: C.text, fontWeight: '700' },
  chevron:   { fontSize: 17 },
  divider:   { height: 1, backgroundColor: C.border, marginVertical: 14 },
  profile:   { flexDirection: 'row', alignItems: 'center' },
  profName:  { color: C.text, fontSize: 12, fontWeight: '700', marginBottom: 2 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.green },
  profRole:  { color: C.textMuted, fontSize: 10 },
  logout:    { width: 28, height: 28, borderRadius: 7, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center' },
});

// ══════════════════════════════════════════════════════════════════════════════
//  TOP BAR (mobile)
// ══════════════════════════════════════════════════════════════════════════════
const TopBar = ({ onMenu, activeId }) => {
  const item = NAV.find(n => n.id === activeId);
  return (
    <View style={tb.wrap}>
      <TouchableOpacity style={tb.ham} onPress={onMenu}>
        <View style={tb.line} />
        <View style={[tb.line, { width: 15 }]} />
        <View style={tb.line} />
      </TouchableOpacity>
      <View style={tb.logoRow}>
        <Text style={{ color: C.accent, fontSize: 14, marginRight: 6 }}>✦</Text>
        <Text style={tb.logoTxt}>Campus360</Text>
      </View>
      <TouchableOpacity style={tb.notif}><Text style={{ fontSize: 15 }}>🔔</Text></TouchableOpacity>
      <TouchableOpacity style={[tb.live, { backgroundColor: item?.color || C.accent }]}>
        <Text style={tb.liveTxt}>▶ Live Class</Text>
      </TouchableOpacity>
    </View>
  );
};
const tb = StyleSheet.create({
  wrap:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 11, backgroundColor: C.sidebar, borderBottomWidth: 1, borderBottomColor: C.border, gap: 8 },
  ham:     { padding: 5 },
  line:    { width: 20, height: 2, backgroundColor: C.accent, borderRadius: 2, marginVertical: 2 },
  logoRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  logoTxt: { color: C.text, fontSize: 15, fontWeight: '800' },
  notif:   { width: 34, height: 34, borderRadius: 17, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  live:    { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  liveTxt: { color: '#fff', fontWeight: '700', fontSize: 11 },
});

// ══════════════════════════════════════════════════════════════════════════════
//  PAGE HEADER (desktop top bar)
// ══════════════════════════════════════════════════════════════════════════════
const DesktopHeader = ({ activeId }) => {
  const item = NAV.find(n => n.id === activeId);
  return (
    <View style={dh.wrap}>
      <View>
        <Text style={dh.title}>Good Morning, Dr. Smith</Text>
        <Text style={dh.sub}>Monday, October 23rd  •  Semester Fall 2024</Text>
      </View>
      <TouchableOpacity style={dh.notif}><Text style={{ fontSize: 15 }}>🔔</Text></TouchableOpacity>
      <TouchableOpacity style={[dh.live, { backgroundColor: item?.color || C.accent }]}>
        <Text style={dh.liveTxt}>▶  Start Live Class</Text>
      </TouchableOpacity>
    </View>
  );
};
const dh = StyleSheet.create({
  wrap:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border, gap: 10 },
  title:   { color: C.text, fontSize: 18, fontWeight: '900' },
  sub:     { color: C.textMuted, fontSize: 11.5, marginTop: 2 },
  notif:   { width: 36, height: 36, borderRadius: 18, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border, marginLeft: 'auto' },
  live:    { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 22 },
  liveTxt: { color: '#fff', fontWeight: '700', fontSize: 12 },
});

// ══════════════════════════════════════════════════════════════════════════════
//  PAGE RENDERER
// ══════════════════════════════════════════════════════════════════════════════
const PAGES = {
  dashboard:   DashboardPage,
  analytics:   AnalyticsPage,
  attendance:  AttendancePage,
  assignments: AssignmentsPage,
  planner:     LessonPlannerPage,
  exam:        ExamMgmtPage,
};

// ══════════════════════════════════════════════════════════════════════════════
//  ROOT APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const { width }  = useWindowDimensions();
  const isDesktop  = width >= BREAKPOINT;

  const [activeNav, setActiveNav] = useState('dashboard');
  const [drawer,    setDrawer]    = useState(false);

  const slideX    = useRef(new Animated.Value(-SIDEBAR_W)).current;
  const overlayOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isDesktop) { setDrawer(false); return; }
    Animated.parallel([
      Animated.spring(slideX, { toValue: drawer ? 0 : -SIDEBAR_W, useNativeDriver: true, tension: 68, friction: 12 }),
      Animated.timing(overlayOp, { toValue: drawer ? 1 : 0, duration: 250, useNativeDriver: true }),
    ]).start();
  }, [drawer, isDesktop]);

  const PageComponent = PAGES[activeNav];

  return (
    <View style={app.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {isDesktop ? (
        // ── DESKTOP ────────────────────────────────────────────────────────
        <View style={app.desktop}>
          {/* Fixed sidebar */}
          <View style={app.sidebar}>
            <SidebarContent active={activeNav} onSelect={setActiveNav} onClose={() => {}} isDesktop />
          </View>
          {/* Main area */}
          <View style={app.main}>
            <DesktopHeader activeId={activeNav} />
            <ScrollView style={app.mainScroll} contentContainerStyle={app.mainContent}>
              <PageComponent />
            </ScrollView>
          </View>
        </View>

      ) : (
        // ── MOBILE ─────────────────────────────────────────────────────────
        <>
          <SafeAreaView style={{ backgroundColor: C.sidebar }}>
            <TopBar onMenu={() => setDrawer(true)} activeId={activeNav} />
          </SafeAreaView>

          <ScrollView style={app.mobileScroll} contentContainerStyle={app.mobileContent}>
            <PageComponent />
          </ScrollView>

          {/* Overlay */}
          <Animated.View pointerEvents={drawer ? 'auto' : 'none'} style={[app.overlay, { opacity: overlayOp }]}>
            <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setDrawer(false)} />
          </Animated.View>

          {/* Drawer */}
          <Animated.View style={[app.drawer, { transform: [{ translateX: slideX }] }]}>
            <SafeAreaView style={{ flex: 1, backgroundColor: C.sidebar }}>
              <SidebarContent active={activeNav} onSelect={setActiveNav} onClose={() => setDrawer(false)} isDesktop={false} />
            </SafeAreaView>
          </Animated.View>
        </>
      )}
    </View>
  );
}

const app = StyleSheet.create({
  root:        { flex: 1, backgroundColor: C.bg },
  desktop:     { flex: 1, flexDirection: 'row' },
  sidebar:     { width: SIDEBAR_W, backgroundColor: C.sidebar, borderRightWidth: 1, borderRightColor: C.border },
  main:        { flex: 1, flexDirection: 'column' },
  mainScroll:  { flex: 1 },
  mainContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 6 },
  mobileScroll:{ flex: 1 },
  mobileContent:{ paddingHorizontal: 14, paddingTop: 10 },
  overlay:     { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 10 },
  drawer:      {
    position: 'absolute', top: 0, left: 0, bottom: 0, width: SIDEBAR_W,
    backgroundColor: C.sidebar, zIndex: 20,
    borderRightWidth: 1, borderRightColor: C.border,
    shadowColor: '#000', shadowOffset: { width: 8, height: 0 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 20,
  },
});