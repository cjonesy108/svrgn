import { Fragment } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';

import { T } from '@/components/ui';
import type { DomainLayer } from '@/lib/data/domains';
import { colors } from '@/lib/theme';

export interface RadarPoint {
  id: string;
  short: string;
  score: number;
  layer: DomainLayer;
}

export function RadarChart({ points }: { points: RadarPoint[] }) {
  const size = 320;
  const center = size / 2;
  const radius = 108;
  const labelRadius = 138;
  const count = points.length;

  const at = (index: number, distance: number) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * index) / count;
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle),
    };
  };

  const polygon = points
    .map((point, index) => {
      const spot = at(index, radius * (point.score / 100));
      return `${spot.x},${spot.y}`;
    })
    .join(' ');

  return (
    <View accessibilityLabel="Domain radar">
      <Svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`}>
        {[0.25, 0.5, 0.75, 1].map((ring) => (
          <Circle
            key={ring}
            cx={center}
            cy={center}
            r={radius * ring}
            stroke={colors.line}
            strokeWidth={1}
            fill="none"
          />
        ))}
        {points.map((point, index) => {
          const end = at(index, radius);
          const label = at(index, labelRadius);
          const spot = at(index, radius * (point.score / 100));
          const civic = point.layer === 'civic';
          return (
            <Fragment key={point.id}>
              <Line x1={center} y1={center} x2={end.x} y2={end.y} stroke={colors.line} strokeWidth={1} />
              <Circle cx={spot.x} cy={spot.y} r={3.5} fill={civic ? colors.pine : colors.brass} />
              <SvgText
                x={label.x}
                y={label.y + 4}
                fill={civic ? colors.pine : colors.brass}
                fontSize={11}
                textAnchor="middle"
              >
                {point.short}
              </SvgText>
            </Fragment>
          );
        })}
        <Polygon points={polygon} fill="rgba(212,179,106,0.28)" stroke={colors.brass} strokeWidth={2} />
      </Svg>
      <T tone="mute" className="text-center text-xs">
        Brass marks are personal domains. Pine marks are civic domains.
      </T>
    </View>
  );
}
