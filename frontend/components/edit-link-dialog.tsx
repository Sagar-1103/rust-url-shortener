"use client";

import { useState, useEffect } from "react";
import { X, Tag, Check } from "lucide-react";
import { updateUrlTitleApi } from "@/lib/api";

interface EditLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  linkId: string;
  currentTitle: string;
  onUpdated?: () => void;
}

export function EditLinkDialog({
  isOpen,
  onClose,
  linkId,
  currentTitle,
  onUpdated,
}: EditLinkDialogProps) {
  const [title, setTitle] = useState(currentTitle);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(currentTitle);
  }, [currentTitle, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await updateUrlTitleApi(linkId, title.trim());
      if (res.success) {
        if (onUpdated) onUpdated();
        onClose();
      } else {
        setError(res.message || "Failed to update title");
      }
    } catch {
      setError("Failed to update title");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog Container */}
      <div className="relative w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl shadow-black/10 dark:shadow-black/40 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10 cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="pt-7 pb-2 px-6">
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
            <Tag className="size-5" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Edit Link Title</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Update the descriptive title for your shortened URL.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-3 space-y-4">
          {error && (
            <div className="p-3 text-xs font-medium rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">
              Title
            </label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title..."
                required
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-xl border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {isLoading ? (
                <span className="size-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="size-3.5" />
                  Save Title
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
