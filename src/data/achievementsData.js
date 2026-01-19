import golden_ticket from '../assets/certificate/golden_ticket.jpeg'
import juara2_inotek from '../assets/certificate/juara2_inotek.png'
import juara3_webdev from '../assets/certificate/juara3_webdev.jpeg'
import sertif_amd from '../assets/certificate/sertif_amd.jpeg'
import sertif_cyber from '../assets/certificate/sertif_cyber.jpeg'


const achievementsData = [
  {
    title: "Golden Ticket",
    description: "Sertifikat Dari Kejuraan Lomba INOTEK UNISKA.",
    tech: ["Aplikasi", "Ide Bisnis"],
    image: golden_ticket,
  },
  {
    title: "Juara 2 INOTEK",
    description: "Juara 2 INOTEK Tingkat Nasional yang diselanggarakan UNISKA.",
    tech: ["INOTEK" , "Figma"],
    image: juara2_inotek,
  },
  {
    title: "Juara 3 Web Development",
    description: "Juara 3 Web Development Tingkan Nasional yang disenggelarakan oleh IITC Purwokerto.",
    tech: ["Programing", "Web Delopment"],
    image: juara3_webdev,
  },
  {
    title: "Sertifikasi AMD",
    description: "Sertifkat sebagai peserta Talkshow.",
    tech: ["Classroom"],
    image: sertif_amd,
  },
  {
    title: "Sertifikasi Cyber",
    description: "Sertifikasi pelatihan Cyber Security Awarness.",
    tech: ["Cyber Security Fundamental"],
    image: sertif_cyber,
  },
];

export { achievementsData };
