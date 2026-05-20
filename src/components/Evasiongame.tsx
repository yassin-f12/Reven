import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from "@/src/utils/theme";
import useStore from "@/src/store/useStore";

const GAME_W =
  Dimensions.get("window").width - SPACING["2xl"] * 2 - SPACING.md * 2;
const GAME_H = 220;
const PLAYER_W = 36;
const PLAYER_H = 36;
const OBS_W = 28;
const OBS_H = 28;
const LANE_COUNT = 3;
const LANE_W = GAME_W / LANE_COUNT;

type Obstacle = { id: number; lane: number; y: number };


function spawnWave(
  score: number,
  idRef: React.MutableRefObject<number>,
): Obstacle[] {
  const lanes = [0, 1, 2];
  const shuffled = [...lanes].sort(() => Math.random() - 0.5);

  let count: number;
  if (score < 10) {
    count = 1;
  } else if (score < 25) {
    count = Math.random() < 0.4 ? 2 : 1;
  } else {
    count = 2;
  }

  return shuffled.slice(0, count).map((lane) => {
    idRef.current += 1;
    return { id: idRef.current, lane, y: -OBS_H };
  });
}

export default function EvasionGame() {
  const user = useStore((s) => s.user);

  const [lane, setLane] = useState(1);
  const [obs, setObs] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [running, setRunning] = useState(false);
  const [dead, setDead] = useState(false);

  const laneRef = useRef(1);
  const obsRef = useRef<Obstacle[]>([]);
  const scoreRef = useRef(0);
  const idRef = useRef(0);
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const laneX = (l: number) => l * LANE_W + LANE_W / 2 - PLAYER_W / 2;
  const obsLaneX = (l: number) => l * LANE_W + LANE_W / 2 - OBS_W / 2;
  const playerY = GAME_H - PLAYER_H - 8;

  const moveTo = (l: number) => {
    laneRef.current = l;
    setLane(l);
  };

  const start = () => {
    if (loopRef.current) clearInterval(loopRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
    laneRef.current = 1;
    obsRef.current = [];
    scoreRef.current = 0;
    idRef.current = 0;
    setLane(1);
    setObs([]);
    setScore(0);
    setDead(false);
    setRunning(true);
  };

  const stop = (final: number) => {
    setRunning(false);
    setDead(true);
    if (loopRef.current) clearInterval(loopRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
    setBest((b) => Math.max(b, final));
  };

  useEffect(() => {
    if (!running) return;

    const getSpawnInterval = () => {
      const s = scoreRef.current;
      if (s < 10) return 1400;
      if (s < 20) return 1200;
      if (s < 35) return 1050;
      if (s < 50) return 900;
      return 800;
    };

    const scheduleNext = () => {
      spawnRef.current = setTimeout(() => {
        const wave = spawnWave(scoreRef.current, idRef);
        obsRef.current = [...obsRef.current, ...wave];
        setObs([...obsRef.current]);
        scheduleNext();
      }, getSpawnInterval());
    };

    scheduleNext();
    return () => {
      if (spawnRef.current) clearTimeout(spawnRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (!running) return;

    loopRef.current = setInterval(() => {
      const s = scoreRef.current;
      const speed = Math.min(3 + Math.floor(s / 8) * 0.6, 9);

      const next = obsRef.current
        .map((o) => ({ ...o, y: o.y + speed }))
        .filter((o) => o.y < GAME_H + OBS_H);

      const PAD = 8;
      const hit = next.some(
        (o) =>
          o.lane === laneRef.current &&
          o.y + OBS_H - PAD >= playerY + PAD &&
          o.y + PAD <= playerY + PLAYER_H - PAD,
      );

      if (hit) {
        stop(scoreRef.current);
        return;
      }

      const passed = obsRef.current.filter((o) => o.y + OBS_H < playerY).length;
      scoreRef.current += passed;
      setScore(scoreRef.current);

      obsRef.current = next;
      setObs([...next]);
    }, 50);

    return () => {
      if (loopRef.current) clearInterval(loopRef.current);
    };
  }, [running]);

  useEffect(
    () => () => {
      if (loopRef.current) clearInterval(loopRef.current);
      if (spawnRef.current) clearTimeout(spawnRef.current);
    },
    [],
  );

  return (
    <View style={g.wrapper}>
      <Text style={g.gameTitle}>Esquive — occupe tes mains !</Text>
      <Text style={g.gameSub}>
        Appuie sur les flèches pour déplacer le grimpeur
      </Text>

      <View style={g.scoreRow}>
        <Text style={g.scoreText}>Score : {score}</Text>
        {best > 0 && <Text style={g.bestText}>Meilleur : {best}</Text>}
      </View>

      <ImageBackground
        source={require("@/assets/images/nuage.png")}
        style={[g.arena, { width: GAME_W, height: GAME_H }]}
        resizeMode="cover"
      >
        {[1, 2].map((i) => (
          <View key={i} style={[g.laneLine, { left: i * LANE_W }]} />
        ))}

        {obs.map((o) => (
          <View
            key={o.id}
            style={[
              g.obstacle,
              { left: obsLaneX(o.lane), top: o.y, width: OBS_W, height: OBS_H },
            ]}
          >
            <Text style={g.obsEmoji}>🚬</Text>
          </View>
        ))}

        <View
          style={[
            g.player,
            {
              left: laneX(lane),
              top: playerY,
              width: PLAYER_W,
              height: PLAYER_H,
            },
          ]}
        >
          <Image
            source={user?.avatar?.image}
            style={{ width: 26, height: 26 }}
          />
        </View>

        {dead && (
          <View style={g.overlay}>
            <Ionicons name="skull" size={28} color="#fff" />
            <Text style={g.overlayScore}>Score : {score}</Text>
            {score > 0 && score >= best && (
              <Text style={g.newBest}>Nouveau record !</Text>
            )}
          </View>
        )}

        {!running && !dead && (
          <View style={g.overlay}>
            <Ionicons name="game-controller" size={32} color={COLORS.warning} />
            <Text style={g.overlayHint}>Appuie sur Démarrer</Text>
          </View>
        )}
      </ImageBackground>

      <View style={g.tapRow}>
        {[
          { target: 0, icon: "arrow-back" as const, label: "←" },
          { target: 1, icon: "remove" as const, label: "▪" },
          { target: 2, icon: "arrow-forward" as const, label: "→" },
        ].map(({ target, icon }) => (
          <TouchableOpacity
            key={target}
            style={[g.tapBtn, lane === target && running && g.tapBtnActive]}
            onPress={() => moveTo(target)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={icon}
              size={22}
              color={
                lane === target && running
                  ? COLORS.bgPrimary
                  : COLORS.textPrimary
              }
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={g.startBtn} onPress={start}>
        <Text style={g.startBtnText}>
          {dead ? "Rejouer" : running ? "Recommencer" : "Démarrer"}
        </Text>
      </TouchableOpacity>

      <Text style={g.hint}>
        Chaque seconde à jouer = une seconde sans craquer 
      </Text>
    </View>
  );
}

const g = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
    gap: SPACING.sm,
    paddingTop: SPACING.sm,
  },
  gameTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.black,
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  gameSub: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: SPACING.xs,
  },
  scoreText: {
    color: COLORS.warning,
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE.md,
  },
  diffText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    fontStyle: "italic",
  },
  bestText: { color: COLORS.textMuted, fontSize: FONT_SIZE.sm },
  arena: {
    borderRadius: RADIUS.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    position: "relative",
  },
  laneLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 0.5,
    backgroundColor: "rgba(150,150,150,0.4)",
  },
  obstacle: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  obsEmoji: { fontSize: 20 },
  player: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  overlayScore: {
    color: COLORS.warning,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  overlayHint: { color: "rgba(255,255,255,0.7)", fontSize: FONT_SIZE.sm },
  newBest: {
    color: COLORS.gold,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
  tapRow: { flexDirection: "row", gap: SPACING.sm, width: "100%" },
  tapBtn: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: COLORS.bgCardBorder,
  },
  tapBtnActive: {
    backgroundColor: COLORS.warning,
    borderColor: COLORS.warning,
    paddingVertical: SPACING["2xl"],
  },
  startBtn: {
    backgroundColor: COLORS.warning,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING["3xl"],
    paddingVertical: SPACING.sm,
    marginTop: SPACING.xs,
  },
  startBtnText: {
    color: COLORS.bgPrimary,
    fontWeight: FONT_WEIGHT.black,
    fontSize: FONT_SIZE.base,
  },
  hint: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    fontStyle: "italic",
    textAlign: "center",
  },
});
