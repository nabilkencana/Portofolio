import golden_ticket from '../assets/certificate/golden_ticket.webp'
import juara2_inotek from '../assets/certificate/juara2_inotek.webp'
import juara3_webdev from '../assets/certificate/juara3_webdev.webp'
import sertif_amd from '../assets/certificate/sertif_amd.webp'
import sertif_cyber from '../assets/certificate/sertif_cyber.webp'


const achievementsData = [
  {
    id: "ach_1",
    title: "Golden Ticket",
    description: "Sertifikat Dari Kejuraan Lomba INOTEK UNISKA.",
    tech: ["Aplikasi", "Ide Bisnis"],
    image: golden_ticket,
  },
  {
    id: "ach_2",
    title: "Juara 2 INOTEK",
    description: "Juara 2 INOTEK Tingkat Nasional yang diselanggarakan UNISKA.",
    tech: ["INOTEK" , "Figma"],
    image: juara2_inotek,
  },
  {
    id: "ach_3",
    title: "Juara 3 Web Development",
    description: "Juara 3 Web Development Tingkan Nasional yang disenggelarakan oleh IITC Purwokerto.",
    tech: ["Programing", "Web Delopment"],
    image: juara3_webdev,
  },
  {
    id: "ach_4",
    title: "Sertifikasi AMD",
    description: "Sertifkat sebagai peserta Talkshow.",
    tech: ["Classroom"],
    image: sertif_amd,
  },
  {
    id: "ach_5",
    title: "Sertifikasi Cyber",
    description: "Sertifikasi pelatihan Cyber Security Awarness.",
    tech: ["Cyber Security Fundamental"],
    image: sertif_cyber,
  },
];

export { achievementsData };
