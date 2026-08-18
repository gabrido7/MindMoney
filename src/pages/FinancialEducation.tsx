import { useMemo, useState } from "react";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";
import Modal from "../components/ui/Modal";
import Icon from "../components/ui/Icon";
import EmptyState from "../components/ui/EmptyState";
import {
  educationTopics,
  educationCategories,
  type EducationLevel,
  type EducationTopic,
} from "../features/education/data/topics";

const LEVELS: EducationLevel[] = ["Iniciante", "Intermediário", "Avançado"];

const LEVEL_COLOR: Record<EducationLevel, string> = {
  Iniciante: "#0ca30c",
  Intermediário: "#fab219",
  Avançado: "#d03b3b",
};

export default function FinancialEducation() {
  const [category, setCategory] = useState<string>("todas");
  const [level, setLevel] = useState<string>("todos");
  const [selectedTopic, setSelectedTopic] = useState<EducationTopic | null>(null);

  const filtered = useMemo(
    () =>
      educationTopics.filter(
        (t) => (category === "todas" || t.category === category) && (level === "todos" || t.level === level)
      ),
    [category, level]
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Educação Financeira</h1>

      <div className="flex flex-wrap gap-3">
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-56">
          <option value="todas">Todas as categorias</option>
          {educationCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select value={level} onChange={(e) => setLevel(e.target.value)} className="w-48">
          <option value="todos">Todos os níveis</option>
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon="book" message="Nenhum conteúdo encontrado para esse filtro." />
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((topic) => (
            <button key={topic.id} onClick={() => setSelectedTopic(topic)} className="text-left">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="font-semibold text-gray-900 dark:text-white">{topic.title}</h2>
                  <Icon name="book" size={18} className="text-gray-400 shrink-0" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{topic.summary}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {topic.category}
                  </span>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: `${LEVEL_COLOR[topic.level]}1a`,
                      color: LEVEL_COLOR[topic.level],
                    }}
                  >
                    {topic.level}
                  </span>
                </div>
              </Card>
            </button>
          ))}
        </div>
      )}

      {selectedTopic && (
        <Modal title={selectedTopic.title} onClose={() => setSelectedTopic(null)} size="lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {selectedTopic.category}
            </span>
            <span
              className="text-xs px-2 py-1 rounded-full font-medium"
              style={{
                backgroundColor: `${LEVEL_COLOR[selectedTopic.level]}1a`,
                color: LEVEL_COLOR[selectedTopic.level],
              }}
            >
              {selectedTopic.level}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {selectedTopic.content.map((paragraph, index) => (
              <p key={index} className="text-gray-700 dark:text-gray-200 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
