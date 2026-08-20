// src/data/skillsData.js

import html from "../assets/cards/html.svg";
import css from "../assets/cards/css.svg";
import js from "../assets/cards/js.svg";
import flutter from '../assets/cards/flutter.svg'
import git from "../assets/cards/git.svg";
import github from "../assets/cards/github.webp";
import nestjs from '../assets/cards/nestjs.svg'
import mysql from "../assets/cards/mysql.svg";
import nodejs from "../assets/cards/nodejs.svg";
import typescript from '../assets/cards/typescript.svg'
import react from "../assets/cards/react.svg";
import postgresql from '../assets/cards/postgresql.svg'
import tailwindcss from "../assets/cards/tailwindcss.svg";
import vite from "../assets/cards/vite.svg";
import firebase from "../assets/cards/firebase.svg";
import laravel from "../assets/cards/laravel.svg";
import php from "../assets/cards/php.svg";
import composer from "../assets/cards/composer.png";

const skillsData = [
  { title: "Laravel", description: "PHP Framework", icon: laravel },
  { title: "PHP", description: "Backend Language", icon: php, iconClassName: "w-10 h-10" },
  { title: "Composer", description: "Dependency Manager", icon: composer, iconClassName: "w-11 h-11" },
  { title: "HTML", description: "Markup Language", icon: html },
  { title: "CSS", description: "Styling Language", icon: css },
  { title: "JavaScript", description: "Core Language", icon: js },
  { title: "TypeScript", description: "Typed JavaScript", icon: typescript },
  { title: "React", description: "Frontend Library", icon: react },
  { title: "Tailwind CSS", description: "Utility Styling", icon: tailwindcss },
  { title: "Flutter", description: "Application Framework", icon: flutter },
  { title: "NestJS", description: "Backend Framework", icon: nestjs },
  { title: "Node.js", description: "Runtime Environment", icon: nodejs },
  { title: "Vite", description: "Build Tool", icon: vite },
  { title: "MySQL", description: "Relational Database", icon: mysql },
  { title: "PostgreSQL", description: "Relational Database", icon: postgresql },
  { title: "Firebase", description: "Cloud Database", icon: firebase },
  { title: "Git", description: "Version Control", icon: git },
  { title: "GitHub", description: "Code Hosting", icon: github },
];

export default skillsData;
