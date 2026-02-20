import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const COLORS = {
  ink: "#0B0E14",
  white: "#F9FAFB",
  slate: "#9AA3B2",
  blue: "#3B82F6",
  indigo: "#2563EB",
  teal: "#14B8A6",
  amber: "#F59E0B",
  rose: "#F43F5E",
  cyan: "#22D3EE",
  glowBlue: "rgba(59, 130, 246, 0.45)",
  glowTeal: "rgba(20, 184, 166, 0.45)",
};

const LAYOUT = {
  safeTop: 84,
  safeBottom: 80,
  safeX: 140,
  titleGap: 10,
  panelTop: 320,
  centerY: 560,
};

const ASSETS = {
  multiIcon: staticFile("/assets/hibot/feature-icon-multiagente.png"),
  multiImage: staticFile("/assets/hibot/help-app-conversations.png"),
  botsIcon: staticFile("/assets/hibot/feature-icon-bots.png"),
  botsImage: staticFile("/assets/hibot/help-app-filter.png"),
  metricsIcon: staticFile("/assets/hibot/feature-icon-metrics.png"),
  metricsImage: staticFile("/assets/hibot/help-login.png"),
  useCaseSales: staticFile("/assets/hibot/use-case-icon-sells.png"),
  useCaseSupport: staticFile("/assets/hibot/use-case-icon-support.png"),
  useCaseDistribution: staticFile("/assets/hibot/use-case-icon-distribution.png"),
  logo: staticFile("/assets/hibot/hibot-by-sofka.svg"),
  channelWhatsapp: staticFile("/assets/hibot/channels/whatsapp.svg"),
  channelInstagram: staticFile("/assets/hibot/channels/instagram.svg"),
  channelFacebook: staticFile("/assets/hibot/channels/facebook.svg"),
  channelTelegram: staticFile("/assets/hibot/channels/telegram.svg"),
  channelWeb: staticFile("/assets/hibot/channels/web.svg"),
};

const Background: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(1600px 900px at 20% 10%, #1D2440 0%, #0C101B 50%, #070A11 100%)",
      }}
    />
  );
};

