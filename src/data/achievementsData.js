import golden_ticket from '../assets/certificate/golden_ticket.webp'
import juara2_inotek from '../assets/certificate/juara2_inotek.webp'
import juara3_webdev from '../assets/certificate/juara3_webdev.webp'
import sertif_amd from '../assets/certificate/sertif_amd.webp'
import sertif_cyber from '../assets/certificate/sertif_cyber.webp'
import sertif_uuk_fullstack from '../assets/certificate/sertif_uuk_fullstack.webp'


const achievementsData = [
  {
    id: "ach_1",
    title: "Golden Ticket",
    description: "Sertifikat Dari Kejuaraan Lomba INOTEK UNISKA.",
    tech: ["Aplikasi", "Ide Bisnis"],
    image: golden_ticket,
  },
  {
    id: "ach_2",
    title: "Juara 2 INOTEK",
    description: "Juara 2 INOTEK Tingkat Nasional yang diselenggarakan UNISKA.",
    tech: ["INOTEK", "Figma"],
    image: juara2_inotek,
  },
  {
    id: "ach_3",
    title: "Juara 3 Web Development",
    description: "Juara 3 Web Development Tingkat Nasional yang diselenggarakan oleh IITC Purwokerto.",
    tech: ["Programming", "Web Development"],
    image: juara3_webdev,
  },
  {
    id: "ach_6",
    title: "Sertifikat Kompetensi Full Stack",
    description: "Sertifikat Uji Unit Kompetensi (UUK) Rekayasa Perangkat Lunak proyek Aplikasi Web Next.js & NestJS dengan predikat Sangat Kompeten.",
    tech: ["Next.js", "NestJS", "Full Stack"],
    image: sertif_uuk_fullstack,
  },
  {
    id: "ach_4",
    title: "Sertifikasi AMD",
    description: "Sertifikat sebagai peserta Talkshow AMD.",
    tech: ["Classroom"],
    image: sertif_amd,
  },
  {
    id: "ach_5",
    title: "Sertifikasi Cyber",
    description: "Sertifikasi pelatihan Cyber Security Awareness.",
    tech: ["Cyber Security Fundamental"],
    image: sertif_cyber,
  },
];

export { achievementsData };
