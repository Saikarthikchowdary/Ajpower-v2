"use client";

import { useEffect, useMemo, useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { resolveImage } from "@/lib/images";
import { IMAGE_SLOTS, type ImageSlot } from "@/lib/siteImages";
import { OVERRIDES_DOC, readOverrides } from "@/components/SiteImagesProvider";

/* Every replaceable picture on the site, listed by where it appears. Uploading
   merges one field into the siteImages/overrides document; removing deletes that
   field and the original picture — never overwritten — comes straight back. */

/* Turns a raw Firebase/Cloudinary failure into something the person reading it
   can act on. "Missing or insufficient permissions" in particular means the
   Firestore rules have not been opened for this collection yet, which is a
   console change, not something to retry. */
function explain(err: unknown, fallback: string): string {
  const code = (err as { code?: string })?.code ?? "";
  const message = err instanceof Error ? err.message : "";
  if (code === "permission-denied" || /insufficient permissions/i.test(message)) {
    return "Firestore denied it. The rules for the “siteImages” collection must let everyone read and signed-in users write — add that rule in the Firebase console (Firestore → Rules), then try again.";
  }
  if (code === "unauthenticated") {
    return "Your session has expired. Log out and back in, then try again.";
  }
  if (/Cloudinary/i.test(message)) return message;
  return message || fallback;
}
export default function ImagesPanel() {
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [busySlot, setBusySlot] = useState("");
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { db } = await import("@/lib/firebase");
        const { doc, getDoc } = await import("firebase/firestore");
        const snap = await getDoc(doc(db, OVERRIDES_DOC.collection, OVERRIDES_DOC.id));
        setOverrides(snap.exists() ? readOverrides(snap.data()) : {});
      } catch (err) {
        setLoadError(
          "Every picture below is showing its original, because your saved changes could not be read. " +
          explain(err, "Check your Firestore rules and .env.local."),
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* Preserves the order of IMAGE_SLOTS, so the groups read top-to-bottom in the
     same order the pictures appear on the site. */
  const groups = useMemo(() => {
    const map = new Map<string, ImageSlot[]>();
    for (const slot of IMAGE_SLOTS) {
      const list = map.get(slot.group);
      if (list) list.push(slot);
      else map.set(slot.group, [slot]);
    }
    return [...map.entries()];
  }, []);

  const changedCount = IMAGE_SLOTS.filter((s) => overrides[s.id]).length;

  async function replace(slot: ImageSlot, file: File) {
    setNote(null);
    setBusySlot(slot.id);
    try {
      const { url, publicId } = await uploadToCloudinary(file);
      const { db } = await import("@/lib/firebase");
      const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
      await setDoc(
        doc(db, OVERRIDES_DOC.collection, OVERRIDES_DOC.id),
        { [slot.id]: { url, publicId, updatedAt: serverTimestamp() } },
        { merge: true },
      );
      setOverrides((prev) => ({ ...prev, [slot.id]: url }));
      setNote({ ok: true, text: `Saved. “${slot.label}” now uses your picture — reload the site to see it.` });
    } catch (err) {
      setNote({ ok: false, text: explain(err, "That picture could not be saved.") });
    } finally {
      setBusySlot("");
    }
  }

  async function restore(slot: ImageSlot) {
    if (!confirm(`Remove your picture from “${slot.label}” and go back to the original?`)) return;
    setNote(null);
    setBusySlot(slot.id);
    const previous = overrides[slot.id];
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[slot.id];
      return next;
    });
    try {
      const { db } = await import("@/lib/firebase");
      const { doc, updateDoc, deleteField, FieldPath } = await import("firebase/firestore");
      // FieldPath takes the slot id as one literal segment, so ids containing
      // hyphens ("hero-r2-p3") are not mis-parsed as a dotted field path.
      await updateDoc(
        doc(db, OVERRIDES_DOC.collection, OVERRIDES_DOC.id),
        new FieldPath(slot.id), deleteField(),
      );
      setNote({ ok: true, text: `“${slot.label}” is back to the original picture.` });
    } catch (err) {
      setOverrides((prev) => ({ ...prev, [slot.id]: previous }));
      setNote({ ok: false, text: explain(err, "That picture could not be put back. Nothing was changed.") });
    } finally {
      setBusySlot("");
    }
  }

  return (
    <section>
      <div className="adm-head">
        <h1>Site Images</h1>
        <span className="adm-count">
          {changedCount === 0
            ? "all original"
            : `${changedCount} of ${IMAGE_SLOTS.length} replaced`}
        </span>
      </div>

      <p className="adm-hint">
        Every picture below is one you can swap for your own. Find the one you want, click
        <b> Replace picture</b> and choose a photo from your computer — it goes live on the
        website as soon as the page is reloaded. Click <b>Remove</b> on any picture you have
        replaced and the original comes back. The originals are never deleted, so you can
        always change your mind.
      </p>

      {note && <div className={"adm-note" + (note.ok ? "" : " is-err")}>{note.text}</div>}

      {loading && <div className="adm-empty">Loading pictures…</div>}
      {!loading && loadError && <div className="adm-empty adm-empty-err">{loadError}</div>}

      {!loading && groups.map(([group, slots]) => (
        <div className="adm-slotgroup" key={group}>
          <h2 className="adm-slothead">{group}</h2>
          <div className="adm-slots">
            {slots.map((slot) => {
              const custom = overrides[slot.id];
              const busy = busySlot === slot.id;
              return (
                <div className={"adm-slot" + (custom ? " is-custom" : "")} key={slot.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resolveImage(custom || slot.fallback, "thumb")}
                    alt={`Currently showing for ${slot.label}`} loading="lazy" />
                  <div className="adm-slotbody">
                    <b>{slot.label}</b>
                    <span className={"adm-slottag" + (custom ? " on" : "")}>
                      {custom ? "Your picture" : "Original picture"}
                    </span>
                    <div className="adm-slotacts">
                      <label className={"adm-btn adm-btn-primary adm-upload" + (busy ? " is-busy" : "")}>
                        {busy ? "Working…" : custom ? "Replace again" : "Replace picture"}
                        <input type="file" accept="image/*" hidden disabled={busy}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            e.target.value = "";
                            if (file) replace(slot, file);
                          }} />
                      </label>
                      {custom && (
                        <button className="adm-del" disabled={busy} onClick={() => restore(slot)}>
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
