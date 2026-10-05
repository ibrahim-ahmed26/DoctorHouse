export type Locale = "en" | "ar";

export type LocalizedText = { en: string; ar: string };

export interface Doctor {
  id: string;
  name: LocalizedText;
  specialty: LocalizedText;
  experience: LocalizedText;
  highlights: { en: [string, string]; ar: [string, string] };
  order: number;
  imageUrl?: string;
}

export interface LeadInput {
  name: string;
  phone: string;
  need: string;
  locale: Locale;
}

export type LeadStatus = "new" | "contacted" | "done";

export interface Lead extends LeadInput {
  id: string;
  status: LeadStatus;
  createdAt: string; // ISO string once serialized for the client
}
export interface PdfDoc {
  id: string;
  title: { en: string; ar: string };
  publicId: string;
  order: number;
}
