"use client";

import { Bookmark, Check, Share2, Volume2 } from "lucide-react";
import { useState } from "react";
import type { Story } from "@/lib/stories";

const bookmarksKey = "briefly-bookmarks";

export function LeadStoryActions({ story }: { story: Story }) {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem(bookmarksKey) || "[]",
      );
      return Array.isArray(saved)
        ? saved.some((item: Story) => item.id === story.id)
        : false;
    } catch {
      return false;
    }
  });

  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleBookmark = () => {
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem(bookmarksKey) || "[]",
      );
      const list: Story[] = Array.isArray(saved) ? (saved as Story[]) : [];
      const next = list.some((item) => item.id === story.id)
        ? list.filter((item) => item.id !== story.id)
        : [story, ...list];
      localStorage.setItem(bookmarksKey, JSON.stringify(next));
      setIsBookmarked(!isBookmarked);
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/story/${story.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleAudio = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Audio brief synthesis is not supported on this device.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = `${story.title}. ${story.articles[0]?.description || ""}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.05;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        onClick={toggleAudio}
        className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full transition ${
          isPlayingAudio
            ? "bg-editorial-charcoal text-white"
            : "text-editorial-body hover:text-editorial-charcoal bg-editorial-surfaceMuted"
        }`}
        title={isPlayingAudio ? "Stop reading" : "Listen to summary audio"}
      >
        <Volume2
          size={13}
          className={`mr-1 ${isPlayingAudio ? "text-emerald-400 animate-pulse" : "text-editorial-accent"}`}
          aria-hidden="true"
        />
        <span>{isPlayingAudio ? "Playing" : "Listen (2 min)"}</span>
      </button>

      <button
        type="button"
        onClick={toggleBookmark}
        className={`p-1.5 rounded-full transition ${
          isBookmarked
            ? "text-editorial-accent bg-orange-50 hover:bg-orange-100"
            : "text-editorial-muted hover:text-editorial-charcoal hover:bg-neutral-100"
        }`}
        title={isBookmarked ? "Remove bookmark" : "Bookmark story"}
        aria-label={isBookmarked ? "Remove bookmark" : "Bookmark story"}
      >
        <Bookmark
          size={16}
          fill={isBookmarked ? "currentColor" : "none"}
          aria-hidden="true"
        />
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="p-1.5 text-editorial-muted hover:text-editorial-charcoal rounded-full hover:bg-neutral-100 transition relative"
        title={copied ? "Link copied!" : "Share story"}
        aria-label="Share story"
      >
        {copied ? (
          <Check size={16} className="text-emerald-600" aria-hidden="true" />
        ) : (
          <Share2 size={16} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

