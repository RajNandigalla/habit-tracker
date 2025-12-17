import { GeometryConstants, Point, SliderTick } from './types';

export const GEOMETRY: GeometryConstants = {
  viewboxWidth: 400,
  viewboxHeight: 400,
  arcRadius: 350,
  centerX: 200,
  centerY: 420,
  arcSpan: 80,
  startAngle: 270 - 80 / 2, // 230
  endAngle: 270 + 80 / 2, // 310
  emojiRadius: 350 + 70, // 420
};

export const toRad = (deg: number): number => (deg * Math.PI) / 180;

export const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number): Point => {
  const rad = toRad(angleDeg);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
};

export const getAngleForIndex = (index: number, totalOptions: number): number => {
  const pct = index / (totalOptions - 1);
  return GEOMETRY.startAngle + pct * (GEOMETRY.endAngle - GEOMETRY.startAngle);
};

export const createArcPath = (
  start: number,
  end: number,
  radius: number,
  centerX: number,
  centerY: number
): string => {
  const startPt = polarToCartesian(centerX, centerY, radius, start);
  const endPt = polarToCartesian(centerX, centerY, radius, end);
  const largeArcFlag = end - start <= 180 ? '0' : '1';

  return [
    'M',
    startPt.x,
    startPt.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    1,
    endPt.x,
    endPt.y,
  ].join(' ');
};

export const generateTicks = (currentAngle: number, count: number = 41): SliderTick[] => {
  return Array.from({ length: count }).map((_, i) => {
    const t = i / (count - 1);
    const angle = GEOMETRY.startAngle + t * (GEOMETRY.endAngle - GEOMETRY.startAngle);
    const isMajor = i % 10 === 0;
    const isActive = angle <= currentAngle;

    return { angle, isMajor, isActive };
  });
};

export const calculateIndexFromAngle = (angle: number, totalOptions: number): number => {
  const pct = (angle - GEOMETRY.startAngle) / (GEOMETRY.endAngle - GEOMETRY.startAngle);
  return Math.round(pct * (totalOptions - 1));
};

export const clampAngle = (angle: number): number => {
  return Math.max(GEOMETRY.startAngle, Math.min(GEOMETRY.endAngle, angle));
};
