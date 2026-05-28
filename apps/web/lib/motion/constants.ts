export const DURATION = {
  instant:  100,   
  fast:     150,   
  default:  250,   
  medium:   350,   
  slow:     500,  
  crawl:    800,   
} as const;

export const EASING = {
  ease:       [0.4, 0, 0.2, 1] as const,       
  easeIn:     [0.4, 0, 1, 1] as const,
  easeOut:    [0, 0, 0.2, 1] as const,

  spring:       { type: 'spring' as const, stiffness: 320, damping: 28 },
  springBounce: { type: 'spring' as const, stiffness: 400, damping: 20 },
  springSnap:   { type: 'spring' as const, stiffness: 500, damping: 35 },
} as const;

export const STAGGER = {
  children: 0.06,  
  fast:     0.04,  
} as const;
