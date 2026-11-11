import * as WebBrowser from 'expo-web-browser';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { Note, ProtocolCard } from '@/components/protocol-card';
import { ShareSheet } from '@/components/share-sheet';
import { Button, Screen, T, Wordmark } from '@/components/ui';
import { getBadge } from '@/lib/data/badges';
import { getDomain } from '@/lib/data/domains';
import { LEGAL_LITERACY_NOTE } from '@/lib/data/legal';
import { usePathData } from '@/lib/progress/use-path';
import { MIN_REFLECTION_LENGTH } from '@/lib/progress/rules';
import { useProgressStore } from '@/lib/progress/store';
import { badgeShareModel } from '@/lib/share/model';
import { colors } from '@/lib/theme';

export default function BadgeDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const badge = id ? getBadge(id) : undefined;
  const router = useRouter();
  const { user, progress } = usePathData();
  const startBadge = useProgressStore((state) => state.startBadge);
  const completeBadge = useProgressStore((state) => state.completeBadge);
  const [attested, setAttested] = useState(false);
  const [reflection, setReflection] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  if (!badge || !user) {
    return (
      <Screen>
        <T>That badge is not in the catalog.</T>
        <View className="mt-4">
          <Button label="Back to the catalog" onPress={() => router.replace('/badges')} />
        </View>
      </Screen>
    );
  }

  const domain = getDomain(badge.domainId);
  const record = progress.badges[badge.id];
  const prerequisites = badge.prerequisites.map((prerequisiteId) => getBadge(prerequisiteId)).filter((item) => item !== undefined);
  const locked = prerequisites.some((item) => progress.badges[item.id]?.status !== 'completed');

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace('/badges');
  }

  function begin() {
    const result = startBadge(user!.id, badge!.id);
    if (!result.ok) setError(result.reason);
  }

  function finish() {
    const result = completeBadge(user!.id, badge!.id, reflection, attested);
    if (!result.ok) setError(result.reason);
    else setError(null);
  }

  return (
    <Screen
      footer={<Button label="Back" tone="ghost" onPress={back} />}
    >
      <Wordmark />
      <Pressable onPress={back} className="mt-4">
        <T tone="brass" className="text-sm">
          Back
        </T>
      </Pressable>
      <T tone="brass" className="mt-4 text-xs uppercase tracking-[2px]">
        {domain?.name} · {badge.difficulty} · {badge.xp} xp
      </T>
      <T className="mt-2 text-3xl font-semibold">{badge.title}</T>
      <T tone="mute" className="mt-2 text-base leading-6">
        {badge.description}
      </T>
      <T tone="mute" className="mt-2 text-sm">
        Effort: {badge.effort}
      </T>

      {prerequisites.length > 0 ? (
        <View className="mt-4">
          <T className="text-sm font-semibold">Prerequisites</T>
          {prerequisites.map((item) => {
            const done = progress.badges[item.id]?.status === 'completed';
            return (
              <Pressable key={item.id} onPress={() => router.push(`/badge/${item.id}`)} className="mt-2">
                <T tone={done ? 'pine' : 'clay'} className="text-sm">
                  {done ? 'Earned' : 'Still open'} · {item.title}
                </T>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      <T className="mb-2 mt-6 text-xs uppercase tracking-[2px]" tone="brass">
        Criteria
      </T>
      {badge.criteria.map((criterion, index) => (
        <T key={criterion} className="mb-2 text-base leading-6">
          {index + 1}. {criterion}
        </T>
      ))}

      <T className="mb-2 mt-4 text-xs uppercase tracking-[2px]" tone="brass">
        Lesson
      </T>
      <T className="text-base leading-6">{badge.lesson.summary}</T>
      {badge.lesson.steps.map((step, index) => (
        <T key={step} tone="mute" className="mt-2 text-sm leading-5">
          {index + 1}. {step}
        </T>
      ))}
      {badge.lesson.link ? (
        <Pressable
          accessibilityRole="link"
          onPress={() => WebBrowser.openBrowserAsync(badge.lesson.link!.url)}
          className="mt-3"
        >
          <T tone="brass" className="text-base">
            {badge.lesson.link.label}
          </T>
        </Pressable>
      ) : null}

      {badge.domainId === 'rights' || badge.id === 'statute-and-contract' ? (
        <View className="mt-4">
          <Note>{LEGAL_LITERACY_NOTE}</Note>
        </View>
      ) : null}

      <View className="mt-6">
        <ProtocolCard domainId={badge.domainId} />
      </View>

      <View className="mt-6">
        {record?.status === 'completed' ? (
          <View className="rounded-md border border-line bg-panel p-4">
            <T tone="brass" className="text-xs uppercase tracking-[2px]">
              Earned {record.completedAt ? new Date(record.completedAt).toLocaleDateString() : ''}
            </T>
            <T className="mt-3 text-base leading-6">{record.reflection}</T>
            <View className="mt-4">
              <Button label="Share badge card" onPress={() => setShareOpen(true)} />
            </View>
          </View>
        ) : locked ? (
          <T tone="mute" className="text-sm leading-5">
            Finish the prerequisites before you start this badge.
          </T>
        ) : record?.status !== 'in_progress' ? (
          <Button label="Begin this badge" onPress={begin} />
        ) : (
          <View className="gap-3">
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: attested }}
              onPress={() => setAttested((value) => !value)}
              className="flex-row gap-3 rounded-md border border-line bg-panel p-4"
            >
              <T tone={attested ? 'brass' : 'mute'}>{attested ? 'Yes' : 'No'}</T>
              <T className="flex-1 text-sm leading-5">
                I attest that every criterion above is true. No one else has reviewed this.
              </T>
            </Pressable>
            <T tone="mute" className="text-xs uppercase tracking-widest">
              Reflection · {reflection.trim().length}/{MIN_REFLECTION_LENGTH}
            </T>
            <TextInput
              value={reflection}
              onChangeText={setReflection}
              multiline
              placeholder="What did you do, and what is different because you did it?"
              placeholderTextColor={colors.mute}
              className="min-h-[120px] rounded-md border border-line bg-panel px-3 py-3 text-base text-cream"
              textAlignVertical="top"
            />
            <Button label="Mark complete" onPress={finish} />
          </View>
        )}
        {error ? (
          <T tone="clay" className="mt-3 text-sm leading-5">
            {error}
          </T>
        ) : null}
      </View>
      <ShareSheet
        model={
          shareOpen && record?.status === 'completed' && domain
            ? badgeShareModel({
                badge,
                holderName: user.name,
                domainName: domain.name,
                layer: domain.layer,
                earnedAt: record.completedAt ?? new Date().toISOString(),
              })
            : null
        }
        onClose={() => setShareOpen(false)}
      />
    </Screen>
  );
}
