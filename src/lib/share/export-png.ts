import { File as ExpoFile, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import { CARD_HEIGHT, CARD_WIDTH, cardFileName } from './layout';
import type { ShareCardModel } from './model';

export interface SvgExportHandle {
  toDataURL?: (callback: (base64: string) => void, options?: { width?: number; height?: number }) => void;
  elementRef?: { current: SVGSVGElement | null };
}

export async function exportShareCard(handle: SvgExportHandle, model: ShareCardModel): Promise<'shared' | 'downloaded'> {
  const label = model.kind === 'badge' ? model.title : model.rankName;
  const filename = cardFileName(model.kind, label);
  const title = `${label} · Sovereign Path`;
  if (Platform.OS === 'web') {
    const node = handle.elementRef?.current;
    if (!node) throw new Error('The card is not ready to export.');
    const dataUrl = await rasterizeSvg(node, CARD_WIDTH, CARD_HEIGHT);
    return deliverWebPng(dataUrl, filename, title);
  }
  const base64 = await rasterizeNative(handle);
  await shareNative(base64, filename, title);
  return 'shared';
}

/** Draw the on-screen SVG at the card's real pixel size. Call this before the save tap. */
export function rasterizeSvg(node: SVGSVGElement, width: number, height: number): Promise<string> {
  const clone = node.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));
  clone.setAttribute('viewBox', `0 0 ${width} ${height}`);
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;
  const xml = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (!context) {
        URL.revokeObjectURL(url);
        reject(new Error('Could not draw the card.'));
        return;
      }
      context.drawImage(image, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not draw the card.'));
    };
    image.src = url;
  });
}

/**
 * Download or open the system share sheet. Call this from the save press,
 * with a PNG that is already prepared, so the browser still treats it as a tap.
 */
export async function deliverWebPng(dataUrl: string, filename: string, title: string): Promise<'shared' | 'downloaded'> {
  const file = new File([dataUrlToBlob(dataUrl)], filename, { type: 'image/png' });
  const canShare = typeof navigator !== 'undefined' && navigator.canShare?.({ files: [file] });
  if (canShare) {
    try {
      await navigator.share({ files: [file], title });
      return 'shared';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'shared';
    }
  }
  downloadDataUrl(dataUrl, filename);
  return 'downloaded';
}

function downloadDataUrl(dataUrl: string, filename: string): void {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(',');
  const mime = /data:(.*?);/.exec(header ?? '')?.[1] ?? 'image/png';
  const binary = atob(data ?? '');
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new Blob([bytes], { type: mime });
}

function rasterizeNative(handle: SvgExportHandle): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!handle.toDataURL) {
      reject(new Error('The card is not ready to export.'));
      return;
    }
    const timer = setTimeout(() => reject(new Error('Could not draw the card.')), 8000);
    handle.toDataURL((base64) => {
      clearTimeout(timer);
      resolve(base64);
    }, { width: CARD_WIDTH, height: CARD_HEIGHT });
  });
}

async function shareNative(base64: string, filename: string, title: string): Promise<void> {
  const file = new ExpoFile(Paths.cache, filename);
  if (file.exists) file.delete();
  file.create();
  file.write(base64, { encoding: 'base64' });
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing is not available on this device.');
  }
  await Sharing.shareAsync(file.uri, {
    mimeType: 'image/png',
    UTI: 'public.png',
    dialogTitle: title,
  });
}
