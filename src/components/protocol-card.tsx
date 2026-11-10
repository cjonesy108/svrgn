import { ReactNode } from 'react';
import { View } from 'react-native';

import { T } from '@/components/ui';
import { LEGAL_LITERACY_NOTE } from '@/lib/data/legal';
import { getProtocol } from '@/lib/data/protocols';

export function ProtocolCard({ domainId }: { domainId: string }) {
  const protocol = getProtocol(domainId);
  if (!protocol) return null;
  return (
    <View className="rounded-md border border-line bg-panel p-4">
      <T tone="brass" className="text-xs uppercase tracking-[2px]">
        When you fall short
      </T>
      <T className="mt-2 text-base font-semibold">{protocol.title}</T>
      <T tone="mute" className="mt-2 text-sm leading-5">
        {protocol.body}
      </T>
      {domainId === 'rights' ? (
        <T tone="mute" className="mt-3 text-sm leading-5">
          {LEGAL_LITERACY_NOTE}
        </T>
      ) : null}
    </View>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <View className="rounded-md border border-line bg-panel p-4">
      <T tone="mute" className="text-sm leading-5">
        {children}
      </T>
    </View>
  );
}
