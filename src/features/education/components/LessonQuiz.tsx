import { useState } from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/ui/Icon";
import ScoreArc from "../../../components/ui/ScoreArc";
import type { QuizQuestion } from "../types";

export default function LessonQuiz({
  questions,
  onFinish,
}: {
  questions: QuizQuestion[];
  onFinish: (score: number, total: number) => void;
}) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = answers.every((a) => a !== null);
  const score = answers.filter((a, i) => a === questions[i].correctIndex).length;

  const handleSubmit = () => {
    setSubmitted(true);
    onFinish(score, questions.length);
  };

  return (
    <div className="flex flex-col gap-5">
      {questions.map((q, qi) => (
        <div key={qi}>
          <p className="font-medium text-ink mb-2">
            {qi + 1}. {q.question}
          </p>
          <div className="flex flex-col gap-2">
            {q.options.map((opt, oi) => {
              const isSelected = answers[qi] === oi;
              const isCorrectOption = oi === q.correctIndex;

              let stateClass = "border-line hover:bg-surface-alt";
              if (submitted) {
                if (isCorrectOption) {
                  stateClass = "border-brand bg-brand-soft text-brand-deep";
                } else if (isSelected) {
                  stateClass = "border-negative bg-negative-soft text-negative";
                } else {
                  stateClass = "border-line opacity-60";
                }
              } else if (isSelected) {
                stateClass = "border-brand bg-brand-soft text-brand-deep";
              }

              return (
                <button
                  key={oi}
                  type="button"
                  disabled={submitted}
                  onClick={() => setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)))}
                  className={`flex items-center justify-between text-left rounded-lg border px-3 py-2 text-sm transition-all active:scale-[0.99] disabled:active:scale-100 ${stateClass}`}
                >
                  {opt}
                  {submitted && isCorrectOption && <Icon name="check" size={14} className="shrink-0" />}
                </button>
              );
            })}
          </div>
          {submitted && (
            <p className="mt-2 text-xs text-ink-soft bg-surface-alt rounded-lg p-2.5">
              💡 {q.explanation}
            </p>
          )}
        </div>
      ))}

      {!submitted ? (
        <Button onClick={handleSubmit} disabled={!allAnswered} className="self-start">
          Corrigir respostas
        </Button>
      ) : (
        <div className="flex items-center gap-4">
          <ScoreArc value={score} max={questions.length} size="sm" color="var(--brand)">
            <span className="font-data text-sm font-bold text-ink">
              {score}/{questions.length}
            </span>
          </ScoreArc>
          <p className="font-semibold text-ink">
            Você acertou {score} de {questions.length} {questions.length === 1 ? "pergunta" : "perguntas"}.
          </p>
        </div>
      )}
    </div>
  );
}
