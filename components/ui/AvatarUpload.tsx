"use client";

import { useState, useRef } from "react";
import { Upload, Loader2, User } from "lucide-react";
import Image from "next/image";

interface AvatarUploadProps {
  currentUrl?: string | null;
  userName: string;
  userId: string;
  onUpload: (file: File) => Promise<void>;
}

export function AvatarUpload({ currentUrl, userName, userId, onUpload }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const displaySrc = preview ?? currentUrl;

  return (
    <div className="relative group">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleChange}
      />

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative w-20 h-20 rounded-2xl flex items-center justify-center
          text-2xl font-black border-2 shrink-0 select-none cursor-pointer
          overflow-hidden transition-all duration-200
          ${dragOver ? "border-green-500 scale-105" : "border-transparent"}
        `}
        style={{
          background: displaySrc ? "transparent" : "rgba(34,197,94,0.12)",
          borderColor: displaySrc ? "rgba(34,197,94,0.3)" : "rgba(34,197,94,0.3)",
        }}
      >
        {displaySrc ? (
          <Image
            src={displaySrc}
            alt={userName}
            fill
            className="object-cover rounded-2xl"
            sizes="80px"
          />
        ) : (
          <span style={{ color: "var(--dash-accent)" }}>{initials}</span>
        )}

        <div
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : (
            <Upload className="w-5 h-5 text-white" />
          )}
        </div>
      </div>
    </div>
  );
}
