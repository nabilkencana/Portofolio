import { useState, useEffect, useRef } from "react";
import { logoutAdmin } from "../lib/adminAuth";
import {
  getAdminGallery, addAdminGalleryItem, deleteAdminGalleryItem, updateAdminGalleryItem,
  getAdminProjects, addAdminProjectItem, deleteAdminProjectItem, updateAdminProjectItem,
  getAdminAchievements, addAdminAchievementItem, deleteAdminAchievementItem, updateAdminAchievementItem,
} from "../lib/adminStore";
import { uploadImageToCloudinary } from "../lib/cloudinary";
import {
  Images, FolderKanban, LogOut, Plus, Trash2, Upload,
  X, Save, Eye, Palette, FileImage, CheckCircle2, Edit2, AlertCircle, Award, Loader2
} from "lucide-react";

// ─── Warna preset untuk project ───
const COLOR_PRESETS = [
  "#10b981", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ef4444",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#61DAFB",
];

// ─── Komponen card kecil untuk preview ───
const GalleryPreviewCard = ({ item, onEdit, onDelete }) => (
  <div style={{
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    overflow: "hidden",
    position: "relative",
  }}>
    <img src={item.image} alt={item.title} style={{ width: "100%", height: "100px", objectFit: "cover" }} />
    <div style={{ padding: "8px 10px" }}>
      <p style={{ color: "#fff", fontSize: "12px", fontWeight: "600", margin: 0 }}>{item.title}</p>
      <p style={{ color: "#71717a", fontSize: "11px", margin: "2px 0 0" }}>{item.description}</p>
    </div>
    
    <div style={{ position: "absolute", top: "6px", right: "6px", display: "flex", gap: "6px" }}>
      {onEdit && (
        <button onClick={onEdit} style={{
          background: "rgba(14,165,233,0.85)", border: "none", borderRadius: "6px",
          padding: "4px", cursor: "pointer", display: "flex", alignItems: "center",
        }}>
          <Edit2 size={12} color="#fff" />
        </button>
      )}
      {onDelete && (
        <button onClick={onDelete} style={{
          background: "rgba(239,68,68,0.85)", border: "none", borderRadius: "6px",
          padding: "4px", cursor: "pointer", display: "flex", alignItems: "center",
        }}>
          <Trash2 size={12} color="#fff" />
        </button>
      )}
    </div>

    {item.isAdmin && (
      <span style={{
        position: "absolute", top: "6px", left: "6px",
        background: "rgba(16,185,129,0.85)", borderRadius: "4px",
        padding: "2px 6px", fontSize: "9px", color: "#fff", fontWeight: "700",
      }}>ADMIN</span>
    )}
  </div>
);

