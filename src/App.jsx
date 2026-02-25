import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame, animate, stagger } from 'framer-motion';
import { ChevronDown, ArrowUpRight, Play, Download } from 'lucide-react';
import Lenis from 'lenis';

// Import Assets Lokal
import RayDharma from './assets/ray-dharma.jpg';
import ShowcaseOne from './assets/1.jpg';
import ShowcaseTwo from './assets/2.jpg';
import ShowcaseThree from './assets/3.jpg';
import ShowcaseFour from './assets/4.jpg';
import ShowcaseFive from './assets/5.jpg';
import ShowcaseSix from './assets/6.jpg';

// Import Assets BTS
import BTSOne from './assets/bts-1.jpg';
import BTSTwo from './assets/bts-2.jpg';
import BTSThree from './assets/bts-3.jpg';
import BTSFour from './assets/bts-4.jpg';

// ─── MAGNETIC BUTTON COMPONENT ────────────────────────────────────────────────
const MagneticWrapper = ({ children, strength = 0.4 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  }, [strength, x, y]);

  const handleMouseLeave = useCallback(() => {
    animate(x, 0, { type: 'spring', stiffness: 300, damping: 20 });
    animate(y, 0, { type: 'spring', stiffness: 300, damping: 20 });
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
};

// ─── SCRAMBLE TEXT COMPONENT ──────────────────────────────────────────────────
const ScrambleText = ({ text, className, trigger = false }) => {
  const [displayed, setDisplayed] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const intervalRef = useRef(null);

  const scramble = useCallback(() => {
    let iteration = 0;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDisplayed(
        text.split("").map((char, idx) =>
          idx < iteration ? char : char === " " ? " " : chars[Math.floor(Math.random() * chars.length)]
        ).join("")
      );
      iteration += 0.5;
      if (iteration >= text.length) clearInterval(intervalRef.current);
    }, 30);
  }, [text]);

  useEffect(() => { if (trigger) scramble(); }, [trigger, scramble]);

  return (
    <span
      className={className}
      onMouseEnter={scramble}
      style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: 'inherit' }}
    >
      {displayed}
    </span>
  );
};

