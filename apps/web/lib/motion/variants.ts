import { Variants } from "framer-motion";
import { DURATION, EASING, STAGGER } from "./constants";

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.medium / 1000, ease: EASING.easeOut },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER.children, delayChildren: 0.05 },
  },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER.fast, delayChildren: 0.03 },
  },
};

export const cardHover: Variants = {
  rest: { scale: 1, y: 0, boxShadow: "var(--shadow-sm)" },
  hover: {
    scale: 1.015,
    y: -3,
    boxShadow: "var(--shadow-lg), var(--shadow-glow-sm)",
    transition: EASING.spring,
  },
};

export const settingsCardHover: Variants = {
  rest: { y: 0 },
  hover: {
    y: -2,
    boxShadow: "var(--shadow-lg), var(--shadow-glow-sm)",
    transition: { type: "spring", stiffness: 300, damping: 28 },
  },
};

export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.default / 1000 } },
  exit: { opacity: 0, transition: { duration: DURATION.fast / 1000 } },
};

export const modalPanel: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...EASING.spring, delay: 0.03 },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: { duration: DURATION.fast / 1000, ease: EASING.easeIn },
  },
};

export const otpBoxEntry: Variants = {
  idle: { scale: 1, borderColor: "var(--border-default)" },
  filled: {
    scale: [1, 1.08, 1],
    borderColor: "var(--border-focus)",
    transition: EASING.springBounce,
  },
  error: {
    x: [0, -4, 4, -4, 4, 0],
    borderColor: "var(--error)",
    transition: { duration: DURATION.medium / 1000, ease: EASING.ease },
  },
  success: {
    scale: 1,
    borderColor: "var(--success)",
    backgroundColor: "rgba(82, 183, 136, 0.08)",
    transition: EASING.spring,
  },
};

export const badgeReveal: Variants = {
  hidden: { scale: 0, opacity: 0, rotate: -12 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { ...EASING.springBounce, delay: 0.2 },
  },
};
