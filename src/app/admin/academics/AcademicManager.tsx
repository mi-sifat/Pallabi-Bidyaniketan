"use client";

import { useState, useCallback } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Upload,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Download,
  Loader2,
  X,
  Save,
  Layers,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  Copy,
  Eye,
  EyeOff,
  Coffee,
  Sun,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SubjectItem {
  id: string;
  nameEn: string;
  nameBn?: string | null;
  code?: string | null;
  classId?: string | null;
  subjectType?: string | null;
  fullMarks?: number | null;
  description?: string | null;
  sortOrder?: number;
  academicYear?: string | null;
  isActive: boolean;
}

export interface AcademicClassItem {
  id: string;
  nameEn: string;
  nameBn?: string | null;
  level: number | null;
  section?: string | null;
  shift?: string | null;
  academicYear?: string | null;
  descriptionBn?: string | null;
  descriptionEn?: string | null;
  isActive: boolean;
  sortOrder: number;
  subjects?: SubjectItem[];
  routines?: Array<{ id: string; titleBn?: string | null; fileUrl?: string | null; year?: string | null }>;
}

export interface RoutineItem {
  id: string;
  titleBn?: string | null;
  titleEn: string;
  routineType: "CLASS_ROUTINE" | "EXAM_ROUTINE" | "OTHER";
  classId?: string | null;
  section?: string | null;
  shift?: string | null;
  year?: string | null;
  contentBn?: string | null;
  contentEn?: string | null;
  fileUrl?: string | null;
  isPublished: boolean;
  class?: { nameBn?: string | null; nameEn: string; level: number | null } | null;
}

export interface SyllabusItem {
  id: string;
  titleBn?: string | null;
  titleEn: string;
  year?: string | null;
  classLevel?: string | null;
  subject?: string | null;
  fileUrl?: string | null;
  isPublished: boolean;
}

// ─── Weekly Routine Types ─────────────────────────────────────────────────────

interface WorkingDay {
  key: string;
  nameBn: string;
  nameEn: string;
  enabled: boolean;
}

interface PeriodSlot {
  id: string;
  period: string;
  time: string;
  subjectBn: string;
  isBreak?: boolean;
}

interface WeeklyEntry {
  dayKey: string;
  periodId: string;
  subjectBn: string;
  teacherName?: string;
  roomNo?: string;
  note?: string;
}

interface WeeklyRoutineData {
  workingDays: WorkingDay[];
  periods: PeriodSlot[];
  entries: WeeklyEntry[];
}

const DEFAULT_WORKING_DAYS: WorkingDay[] = [
  { key: "sat", nameBn: "শনিবার", nameEn: "Saturday", enabled: true },
  { key: "sun", nameBn: "রবিবার", nameEn: "Sunday", enabled: true },
  { key: "mon", nameBn: "সোমবার", nameEn: "Monday", enabled: true },
  { key: "tue", nameBn: "মঙ্গলবার", nameEn: "Tuesday", enabled: true },
  { key: "wed", nameBn: "বুধবার", nameEn: "Wednesday", enabled: true },
  { key: "thu", nameBn: "বৃহস্পতিবার", nameEn: "Thursday", enabled: true },
  { key: "fri", nameBn: "শুক্রবার", nameEn: "Friday", enabled: false },
];