const Title: React.FC<{
  label: string;
  sub?: string;
  start: number;
  duration: number;
  variant?: "hero" | "default";
  offsetY?: number;
}> = ({ label, sub, start, duration, variant = "default", offsetY = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - start;
  const opacity = interpolate(
    local,
    [0, 0.4 * fps, duration - 0.4 * fps, duration],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const y = interpolate(local, [0, 0.6 * fps], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zoomIn = interpolate(local, [0, duration], [0.96, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isHero = variant === "hero";

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
        gap: isHero ? 14 : LAYOUT.titleGap,
        paddingTop: (isHero ? 140 : LAYOUT.safeTop) + offsetY,
        opacity,
        transform: `translateY(${y}px) scale(${zoomIn})`,
      }}
    >
      <div
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: isHero ? 104 : 78,
          fontWeight: 700,
          color: COLORS.white,
          letterSpacing: isHero ? -2 : -1.5,
          textTransform: isHero ? "uppercase" : "none",
          textShadow: isHero
            ? "0 12px 40px rgba(0,0,0,0.45), 0 0 30px rgba(59,130,246,0.35)"
            : "0 10px 30px rgba(0,0,0,0.35)",
        }}
      >
        {label}
      </div>
      {sub ? (
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: isHero ? 34 : 28,
            fontWeight: 500,
            color: COLORS.slate,
            maxWidth: 1200,
            textAlign: "center",
          }}
        >
          {sub}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const ChannelBubble: React.FC<{
  label: string;
  color: string;
  start: number;
  duration: number;
  delay: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
  icon?: string;
  sizeScale?: number;
}> = ({ label, color, start, duration, delay, to, icon, sizeScale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - start - delay;
  const intro = spring({
    frame: local,
    fps,
    config: { damping: 12, mass: 0.8 },
  });
  const introScale = interpolate(intro, [0, 1], [0.75, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "extend",
  });
  const outroStart = duration - 0.7 * fps;
  const outroScale = interpolate(local, [outroStart, duration], [1, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(
    local,
    [0, 0.2 * fps, outroStart, duration],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const x = to.x;
  const y = to.y;
  const scale = introScale * outroScale;

  const fontSize = 28 * sizeScale;
  const paddingY = 16 * sizeScale;
  const paddingX = 24 * sizeScale;
  const iconBox = 40 * sizeScale;
  const iconSize = 22 * sizeScale;
  const gap = 14 * sizeScale;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        padding: `${paddingY}px ${paddingX}px`,
        borderRadius: 999,
        background: color,
        color: "#0B0E14",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize,
        fontWeight: 700,
        opacity,
        boxShadow:
          "0 20px 50px rgba(0,0,0,0.35), 0 0 26px rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        gap,
      }}
    >
      {icon ? (
        <div
          style={{
            width: iconBox,
            height: iconBox,
            borderRadius: 999,
            background: "rgba(11, 14, 20, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img src={icon} style={{ width: iconSize, height: iconSize }} />
        </div>
      ) : null}
      {label}
    </div>
  );
};

const InboxCard: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - start;
  const bounce = spring({
    frame: local,
    fps,
    config: { damping: 12, mass: 0.8 },
  });
  const scale = interpolate(bounce, [0, 1], [0.9, 1], {
    extrapolateRight: "extend",
  });
  const opacity = interpolate(local, [0, 0.3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: LAYOUT.centerY + 60,
        transform: `translate(-50%, -50%) scale(${scale})`,
        width: 1180,
        height: 600,
        borderRadius: 32,
        background: "rgba(15, 23, 42, 0.95)",
        border: "1px solid rgba(148, 163, 184, 0.2)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        padding: 36,
        opacity,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 22,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 30,
            fontWeight: 700,
            color: COLORS.white,
          }}
        >
          Bandeja unificada
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 20,
            color: COLORS.slate,
          }}
        >
          HiBot Inbox
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {[
          { name: "Sofía - Pedido #884", tag: "Ventas" },
          { name: "Carlos - Seguimiento", tag: "Soporte" },
          { name: "Lucía - Cotización", tag: "Ventas" },
          { name: "Pedro - Entrega", tag: "Logística" },
        ].map((item) => (
          <div
            key={item.name}
            style={{
              background: "rgba(30, 41, 59, 0.8)",
              borderRadius: 18,
              padding: "18px 22px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 20,
                color: COLORS.white,
              }}
            >
              {item.name}
            </div>
            <div
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 16,
                color: COLORS.ink,
                background: COLORS.teal,
                padding: "6px 12px",
                borderRadius: 999,
                fontWeight: 700,
              }}
            >
              {item.tag}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 28,
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 14,
        }}
      >
        {[
          "Centraliza todos tus chats",
          "Asigna por equipo o prioridad",
          "Historial completo en un lugar",
        ].map((benefit) => (
          <div
            key={benefit}
            style={{
              background: "rgba(30, 41, 59, 0.8)",
              borderRadius: 999,
              padding: "14px 22px",
              textAlign: "center",
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 22,
              color: COLORS.white,
              fontWeight: 600,
              boxShadow: "0 16px 36px rgba(0,0,0,0.28)",
            }}
          >
            {benefit}
          </div>
        ))}
      </div>
    </div>
  );
};