// ─── SPLIT TEXT REVEAL ────────────────────────────────────────────────────────
const SplitReveal = ({ text, className, delay = 0, once = true }) => {
  const words = text.split(" ");
  return (
    <span className={className} style={{ display: 'flex', flexWrap: 'wrap', gap: '0 0.25em' }}>
      {words.map((word, i) => (
        <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            transition={{ duration: 0.9, delay: delay + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

// ─── INFINITE TICKER ──────────────────────────────────────────────────────────
const Ticker = ({ items, speed = 35, reverse = false }) => {
  const x = useMotionValue(0);
  const baseX = useMotionValue(0);
  const tickerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (tickerRef.current) setWidth(tickerRef.current.scrollWidth / 2);
  }, []);

  useAnimationFrame((_, delta) => {
    const dir = reverse ? 1 : -1;
    baseX.set(baseX.get() + dir * (speed / 1000) * delta);
    if (Math.abs(baseX.get()) >= width) baseX.set(0);
    x.set(baseX.get());
  });

  const all = [...items, ...items];

  return (
    <div className="overflow-hidden whitespace-nowrap py-5 border-y border-zinc-900 select-none">
      <motion.div ref={tickerRef} style={{ x }} className="inline-flex gap-0">
        {all.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-8 text-[11px] tracking-[0.35em] text-zinc-600 uppercase font-medium">
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 inline-block" />
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// ─── PARALLAX IMAGE ───────────────────────────────────────────────────────────
const ParallaxImage = ({ src, alt, className, speed = 0.15 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img src={src} alt={alt} style={{ y, scale: 1.2 }} className="w-full h-full object-cover" />
    </div>
  );
};

// ─── NOISE OVERLAY ────────────────────────────────────────────────────────────
const NoiseOverlay = () => (
  <div
    className="fixed inset-0 pointer-events-none z-[50] opacity-[0.03]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundSize: '200px 200px',
    }}
  />
);

// ─── COUNTER ──────────────────────────────────────────────────────────────────
const AnimatedCounter = ({ target, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        let start = 0;
        const step = target / (duration * 60);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 1000 / 60);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const App = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");
  const [isOverWhite, setIsOverWhite] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.07, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    setTimeout(() => setHeroLoaded(true), 300);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const move = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.88]);
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, 80]);

  const cursorColor = isOverWhite ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)";
  const cursorBg = isOverWhite ? "black" : "white";

  const variants = {
    default: {
      x: mousePos.x - 12, y: mousePos.y - 12,
      height: 24, width: 24,
      border: `1.5px solid ${cursorColor}`,
      backgroundColor: "transparent",
      mixBlendMode: "normal",
    },
    hover: {
      height: 80, width: 80,
      x: mousePos.x - 40, y: mousePos.y - 40,
      backgroundColor: cursorBg,
      mixBlendMode: isOverWhite ? "normal" : "difference",
      border: "none",
    },
    text: {
      height: 110, width: 110,
      x: mousePos.x - 55, y: mousePos.y - 55,
      backgroundColor: "white",
      mixBlendMode: "difference",
      border: "none",
    }
  };

  const tickerItems = ["Creative Direction", "Cinematography", "Brand Strategy", "Visual Architecture", "Motion Design", "Art Direction"];

  const portfolios = [
    { id: 1, title: "Dharma Negara Alaya", cat: "Cosplay Event — 7 Feb 2026", img: ShowcaseOne },
    { id: 2, title: "Frieren & Himmel", cat: "Cinematic Music Video", img: ShowcaseTwo },
    { id: 3, title: "Dharma Negara Alaya", cat: "Cosplay Event — 8 Feb 2026", img: ShowcaseThree },
    { id: 4, title: "Moonlight Effulgent", cat: "The Beauty of My Wife Selvi", img: ShowcaseFour },
    { id: 5, title: "KWB (Kpop Wibu Bali)", cat: "Cosplay Event — 15 Feb 2026", img: ShowcaseFive },
    { id: 6, title: "Dewata Renfaire", cat: "Cosplay Event — 22 Feb 2026", img: ShowcaseSix },
  ];

  return (
    <div className="bg-[#050505] text-white selection:bg-white selection:text-black font-sans overflow-x-hidden">
      <NoiseOverlay />

      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-[1.5px] bg-white origin-left z-[100]" style={{ scaleX }} />

      {/* Smart Cursor — Desktop only */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[999] hidden md:block"
        variants={variants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
      />

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden px-6">
        {/* Ambient background gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: heroLoaded ? 0.35 : 0, scale: 1 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[180px]"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)' }}
          />
          <motion.div
            animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[150px]"
            style={{ background: 'radial-gradient(circle, rgba(200,200,200,0.04) 0%, transparent 70%)' }}
          />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="text-center z-10 w-full"
        >
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: heroLoaded ? 1 : 0, y: heroLoaded ? 0 : 30 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-[9px] sm:text-[10px] tracking-[0.7em] sm:tracking-[1em] text-zinc-500 uppercase mb-8 md:mb-12"
          >
            Visionary Director &amp; CEO
          </motion.p>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: heroLoaded ? '0%' : '100%' }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[18vw] sm:text-[15vw] md:text-[14vw] font-medium tracking-tighter leading-none"
              onMouseEnter={() => setCursorVariant("text")}
              onMouseLeave={() => setCursorVariant("default")}
            >
              RAY{' '}
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: heroLoaded ? 1 : 0, x: heroLoaded ? 0 : -20 }}
                transition={{ duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="font-light italic text-zinc-500"
              >
                DHARMA
              </motion.span>
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: heroLoaded ? 1 : 0, y: heroLoaded ? 0 : 20 }}
            transition={{ duration: 1, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 md:mt-14 flex justify-center gap-4 sm:gap-8 text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.4em] text-zinc-500 uppercase"
          >
            <span>Hikayyara Creative</span>
            <span className="text-zinc-800">/</span>
            <span>Visual Architect</span>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="absolute bottom-8 sm:bottom-10 text-zinc-700"
        >
          <ChevronDown size={22} strokeWidth={1} />
        </motion.div>
      </section>

      {/* Ticker */}
      <Ticker items={tickerItems} speed={28} />

      {/* ── STATS ROW ────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {[
            { val: 50, suf: '+', label: 'Projects Delivered' },
            { val: 9, suf: ' yrs', label: 'Experience' },
            { val: 10, suf: '+', label: 'Brand Clients' },
            { val: 50, suf: 'K+', label: 'Reach Generated' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="text-center md:text-left border-t border-zinc-900 pt-6"
            >
              <p className="text-4xl md:text-5xl font-light tracking-tighter text-white tabular-nums">
                <AnimatedCounter target={stat.val} suffix={stat.suf} />
              </p>
              <p className="text-[9px] tracking-[0.3em] text-zinc-600 uppercase mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PROFILE ──────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto border-t border-zinc-900/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Image with parallax */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            onMouseEnter={() => setCursorVariant("hover")}
            onMouseLeave={() => setCursorVariant("default")}
            className="relative aspect-[4/5] overflow-hidden bg-zinc-900 shadow-2xl"
          >
            <ParallaxImage src={RayDharma} alt="Ray Dharma" className="absolute inset-0" speed={0.12} />
            {/* Reveal overlay */}
            <motion.div
              initial={{ scaleY: 1 }}
              whileInView={{ scaleY: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
              viewport={{ once: true }}
              style={{ originY: 0 }}
              className="absolute inset-0 bg-[#050505] z-10"
            />
            <div className="absolute inset-0 border border-white/5 z-20" />
            {/* Floating label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              viewport={{ once: true }}
              className="absolute bottom-5 left-5 right-5 z-20 flex justify-between items-end"
            >
              <div className="bg-black/60 backdrop-blur-sm border border-white/10 px-4 py-2.5 rounded">
                <p className="text-[8px] tracking-[0.3em] text-zinc-400 uppercase">CEO & Director</p>
                <p className="text-sm font-medium tracking-tight">Hikayyara Creative</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="space-y-8 md:space-y-10"
          >
            <div className="space-y-4">
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-[9px] sm:text-xs tracking-[0.4em] text-zinc-500 uppercase"
              >
                The Leadership
              </motion.h2>
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-balance text-white">
                <SplitReveal
                  text="Elevating brands through strategic visuals."
                  delay={0.25}
                />
              </h3>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="text-zinc-400 text-base md:text-lg leading-relaxed font-light text-justify md:text-left"
            >
              Sebagai CEO dari{' '}
              <span className="text-white font-medium">Hikayyara Creative</span>
              , Ray Dharma memadukan insting bisnis dengan eksekusi visual kelas atas. Fokus saya adalah menciptakan narasi sinematik yang tidak hanya estetik, tetapi juga menggerakkan audiens. Kami percaya bahwa setiap frame adalah cerita, &amp; setiap cerita adalah aset brand yang tak ternilai.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-8 md:gap-10 py-8 border-y border-zinc-900"
            >
              <div>
                <p className="text-[9px] tracking-widest text-zinc-600 uppercase mb-3">Expertise</p>
                <ul className="text-sm space-y-2 text-zinc-300 tracking-wide font-light">
                  {["Creative Direction", "Cinematography", "Brand Strategy"].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 + i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[9px] tracking-widest text-zinc-600 uppercase mb-3">Contact</p>
                <ul className="text-sm space-y-2 text-zinc-300 tracking-wide font-light">
                  <li>
                    <a href="mailto:raydharmaa@gmail.com" className="underline underline-offset-4 hover:text-white transition-colors">
                      raydharmaa@gmail.com
                    </a>
                  </li>
                  <li>
                    <a href="https://instagram.com/raydharmawan" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-white transition-colors">
                      Instagram / raydharmawan
                    </a>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* <MagneticWrapper strength={0.35}>
              <motion.a
                href="#"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ x: 8 }}
                onMouseEnter={() => setCursorVariant("hover")}
                onMouseLeave={() => setCursorVariant("default")}
                className="inline-flex items-center gap-4 text-[9px] sm:text-[10px] tracking-[0.3em] font-bold border-b border-white pb-2 transition-all hover:text-zinc-400 hover:border-zinc-400"
              >
                DOWNLOAD PROFESSIONAL CV <Download size={13} />
              </motion.a>
            </MagneticWrapper> */}
          </motion.div>
        </div>
      </section>

      {/* Ticker reverse */}
      <Ticker items={["Visual Storytelling", "Ray Dharma", "Hikayyara Creative", "Bali Indonesia", "Cosplay Events", "Cinematic"]} speed={22} reverse />

      {/* ── PORTFOLIO GRID ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-4 sm:px-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-12 md:mb-16 px-2 gap-4">
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: '110%' }}
              whileInView={{ y: '0%' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-light tracking-tighter italic text-white"
            >
              Featured Works
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-zinc-600 text-[9px] sm:text-[10px] tracking-[0.4em] uppercase font-medium"
          >
            Archive 2026
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {portfolios.map((item, index) => (
            <PortfolioCard key={item.id} item={item} index={index} setCursor={setCursorVariant} />
          ))}
        </div>
      </section>

      {/* ── IN PRODUCTION (WHITE) ────────────────────────────────────────── */}
      <section
        onMouseEnter={() => setIsOverWhite(true)}
        onMouseLeave={() => setIsOverWhite(false)}
        className="py-24 md:py-40 bg-white text-black overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-6">
            <div>
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: '110%' }}
                  whileInView={{ y: '0%' }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter italic leading-none"
                >
                  IN PRODUCTION.
                </motion.h2>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-zinc-400 mt-4 tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[9px] sm:text-xs"
              >
                A glimpse into the daily rhythm &amp; visual studies at @raydharmawan
              </motion.p>
            </div>

            <MagneticWrapper strength={0.3}>
              <motion.a
                href="https://instagram.com/raydharmawan"
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                onMouseEnter={() => setCursorVariant("hover")}
                onMouseLeave={() => setCursorVariant("default")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 md:px-10 py-3.5 md:py-4 bg-black text-white rounded-full flex items-center gap-3 text-[9px] sm:text-xs tracking-widest font-bold hover:bg-zinc-800 transition-colors"
              >
                VISIT INSTAGRAM <ArrowUpRight size={15} />
              </motion.a>
            </MagneticWrapper>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            {[BTSOne, BTSTwo, BTSThree, BTSFour].map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                className="aspect-square bg-zinc-100 overflow-hidden relative group cursor-none"
                onMouseEnter={() => setCursorVariant("hover")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center"
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                  >
                    <Play className="text-white" fill="white" size={28} />
                  </motion.div>
                </motion.div>
                <motion.img
                  src={img}
                  className="w-full h-full object-cover"
                  alt={`BTS ${i + 1}`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="py-24 md:py-40 px-6 text-center border-t border-zinc-900 relative overflow-hidden">
        {/* bg glow */}
        <motion.div
          animate={{ opacity: [0.05, 0.12, 0.05], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[200px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%)' }}
        />

        <div onMouseEnter={() => setCursorVariant("text")} onMouseLeave={() => setCursorVariant("default")}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-zinc-600 tracking-[0.5em] text-[9px] sm:text-[10px] uppercase mb-8 md:mb-10"
          >
            Get in touch
          </motion.p>

          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: '100%' }}
              whileInView={{ y: '0%' }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="text-[14vw] sm:text-[12vw] md:text-[10vw] font-bold tracking-tighter leading-none mb-12 md:mb-20"
            >
              <ScrambleText text="LET'S TALK." trigger={true} />
            </motion.h2>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex justify-center gap-8 sm:gap-12 text-zinc-500 text-[9px] sm:text-xs tracking-[0.2em] uppercase"
        >
          {[
            { label: 'Instagram', href: 'https://instagram.com/raydharmawan' },
            { label: 'Mail', href: 'mailto:raydharmaa@gmail.com' },
          ].map((link, i) => (
            <MagneticWrapper key={i} strength={0.5}>
              <motion.a
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="hover:text-white transition-colors duration-300 relative group"
                onMouseEnter={() => setCursorVariant("hover")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
              </motion.a>
            </MagneticWrapper>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-24 md:mt-40 text-zinc-600 text-[9px] sm:text-[10px] md:text-sm font-medium tracking-[0.4em] uppercase"
        >
          Hikayyara Creative © 2026 — Ray Dharma
        </motion.p>
      </footer>
    </div>
  );
};

// ─── PORTFOLIO CARD ───────────────────────────────────────────────────────────
const PortfolioCard = ({ item, index, setCursor }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? '4%' : '-4%', index % 2 === 0 ? '-4%' : '4%']);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-50px' }}
      onMouseEnter={() => setCursor("hover")}
      onMouseLeave={() => setCursor("default")}
      className="relative overflow-hidden bg-zinc-900 group cursor-none"
      style={{ aspectRatio: '9/16' }}
    >
      {/* Reveal overlay */}
      <motion.div
        initial={{ scaleY: 1 }}
        whileInView={{ scaleY: 0 }}
        transition={{ duration: 1, delay: 0.15 + (index % 3) * 0.1, ease: [0.76, 0, 0.24, 1] }}
        viewport={{ once: true }}
        style={{ originY: 1 }}
        className="absolute inset-0 bg-zinc-800 z-20"
      />

      <motion.img
        src={item.img}
        alt={item.title}
        style={{ y }}
        className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
      />

      {/* Gradient overlay */}
      <motion.div
        initial={{ opacity: 0.6 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8 md:p-10"
      >
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 + index * 0.05 }}
          viewport={{ once: true }}
          className="text-[8px] sm:text-[9px] tracking-[0.35em] text-zinc-300 mb-2 uppercase font-bold"
        >
          {item.cat}
        </motion.p>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 + index * 0.05 }}
          viewport={{ once: true }}
          className="text-xl sm:text-2xl md:text-3xl font-light tracking-tighter flex justify-between items-end italic text-white text-balance gap-3"
        >
          {item.title}
          <motion.span whileHover={{ x: 3, y: -3 }} transition={{ type: 'spring', stiffness: 400 }}>
            <ArrowUpRight size={18} strokeWidth={1} className="shrink-0" />
          </motion.span>
        </motion.h3>
      </motion.div>
    </motion.div>
  );
};

export default App;