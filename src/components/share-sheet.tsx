import { useEffect, useRef, useState } from 'react';
import { Modal, Platform, ScrollView, useWindowDimensions, View } from 'react-native';

import { ShareCardArt } from '@/components/share-card-art';
import { Button, T } from '@/components/ui';
import { deliverWebPng, exportShareCard, rasterizeSvg, type SvgExportHandle } from '@/lib/share/export-png';
import { CARD_HEIGHT, CARD_WIDTH, cardFileName } from '@/lib/share/layout';
import type { ShareCardModel } from '@/lib/share/model';
import { colors } from '@/lib/theme';

export function ShareSheet({ model, onClose }: { model: ShareCardModel | null; onClose: () => void }) {
  const svgRef = useRef<SvgExportHandle>(null);
  const { width } = useWindowDimensions();
  const preview = Math.min(360, Math.max(240, width - 48));
  const [ready, setReady] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setReady(null);
    setStatus(null);
    setError(null);
    if (!model || Platform.OS !== 'web') return;
    let cancel = false;
    let attempts = 0;
    const timer = setInterval(() => {
      if (cancel) return;
      attempts += 1;
      const node = svgRef.current?.elementRef?.current;
      if (!node && attempts < 20) return;
      clearInterval(timer);
      if (!node) {
        setError('The card is not ready to export.');
        return;
      }
      void rasterizeSvg(node, CARD_WIDTH, CARD_HEIGHT)
        .then((png) => {
          if (!cancel) setReady(png);
        })
        .catch((caught: unknown) => {
          if (!cancel) setError(caught instanceof Error ? caught.message : 'Could not draw the card.');
        });
    }, 50);
    return () => {
      cancel = true;
      clearInterval(timer);
    };
  }, [model]);

  async function save() {
    if (!model || busy) return;
    setBusy(true);
    setError(null);
    try {
      if (Platform.OS === 'web') {
        if (!ready) return;
        const label = model.kind === 'badge' ? model.title : model.rankName;
        const outcome = await deliverWebPng(ready, cardFileName(model.kind, label), `${label} · Sovereign Path`);
        setStatus(outcome === 'shared' ? 'Opened the share sheet.' : 'Saved the PNG.');
        return;
      }
      const handle = svgRef.current;
      if (!handle) throw new Error('The card is not ready to export.');
      const outcome = await exportShareCard(handle, model);
      setStatus(outcome === 'shared' ? 'Opened the share sheet.' : 'Saved the PNG.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not export the card.');
    } finally {
      setBusy(false);
    }
  }

  const webWaiting = Platform.OS === 'web' && !ready && !error;
  const label = model?.kind === 'rank' ? 'Save rank card' : 'Save badge card';

  return (
    <Modal visible={model !== null} animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.ink }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 28, alignItems: 'center' }}>
          {model ? (
            <View style={{ width: preview, backgroundColor: colors.ink }}>
              <ShareCardArt ref={svgRef} model={model} width={preview} />
            </View>
          ) : null}
          <View style={{ width: Math.min(420, width - 40), marginTop: 16, gap: 12 }}>
            <Button label={busy || webWaiting ? 'Preparing image…' : label} onPress={save} disabled={busy || webWaiting} />
            <Button label="Close" tone="ghost" onPress={onClose} />
            {status ? (
              <T className="text-center text-sm leading-5">{status}</T>
            ) : (
              <T tone="mute" className="text-center text-sm leading-5">
                Saves a PNG. On a phone, this opens the share sheet when the browser allows it.
              </T>
            )}
            {error ? (
              <T tone="clay" className="text-center text-sm leading-5">
                {error}
              </T>
            ) : null}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
