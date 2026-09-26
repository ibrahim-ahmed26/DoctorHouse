"use client";
import { useState } from "react";
import type { Doctor } from "@/lib/types";

type DraftDoctor = Omit<Doctor, "id"> & {
  imageUrl: string;
};

const empty: DraftDoctor = {
  order: 1,
  name: { en: "", ar: "" },
  specialty: { en: "", ar: "" },
  experience: { en: "", ar: "" },
  highlights: { en: ["", ""], ar: ["", ""] },
  imageUrl: "",
};

export default function DoctorForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Doctor;
  onSave: (doc: DraftDoctor) => Promise<void>;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<DraftDoctor>(
    initial ? { ...initial, imageUrl: initial.imageUrl ?? "" } : empty,
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function field(path: string, value: string | number) {
    setDraft((d) => {
      const copy: any = structuredClone(d);
      const keys = path.split(".");
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  }

  async function onImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setUploadError("Image must be under 8MB.");
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !preset) {
      setUploadError("Cloudinary isn't configured yet (missing env vars).");
      return;
    }

    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", preset);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? "Upload failed");

      field("imageUrl", data.secure_url as string);
    } catch (err: any) {
      setUploadError(err.message ?? "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(draft);
    setSaving(false);
  }

  return (
    <form onSubmit={submit} className="admin-form">
      <h2>{initial ? "Edit doctor" : "Add doctor"}</h2>

      <div className="admin-field">
        <label>Photo</label>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {draft.imageUrl ? (
            <img
              src={draft.imageUrl}
              alt=""
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                objectFit: "cover",
                border: "1px solid var(--line)",
              }}
            />
          ) : (
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "var(--sage)",
                display: "grid",
                placeItems: "center",
                color: "var(--mute)",
                fontSize: 12,
              }}
            >
              No photo
            </div>
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={onImagePick}
              disabled={uploading}
            />
            {uploading && (
              <p style={{ fontSize: 13, color: "var(--mute)" }}>Uploading...</p>
            )}
            {uploadError && (
              <p style={{ fontSize: 13, color: "#d33" }}>{uploadError}</p>
            )}
          </div>
        </div>
      </div>

      <div className="admin-field">
        <label>Order</label>
        <input
          type="number"
          value={draft.order}
          onChange={(e) => field("order", Number(e.target.value))}
        />
      </div>

      <div className="admin-field-row">
        <div className="admin-field">
          <label>Name (EN)</label>
          <input
            value={draft.name.en}
            onChange={(e) => field("name.en", e.target.value)}
            required
          />
        </div>
        <div className="admin-field">
          <label>Name (AR)</label>
          <input
            value={draft.name.ar}
            onChange={(e) => field("name.ar", e.target.value)}
            dir="rtl"
            required
          />
        </div>
      </div>
      <div className="admin-field-row">
        <div className="admin-field">
          <label>Specialty (EN)</label>
          <input
            value={draft.specialty.en}
            onChange={(e) => field("specialty.en", e.target.value)}
            required
          />
        </div>
        <div className="admin-field">
          <label>Specialty (AR)</label>
          <input
            value={draft.specialty.ar}
            onChange={(e) => field("specialty.ar", e.target.value)}
            dir="rtl"
            required
          />
        </div>
      </div>
      <div className="admin-field-row">
        <div className="admin-field">
          <label>Experience (EN)</label>
          <input
            value={draft.experience.en}
            onChange={(e) => field("experience.en", e.target.value)}
            required
          />
        </div>
        <div className="admin-field">
          <label>Experience (AR)</label>
          <input
            value={draft.experience.ar}
            onChange={(e) => field("experience.ar", e.target.value)}
            dir="rtl"
            required
          />
        </div>
      </div>
      <div className="admin-field-row">
        <div className="admin-field">
          <label>Highlight 1 (EN)</label>
          <input
            value={draft.highlights.en[0]}
            onChange={(e) => field("highlights.en.0", e.target.value)}
          />
        </div>
        <div className="admin-field">
          <label>Highlight 1 (AR)</label>
          <input
            value={draft.highlights.ar[0]}
            onChange={(e) => field("highlights.ar.0", e.target.value)}
            dir="rtl"
          />
        </div>
      </div>
      <div className="admin-field-row">
        <div className="admin-field">
          <label>Highlight 2 (EN)</label>
          <input
            value={draft.highlights.en[1]}
            onChange={(e) => field("highlights.en.1", e.target.value)}
          />
        </div>
        <div className="admin-field">
          <label>Highlight 2 (AR)</label>
          <input
            value={draft.highlights.ar[1]}
            onChange={(e) => field("highlights.ar.1", e.target.value)}
            dir="rtl"
          />
        </div>
      </div>

      <div className="admin-form-actions">
        <button
          type="submit"
          className="admin-btn"
          disabled={saving || uploading}
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button type="button" className="admin-btn outline" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