const ProjectPreviewCard = ({ item, onEdit, onDelete }) => (
  <div style={{
    background: item.gradient || "rgba(255,255,255,0.03)",
    border: `1px solid ${item.borderColor || "rgba(255,255,255,0.08)"}`,
    borderRadius: "12px",
    padding: "12px",
    position: "relative",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  }}>
    {item.image && (
      <img src={item.image} alt={item.title} style={{ width: "48px", height: "36px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }} />
    )}
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ color: "#fff", fontSize: "12px", fontWeight: "600", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</p>
      <p style={{ color: "#a1a1aa", fontSize: "11px", margin: "2px 0 0" }}>{item.subtitle}</p>
    </div>
    
    <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
      {onEdit && (
        <button onClick={onEdit} style={{
          background: "rgba(14,165,233,0.85)", border: "none", borderRadius: "6px",
          padding: "4px", cursor: "pointer", display: "flex", alignItems: "center",
        }}>
          <Edit2 size={12} color="#fff" />
        </button>
      )}
      {onDelete && (
        <button onClick={onDelete} style={{
          background: "rgba(239,68,68,0.85)", border: "none", borderRadius: "6px",
          padding: "4px", cursor: "pointer", display: "flex", alignItems: "center",
        }}>
          <Trash2 size={12} color="#fff" />
        </button>
      )}
    </div>

    {item.isAdmin && (
      <span style={{
        position: "absolute", top: "4px", right: "70px",
        background: "rgba(16,185,129,0.85)", borderRadius: "4px",
        padding: "1px 5px", fontSize: "9px", color: "#fff", fontWeight: "700",
      }}>ADMIN</span>
    )}
  </div>
);

const AchievementPreviewCard = ({ item, onEdit, onDelete }) => (
  <div style={{
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    overflow: "hidden",
    position: "relative",
  }}>
    <img src={item.image} alt={item.title} style={{ width: "100%", height: "100px", objectFit: "cover" }} />
    <div style={{ padding: "8px 10px" }}>
      <p style={{ color: "#fff", fontSize: "12px", fontWeight: "600", margin: 0 }}>{item.title}</p>
      <p style={{ color: "#71717a", fontSize: "11px", margin: "2px 0 0" }}>{item.description}</p>
    </div>
    
    <div style={{ position: "absolute", top: "6px", right: "6px", display: "flex", gap: "6px" }}>
      {onEdit && (
        <button onClick={onEdit} style={{
          background: "rgba(14,165,233,0.85)", border: "none", borderRadius: "6px",
          padding: "4px", cursor: "pointer", display: "flex", alignItems: "center",
        }}>
          <Edit2 size={12} color="#fff" />
        </button>
      )}
      {onDelete && (
        <button onClick={onDelete} style={{
          background: "rgba(239,68,68,0.85)", border: "none", borderRadius: "6px",
          padding: "4px", cursor: "pointer", display: "flex", alignItems: "center",
        }}>
          <Trash2 size={12} color="#fff" />
        </button>
      )}
    </div>

    {item.isAdmin && (
      <span style={{
        position: "absolute", top: "6px", left: "6px",
        background: "rgba(16,185,129,0.85)", borderRadius: "4px",
        padding: "2px 6px", fontSize: "9px", color: "#fff", fontWeight: "700",
      }}>ADMIN</span>
    )}
  </div>
);

// ─── Toast Notifikasi ───
const Toast = ({ message, type, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div style={{
      position: "fixed", bottom: "24px", right: "24px", zIndex: 99999,
      background: type === "success" ? "rgba(16,185,129,0.95)" : "rgba(239,68,68,0.95)",
      color: "#fff", padding: "12px 20px", borderRadius: "12px",
      fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: "600",
      boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", gap: "8px",
      animation: "slideUp 0.3s ease",
    }}>
      <CheckCircle2 size={16} />
      {message}
    </div>
  );
};

// ─── Confirmation Modal ───
const ConfirmModal = ({ title, message, onConfirm, onCancel }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 100000,
    background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "16px"
  }}>
    <div style={{
      background: "linear-gradient(135deg, #18181b 0%, #09090b 100%)",
      border: "1px solid rgba(239,68,68,0.3)",
      borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "360px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <div style={{ background: "rgba(239,68,68,0.1)", padding: "8px", borderRadius: "50%" }}>
          <AlertCircle size={24} color="#ef4444" />
        </div>
        <h3 style={{ color: "#fff", margin: 0, fontSize: "16px" }}>{title}</h3>
      </div>
      <p style={{ color: "#a1a1aa", fontSize: "13px", marginBottom: "24px", lineHeight: "1.5" }}>{message}</p>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <button onClick={onCancel} style={{
          background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#fff",
          padding: "8px 16px", borderRadius: "8px", fontSize: "13px", cursor: "pointer"
        }}>Batal</button>
        <button onClick={onConfirm} style={{
          background: "#ef4444", border: "none", color: "#fff",
          padding: "8px 16px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: "600"
        }}>Hapus</button>
      </div>
    </div>
  </div>
);

// ─── MAIN ADMIN PANEL ───
const AdminPanel = ({ onClose }) => {
  const [tab, setTab] = useState("gallery");
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [confirmDelete, setConfirmDelete] = useState(null); // { type, id }

  // Gallery state
  const [adminGallery, setAdminGallery] = useState([]);
  const [galleryForm, setGalleryForm] = useState({ id: null, title: "", description: "", image: "" });
  const [galleryPreview, setGalleryPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Project state
  const [adminProjects, setAdminProjects] = useState([]);
  const [projectForm, setProjectForm] = useState({
    id: null, title: "", subtitle: "", image: "", url: "",
    borderColor: "#10b981", gradient: "",
  });
  const [projectPreview, setProjectPreview] = useState(null);
  const [isProjectDragging, setIsProjectDragging] = useState(false);
  const projectFileInputRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState("#10b981");

  // Achievement state
  const [adminAchievements, setAdminAchievements] = useState([]);
  const [achievementForm, setAchievementForm] = useState({ id: null, title: "", description: "", tech: "", image: "" });
  const [achievementPreview, setAchievementPreview] = useState(null);
  const [isAchievementDragging, setIsAchievementDragging] = useState(false);
  const achievementFileInputRef = useRef(null);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      const gallery = await getAdminGallery();
      setAdminGallery(gallery);
      const projects = await getAdminProjects();
      setAdminProjects(projects);
      const achievements = await getAdminAchievements();
      setAdminAchievements(achievements);
    };
    loadData();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // ── Helpers untuk upload image ──
  const processImageFile = (file, setForm, setPreview) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("Gambar terlalu besar (maks 5MB)", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setForm((p) => ({ ...p, image: base64, imageFile: file }));
      setPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e, setForm, setPreview, setDragging) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    processImageFile(file, setForm, setPreview);
  };

  // ── Gallery Actions ──
  const handleGalleryAddOrUpdate = async () => {
    if (!galleryForm.title || (!galleryForm.image && !galleryForm.imageFile)) {
      showToast("Judul dan gambar wajib diisi!", "error");
      return;
    }
    setUploading(true);
    let imageUrl = galleryForm.image;
    try {
      if (galleryForm.imageFile) {
        showToast("Mengunggah gambar...", "info");
        imageUrl = await uploadImageToCloudinary(galleryForm.imageFile);
      }
      const payload = { ...galleryForm, image: imageUrl };

      if (galleryForm.id) {
        const updated = await updateAdminGalleryItem(galleryForm.id, payload);
        setAdminGallery((p) => p.map(i => i.id === galleryForm.id ? updated : i));
        showToast("Foto berhasil diupdate!");
      } else {
        const newItem = await addAdminGalleryItem(payload);
        setAdminGallery((p) => [...p, newItem]);
        showToast("Foto berhasil ditambahkan!");
      }
      setGalleryForm({ id: null, title: "", description: "", image: "", imageFile: null });
      setGalleryPreview(null);
      window.dispatchEvent(new Event("adminDataUpdated"));
    } catch (e) {
      showToast("Gagal menyimpan data", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryEdit = (item) => {
    setGalleryForm({ id: item.id, title: item.title, description: item.description, image: item.image, imageFile: null });
    setGalleryPreview(item.image);
    setTab("gallery");
  };

  const executeGalleryDelete = async () => {
    await deleteAdminGalleryItem(confirmDelete.id);
    setAdminGallery((p) => p.filter((i) => i.id !== confirmDelete.id));
    setConfirmDelete(null);
    showToast("Foto dihapus");
    window.dispatchEvent(new Event("adminDataUpdated"));
  };

  // ── Project Actions ──
  const handleProjectAddOrUpdate = async () => {
    if (!projectForm.title || !projectForm.subtitle || (!projectForm.image && !projectForm.imageFile)) {
      showToast("Judul, subtitle, dan gambar wajib diisi!", "error");
      return;
    }
    setUploading(true);
    let imageUrl = projectForm.image;
    try {
      if (projectForm.imageFile) {
        showToast("Mengunggah gambar...", "info");
        imageUrl = await uploadImageToCloudinary(projectForm.imageFile);
      }
      const gradient = `linear-gradient(160deg,${selectedColor} 0%,#000 70%)`;
      const payload = { ...projectForm, borderColor: selectedColor, gradient, image: imageUrl };
      
      if (projectForm.id) {
        const updated = await updateAdminProjectItem(projectForm.id, payload);
        setAdminProjects((p) => p.map(i => i.id === projectForm.id ? updated : i));
        showToast("Project berhasil diupdate!");
      } else {
        const newItem = await addAdminProjectItem(payload);
        setAdminProjects((p) => [...p, newItem]);
        showToast("Project berhasil ditambahkan!");
      }
      
      setProjectForm({ id: null, title: "", subtitle: "", image: "", imageFile: null, url: "", borderColor: "#10b981", gradient: "" });
      setProjectPreview(null);
      setSelectedColor("#10b981");
      window.dispatchEvent(new Event("adminDataUpdated"));
    } catch (e) {
      showToast("Gagal menyimpan data", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleProjectEdit = (item) => {
    setProjectForm({ id: item.id, title: item.title, subtitle: item.subtitle, image: item.image, imageFile: null, url: item.url || "" });
    setSelectedColor(item.borderColor || "#10b981");
    setProjectPreview(item.image);
    setTab("project");
  };

  const executeProjectDelete = async () => {
    await deleteAdminProjectItem(confirmDelete.id);
    setAdminProjects((p) => p.filter((i) => i.id !== confirmDelete.id));
    setConfirmDelete(null);
    showToast("Project dihapus");
    window.dispatchEvent(new Event("adminDataUpdated"));
  };

  // ── Achievement Actions ──
  const handleAchievementAddOrUpdate = async () => {
    if (!achievementForm.title || (!achievementForm.image && !achievementForm.imageFile)) {
      showToast("Judul dan gambar wajib diisi!", "error");
      return;
    }
    setUploading(true);
    let imageUrl = achievementForm.image;
    try {
      if (achievementForm.imageFile) {
        showToast("Mengunggah gambar...", "info");
        imageUrl = await uploadImageToCloudinary(achievementForm.imageFile);
      }
      const techArray = typeof achievementForm.tech === "string" 
        ? achievementForm.tech.split(",").map(t => t.trim()).filter(Boolean)
        : achievementForm.tech;
        
      const payload = { ...achievementForm, tech: techArray, image: imageUrl };

      if (achievementForm.id) {
        const updated = await updateAdminAchievementItem(achievementForm.id, payload);
        setAdminAchievements((p) => p.map(i => i.id === achievementForm.id ? updated : i));
        showToast("Pencapaian berhasil diupdate!");
      } else {
        const newItem = await addAdminAchievementItem(payload);
        setAdminAchievements((p) => [...p, newItem]);
        showToast("Pencapaian berhasil ditambahkan!");
      }
      setAchievementForm({ id: null, title: "", description: "", tech: "", image: "", imageFile: null });
      setAchievementPreview(null);
      window.dispatchEvent(new Event("adminDataUpdated"));
    } catch (e) {
      showToast("Gagal menyimpan data", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleAchievementEdit = (item) => {
    setAchievementForm({ 
      id: item.id, 
      title: item.title, 
      description: item.description, 
      tech: Array.isArray(item.tech) ? item.tech.join(", ") : (item.tech || ""), 
      image: item.image,
      imageFile: null
    });
    setAchievementPreview(item.image);
    setTab("achievement");
  };

  const executeAchievementDelete = async () => {
    await deleteAdminAchievementItem(confirmDelete.id);
    setAdminAchievements((p) => p.filter((i) => i.id !== confirmDelete.id));
    setConfirmDelete(null);
    showToast("Pencapaian dihapus");
    window.dispatchEvent(new Event("adminDataUpdated"));
  };

  // ── Styling helpers ──
  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
    color: "#fff", padding: "10px 14px", fontSize: "13px",
    fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box",
  };
  const labelStyle = { color: "#a1a1aa", fontSize: "12px", fontWeight: "600", marginBottom: "6px", display: "block" };
  const btnPrimary = {
    background: "linear-gradient(135deg,#10b981 0%,#059669 100%)",
    border: "none", borderRadius: "10px", color: "#fff",
    padding: "10px 20px", fontSize: "13px", fontWeight: "600",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
    fontFamily: "Inter, sans-serif", boxShadow: "0 4px 15px rgba(16,185,129,0.3)",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9998,
      background: "rgba(0,0,0,0.92)", backdropFilter: "blur(16px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px",
      fontFamily: "Inter, sans-serif",
    }}>
      <div style={{
        width: "100%", maxWidth: "900px", maxHeight: "90vh",
        background: "linear-gradient(135deg,rgba(18,18,20,0.99) 0%,rgba(9,9,11,0.99) 100%)",
        border: "1px solid rgba(16,185,129,0.2)",
        borderRadius: "20px", overflow: "hidden",
        boxShadow: "0 0 80px rgba(16,185,129,0.08), 0 30px 60px rgba(0,0,0,0.9)",
        display: "flex", flexDirection: "column",
      }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(16,185,129,0.05)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "linear-gradient(135deg,rgba(16,185,129,0.3),rgba(16,185,129,0.1))",
              border: "1px solid rgba(16,185,129,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Eye size={18} color="#10b981" />
            </div>
            <div>
              <h2 style={{ color: "#fff", margin: 0, fontSize: "16px", fontWeight: "700", fontFamily: "Space Grotesk, sans-serif" }}>
                Admin Panel
              </h2>
              <p style={{ color: "#52525b", margin: 0, fontSize: "11px" }}>Nabil Kencana — Private Access</p>
            </div>
          </div>
          <button onClick={() => { logoutAdmin(); onClose(); }} style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "10px", color: "#ef4444", padding: "8px 14px",
            cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
            fontSize: "12px", fontWeight: "600", fontFamily: "Inter, sans-serif",
          }}>
            <LogOut size={14} />
            Keluar
          </button>
        </div>

        {/* ── Tab Bar ── */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px" }}>
          {[
            { id: "gallery", icon: <Images size={15} />, label: "Gallery" },
            { id: "project", icon: <FolderKanban size={15} />, label: "Projects" },
            { id: "achievement", icon: <Award size={15} />, label: "Achievements" },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "14px 18px", display: "flex", alignItems: "center", gap: "6px",
              fontSize: "13px", fontWeight: "600", fontFamily: "Inter, sans-serif",
              color: tab === t.id ? "#10b981" : "#52525b",
              borderBottom: tab === t.id ? "2px solid #10b981" : "2px solid transparent",
              transition: "all 0.2s",
              marginBottom: "-1px",
            }}>
              {t.icon}{t.label}
              <span style={{
                background: tab === t.id ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)",
                color: tab === t.id ? "#10b981" : "#52525b",
                borderRadius: "20px", padding: "1px 8px", fontSize: "10px",
              }}>
                {t.id === "gallery" ? adminGallery.length : t.id === "project" ? adminProjects.length : adminAchievements.length}
              </span>
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", gap: "24px", flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>

          {/* ─── GALLERY TAB ─── */}
          {tab === "gallery" && (
            <>
              {/* Form */}
              <div style={{ flex: "0 0 300px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ color: "#fff", margin: 0, fontSize: "14px", fontWeight: "700" }}>
                    {galleryForm.id ? "Edit Foto" : "Tambah Foto Baru"}
                  </h3>
                  {galleryForm.id && (
                    <button onClick={() => { setGalleryForm({ id: null, title: "", description: "", image: "" }); setGalleryPreview(null); }} style={{ background: "none", border: "none", color: "#a1a1aa", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <X size={12} style={{ marginRight: 4 }} /> Batal Edit
                    </button>
                  )}
                </div>

                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => handleDrop(e, setGalleryForm, setGalleryPreview, setIsDragging)}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${isDragging ? "#10b981" : "rgba(255,255,255,0.12)"}`,
                    borderRadius: "12px", padding: "20px",
                    cursor: "pointer", textAlign: "center",
                    background: isDragging ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
                    transition: "all 0.2s",
                    minHeight: "120px", display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: "8px",
                  }}
                >
                  {galleryPreview ? (
                    <img src={galleryPreview} alt="preview"
                      style={{ width: "100%", maxHeight: "120px", objectFit: "cover", borderRadius: "8px" }} />
                  ) : (
                    <>
                      <Upload size={24} color={isDragging ? "#10b981" : "#52525b"} />
                      <p style={{ color: "#71717a", fontSize: "12px", margin: 0 }}>
                        Drag & drop atau <span style={{ color: "#10b981" }}>klik upload</span>
                      </p>
                      <p style={{ color: "#3f3f46", fontSize: "11px", margin: 0 }}>PNG, JPG, WEBP · maks 5MB</p>
                    </>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" hidden
                    onChange={(e) => processImageFile(e.target.files[0], setGalleryForm, setGalleryPreview)} />
                </div>

                {galleryPreview && (
                  <button onClick={() => { setGalleryPreview(null); setGalleryForm((p) => ({ ...p, image: "" })); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <X size={12} /> Hapus gambar
                  </button>
                )}

                <div>
                  <label style={labelStyle}>Judul *</label>
                  <input style={inputStyle} placeholder="Contoh: Foto Wisuda"
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm((p) => ({ ...p, title: e.target.value }))} />
                </div>

                <div>
                  <label style={labelStyle}>Deskripsi</label>
                  <textarea style={{ ...inputStyle, resize: "vertical", minHeight: "70px" }}
                    placeholder="Deskripsi singkat..."
                    value={galleryForm.description}
                    onChange={(e) => setGalleryForm((p) => ({ ...p, description: e.target.value }))} />
                </div>

                <button onClick={handleGalleryAddOrUpdate} disabled={uploading} style={{ ...btnPrimary, opacity: uploading ? 0.7 : 1, cursor: uploading ? "not-allowed" : "pointer" }}>
                  {uploading ? <Loader2 size={15} className="spin" /> : (galleryForm.id ? <Save size={15} /> : <Plus size={15} />)} 
                  {uploading ? "Menyimpan..." : (galleryForm.id ? "Simpan Perubahan" : "Tambahkan ke Gallery")}
                </button>
              </div>

              {/* Grid preview */}
              <div style={{ flex: 1 }}>
                <h3 style={{ color: "#fff", margin: "0 0 16px", fontSize: "14px", fontWeight: "700" }}>
                  Foto Admin ({adminGallery.length})
                </h3>
                {adminGallery.length === 0 ? (
                  <div style={{
                    border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "12px",
                    padding: "40px", textAlign: "center",
                  }}>
                    <FileImage size={32} color="#3f3f46" style={{ margin: "0 auto 8px" }} />
                    <p style={{ color: "#52525b", fontSize: "13px", margin: 0 }}>Belum ada foto yang ditambahkan</p>
                  </div>
                ) : (
                  <div style={{
                    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px",
                    maxHeight: "480px", overflowY: "auto",
                  }}>
                    {adminGallery.map((item) => (
                      <GalleryPreviewCard key={item.id} item={item} 
                        onEdit={() => handleGalleryEdit(item)}
                        onDelete={() => setConfirmDelete({ type: 'gallery', id: item.id })} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ─── PROJECT TAB ─── */}
          {tab === "project" && (
            <>
              {/* Form */}
              <div style={{ flex: "0 0 300px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ color: "#fff", margin: 0, fontSize: "14px", fontWeight: "700" }}>
                    {projectForm.id ? "Edit Project" : "Tambah Project Baru"}
                  </h3>
                  {projectForm.id && (
                    <button onClick={() => { setProjectForm({ id: null, title: "", subtitle: "", image: "", url: "", borderColor: "#10b981", gradient: "" }); setProjectPreview(null); }} style={{ background: "none", border: "none", color: "#a1a1aa", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <X size={12} style={{ marginRight: 4 }} /> Batal Edit
                    </button>
                  )}
                </div>

                {/* Drop zone image untuk Project */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsProjectDragging(true); }}
                  onDragLeave={() => setIsProjectDragging(false)}
                  onDrop={(e) => handleDrop(e, setProjectForm, setProjectPreview, setIsProjectDragging)}
                  onClick={() => projectFileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${isProjectDragging ? "#10b981" : "rgba(255,255,255,0.12)"}`,
                    borderRadius: "12px", padding: "12px",
                    cursor: "pointer", textAlign: "center",
                    background: isProjectDragging ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
                    transition: "all 0.2s",
                    minHeight: "100px", display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: "8px",
                  }}
                >
                  {projectPreview ? (
                    <img src={projectPreview} alt="preview"
                      style={{ width: "100%", maxHeight: "100px", objectFit: "cover", borderRadius: "8px" }} />
                  ) : (
                    <>
                      <Upload size={20} color={isProjectDragging ? "#10b981" : "#52525b"} />
                      <p style={{ color: "#71717a", fontSize: "12px", margin: 0 }}>
                        <span style={{ color: "#10b981" }}>Upload</span> Thumbnail Project
                      </p>
                    </>
                  )}
                  <input ref={projectFileInputRef} type="file" accept="image/*" hidden
                    onChange={(e) => processImageFile(e.target.files[0], setProjectForm, setProjectPreview)} />
                </div>
                {projectPreview && (
                  <button onClick={() => { setProjectPreview(null); setProjectForm((p) => ({ ...p, image: "" })); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px", marginTop: "-8px" }}>
                    <X size={12} /> Hapus gambar
                  </button>
                )}

                <div>
                  <label style={labelStyle}>Judul Project *</label>
                  <input style={inputStyle} placeholder="Nama project..."
                    value={projectForm.title}
                    onChange={(e) => setProjectForm((p) => ({ ...p, title: e.target.value }))} />
                </div>

                <div>
                  <label style={labelStyle}>Subtitle / Stack *</label>
                  <input style={inputStyle} placeholder="ReactJS • TailwindCSS"
                    value={projectForm.subtitle}
                    onChange={(e) => setProjectForm((p) => ({ ...p, subtitle: e.target.value }))} />
                </div>

                <div>
                  <label style={labelStyle}>URL Project</label>
                  <input style={inputStyle} placeholder="https://..."
                    value={projectForm.url}
                    onChange={(e) => setProjectForm((p) => ({ ...p, url: e.target.value }))} />
                </div>

                <div>
                  <label style={labelStyle}><Palette size={11} style={{ display: "inline", marginRight: "4px" }} />Warna Aksen</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                    {COLOR_PRESETS.map((c) => (
                      <button key={c} onClick={() => setSelectedColor(c)} style={{
                        width: "28px", height: "28px", borderRadius: "8px",
                        background: c, border: selectedColor === c ? "3px solid #fff" : "2px solid transparent",
                        cursor: "pointer", transition: "all 0.15s",
                        boxShadow: selectedColor === c ? `0 0 10px ${c}` : "none",
                      }} />
                    ))}
                  </div>
                </div>

                {/* Preview card mini */}
                {projectForm.title && (
                  <div>
                    <label style={labelStyle}>Preview Project Card</label>
                    <ProjectPreviewCard item={{ ...projectForm, borderColor: selectedColor, gradient: `linear-gradient(160deg,${selectedColor} 0%,#000 70%)` }} />
                  </div>
                )}

                <button onClick={handleProjectAddOrUpdate} disabled={uploading} style={{ ...btnPrimary, opacity: uploading ? 0.7 : 1, cursor: uploading ? "not-allowed" : "pointer" }}>
                  {uploading ? <Loader2 size={15} className="spin" /> : (projectForm.id ? <Save size={15} /> : <Plus size={15} />)} 
                  {uploading ? "Menyimpan..." : (projectForm.id ? "Simpan Perubahan" : "Simpan Project")}
                </button>
              </div>

              {/* List project admin */}
              <div style={{ flex: 1 }}>
                <h3 style={{ color: "#fff", margin: "0 0 16px", fontSize: "14px", fontWeight: "700" }}>
                  Projects Admin ({adminProjects.length})
                </h3>
                {adminProjects.length === 0 ? (
                  <div style={{
                    border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "12px",
                    padding: "40px", textAlign: "center",
                  }}>
                    <FolderKanban size={32} color="#3f3f46" style={{ margin: "0 auto 8px" }} />
                    <p style={{ color: "#52525b", fontSize: "13px", margin: 0 }}>Belum ada project yang ditambahkan</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "480px", overflowY: "auto" }}>
                    {adminProjects.map((item) => (
                      <ProjectPreviewCard key={item.id} item={item} 
                        onEdit={() => handleProjectEdit(item)}
                        onDelete={() => setConfirmDelete({ type: 'project', id: item.id })} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ─── ACHIEVEMENT TAB ─── */}
          {tab === "achievement" && (
            <>
              {/* Form */}
              <div style={{ flex: "0 0 300px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ color: "#fff", margin: 0, fontSize: "14px", fontWeight: "700" }}>
                    {achievementForm.id ? "Edit Pencapaian" : "Tambah Pencapaian"}
                  </h3>
                  {achievementForm.id && (
                    <button onClick={() => { setAchievementForm({ id: null, title: "", description: "", tech: "", image: "" }); setAchievementPreview(null); }} style={{ background: "none", border: "none", color: "#a1a1aa", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <X size={12} style={{ marginRight: 4 }} /> Batal Edit
                    </button>
                  )}
                </div>

                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsAchievementDragging(true); }}
                  onDragLeave={() => setIsAchievementDragging(false)}
                  onDrop={(e) => handleDrop(e, setAchievementForm, setAchievementPreview, setIsAchievementDragging)}
                  onClick={() => achievementFileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${isAchievementDragging ? "#10b981" : "rgba(255,255,255,0.12)"}`,
                    borderRadius: "12px", padding: "20px",
                    cursor: "pointer", textAlign: "center",
                    background: isAchievementDragging ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
                    transition: "all 0.2s",
                    minHeight: "120px", display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: "8px",
                  }}
                >
                  {achievementPreview ? (
                    <img src={achievementPreview} alt="preview"
                      style={{ width: "100%", maxHeight: "120px", objectFit: "cover", borderRadius: "8px" }} />
                  ) : (
                    <>
                      <Upload size={24} color={isAchievementDragging ? "#10b981" : "#52525b"} />
                      <p style={{ color: "#71717a", fontSize: "12px", margin: 0 }}>
                        Drag & drop atau <span style={{ color: "#10b981" }}>klik upload</span>
                      </p>
                      <p style={{ color: "#3f3f46", fontSize: "11px", margin: 0 }}>PNG, JPG, WEBP · maks 5MB</p>
                    </>
                  )}
                  <input ref={achievementFileInputRef} type="file" accept="image/*" hidden
                    onChange={(e) => processImageFile(e.target.files[0], setAchievementForm, setAchievementPreview)} />
                </div>

                {achievementPreview && (
                  <button onClick={() => { setAchievementPreview(null); setAchievementForm((p) => ({ ...p, image: "" })); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <X size={12} /> Hapus gambar
                  </button>
                )}

                <div>
                  <label style={labelStyle}>Judul Pencapaian *</label>
                  <input style={inputStyle} placeholder="Contoh: Sertifikat React..."
                    value={achievementForm.title}
                    onChange={(e) => setAchievementForm((p) => ({ ...p, title: e.target.value }))} />
                </div>

                <div>
                  <label style={labelStyle}>Kategori / Tech (pisahkan koma)</label>
                  <input style={inputStyle} placeholder="Aplikasi, Ide Bisnis"
                    value={achievementForm.tech}
                    onChange={(e) => setAchievementForm((p) => ({ ...p, tech: e.target.value }))} />
                </div>

                <div>
                  <label style={labelStyle}>Deskripsi</label>
                  <textarea style={{ ...inputStyle, resize: "vertical", minHeight: "70px" }}
                    placeholder="Deskripsi singkat..."
                    value={achievementForm.description}
                    onChange={(e) => setAchievementForm((p) => ({ ...p, description: e.target.value }))} />
                </div>

                <button onClick={handleAchievementAddOrUpdate} disabled={uploading} style={{ ...btnPrimary, opacity: uploading ? 0.7 : 1, cursor: uploading ? "not-allowed" : "pointer" }}>
                  {uploading ? <Loader2 size={15} className="spin" /> : (achievementForm.id ? <Save size={15} /> : <Plus size={15} />)} 
                  {uploading ? "Menyimpan..." : (achievementForm.id ? "Simpan Perubahan" : "Tambahkan Pencapaian")}
                </button>
              </div>

              {/* Grid preview */}
              <div style={{ flex: 1 }}>
                <h3 style={{ color: "#fff", margin: "0 0 16px", fontSize: "14px", fontWeight: "700" }}>
                  Pencapaian Admin ({adminAchievements.length})
                </h3>
                {adminAchievements.length === 0 ? (
                  <div style={{
                    border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "12px",
                    padding: "40px", textAlign: "center",
                  }}>
                    <Award size={32} color="#3f3f46" style={{ margin: "0 auto 8px" }} />
                    <p style={{ color: "#52525b", fontSize: "13px", margin: 0 }}>Belum ada pencapaian yang ditambahkan</p>
                  </div>
                ) : (
                  <div style={{
                    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px",
                    maxHeight: "480px", overflowY: "auto",
                  }}>
                    {adminAchievements.map((item) => (
                      <AchievementPreviewCard key={item.id} item={item} 
                        onEdit={() => handleAchievementEdit(item)}
                        onDelete={() => setConfirmDelete({ type: 'achievement', id: item.id })} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
      
      {/* Modal Konfirmasi Hapus */}
      {confirmDelete && (
        <ConfirmModal 
          title="Konfirmasi Hapus"
          message={`Apakah Anda yakin ingin menghapus ${confirmDelete.type === 'gallery' ? 'foto' : confirmDelete.type === 'project' ? 'project' : 'pencapaian'} ini? Data yang dihapus tidak dapat dikembalikan.`}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={confirmDelete.type === 'gallery' ? executeGalleryDelete : confirmDelete.type === 'project' ? executeProjectDelete : executeAchievementDelete}
        />
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default AdminPanel;