const FeatureShowcase: React.FC<{
  start: number;
  title: string;
  icon: string;
  image: string;
  bullets: string[];
  imageScale?: number;
  imageOffset?: { x: number; y: number };
  layout?: "default" | "textWide";
  bulletSize?: number;
  bulletPadding?: { x: number; y: number };
}> = ({
  start,
  title,
  icon,
  image,
  bullets,
  imageScale = 1,
  imageOffset,
  layout = "default",
  bulletSize,
  bulletPadding,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - start;
  const opacity = interpolate(local, [0, 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rise = interpolate(local, [0, 1.1 * fps], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bounce = spring({
    frame: local,
    fps,
    config: { damping: 12, mass: 0.8 },
  });
  const scale = interpolate(bounce, [0, 1], [0.92, 1], {
    extrapolateRight: "extend",
  });
  const isTextWide = layout === "textWide";

  return (
    <div
      style={{
        position: "absolute",
        left: LAYOUT.safeX,
        right: LAYOUT.safeX,
        top: LAYOUT.panelTop,
        bottom: LAYOUT.safeBottom,
        opacity,
        transform: `translateY(${rise}px) scale(${scale})`,
        background: "rgba(15, 23, 42, 0.9)",
        borderRadius: 28,
        border: "1px solid rgba(148, 163, 184, 0.2)",
        padding: 42,
        display: "grid",
        gridTemplateColumns: isTextWide ? "1.2fr 0.8fr" : "0.95fr 1.05fr",
        gap: isTextWide ? 44 : 40,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: isTextWide ? 56 : 48,
              height: isTextWide ? 56 : 48,
              borderRadius: 16,
              background: "rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Img
              src={icon}
              style={{
                width: isTextWide ? 34 : 28,
                height: isTextWide ? 34 : 28,
              }}
            />
          </div>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: isTextWide ? 38 : 28,
              fontWeight: 700,
              color: COLORS.white,
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gap: isTextWide ? 20 : 16,
            marginTop: isTextWide ? 12 : 0,
            maxWidth: isTextWide ? 600 : 560,
          }}
        >
          {bullets.map((bullet) => (
            <div
              key={bullet}
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize:
                  bulletSize ?? (isTextWide ? 28 : 20),
                color: COLORS.white,
                padding:
                  bulletPadding
                    ? `${bulletPadding.y}px ${bulletPadding.x}px`
                    : isTextWide
                      ? "18px 30px"
                      : "12px 20px",
                borderRadius: 999,
                background: "rgba(30, 41, 59, 0.8)",
                width: isTextWide ? "100%" : "fit-content",
                textAlign: "center",
                boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
              }}
            >
              {bullet}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          background: "rgba(7, 10, 17, 0.6)",
          borderRadius: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 18,
          border: "1px solid rgba(148, 163, 184, 0.2)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(20,184,166,0.08))",
          }}
        />
        <Img
          src={image}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transform: `translate(${imageOffset?.x ?? 0}px, ${
              imageOffset?.y ?? 0
            }px) scale(${imageScale})`,
            filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.35))",
          }}
        />
      </div>
    </div>
  );
};

