export interface Creator {
  name: string;
  role: string;
  bio: string;
}

export const CREATORS: Creator[] = [
  {
    name: "Gabriel Jacomini",
    role: "Desenvolvedor Sênior",
    bio: "Responsável por todo o projeto -- da arquitetura do frontend e do backend ao banco de dados e ao design.",
  },
  {
    name: "Enzo Calipo Ricci",
    role: "Desenvolvedor Pleno",
    bio: "Responsável pelo banco de dados: desenho do schema, migrations e integridade dos dados.",
  },
  {
    name: "Arthur Jacomini",
    role: "Desenvolvedor Pleno",
    bio: "Responsável pelo banco de dados e pela documentação técnica do projeto.",
  },
  {
    name: "Felipe Morales",
    role: "Desenvolvedor Júnior",
    bio: "Responsável pela documentação técnica que guia o projeto.",
  },
];
