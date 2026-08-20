import { useState } from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/ui/Icon";
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
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            {qi + 1}. {q.question}
          </p>
          <div className="flex flex-col gap-2">
            {q.options.map((opt, oi) => {
              const isSelected = answers[qi] === oi;
              const isCorrectOption = oi === q.correctIndex;

              let stateClass = "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700";
              if (submitted) {
                if (isCorrectOption) {
                  stateClass = "border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300";
                } else if (isSelected) {
                  stateClass = "border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300";
                } else {
                  stateClass = "border-gray-200 dark:border-gray-600 opacity-60";
                }
              } else if (isSelected) {
                stateClass = "border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300";
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
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-lg p-2.5">
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
        <p className="font-semibold text-gray-900 dark:text-white">
          Você acertou {score} de {questions.length} {questions.length === 1 ? "pergunta" : "perguntas"}.
        </p>
      )}
    </div>
  );
}