const DEFAULT_PERIODS: PeriodSlot[] = [
  { id: "p1", period: "১ম পিরিয়ড", time: "০৮:০০ - ০৮:৪৫", subjectBn: "", isBreak: false },
  { id: "p2", period: "২য় পিরিয়ড", time: "০৮:৪৫ - ০৯:৩০", subjectBn: "", isBreak: false },
  { id: "p3", period: "৩য় পিরিয়ড", time: "০৯:৩০ - ১০:১৫", subjectBn: "", isBreak: false },
  { id: "break1", period: "টিফিন বিরতি", time: "১০:১৫ - ১০:৩৫", subjectBn: "টিফিন", isBreak: true },
  { id: "p4", period: "৪র্থ পিরিয়ড", time: "১০:৩৫ - ১১:২০", subjectBn: "", isBreak: false },
  { id: "p5", period: "৫ম পিরিয়ড", time: "১১:২০ - ১২:০০", subjectBn: "", isBreak: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseRoutineContent(contentBn: string | null | undefined): WeeklyRoutineData | null {
  if (!contentBn) return null;
  try {
    const parsed = JSON.parse(contentBn);
    if (parsed && parsed.workingDays && parsed.periods) {
      return parsed as WeeklyRoutineData;
    }
    // Legacy: array of simple period slots
    if (Array.isArray(parsed)) {
      return {
        workingDays: DEFAULT_WORKING_DAYS,
        periods: parsed.map((p: any, i: number) => ({
          id: `p${i + 1}`,
          period: p.period,
          time: p.time,
          subjectBn: p.subjectBn,
          isBreak: p.isBreak || false,
        })),
        entries: [],
      };
    }
    return null;
  } catch {
    return null;
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AcademicManager({
  initialClasses,
  initialRoutines,
  initialSyllabi,
}: {
  initialClasses: AcademicClassItem[];
  initialRoutines: RoutineItem[];
  initialSyllabi: SyllabusItem[];
}) {
  const [activeTab, setActiveTab] = useState<"classes" | "subjects" | "routines" | "syllabi">("classes");
  const [classes, setClasses] = useState<AcademicClassItem[]>(initialClasses);
  const [routines, setRoutines] = useState<RoutineItem[]>(initialRoutines);
  const [syllabi, setSyllabi] = useState<SyllabusItem[]>(initialSyllabi);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ── Class Modal ──
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<AcademicClassItem | null>(null);
  const [classForm, setClassForm] = useState({
    nameBn: "",
    nameEn: "",
    level: 0,
    shift: "প্রভাতি শাখা (সকাল ৮:০০ - ১২:০০)",
    academicYear: "2026",
    descriptionBn: "",
    sortOrder: 0,
    isActive: true,
  });

  // ── Subject State ──
  const [selectedClassIdForSubjects, setSelectedClassIdForSubjects] = useState<string>(classes[0]?.id || "");
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [subjectForm, setSubjectForm] = useState({
    nameBn: "",
    nameEn: "",
    code: "",
    classId: classes[0]?.id || "",
    subjectType: "COMPULSORY",
    fullMarks: 100,
    description: "",
    sortOrder: 0,
    academicYear: "2026",
    isActive: true,
  });
  const [seedingSubjects, setSeedingSubjects] = useState(false);

  // ── Routine State ──
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<RoutineItem | null>(null);
  const [routineForm, setRoutineForm] = useState({
    titleBn: "",
    titleEn: "",
    routineType: "CLASS_ROUTINE" as RoutineItem["routineType"],
    classId: classes[0]?.id || "",
    section: "",
    shift: "",
    year: "2026",
    fileUrl: "",
    isPublished: true,
  });

  // Weekly Routine Builder state
  const [weeklyData, setWeeklyData] = useState<WeeklyRoutineData>({
    workingDays: DEFAULT_WORKING_DAYS,
    periods: DEFAULT_PERIODS,
    entries: [],
  });
  const [editingCell, setEditingCell] = useState<{ dayKey: string; periodId: string } | null>(null);
  const [cellForm, setCellForm] = useState({ subjectBn: "", teacherName: "", roomNo: "", note: "" });

  // ── Syllabus Modal ──
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);
  const [editingSyllabus, setEditingSyllabus] = useState<SyllabusItem | null>(null);
  const [syllabusForm, setSyllabusForm] = useState({
    titleBn: "",
    titleEn: "",
    year: "2026",
    classLevel: classes[0]?.nameBn || "",
    subject: "সকল বিষয়",
    fileUrl: "",
    isPublished: true,
  });

  const [uploadingFile, setUploadingFile] = useState(false);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4500);
  };

  // ── File Upload ──
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "routine" | "syllabus") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast("error", "ফাইলের আকার ১০ মেগাবাইটের বেশি হতে পারবে না");
      return;
    }
    setUploadingFile(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", target === "routine" ? "routines" : "syllabi");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "আপলোড ব্যর্থ");
      if (target === "routine") setRoutineForm(prev => ({ ...prev, fileUrl: data.url }));
      else setSyllabusForm(prev => ({ ...prev, fileUrl: data.url }));
      showToast("success", "পিডিএফ ফাইল সফলভাবে আপলোড হয়েছে!");
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "আপলোড ব্যর্থ");
    } finally {
      setUploadingFile(false);
    }
  };

  // ═══ CLASS HANDLERS ═══════════════════════════════════════════════════════

  const handleToggleClass = async (cls: AcademicClassItem) => {
    try {
      const res = await fetch(`/api/admin/academics/classes/${cls.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !cls.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setClasses(prev => prev.map(c => c.id === cls.id ? { ...c, isActive: !c.isActive } : c));
      showToast("success", `${cls.nameBn || cls.nameEn} অবস্থা পরিবর্তন হয়েছে`);
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "ব্যর্থ");
    }
  };

  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKey("class");
    try {
      if (editingClass) {
        const res = await fetch(`/api/admin/academics/classes/${editingClass.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(classForm),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setClasses(prev => prev.map(c => c.id === editingClass.id ? { ...c, ...classForm } : c));
        showToast("success", "শ্রেণির তথ্য সফলভাবে আপডেট হয়েছে!");
      } else {
        const res = await fetch("/api/admin/academics/classes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(classForm),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setClasses(prev => [...prev, data.academicClass]);
        showToast("success", "নতুন শ্রেণি সফলভাবে যুক্ত হয়েছে!");
      }
      setIsClassModalOpen(false);
      setEditingClass(null);
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "সংরক্ষণ ব্যর্থ");
    } finally {
      setSavingKey(null);
    }
  };

  // ═══ SUBJECT HANDLERS ══════════════════════════════════════════════════════

  const handleSeedSubjects = async (classId: string) => {
    if (!confirm("NCTB প্রমিত বিষয়াবলী লোড করবেন? বিদ্যমান বিষয়গুলি রাখা হবে।")) return;
    setSeedingSubjects(true);
    try {
      const res = await fetch("/api/admin/academics/subjects/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setClasses(prev =>
        prev.map(c =>
          c.id === classId ? { ...c, subjects: data.subjects } : c
        )
      );
      showToast("success", data.message);
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "লোড ব্যর্থ");
    } finally {
      setSeedingSubjects(false);
    }
  };

  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKey("subject");
    try {
      if (editingSubject) {
        const res = await fetch(`/api/admin/academics/subjects/${editingSubject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subjectForm),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setClasses(prev =>
          prev.map(c => {
            if (c.id === subjectForm.classId) {
              return { ...c, subjects: (c.subjects || []).map(s => s.id === editingSubject.id ? data.subject : s) };
            }
            return c;
          })
        );
        showToast("success", "বিষয়টি সফলভাবে আপডেট হয়েছে!");
      } else {
        const res = await fetch("/api/admin/academics/subjects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subjectForm),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setClasses(prev =>
          prev.map(c => {
            if (c.id === subjectForm.classId) {
              return { ...c, subjects: [...(c.subjects || []), data.subject] };
            }
            return c;
          })
        );
        showToast("success", "নতুন বিষয় সফলভাবে যুক্ত হয়েছে!");
      }
      setIsSubjectModalOpen(false);
      setEditingSubject(null);
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "সংরক্ষণ ব্যর্থ");
    } finally {
      setSavingKey(null);
    }
  };

  const handleDeleteSubject = async (subjectId: string, classId: string) => {
    if (!confirm("এই বিষয়টি স্থায়ীভাবে মুছে ফেলবেন?")) return;
    try {
      const res = await fetch(`/api/admin/academics/subjects/${subjectId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("মোছা যায়নি");
      setClasses(prev =>
        prev.map(c => c.id === classId ? { ...c, subjects: (c.subjects || []).filter(s => s.id !== subjectId) } : c)
      );
      showToast("success", "বিষয়টি মুছে ফেলা হয়েছে");
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "ব্যর্থ");
    }
  };

  // ═══ ROUTINE HANDLERS ══════════════════════════════════════════════════════

  const openNewRoutineModal = () => {
    setEditingRoutine(null);
    const defaultClassId = classes[0]?.id || "";
    setRoutineForm({
      titleBn: "",
      titleEn: "",
      routineType: "CLASS_ROUTINE",
      classId: defaultClassId,
      section: "",
      shift: "",
      year: "2026",
      fileUrl: "",
      isPublished: true,
    });
    setWeeklyData({ workingDays: DEFAULT_WORKING_DAYS, periods: DEFAULT_PERIODS, entries: [] });
    setIsRoutineModalOpen(true);
  };

  const openEditRoutineModal = (r: RoutineItem) => {
    setEditingRoutine(r);
    setRoutineForm({
      titleBn: r.titleBn || "",
      titleEn: r.titleEn,
      routineType: r.routineType,
      classId: r.classId || classes[0]?.id || "",
      section: r.section || "",
      shift: r.shift || "",
      year: r.year || "2026",
      fileUrl: r.fileUrl || "",
      isPublished: r.isPublished,
    });
    const parsed = parseRoutineContent(r.contentBn);
    if (parsed) {
      setWeeklyData(parsed);
    } else {
      setWeeklyData({ workingDays: DEFAULT_WORKING_DAYS, periods: DEFAULT_PERIODS, entries: [] });
    }
    setIsRoutineModalOpen(true);
  };

  const handleSaveRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKey("routine");
    try {
      const payload = {
        ...routineForm,
        contentBn: routineForm.routineType === "CLASS_ROUTINE" ? JSON.stringify(weeklyData) : null,
      };

      if (editingRoutine) {
        const res = await fetch(`/api/admin/academics/routines/${editingRoutine.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setRoutines(prev => prev.map(r => r.id === editingRoutine.id ? data.routine : r));
        showToast("success", "রুটিন সফলভাবে আপডেট হয়েছে!");
      } else {
        const res = await fetch("/api/admin/academics/routines", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setRoutines(prev => [data.routine, ...prev]);
        showToast("success", "নতুন রুটিন সফলভাবে যুক্ত হয়েছে!");
      }
      setIsRoutineModalOpen(false);
      setEditingRoutine(null);
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "সংরক্ষণ ব্যর্থ");
    } finally {
      setSavingKey(null);
    }
  };

  const handleDeleteRoutine = async (id: string) => {
    if (!confirm("এই রুটিনটি স্থায়ীভাবে মুছে ফেলবেন?")) return;
    try {
      const res = await fetch(`/api/admin/academics/routines/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("মোছা যায়নি");
      setRoutines(prev => prev.filter(r => r.id !== id));
      showToast("success", "রুটিন মুছে ফেলা হয়েছে");
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "ব্যর্থ");
    }
  };

  const handleToggleRoutinePublish = async (r: RoutineItem) => {
    try {
      const res = await fetch(`/api/admin/academics/routines/${r.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !r.isPublished }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRoutines(prev => prev.map(x => x.id === r.id ? { ...x, isPublished: !x.isPublished } : x));
      showToast("success", !r.isPublished ? "রুটিন প্রকাশিত হয়েছে" : "রুটিন খসড়ায় সরানো হয়েছে");
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "ব্যর্থ");
    }
  };

  // ── Weekly Routine Builder Helpers ──

  const getEntry = (dayKey: string, periodId: string): WeeklyEntry | undefined =>
    weeklyData.entries.find(e => e.dayKey === dayKey && e.periodId === periodId);

  const handleCellClick = (dayKey: string, periodId: string) => {
    const existing = getEntry(dayKey, periodId);
    setEditingCell({ dayKey, periodId });
    setCellForm({
      subjectBn: existing?.subjectBn || "",
      teacherName: existing?.teacherName || "",
      roomNo: existing?.roomNo || "",
      note: existing?.note || "",
    });
  };

  const handleSaveCell = () => {
    if (!editingCell) return;
    setWeeklyData(prev => {
      const filtered = prev.entries.filter(
        e => !(e.dayKey === editingCell.dayKey && e.periodId === editingCell.periodId)
      );
      if (cellForm.subjectBn.trim()) {
        return { ...prev, entries: [...filtered, { ...editingCell, ...cellForm }] };
      }
      return { ...prev, entries: filtered };
    });
    setEditingCell(null);
  };

  const handleClearCell = (dayKey: string, periodId: string) => {
    setWeeklyData(prev => ({
      ...prev,
      entries: prev.entries.filter(e => !(e.dayKey === dayKey && e.periodId === periodId)),
    }));
  };

  const handleCopyDay = (fromDayKey: string, toDayKey: string) => {
    setWeeklyData(prev => {
      const fromEntries = prev.entries.filter(e => e.dayKey === fromDayKey);
      const withoutTo = prev.entries.filter(e => e.dayKey !== toDayKey);
      const copied = fromEntries.map(e => ({ ...e, dayKey: toDayKey }));
      return { ...prev, entries: [...withoutTo, ...copied] };
    });
    showToast("success", "রুটিন কপি করা হয়েছে");
  };

  const handleAddPeriod = () => {
    const idx = weeklyData.periods.length + 1;
    const newPeriod: PeriodSlot = {
      id: `custom_${Date.now()}`,
      period: `${idx}ম পিরিয়ড`,
      time: "",
      subjectBn: "",
      isBreak: false,
    };
    setWeeklyData(prev => ({ ...prev, periods: [...prev.periods, newPeriod] }));
  };

  const handleUpdatePeriod = (id: string, field: keyof PeriodSlot, value: string | boolean) => {
    setWeeklyData(prev => ({
      ...prev,
      periods: prev.periods.map(p => p.id === id ? { ...p, [field]: value } : p),
    }));
  };

  const handleDeletePeriod = (id: string) => {
    setWeeklyData(prev => ({
      ...prev,
      periods: prev.periods.filter(p => p.id !== id),
      entries: prev.entries.filter(e => e.periodId !== id),
    }));
  };

  const handleToggleWorkingDay = (key: string) => {
    setWeeklyData(prev => ({
      ...prev,
      workingDays: prev.workingDays.map(d => d.key === key ? { ...d, enabled: !d.enabled } : d),
    }));
  };

  // ═══ SYLLABUS HANDLERS ═════════════════════════════════════════════════════

  const handleSaveSyllabus = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKey("syllabus");
    try {
      if (editingSyllabus) {
        const res = await fetch(`/api/admin/academics/syllabi/${editingSyllabus.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(syllabusForm),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setSyllabi(prev => prev.map(s => s.id === editingSyllabus.id ? data.syllabus : s));
        showToast("success", "সিলেবাস আপডেট হয়েছে!");
      } else {
        const res = await fetch("/api/admin/academics/syllabi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(syllabusForm),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setSyllabi(prev => [data.syllabus, ...prev]);
        showToast("success", "নতুন সিলেবাস যুক্ত হয়েছে!");
      }
      setIsSyllabusModalOpen(false);
      setEditingSyllabus(null);
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "সংরক্ষণ ব্যর্থ");
    } finally {
      setSavingKey(null);
    }
  };

  const handleDeleteSyllabus = async (id: string) => {
    if (!confirm("এই সিলেবাসটি মুছে ফেলবেন?")) return;
    try {
      const res = await fetch(`/api/admin/academics/syllabi/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("মোছা যায়নি");
      setSyllabi(prev => prev.filter(s => s.id !== id));
      showToast("success", "সিলেবাস মুছে ফেলা হয়েছে");
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "ব্যর্থ");
    }
  };

  // ═══ Computed Values ════════════════════════════════════════════════════════

  const activeClassForSubjects = classes.find(c => c.id === selectedClassIdForSubjects) || classes[0];
  const currentClassSubjects = activeClassForSubjects?.subjects || [];
  const filteredSubjects = subjectSearch
    ? currentClassSubjects.filter(s =>
        (s.nameBn || "").includes(subjectSearch) ||
        (s.nameEn || "").toLowerCase().includes(subjectSearch.toLowerCase()) ||
        (s.code || "").includes(subjectSearch)
      )
    : currentClassSubjects;
  const totalSubjectsCount = classes.reduce((sum, c) => sum + (c.subjects?.length || 0), 0);
  const activeDays = weeklyData.workingDays.filter(d => d.enabled);
  const regularPeriods = weeklyData.periods.filter(p => !p.isBreak);

  // ═══ RENDER ══════════════════════════════════════════════════════════════════

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium flex items-center gap-2 border transition-all animate-in slide-in-from-bottom-4 ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header & Tabs */}
      <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f]">
            একাডেমিক তথ্য ও শ্রেণি ব্যবস্থাপনা
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            শ্রেণি, পাঠ্য বিষয়, সাপ্তাহিক রুটিন (Visual Builder) ও সিলেবাস পরিচালনা
          </p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-2xl flex-wrap gap-0.5">
          {(["classes", "subjects", "routines", "syllabi"] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab ? "bg-[#1e3a5f] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "classes" && `শ্রেণি (${classes.length})`}
              {tab === "subjects" && `বিষয়াবলী (${totalSubjectsCount})`}
              {tab === "routines" && `রুটিন (${routines.length})`}
              {tab === "syllabi" && `সিলেবাস (${syllabi.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          TAB 1: CLASSES
      ══════════════════════════════════════════ */}
      {activeTab === "classes" && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#1e3a5f]">স্কুল শ্রেণি ও শাখা তালিকা</h2>
              <p className="text-xs text-gray-500">শিশু শ্রেণি থেকে ১০ম শ্রেণি পর্যন্ত সকল শ্রেণির পরিচালনা</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingClass(null);
                setClassForm({ nameBn: "", nameEn: "", level: 0, shift: "প্রভাতি শাখা (সকাল ৮:০০ - ১২:০০)", academicYear: "2026", descriptionBn: "", sortOrder: classes.length, isActive: true });
                setIsClassModalOpen(true);
              }}
              className="btn-primary !text-xs !py-2 cursor-pointer"
            >
              <Plus size={16} /> নতুন শ্রেণি যুক্ত করুন
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classes.map(cls => (
              <div key={cls.id} className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60 hover:bg-white hover:border-[#1e3a5f]/40 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#1e3a5f] text-[#c9a84c] flex items-center justify-center font-black text-sm shadow-xs">
                      {cls.level === 0 ? "শি" : cls.level}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{cls.nameBn || cls.nameEn}</h3>
                      <p className="text-xs text-gray-500">{cls.nameEn} • {cls.shift || "প্রভাতি"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleClass(cls)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                        cls.isActive ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      }`}
                    >
                      {cls.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingClass(cls);
                        setClassForm({
                          nameBn: cls.nameBn || "",
                          nameEn: cls.nameEn,
                          level: cls.level ?? 0,
                          shift: cls.shift || "প্রভাতি শাখা (সকাল ৮:০০ - ১২:০০)",
                          academicYear: cls.academicYear || "2026",
                          descriptionBn: cls.descriptionBn || "",
                          sortOrder: cls.sortOrder,
                          isActive: cls.isActive,
                        });
                        setIsClassModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-[#1e3a5f] hover:bg-white border border-transparent hover:border-gray-200 cursor-pointer"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-gray-500">
                  <span>বিষয়: {cls.subjects?.length || 0}টি</span>
                  <span>•</span>
                  <span>রুটিন: {cls.routines?.length || 0}টি</span>
                  <span>•</span>
                  <span>বর্ষ: {cls.academicYear || "2026"}</span>
                </div>
                {cls.descriptionBn && (
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{cls.descriptionBn}</p>
                )}
                {/* Direct quick action buttons to manage subjects & routine for this class */}
                <div className="pt-2 border-t border-gray-200/80 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedClassIdForSubjects(cls.id);
                      setActiveTab("subjects");
                    }}
                    className="flex-1 py-1.5 px-2 bg-white border border-blue-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl text-[11px] font-bold text-[#1e3a5f] flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  >
                    <BookOpen size={13} className="text-[#c9a84c]" />
                    <span>বিষয়সমূহ ({cls.subjects?.length || 0}টি)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("routines");
                    }}
                    className="flex-1 py-1.5 px-2 bg-white border border-blue-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl text-[11px] font-bold text-[#1e3a5f] flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  >
                    <Clock size={13} className="text-[#c9a84c]" />
                    <span>ক্লাস রুটিন ({cls.routines?.length || 0}টি)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          TAB 2: SUBJECTS
      ══════════════════════════════════════════ */}
      {activeTab === "subjects" && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#1e3a5f]">পাঠ্য বিষয়াবলী ব্যবস্থাপনা</h2>
              <p className="text-xs text-gray-500">শ্রেণিভিত্তিক বিষয়, কোড, পূর্ণমান ও ধরন পরিচালনা করুন</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  if (activeClassForSubjects) handleSeedSubjects(activeClassForSubjects.id);
                }}
                disabled={seedingSubjects}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold cursor-pointer hover:bg-amber-100 disabled:opacity-50"
              >
                {seedingSubjects ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                NCTB লোড করুন
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingSubject(null);
                  setSubjectForm({
                    nameBn: "",
                    nameEn: "",
                    code: "",
                    classId: activeClassForSubjects?.id || classes[0]?.id || "",
                    subjectType: "COMPULSORY",
                    fullMarks: 100,
                    description: "",
                    sortOrder: currentClassSubjects.length,
                    academicYear: "2026",
                    isActive: true,
                  });
                  setIsSubjectModalOpen(true);
                }}
                className="btn-primary !text-xs !py-2 cursor-pointer"
              >
                <Plus size={16} /> নতুন বিষয় যুক্ত
              </button>
            </div>
          </div>

          {/* Class Selector */}
          <div className="flex flex-wrap gap-2">
            {classes.map(cls => (
              <button
                key={cls.id}
                type="button"
                onClick={() => setSelectedClassIdForSubjects(cls.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  selectedClassIdForSubjects === cls.id
                    ? "bg-[#1e3a5f] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cls.nameBn || cls.nameEn}
                <span className="ml-1 opacity-70">({cls.subjects?.length || 0})</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="বিষয় খুঁজুন (নাম, কোড)..."
              value={subjectSearch}
              onChange={e => setSubjectSearch(e.target.value)}
              className="form-input pl-8 !text-xs"
            />
          </div>

          {/* Subject Table */}
          {filteredSubjects.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-bold text-gray-600">বিষয় কোড</th>
                    <th className="text-left px-4 py-3 font-bold text-gray-600">বিষয়ের নাম (বাংলা)</th>
                    <th className="text-left px-4 py-3 font-bold text-gray-600">Subject Name (English)</th>
                    <th className="text-left px-4 py-3 font-bold text-gray-600">ধরন</th>
                    <th className="text-center px-4 py-3 font-bold text-gray-600">পূর্ণমান</th>
                    <th className="text-center px-4 py-3 font-bold text-gray-600">অবস্থা</th>
                    <th className="text-center px-4 py-3 font-bold text-gray-600">কার্যক্রম</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSubjects.map(sub => (
                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-[#1e3a5f]">{sub.code || "—"}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{sub.nameBn || "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{sub.nameEn}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sub.subjectType === "OPTIONAL"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}>
                          {sub.subjectType === "OPTIONAL" ? "ঐচ্ছিক" : "আবশ্যিক"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-gray-900">{sub.fullMarks || 100}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sub.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                        }`}>
                          {sub.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSubject(sub);
                              setSubjectForm({
                                nameBn: sub.nameBn || "",
                                nameEn: sub.nameEn,
                                code: sub.code || "",
                                classId: sub.classId || activeClassForSubjects?.id || "",
                                subjectType: sub.subjectType || "COMPULSORY",
                                fullMarks: sub.fullMarks || 100,
                                description: sub.description || "",
                                sortOrder: sub.sortOrder || 0,
                                academicYear: sub.academicYear || "2026",
                                isActive: sub.isActive,
                              });
                              setIsSubjectModalOpen(true);
                            }}
                            className="p-1.5 text-gray-500 hover:text-[#1e3a5f] hover:bg-blue-50 rounded-lg cursor-pointer"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubject(sub.id, sub.classId || "")}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-sm text-gray-400 space-y-2">
              <BookOpen size={32} className="mx-auto opacity-30" />
              <p>{subjectSearch ? "কোনো বিষয় পাওয়া যায়নি" : "এই শ্রেণিতে এখনো কোনো বিষয় যুক্ত হয়নি"}</p>
              {!subjectSearch && (
                <p className="text-xs text-gray-400">
                  উপরের &quot;NCTB লোড করুন&quot; বাটনে ক্লিক করে NCTB প্রমিত বিষয়াবলী লোড করুন
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════
          TAB 3: ROUTINES (Visual Weekly Builder)
      ══════════════════════════════════════════ */}
      {activeTab === "routines" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-3 mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#1e3a5f]">শ্রেণিভিত্তিক রুটিন ব্যবস্থাপনা</h2>
                <p className="text-xs text-gray-500">Visual Weekly Routine Builder — সাপ্তাহিক পিরিয়ড ও বিষয় কনফিগার করুন</p>
              </div>
              <button
                type="button"
                onClick={openNewRoutineModal}
                className="btn-primary !text-xs !py-2 cursor-pointer"
              >
                <Grid3X3 size={16} /> নতুন রুটিন তৈরি করুন
              </button>
            </div>

            {routines.length > 0 ? (
              <div className="space-y-3">
                {routines.map(r => {
                  const parsed = parseRoutineContent(r.contentBn);
                  const cls = classes.find(c => c.id === r.classId);
                  const activeDaysCount = parsed ? parsed.workingDays.filter(d => d.enabled).length : 0;
                  const periodsCount = parsed ? parsed.periods.length : 0;
                  return (
                    <div key={r.id} className="p-4 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-white transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center shrink-0">
                            <Grid3X3 size={18} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-gray-900 text-sm truncate">{r.titleBn || r.titleEn}</h3>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                r.isPublished
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-gray-100 text-gray-500 border-gray-200"
                              }`}>
                                {r.isPublished ? "প্রকাশিত" : "খসড়া"}
                              </span>
                              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                                {r.year || "2026"}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {cls?.nameBn || cls?.nameEn || "—"}
                              {r.shift ? ` • ${r.shift}` : ""}
                              {r.section ? ` • শাখা: ${r.section}` : ""}
                              {parsed ? ` • ${activeDaysCount} কর্মদিবস • ${periodsCount} পিরিয়ড` : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleRoutinePublish(r)}
                            className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                              r.isPublished
                                ? "text-emerald-600 hover:bg-emerald-50"
                                : "text-gray-400 hover:bg-gray-100"
                            }`}
                            title={r.isPublished ? "খসড়ায় নিন" : "প্রকাশ করুন"}
                          >
                            {r.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          {r.fileUrl && (
                            <a
                              href={r.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 cursor-pointer"
                              title="PDF দেখুন"
                            >
                              <Download size={14} />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => openEditRoutineModal(r)}
                            className="p-1.5 text-gray-500 hover:text-[#1e3a5f] hover:bg-white rounded-lg cursor-pointer"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRoutine(r.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-10 text-center text-sm text-gray-400 space-y-2">
                <Grid3X3 size={32} className="mx-auto opacity-30" />
                <p>এখনো কোনো রুটিন তৈরি করা হয়নি</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          TAB 4: SYLLABI
      ══════════════════════════════════════════ */}
      {activeTab === "syllabi" && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#1e3a5f]">সিলেবাস প্রকাশনা</h2>
              <p className="text-xs text-gray-500">শ্রেণিভিত্তিক পাঠ্যসূচি ও সিলেবাস পিডিএফ আপলোড ও পরিচালনা</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingSyllabus(null);
                setSyllabusForm({ titleBn: "", titleEn: "", year: "2026", classLevel: classes[0]?.nameBn || "", subject: "সকল বিষয়", fileUrl: "", isPublished: true });
                setIsSyllabusModalOpen(true);
              }}
              className="btn-primary !text-xs !py-2 cursor-pointer"
            >
              <Upload size={16} /> নতুন সিলেবাস আপলোড
            </button>
          </div>
          {syllabi.length > 0 ? (
            <div className="space-y-3">
              {syllabi.map(s => (
                <div key={s.id} className="p-4 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm truncate">{s.titleBn || s.titleEn}</h3>
                      <p className="text-gray-500 truncate">{s.classLevel} • {s.subject || "সকল বিষয়"} • {s.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {s.isPublished ? "প্রকাশিত" : "খসড়া"}
                    </span>
                    {s.fileUrl && (
                      <a href={s.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer">
                        <Download size={14} />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSyllabus(s);
                        setSyllabusForm({ titleBn: s.titleBn || "", titleEn: s.titleEn, year: s.year || "2026", classLevel: s.classLevel || "", subject: s.subject || "", fileUrl: s.fileUrl || "", isPublished: s.isPublished });
                        setIsSyllabusModalOpen(true);
                      }}
                      className="p-1.5 text-gray-500 hover:text-[#1e3a5f] hover:bg-white rounded-lg cursor-pointer"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSyllabus(s.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-sm text-gray-400"><FileText size={32} className="mx-auto opacity-30 mb-2" /><p>কোনো সিলেবাস নেই</p></div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════
          ROUTINE MODAL — Visual Weekly Builder
      ══════════════════════════════════════════ */}
      {isRoutineModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-5xl my-4 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-extrabold text-gray-900 text-xl">
                  {editingRoutine ? "রুটিন সম্পাদনা" : "নতুন সাপ্তাহিক রুটিন তৈরি"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Visual Weekly Routine Builder</p>
              </div>
              <button type="button" onClick={() => setIsRoutineModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-xl cursor-pointer hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveRoutine} className="space-y-6">
              {/* ── Step 1: Basic Info ── */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-4">
                <h4 className="font-bold text-sm text-[#1e3a5f]">① রুটিনের মূল তথ্য</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">রুটিনের শিরোনাম *</label>
                    <input type="text" required placeholder="যেমন: ৬ষ্ঠ শ্রেণি সাপ্তাহিক রুটিন ২০২৬" value={routineForm.titleBn} onChange={e => setRoutineForm(p => ({ ...p, titleBn: e.target.value }))} className="form-input !text-sm" />
                  </div>
                  <div>
                    <label className="form-label">শ্রেণি *</label>
                    <select value={routineForm.classId} onChange={e => setRoutineForm(p => ({ ...p, classId: e.target.value }))} className="form-input" required>
                      {classes.map(c => <option key={c.id} value={c.id}>{c.nameBn || c.nameEn}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">শাখা / শিফট</label>
                    <select value={routineForm.shift} onChange={e => setRoutineForm(p => ({ ...p, shift: e.target.value }))} className="form-input">
                      <option value="">নির্বাচন করুন</option>
                      <option value="প্রভাতি শাখা">প্রভাতি শাখা</option>
                      <option value="দিবা শাখা">দিবা শাখা</option>
                      <option value="উভয় শাখা">উভয় শাখা</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">শিক্ষাবর্ষ</label>
                    <input type="text" value={routineForm.year} onChange={e => setRoutineForm(p => ({ ...p, year: e.target.value }))} className="form-input" placeholder="2026" />
                  </div>
                  <div>
                    <label className="form-label">রুটিনের ধরন</label>
                    <select value={routineForm.routineType} onChange={e => setRoutineForm(p => ({ ...p, routineType: e.target.value as RoutineItem["routineType"] }))} className="form-input">
                      <option value="CLASS_ROUTINE">দৈনিক ক্লাস রুটিন</option>
                      <option value="EXAM_ROUTINE">পরীক্ষা রুটিন</option>
                      <option value="OTHER">অন্যান্য</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">প্রকাশ অবস্থা</label>
                    <select value={String(routineForm.isPublished)} onChange={e => setRoutineForm(p => ({ ...p, isPublished: e.target.value === "true" }))} className="form-input">
                      <option value="true">প্রকাশিত (ওয়েবসাইটে দেখা যাবে)</option>
                      <option value="false">খসড়া (Draft)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ── Step 2: Working Days (only for CLASS_ROUTINE) ── */}
              {routineForm.routineType === "CLASS_ROUTINE" && (
                <>
                  <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/40 space-y-4">
                    <h4 className="font-bold text-sm text-[#1e3a5f]">② কর্মদিবস নির্ধারণ</h4>
                    <div className="flex flex-wrap gap-2">
                      {weeklyData.workingDays.map(day => (
                        <button
                          key={day.key}
                          type="button"
                          onClick={() => handleToggleWorkingDay(day.key)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors border ${
                            day.enabled
                              ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                              : "bg-white text-gray-500 border-gray-300 line-through"
                          }`}
                        >
                          {day.nameBn}
                          {!day.enabled && " (ছুটি)"}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">সক্রিয়: {activeDays.map(d => d.nameBn).join(", ")} ({activeDays.length} দিন)</p>
                  </div>

                  {/* ── Step 3: Period Configuration ── */}
                  <div className="p-4 rounded-2xl border border-purple-100 bg-purple-50/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-[#1e3a5f]">③ পিরিয়ড কনফিগারেশন</h4>
                      <button
                        type="button"
                        onClick={handleAddPeriod}
                        className="px-3 py-1 bg-[#1e3a5f] text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        <Plus size={12} className="inline" /> পিরিয়ড যোগ
                      </button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {weeklyData.periods.map((slot, idx) => (
                        <div key={slot.id} className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs ${slot.isBreak ? "bg-amber-50 border-amber-200" : "bg-white border-gray-200"}`}>
                          {slot.isBreak && <Coffee size={12} className="text-amber-600 shrink-0" />}
                          {!slot.isBreak && <span className="text-gray-400 font-mono w-5 shrink-0">{idx + 1}</span>}
                          <input type="text" placeholder="পিরিয়ড নাম" value={slot.period} onChange={e => handleUpdatePeriod(slot.id, "period", e.target.value)} className="w-1/3 form-input !py-1 !text-xs font-bold" />
                          <input type="text" placeholder="সময় (০৮:০০ - ০৮:৪৫)" value={slot.time} onChange={e => handleUpdatePeriod(slot.id, "time", e.target.value)} className="w-1/3 form-input !py-1 !text-xs" />
                          <label className="flex items-center gap-1 cursor-pointer shrink-0">
                            <input type="checkbox" checked={slot.isBreak} onChange={e => handleUpdatePeriod(slot.id, "isBreak", e.target.checked)} className="cursor-pointer" />
                            <span className="text-[10px] text-gray-500">বিরতি</span>
                          </label>
                          <button type="button" onClick={() => handleDeletePeriod(slot.id)} className="text-red-400 hover:text-red-600 p-0.5 cursor-pointer shrink-0">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Step 4: Weekly Timetable Grid ── */}
                  <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-[#1e3a5f]">④ সাপ্তাহিক তালিকা (ক্লিক করে বিষয় যোগ করুন)</h4>
                      <div className="flex gap-2 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#1e3a5f] inline-block"></span> বিষয় আছে</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-200 inline-block"></span> খালি</span>
                      </div>
                    </div>

                    {activeDays.length > 0 && weeklyData.periods.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse min-w-[600px]">
                          <thead>
                            <tr>
                              <th className="p-2 bg-gray-100 border border-gray-200 text-left font-bold text-gray-600 w-32">পিরিয়ড</th>
                              {activeDays.map(day => (
                                <th key={day.key} className="p-2 bg-gray-100 border border-gray-200 text-center font-bold text-gray-700">
                                  <div>{day.nameBn}</div>
                                  {activeDays.indexOf(day) < activeDays.length - 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const nextDay = activeDays[activeDays.indexOf(day) + 1];
                                        if (nextDay) handleCopyDay(day.key, nextDay.key);
                                      }}
                                      className="text-[9px] text-blue-500 hover:underline cursor-pointer"
                                      title="পরের দিনে কপি করুন"
                                    >
                                      <Copy size={9} className="inline" /> কপি→
                                    </button>
                                  )}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {weeklyData.periods.map(period => (
                              <tr key={period.id} className={period.isBreak ? "bg-amber-50/50" : ""}>
                                <td className="p-2 border border-gray-200 font-semibold text-gray-700 bg-gray-50">
                                  <div className="font-bold">{period.period}</div>
                                  {period.time && <div className="text-[9px] text-gray-500 font-normal">{period.time}</div>}
                                  {period.isBreak && <div className="text-[9px] text-amber-600 font-bold">⏸ বিরতি</div>}
                                </td>
                                {activeDays.map(day => {
                                  const entry = getEntry(day.key, period.id);
                                  if (period.isBreak) {
                                    return (
                                      <td key={day.key} className="p-2 border border-gray-200 text-center bg-amber-50/50">
                                        <span className="text-[10px] text-amber-600">☕ বিরতি</span>
                                      </td>
                                    );
                                  }
                                  return (
                                    <td
                                      key={day.key}
                                      className="p-1.5 border border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors"
                                      onClick={() => handleCellClick(day.key, period.id)}
                                    >
                                      {entry?.subjectBn ? (
                                        <div className="bg-[#1e3a5f] text-white rounded-lg p-1.5 text-center space-y-0.5">
                                          <div className="font-bold text-[11px] leading-tight">{entry.subjectBn}</div>
                                          {entry.teacherName && <div className="text-[9px] opacity-80">{entry.teacherName}</div>}
                                          {entry.roomNo && <div className="text-[9px] opacity-70">কক্ষ: {entry.roomNo}</div>}
                                        </div>
                                      ) : (
                                        <div className="text-center text-gray-300 py-1">
                                          <Plus size={12} className="mx-auto" />
                                        </div>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-xs text-gray-400">
                        কর্মদিবস ও পিরিয়ড কনফিগার করুন তারপর তালিকায় বিষয় যোগ করতে পারবেন
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* PDF Upload */}
              <div className="p-4 rounded-2xl border border-gray-200 space-y-3">
                <h4 className="font-bold text-sm text-[#1e3a5f]">⑤ রুটিন পিডিএফ আপলোড (ঐচ্ছিক)</h4>
                <div className="flex items-center gap-3">
                  <input type="file" accept=".pdf,application/pdf" onChange={e => handlePdfUpload(e, "routine")} className="form-input !py-1 text-xs" disabled={uploadingFile} />
                  {uploadingFile && <Loader2 size={16} className="animate-spin text-[#1e3a5f]" />}
                </div>
                {routineForm.fileUrl && (
                  <p className="text-xs text-emerald-700 flex items-center gap-1 font-semibold">
                    <CheckCircle size={12} /> পিডিএফ সংযুক্ত আছে
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t">
                <button type="button" onClick={() => setIsRoutineModalOpen(false)} className="btn-secondary !text-sm cursor-pointer">বাতিল</button>
                <button type="submit" disabled={savingKey === "routine"} className="btn-primary !text-sm cursor-pointer">
                  {savingKey === "routine" ? <><Loader2 size={16} className="animate-spin" /> সংরক্ষণ হচ্ছে...</> : <><Save size={16} /> রুটিন সংরক্ষণ করুন</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cell Edit Modal */}
      {editingCell && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900">পিরিয়ড বিষয় সেট করুন</h4>
              <button type="button" onClick={() => setEditingCell(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={18} /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <label className="form-label">বিষয়ের নাম (বাংলা) *</label>
                <input
                  type="text"
                  autoFocus
                  placeholder="যেমন: বাংলা, গণিত, ইংরেজি"
                  value={cellForm.subjectBn}
                  onChange={e => setCellForm(p => ({ ...p, subjectBn: e.target.value }))}
                  className="form-input"
                />
                {/* Quick subject suggestions */}
                {routineForm.classId && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(classes.find(c => c.id === routineForm.classId)?.subjects || []).slice(0, 6).map(sub => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setCellForm(p => ({ ...p, subjectBn: sub.nameBn || sub.nameEn }))}
                        className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-blue-100"
                      >
                        {sub.nameBn || sub.nameEn}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="form-label">শিক্ষকের নাম (ঐচ্ছিক)</label>
                <input type="text" placeholder="শিক্ষকের নাম" value={cellForm.teacherName} onChange={e => setCellForm(p => ({ ...p, teacherName: e.target.value }))} className="form-input" />
              </div>
              <div>
                <label className="form-label">কক্ষ নম্বর (ঐচ্ছিক)</label>
                <input type="text" placeholder="কক্ষ নম্বর" value={cellForm.roomNo} onChange={e => setCellForm(p => ({ ...p, roomNo: e.target.value }))} className="form-input" />
              </div>
            </div>
            <div className="flex justify-between gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => { handleClearCell(editingCell.dayKey, editingCell.periodId); setEditingCell(null); }}
                className="px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl cursor-pointer font-medium"
              >
                <Trash2 size={13} className="inline mr-1" />সাফ করুন
              </button>
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditingCell(null)} className="btn-secondary !text-xs cursor-pointer">বাতিল</button>
                <button type="button" onClick={handleSaveCell} className="btn-primary !text-xs cursor-pointer">
                  <Save size={13} className="inline mr-1" />সংরক্ষণ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subject Modal */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-base">
                {editingSubject ? "বিষয় সম্পাদনা" : "নতুন বিষয় যুক্ত করুন"}
              </h3>
              <button type="button" onClick={() => setIsSubjectModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveSubject} className="space-y-4 text-sm">
              <div>
                <label className="form-label">শ্রেণি *</label>
                <select value={subjectForm.classId} onChange={e => setSubjectForm(p => ({ ...p, classId: e.target.value }))} className="form-input font-bold" required>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.nameBn || c.nameEn}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">বিষয়ের নাম (বাংলা) *</label>
                  <input type="text" required placeholder="যেমন: বাংলা, গণিত" value={subjectForm.nameBn} onChange={e => setSubjectForm(p => ({ ...p, nameBn: e.target.value }))} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Subject Name (English)</label>
                  <input type="text" placeholder="e.g. Bangla, Mathematics" value={subjectForm.nameEn} onChange={e => setSubjectForm(p => ({ ...p, nameEn: e.target.value }))} className="form-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">বিষয় কোড</label>
                  <input type="text" placeholder="যেমন: 101, PP-101" value={subjectForm.code} onChange={e => setSubjectForm(p => ({ ...p, code: e.target.value }))} className="form-input font-mono" />
                </div>
                <div>
                  <label className="form-label">পূর্ণমান</label>
                  <input type="number" min="0" max="300" value={subjectForm.fullMarks} onChange={e => setSubjectForm(p => ({ ...p, fullMarks: parseInt(e.target.value) || 100 }))} className="form-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">বিষয়ের ধরন</label>
                  <select value={subjectForm.subjectType} onChange={e => setSubjectForm(p => ({ ...p, subjectType: e.target.value }))} className="form-input">
                    <option value="COMPULSORY">আবশ্যিক</option>
                    <option value="OPTIONAL">ঐচ্ছিক</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">অবস্থা</label>
                  <select value={String(subjectForm.isActive)} onChange={e => setSubjectForm(p => ({ ...p, isActive: e.target.value === "true" }))} className="form-input">
                    <option value="true">সক্রিয়</option>
                    <option value="false">নিষ্ক্রিয়</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">বিষয়ের বিবরণ (ঐচ্ছিক)</label>
                <textarea rows={2} value={subjectForm.description} onChange={e => setSubjectForm(p => ({ ...p, description: e.target.value }))} placeholder="সংক্ষিপ্ত বিবরণ..." className="form-input leading-relaxed" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">প্রদর্শন ক্রম</label>
                  <input type="number" min="0" value={subjectForm.sortOrder} onChange={e => setSubjectForm(p => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))} className="form-input" />
                </div>
                <div>
                  <label className="form-label">শিক্ষাবর্ষ</label>
                  <input type="text" value={subjectForm.academicYear} onChange={e => setSubjectForm(p => ({ ...p, academicYear: e.target.value }))} className="form-input" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setIsSubjectModalOpen(false)} className="btn-secondary !text-xs cursor-pointer">বাতিল</button>
                <button type="submit" disabled={savingKey === "subject"} className="btn-primary !text-xs cursor-pointer">
                  {savingKey === "subject" ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Class Modal */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-base">
                {editingClass ? "শ্রেণির বিবরণ সম্পাদনা" : "নতুন শ্রেণি যুক্ত করুন"}
              </h3>
              <button type="button" onClick={() => setIsClassModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveClass} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">শ্রেণির নাম (বাংলা) *</label>
                  <input type="text" required value={classForm.nameBn} onChange={e => setClassForm(p => ({ ...p, nameBn: e.target.value }))} placeholder="যেমন: ষষ্ঠ শ্রেণি" className="form-input" />
                </div>
                <div>
                  <label className="form-label">শ্রেণির নাম (ইংরেজি) *</label>
                  <input type="text" required value={classForm.nameEn} onChange={e => setClassForm(p => ({ ...p, nameEn: e.target.value }))} placeholder="e.g. Class 6" className="form-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">শাখা / শিফট</label>
                  <select value={classForm.shift} onChange={e => setClassForm(p => ({ ...p, shift: e.target.value }))} className="form-input">
                    <option value="প্রভাতি শাখা (সকাল ৮:০০ - ১২:০০)">প্রভাতি শাখা (সকাল ৮:০০ - ১২:০০)</option>
                    <option value="দিবা শাখা (সকাল ১১:৩০ - ০৪:০০)">দিবা শাখা (সকাল ১১:৩০ - ০৪:০০)</option>
                    <option value="উভয় শাখা">উভয় শাখা</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">লেভেল নম্বর (০-১০)</label>
                  <input type="number" min="0" max="10" value={classForm.level} onChange={e => setClassForm(p => ({ ...p, level: parseInt(e.target.value) || 0 }))} className="form-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">শিক্ষাবর্ষ</label>
                  <input type="text" value={classForm.academicYear} onChange={e => setClassForm(p => ({ ...p, academicYear: e.target.value }))} placeholder="2026" className="form-input" />
                </div>
                <div>
                  <label className="form-label">প্রদর্শন ক্রম</label>
                  <input type="number" min="0" value={classForm.sortOrder} onChange={e => setClassForm(p => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))} className="form-input" />
                </div>
              </div>
              <div>
                <label className="form-label">সক্রিয় অবস্থা</label>
                <select value={String(classForm.isActive)} onChange={e => setClassForm(p => ({ ...p, isActive: e.target.value === "true" }))} className="form-input">
                  <option value="true">সক্রিয় (ওয়েবসাইটে দেখা যাবে)</option>
                  <option value="false">নিষ্ক্রিয় (লুকানো)</option>
                </select>
              </div>
              <div>
                <label className="form-label">শ্রেণির পরিচিতি ও বিবরণ</label>
                <textarea rows={3} value={classForm.descriptionBn} onChange={e => setClassForm(p => ({ ...p, descriptionBn: e.target.value }))} placeholder="জাতীয় শিক্ষাক্রমের আলোকে পাঠদানের সংক্ষিপ্ত রূপরেখা..." className="form-input leading-relaxed" />
              </div>

              {/* Direct shortcuts inside edit modal for subjects and routine */}
              {editingClass && (
                <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1e3a5f]">
                    <span>পাঠ্য বিষয় ও শ্রেণি রুটিন পরিচালনা:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedClassIdForSubjects(editingClass.id);
                        setActiveTab("subjects");
                        setIsClassModalOpen(false);
                      }}
                      className="flex-1 py-2 px-3 bg-white border border-blue-300 rounded-xl text-xs font-bold text-[#1e3a5f] hover:bg-blue-100/70 flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      <BookOpen size={14} className="text-[#c9a84c]" />
                      <span>বিষয়সমূহ ({editingClass.subjects?.length || 0}টি) এডিট করুন</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("routines");
                        setIsClassModalOpen(false);
                      }}
                      className="flex-1 py-2 px-3 bg-white border border-blue-300 rounded-xl text-xs font-bold text-[#1e3a5f] hover:bg-blue-100/70 flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Clock size={14} className="text-[#c9a84c]" />
                      <span>রুটিন ({editingClass.routines?.length || 0}টি) এডিট করুন</span>
                    </button>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setIsClassModalOpen(false)} className="btn-secondary !text-xs cursor-pointer">বাতিল</button>
                <button type="submit" disabled={savingKey === "class"} className="btn-primary !text-xs cursor-pointer">
                  {savingKey === "class" ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Syllabus Modal */}
      {isSyllabusModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-base">
                {editingSyllabus ? "সিলেবাস সম্পাদনা" : "নতুন সিলেবাস আপলোড"}
              </h3>
              <button type="button" onClick={() => setIsSyllabusModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveSyllabus} className="space-y-4 text-sm">
              <div>
                <label className="form-label">সিলেবাসের শিরোনাম *</label>
                <input type="text" required placeholder="যেমন: বার্ষিক পরীক্ষার সিলেবাস ২০২৬" value={syllabusForm.titleBn} onChange={e => setSyllabusForm(p => ({ ...p, titleBn: e.target.value }))} className="form-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">শ্রেণি</label>
                  <select value={syllabusForm.classLevel} onChange={e => setSyllabusForm(p => ({ ...p, classLevel: e.target.value }))} className="form-input">
                    {classes.map(c => <option key={c.id} value={c.nameBn || c.nameEn}>{c.nameBn || c.nameEn}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">বিষয়</label>
                  <input type="text" value={syllabusForm.subject} onChange={e => setSyllabusForm(p => ({ ...p, subject: e.target.value }))} placeholder="যেমন: বাংলা / সকল বিষয়" className="form-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">শিক্ষাবর্ষ</label>
                  <input type="text" value={syllabusForm.year} onChange={e => setSyllabusForm(p => ({ ...p, year: e.target.value }))} className="form-input" />
                </div>
                <div>
                  <label className="form-label">প্রকাশ অবস্থা</label>
                  <select value={String(syllabusForm.isPublished)} onChange={e => setSyllabusForm(p => ({ ...p, isPublished: e.target.value === "true" }))} className="form-input">
                    <option value="true">প্রকাশিত</option>
                    <option value="false">খসড়া</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">সিলেবাস পিডিএফ আপলোড</label>
                <div className="flex items-center gap-3">
                  <input type="file" accept=".pdf,application/pdf" onChange={e => handlePdfUpload(e, "syllabus")} className="form-input !py-1 text-xs" disabled={uploadingFile} />
                  {uploadingFile && <Loader2 size={16} className="animate-spin text-[#1e3a5f]" />}
                </div>
                {syllabusForm.fileUrl && (
                  <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1 font-semibold"><CheckCircle size={12} /> পিডিএফ সংযুক্ত আছে</p>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setIsSyllabusModalOpen(false)} className="btn-secondary !text-xs cursor-pointer">বাতিল</button>
                <button type="submit" disabled={savingKey === "syllabus"} className="btn-primary !text-xs cursor-pointer">
                  {savingKey === "syllabus" ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
