/**
 * Simplified Content & Approval Workflow
 * Standardized across Pallabi Bidyaniketan School CMS
 * 
 * 4 Core Statuses:
 * 1. DRAFT - খসড়া (অসম্পূর্ণ বা ড্রাফট কনটেন্ট)
 * 2. PENDING_REVIEW - পর্যালোচনার অপেক্ষায় (যাচাইয়ের জন্য অপেক্ষমাণ)
 * 3. PUBLISHED - প্রকাশিত (অনুমোদিত এবং পাবলিক ওয়েবসাইটে প্রদর্শিত)
 * 4. ARCHIVED - সংরক্ষিত (আর্কাইভকৃত, পাবলিক ওয়েবসাইটে প্রদর্শিত হবে না)
 */

export type SimplifiedStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "ARCHIVED";

export interface StatusMeta {
  key: SimplifiedStatus;
  labelBn: string;
  labelEn: string;
  badgeClass: string;
  descriptionBn: string;
}

export const STATUS_MAP: Record<SimplifiedStatus, StatusMeta> = {
  DRAFT: {
    key: "DRAFT",
    labelBn: "খসড়া",
    labelEn: "Draft",
    badgeClass: "bg-gray-100 text-gray-700 border-gray-200",
    descriptionBn: "অসম্পূর্ণ বা প্রাথমিক খসড়া কনটেন্ট",
  },
  PENDING_REVIEW: {
    key: "PENDING_REVIEW",
    labelBn: "পর্যালোচনার অপেক্ষায়",
    labelEn: "Pending Review",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    descriptionBn: "প্রশাসনিক যাচাই ও অনুমোদনের জন্য অপেক্ষমাণ",
  },
  PUBLISHED: {
    key: "PUBLISHED",
    labelBn: "প্রকাশিত",
    labelEn: "Published",
    badgeClass: "bg-green-100 text-green-800 border-green-200",
    descriptionBn: "অনুমোদিত এবং সাধারণ ওয়েবসাইটে দৃশ্যমান",
  },
  ARCHIVED: {
    key: "ARCHIVED",
    labelBn: "সংরক্ষিত",
    labelEn: "Archived",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    descriptionBn: "বর্তমানে ওয়েবসাইটে প্রদর্শিত হচ্ছে না",
  },
};

/**
 * Maps any legacy DB enum value (like PENDING_VERIFICATION, PENDING_APPROVAL, NEEDS_REVIEW, APPROVED)
 * to one of the 4 simplified statuses.
 */
export function normalizeStatus(rawStatus?: string | null): SimplifiedStatus {
  if (!rawStatus) return "DRAFT";
  const s = rawStatus.toUpperCase();
  if (s === "PUBLISHED" || s === "APPROVED") return "PUBLISHED";
  if (s === "PENDING_REVIEW" || s === "PENDING_VERIFICATION" || s === "PENDING_APPROVAL" || s === "NEEDS_REVIEW") {
    return "PENDING_REVIEW";
  }
  if (s === "ARCHIVED" || s === "REJECTED") return "ARCHIVED";
  return "DRAFT";
}

/**
 * Returns Prisma-compatible status condition for public queries.
 * Only PUBLISHED (and legacy APPROVED) content may be served to the public.
 */
export function getPublicStatusFilter() {
  return {
    isPublished: true,
    status: {
      in: ["PUBLISHED", "APPROVED"],
    },
  };
}
