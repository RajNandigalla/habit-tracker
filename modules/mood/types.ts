export interface MoodOption {
  value: number;
  label: string;
  emoji: string;
  color: string;
  id: string;
}

export interface GeometryConstants {
  viewboxWidth: number;
  viewboxHeight: number;
  arcRadius: number;
  centerX: number;
  centerY: number;
  arcSpan: number;
  startAngle: number;
  endAngle: number;
  emojiRadius: number;
}

export interface SliderTick {
  angle: number;
  isMajor: boolean;
  isActive: boolean;
}

export interface Point {
  x: number;
  y: number;
}
