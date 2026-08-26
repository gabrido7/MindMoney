import gabrielPhoto from "./Gabriel Jacomini.png";
import enzoPhoto from "./Enzo Calipo Ricci.png";
import arthurPhoto from "./Arthur Jacomini.png";
import felipePhoto from "./Felipe Morales.png";

export interface Creator {
  name: string;
  role: string;
  bio: string;
  photo: string;
}

export const CREATORS: Creator[] = [
  {
    name: "Gabriel Jacomini",
    role: "Desenvolvedor Sênior",
    bio: "Responsável por todo o projeto -- da arquitetura do frontend e do backend ao banco de dados e ao design.",
    photo: gabrielPhoto,
  },
  {
    name: "Enzo Calipo Ricci",
    role: "Desenvolvedor Pleno",
    bio: "Responsável pelo banco de dados: desenho do schema, migrations e integridade dos dados.",
    photo: enzoPhoto,
  },
  {
    name: "Arthur Jacomini",
    role: "Desenvolvedor Pleno",
    bio: "Responsável pelo banco de dados e pela documentação técnica do projeto.",
    photo: arthurPhoto,
  },
  {
    name: "Felipe Morales",
    role: "Desenvolvedor Júnior",
    bio: "Responsável pela documentação técnica que guia o projeto.",
    photo: felipePhoto,
  },
];
