import { forwardRef } from 'react';
import Svg, { Circle, Line, Rect, Text as SvgText, TSpan } from 'react-native-svg';

import type { SvgExportHandle } from '@/lib/share/export-png';
import {
  CARD_HEIGHT,
  CARD_PAD,
  CARD_TEXT_WIDTH,
  CARD_WIDTH,
  badgeCountLabel,
  formatCardDate,
  wrapText,
} from '@/lib/share/layout';
import type { ShareCardModel } from '@/lib/share/model';
import { colors } from '@/lib/theme';

export const ShareCardArt = forwardRef<SvgExportHandle, { model: ShareCardModel; width: number }>(
  function ShareCardArt({ model, width }, ref) {
    const height = Math.round(width * (CARD_HEIGHT / CARD_WIDTH));
    return (
      <Svg
        ref={ref as never}
        viewBox={`0 0 ${CARD_WIDTH} ${CARD_HEIGHT}`}
        width={width}
        height={height}
      >
        <Rect width={CARD_WIDTH} height={CARD_HEIGHT} fill={colors.ink} />
        <Rect
          x={36}
          y={36}
          width={CARD_WIDTH - 72}
          height={CARD_HEIGHT - 72}
          stroke={colors.brass}
          strokeWidth={2}
          fill="none"
        />
        <Mark />
        <Label x={CARD_PAD} y={132} text="SOVEREIGN PATH" size={22} fill={colors.brass} spacing={7} />
        {model.kind === 'badge' ? <BadgeBody model={model} /> : <RankBody model={model} />}
        <Label
          x={CARD_PAD}
          y={1284}
          text="PERSONAL CAPABILITY, THEN CIVIC SKILL"
          size={18}
          fill={colors.mute}
          spacing={2.4}
        />
      </Svg>
    );
  },
);

function BadgeBody({ model }: { model: Extract<ShareCardModel, { kind: 'badge' }> }) {
  const titleLines = wrapText(model.title, 56, CARD_TEXT_WIDTH, 3, 0, true);
  const titleLine = 70;
  const titleTop = 292;
  const descriptionTop = titleTop + titleLines.length * titleLine + 36;
  const description = wrapText(model.description, 28, CARD_TEXT_WIDTH, 4);
  const layerColor = model.layer === 'civic' ? colors.pine : colors.brass;
  const difficulty = model.difficulty.charAt(0).toUpperCase() + model.difficulty.slice(1);
  const holder = wrapText(model.holderName, 26, CARD_TEXT_WIDTH, 1, 0, true)[0] ?? model.holderName;
  return (
    <>
      <Label x={CARD_PAD} y={214} text={model.domainName.toUpperCase()} size={22} fill={layerColor} spacing={3} />
      <Block x={CARD_PAD} y={titleTop} lines={titleLines} size={56} fill={colors.cream} lineHeight={titleLine} bold />
      <Block x={CARD_PAD} y={descriptionTop} lines={description} size={28} fill={colors.mute} lineHeight={40} />
      <Line x1={CARD_PAD} y1={1064} x2={CARD_WIDTH - CARD_PAD} y2={1064} stroke={colors.line} strokeWidth={2} />
      <Label x={CARD_PAD} y={1116} text="EARNED" size={18} fill={colors.brass} spacing={4} />
      <Label x={CARD_PAD} y={1164} text={formatCardDate(model.earnedAt)} size={34} fill={colors.cream} bold />
      <Label x={CARD_PAD} y={1216} text={holder} size={26} fill={colors.cream} />
      <Label x={CARD_PAD} y={1254} text={`Self-attested · ${difficulty}`} size={22} fill={colors.mute} />
    </>
  );
}

function RankBody({ model }: { model: Extract<ShareCardModel, { kind: 'rank' }> }) {
  const summary = wrapText(model.summary, 30, CARD_TEXT_WIDTH, 4);
  const holder = wrapText(model.holderName, 36, CARD_TEXT_WIDTH, 1, 0, true)[0] ?? model.holderName;
  return (
    <>
      <Label
        x={CARD_PAD}
        y={230}
        text={`RANK ${model.order}  ·  ${model.theme.toUpperCase()}`}
        size={22}
        fill={colors.brass}
        spacing={3}
      />
      <Label x={CARD_PAD} y={390} text={model.rankName} size={100} fill={colors.cream} bold />
      <Block x={CARD_PAD} y={470} lines={summary} size={30} fill={colors.mute} lineHeight={42} />
      <Line x1={CARD_PAD} y1={1040} x2={CARD_WIDTH - CARD_PAD} y2={1040} stroke={colors.line} strokeWidth={2} />
      <Label x={CARD_PAD} y={1110} text={holder} size={36} fill={colors.cream} bold />
      <Label x={CARD_PAD} y={1168} text={badgeCountLabel(model.earnedCount)} size={28} fill={colors.brass} />
      <Label x={CARD_PAD} y={1224} text={`As of ${formatCardDate(model.asOf)}`} size={24} fill={colors.mute} />
    </>
  );
}

function Mark() {
  const x = CARD_WIDTH - CARD_PAD - 6;
  const y = 118;
  return (
    <>
      <Circle cx={x} cy={y} r={34} stroke={colors.brass} strokeWidth={3} fill="none" />
      <Circle cx={x} cy={y} r={4} fill={colors.brass} />
      <Line x1={x} y1={y} x2={x + 20} y2={y - 24} stroke={colors.brass} strokeWidth={3} strokeLinecap="round" />
    </>
  );
}

function Label({
  x,
  y,
  text,
  size,
  fill,
  spacing = 0,
  bold = false,
}: {
  x: number;
  y: number;
  text: string;
  size: number;
  fill: string;
  spacing?: number;
  bold?: boolean;
}) {
  return (
    <SvgText
      x={x}
      y={y}
      fill={fill}
      fontSize={size}
      fontFamily="sans-serif"
      fontWeight={bold ? '700' : '500'}
      letterSpacing={spacing}
    >
      {text}
    </SvgText>
  );
}

function Block({
  x,
  y,
  lines,
  size,
  fill,
  lineHeight,
  bold = false,
}: {
  x: number;
  y: number;
  lines: string[];
  size: number;
  fill: string;
  lineHeight: number;
  bold?: boolean;
}) {
  return (
    <SvgText x={x} y={y} fill={fill} fontSize={size} fontFamily="sans-serif" fontWeight={bold ? '700' : '500'}>
      {lines.map((line, index) => (
        <TSpan key={`${index}-${line}`} x={x} dy={index === 0 ? 0 : lineHeight}>
          {line}
        </TSpan>
      ))}
    </SvgText>
  );
}