const UseCases: React.FC<{ start: number; duration: number }> = ({
  start,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - start;
  const opacity = interpolate(local, [0, 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(local, [0, 0.6 * fps], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bounce = spring({
    frame: local,
    fps,
    config: { damping: 12, mass: 0.8 },
  });
  const scale = interpolate(bounce, [0, 1], [0.94, 1], {
    extrapolateRight: "extend",
  });
  const zoomIn = interpolate(local, [0, duration], [1, 1.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const items = [
    { label: "Ventas", icon: ASSETS.useCaseSales },
    { label: "Soporte", icon: ASSETS.useCaseSupport },
    { label: "Logística", icon: ASSETS.useCaseDistribution },
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: 260,
        right: 260,
        top: 640,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 32,
        opacity,
        transform: `translateY(${y}px) scale(${scale * zoomIn})`,
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            borderRadius: 24,
            padding: "20px 22px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            border: "1px solid rgba(148, 163, 184, 0.2)",
          }}
        >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img src={item.icon} style={{ width: 38, height: 38 }} />
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 26,
            color: COLORS.white,
            fontWeight: 600,
          }}
        >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

const CTA: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - start;
  const opacity = interpolate(local, [0, 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = spring({
    frame: local,
    fps,
    config: { damping: 18, mass: 0.8 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 28,
        opacity,
      }}
    >
      <Img src={ASSETS.logo} style={{ width: 220, height: 60 }} />
      <div
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 78,
          fontWeight: 700,
          color: COLORS.white,
          textAlign: "center",
          maxWidth: 1400,
        }}
      >
        Comunícate con nosotros
      </div>
      <div
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 32,
          color: COLORS.slate,
          textAlign: "center",
          maxWidth: 1200,
        }}
      >
        Para optimizar tu atención y convertir más conversaciones en ventas.
      </div>
      <div
        style={{
          transform: `scale(${scale})`,
          padding: "16px 28px",
          borderRadius: 999,
          background: COLORS.amber,
          color: COLORS.ink,
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 26,
          fontWeight: 700,
          boxShadow:
            "0 18px 50px rgba(245,158,11,0.45), 0 0 24px rgba(245,158,11,0.4)",
        }}
      >
        hibotchat.com
      </div>
    </AbsoluteFill>
  );
};

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const musicVolume = (() => {
    const fadeIn = interpolate(frame, [0, 1.2 * fps], [0, 0.2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const fadeOut = interpolate(
      frame,
      [durationInFrames - 1.2 * fps, durationInFrames],
      [1, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );
    return fadeIn * fadeOut;
  })();

  const weights = [4, 4, 6, 6, 6, 6, 3];
  const totalWeight = weights.reduce((acc, val) => acc + val, 0);
  const framesPerWeight = durationInFrames / totalWeight;
  const durations = weights.map((w) => Math.floor(w * framesPerWeight));
  const allocated = durations.reduce((acc, val) => acc + val, 0);
  durations[durations.length - 1] =
    durationInFrames - (allocated - durations[durations.length - 1]);
  const starts = durations.reduce<number[]>((acc, dur, idx) => {
    if (idx === 0) return [0];
    return [...acc, acc[idx - 1] + durations[idx - 1]];
  }, []);

  const scene1Start = starts[0];
  const scene1Duration = durations[0];
  const scene2Start = starts[1];
  const scene2Duration = durations[1];
  const scene3Start = starts[2];
  const scene3Duration = durations[2];
  const scene4Start = starts[3];
  const scene4Duration = durations[3];
  const scene5Start = starts[4];
  const scene5Duration = durations[4];
  const scene6Start = starts[5];
  const scene6Duration = durations[5];
  const scene7Start = starts[6];

  const swooshStart = Math.max(scene2Start - Math.round(0.1 * fps), 0);
  const uiClickStart = scene3Start + Math.round(0.15 * fps);
  const chimeStart = scene5Start + Math.round(0.2 * fps);
  const popStart = scene7Start;

  return (
    <AbsoluteFill>
      <Audio src={staticFile("/audio/hibot-vo-es.mp3")} />
      <Audio
        src={staticFile("/audio/hotham_music-love-me-back-instrumental-126983.mp3")}
        volume={musicVolume}
      />
      <Sequence from={0}>
        <Audio src={staticFile("/audio/sfx/notification-bell.mp3")} volume={0.35} />
      </Sequence>
      <Sequence from={swooshStart}>
        <Audio
          src={staticFile("/audio/sfx/sfx-swoosh1.mp3")}
          volume={0.35}
        />
      </Sequence>
      <Sequence from={uiClickStart}>
        <Audio src={staticFile("/audio/sfx/sfx-menu1.mp3")} volume={0.3} />
      </Sequence>
      <Sequence from={chimeStart}>
        <Audio src={staticFile("/audio/sfx/chime.mp3")} volume={0.25} />
      </Sequence>
      <Sequence from={popStart}>
        <Audio src={staticFile("/audio/sfx/sfx-pop.mp3")} volume={0.3} />
      </Sequence>
      <Background />

      {frame < scene2Start && (
        <>
          <Title
            label="Mensajes por todos lados"
            sub="WhatsApp, Instagram y web..."
            start={scene1Start}
            duration={scene1Duration}
            variant="hero"
            offsetY={160}
          />
          <ChannelBubble
            label="WhatsApp"
            color={COLORS.teal}
            start={scene1Start}
            duration={scene1Duration}
            delay={0}
            from={{ x: -700, y: -220 }}
            to={{ x: -620, y: 100 }}
            icon={ASSETS.channelWhatsapp}
            sizeScale={1.45}
          />
          <ChannelBubble
            label="Instagram"
            color={COLORS.rose}
            start={scene1Start}
            duration={scene1Duration}
            delay={0.3 * fps}
            from={{ x: 620, y: -220 }}
            to={{ x: -120, y: 100 }}
            icon={ASSETS.channelInstagram}
            sizeScale={1.2}
          />
          <ChannelBubble
            label="Facebook"
            color={COLORS.indigo}
            start={scene1Start}
            duration={scene1Duration}
            delay={0.45 * fps}
            from={{ x: 720, y: 120 }}
            to={{ x: 320, y: 100 }}
            icon={ASSETS.channelFacebook}
            sizeScale={1.2}
          />
          <ChannelBubble
            label="Web"
            color={COLORS.amber}
            start={scene1Start}
            duration={scene1Duration}
            delay={0.6 * fps}
            from={{ x: -620, y: 320 }}
            to={{ x: -300, y: 260 }}
            icon={ASSETS.channelWeb}
            sizeScale={1.16}
          />
          <ChannelBubble
            label="Telegram"
            color={COLORS.cyan}
            start={scene1Start}
            duration={scene1Duration}
            delay={0.75 * fps}
            from={{ x: -760, y: 140 }}
            to={{ x: 80, y: 260 }}
            icon={ASSETS.channelTelegram}
            sizeScale={1.16}
          />
        </>
      )}

      {frame >= scene2Start && frame < scene3Start && (
        <>
          <Title
            label="Bandeja unificada"
            sub="Todos tus chats en una sola plataforma"
            start={scene2Start}
            duration={scene2Duration}
          />
          <InboxCard start={scene2Start + 0.2 * fps} />
        </>
      )}

      {frame >= scene3Start && frame < scene4Start && (
        <>
          <Title
            label="Multiagente"
            sub="Asigna conversaciones automáticamente"
            start={scene3Start}
            duration={scene3Duration}
          />
          <FeatureShowcase
            start={scene3Start + 0.4 * fps}
            title="Coordinación de equipos"
            icon={ASSETS.multiIcon}
            image={ASSETS.multiImage}
            bullets={[
              "Asignación inteligente",
              "Colas por prioridad",
              "Visibilidad total",
            ]}
            imageScale={1}
            imageOffset={{ x: 0, y: 0 }}
            layout="textWide"
          />
        </>
      )}

      {frame >= scene4Start && frame < scene5Start && (
        <>
          <Title
            label="Chatbots 24/7"
            sub="Automatiza respuestas y no pierdas clientes"
            start={scene4Start}
            duration={scene4Duration}
          />
          <FeatureShowcase
            start={scene4Start + 0.4 * fps}
            title="Automatización inmediata"
            icon={ASSETS.botsIcon}
            image={ASSETS.botsImage}
            bullets={[
              "Respuestas instantáneas",
              "Flujos personalizados",
              "Derivación a agentes",
            ]}
            imageScale={1}
            imageOffset={{ x: 0, y: 0 }}
            layout="textWide"
          />
        </>
      )}

      {frame >= scene5Start && frame < scene6Start && (
        <>
          <Title
            label="Métricas en vivo"
            sub="Control total del desempeño"
            start={scene5Start}
            duration={scene5Duration}
          />
          <FeatureShowcase
            start={scene5Start + 0.4 * fps}
            title="Dashboard en tiempo real"
            icon={ASSETS.metricsIcon}
            image={ASSETS.metricsImage}
            bullets={["KPIs clave", "Alertas automáticas", "Reportes claros"]}
            imageScale={1}
            imageOffset={{ x: 0, y: 0 }}
            bulletSize={26}
            bulletPadding={{ x: 28, y: 16 }}
          />
        </>
      )}

      {frame >= scene6Start && frame < scene7Start && (
        <>
          <Title
            label="Más velocidad. Más ventas."
            sub="Responde más rápido y convierte más conversaciones"
            start={scene6Start}
            duration={scene6Duration}
            variant="default"
            offsetY={240}
          />
          <UseCases start={scene6Start + 0.4 * fps} duration={scene6Duration} />
        </>
      )}

      {frame >= scene7Start && <CTA start={scene7Start} />}
    </AbsoluteFill>
  );
};
