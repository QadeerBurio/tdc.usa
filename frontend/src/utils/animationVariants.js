/**
 * TDC.USA — Shared Animation Variants
 * Premium motion design system, used across all pages for consistency.
 * Inspired by: Stripe, Linear, Vercel, Apple, Webflow
 */

// ─── Container: stagger children on enter ────────────────────────────────────
export const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

// ─── Basic fade + rise ────────────────────────────────────────────────────────
export const fadeUpVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 90, damping: 16 },
  },
};

// ─── Slide from left ──────────────────────────────────────────────────────────
export const slideFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 85, damping: 14 },
  },
};

// ─── Slide from right ─────────────────────────────────────────────────────────
export const slideFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 85, damping: 14 },
  },
};

// ─── Scale + Fade (for center hero elements) ─────────────────────────────────
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 80, damping: 16 },
  },
};

// ─── Alternating directional reveal (left / right based on index) ─────────────
export const getAlternatingVariant = (index) => {
  return index % 2 === 0 ? slideFromLeft : slideFromRight;
};

// ─── Page-header text entrance (used on all inner page banners) ───────────────
export const pageHeaderVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

export const pageHeaderTitle = {
  hidden: { opacity: 0, y: -28, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export const pageHeaderSubtitle = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.12 },
  },
};

// ─── Card with gold border on hover ──────────────────────────────────────────
export const cardHover = {
  rest: { y: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', borderColor: 'rgba(226,232,240,0.8)' },
  hover: {
    y: -8,
    boxShadow: '0 20px 45px rgba(0,0,0,0.09), 0 0 0 1px rgba(249,195,73,0.35)',
    borderColor: 'rgba(249,195,73,0.4)',
    transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
  },
};

// ─── Viewport settings (used with whileInView) ────────────────────────────────
export const defaultViewport = { once: true, margin: '-80px' };
