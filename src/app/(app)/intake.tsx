import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, T, Wordmark } from '@/components/ui';
import { useAuth } from '@/lib/auth/provider';
import { DOMAINS } from '@/lib/data/domains';
import { QUESTIONS, questionsForDomain, type Question } from '@/lib/data/questions';
import { buildSampleAnswers } from '@/lib/data/sample';
import { useProgressStore, useUserProgress } from '@/lib/progress/store';
import { colors } from '@/lib/theme';

export default function IntakeScreen() {
  const { user } = useAuth();
  const progress = useUserProgress(user?.id);
  const setDraft = useProgressStore((state) => state.setDraft);
  const completeAssessment = useProgressStore((state) => state.completeAssessment);
  const router = useRouter();
  const [step, setStep] = useState(progress.draft?.step ?? 0);
  const [answers, setAnswers] = useState<Record<string, string | number>>(progress.draft?.answers ?? {});
  const [error, setError] = useState<string | null>(null);
  const review = step >= DOMAINS.length;
  const domain = DOMAINS[step];

  useEffect(() => {
    if (!user) return;
    setDraft(user.id, { step, answers });
  }, [user, step, answers, setDraft]);

  if (!user) return null;

  function choose(questionId: string, value: string | number) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  function domainComplete(domainId: string) {
    return questionsForDomain(domainId).every((question) => answers[question.id] !== undefined);
  }

  function goNext() {
    if (!review && domain && !domainComplete(domain.id)) return;
    const next = Math.min(step + 1, DOMAINS.length);
    setStep(next);
  }

  function goBack() {
    if (step > 0) {
      setStep(step - 1);
      return;
    }
    if (router.canGoBack()) router.back();
    else router.replace(progress.assessments.length > 0 ? '/' : '/welcome');
  }

  function submit() {
    if (!DOMAINS.every((item) => domainComplete(item.id))) {
      setError('Answer every domain before you submit.');
      return;
    }
    const payload = QUESTIONS.map((question) => ({
      questionId: question.id,
      value: answers[question.id] ?? '',
    }));
    const result = completeAssessment(user!.id, payload);
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    router.replace('/results');
  }

  function fillSample() {
    const sample = buildSampleAnswers(QUESTIONS);
    setAnswers(sample);
    setStep(DOMAINS.length);
  }

  const questions = domain ? questionsForDomain(domain.id) : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ink }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 }}>
        <View className="w-full max-w-xl self-center">
          <Wordmark />
          <T tone="mute" className="mt-4 text-xs uppercase tracking-[2px]">
            {review ? 'Review' : `${domain?.name} · ${step + 1} of ${DOMAINS.length}`}
          </T>
          <View className="mt-3 h-1 overflow-hidden rounded-full bg-panel2">
            <View
              style={{
                width: `${(Math.min(step, DOMAINS.length) / DOMAINS.length) * 100}%`,
                height: 4,
                backgroundColor: colors.brass,
              }}
            />
          </View>
          {review ? (
            <View className="mt-6 gap-3">
              <T className="text-2xl font-semibold">Check the baseline</T>
              <T tone="mute" className="text-sm leading-5">
                Submit stores the raw answers. Scores are calculated from those answers, not typed in.
              </T>
              {DOMAINS.map((item, index) => (
                <Pressable
                  key={item.id}
                  onPress={() => setStep(index)}
                  className="rounded-md border border-line bg-panel px-4 py-3"
                >
                  <T className="text-base">{item.name}</T>
                  <T tone={domainComplete(item.id) ? 'pine' : 'clay'} className="mt-1 text-sm">
                    {domainComplete(item.id) ? 'Answered' : 'Missing answers'}
                  </T>
                </Pressable>
              ))}
              {__DEV__ ? (
                <Button label="Fill sample answers (dev)" tone="ghost" onPress={fillSample} />
              ) : null}
            </View>
          ) : (
            <View className="mt-6 gap-6">
              <T className="text-2xl font-semibold">{domain?.name}</T>
              <T tone="mute" className="text-sm leading-5">
                {domain?.description}
              </T>
              {questions.map((question) => (
                <QuestionField
                  key={question.id}
                  question={question}
                  value={answers[question.id]}
                  onChange={(value) => choose(question.id, value)}
                />
              ))}
            </View>
          )}
          {error ? (
            <T tone="clay" className="mt-4 text-sm leading-5">
              {error}
            </T>
          ) : null}
        </View>
      </ScrollView>
      <View className="border-t border-line px-5 py-3">
        <View className="w-full max-w-xl flex-row gap-3 self-center">
          <View className="flex-1">
            <Button label="Back" tone="ghost" onPress={goBack} />
          </View>
          <View className="flex-1">
            {review ? (
              <Button label="See my baseline" onPress={submit} />
            ) : (
              <Button
                label="Continue"
                onPress={goNext}
                disabled={!domain || !domainComplete(domain.id)}
              />
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function QuestionField({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
}) {
  return (
    <View>
      <T className="text-base leading-6">{question.prompt}</T>
      {question.kind === 'scale' ? (
        <View className="mt-3">
          <T tone="mute" className="mb-2 text-xs">
            1 is not in place. 10 is something you would trust on a bad week.
          </T>
          <View className="flex-row flex-wrap gap-2">
            {Array.from({ length: question.max - question.min + 1 }, (_, index) => question.min + index).map(
              (score) => {
                const selected = value === score;
                return (
                  <Pressable
                    key={score}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => onChange(score)}
                    className={`h-11 w-11 items-center justify-center rounded-md ${selected ? 'bg-brass' : 'border border-line bg-panel'}`}
                  >
                    <T tone={selected ? 'ink' : 'cream'}>{score}</T>
                  </Pressable>
                );
              },
            )}
          </View>
        </View>
      ) : (
        <View className="mt-3 gap-2">
          {question.options.map((option) => {
            const selected = value === option.id;
            return (
              <Pressable
                key={option.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => onChange(option.id)}
                className={`rounded-md px-3 py-3 ${selected ? 'border border-brass bg-panel2' : 'border border-line bg-panel'}`}
              >
                <T className="text-sm leading-5">{option.label}</T>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
