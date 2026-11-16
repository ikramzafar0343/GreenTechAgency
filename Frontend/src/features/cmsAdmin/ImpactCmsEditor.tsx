"use client";

import { adminFieldClass, adminLabelClass } from "@/components/admin/adminFormStyles";
import { CmsImageField } from "@/features/cmsAdmin/CmsImageField";
import { cmsBtnPrimary, cmsBtnSecondary, cmsCardClass } from "@/features/cmsAdmin/cmsUi";
import { useImpactCmsEditor, cardLabel } from "./ImpactCmsEditorModel";
import { ImpactCmsEditorSection1 } from "./ImpactCmsEditorSections";

export function ImpactCmsEditor() {
  const model = useImpactCmsEditor();
  const { row, form, error, pending, dirty, patchCard, onSave, onPublish } = model;
  if (!form || !row) {
    return (
      <p className="text-[0.9rem] text-black/45">
        {pending ? "Loading Impact block…" : error ?? "No Impact data."}
      </p>
    );
  }

  const imageCards = form.cards
    .map((card, index) => ({ card, index }))
    .filter((entry) => entry.card.kind === "image");
  const otherCards = form.cards
    .map((card, index) => ({ card, index }))
    .filter((entry) => entry.card.kind !== "image");
  return (
    <div className="space-y-5">
      {error ? (
        <p className="rounded-xl border border-black/10 bg-white px-4 py-3 text-[0.9rem] font-medium text-black/70">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={cmsBtnPrimary}
          disabled={pending || !dirty}
          onClick={onSave}
        >
          Save draft
        </button>
        <button
          type="button"
          className={cmsBtnSecondary}
          disabled={pending}
          onClick={onPublish}
        >
          Publish
        </button>
        <span className="self-center text-[0.85rem] font-medium text-black/45">
          Impact · v{row.version}
        </span>
      </div>

      <p className="text-[0.9rem] font-medium text-black/55">
        The Delivery photograph appears behind the Delivery tile on
        service pages. Upload a JPEG, PNG, WebP, or GIF, then Save draft and Publish.
      </p>

      {imageCards.map(({ card, index }) => {
        if (card.kind !== "image") return null;
        return (
          <div
            key={card.id || `image-${index}`}
            className={`${cmsCardClass} space-y-4 p-4 sm:p-5`}
          >
            <p className="text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-black/45">
              Delivery photograph
            </p>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)]">
              <CmsImageField
                label="Background image"
                hint="Shown behind the Delivery tile. Tile text stays on top."
                value={card.src}
                altValue={card.alt}
                spanFull={false}
                onPathChange={(path) => patchCard(index, { ...card, src: path })}
                onAltChange={(alt) => patchCard(index, { ...card, alt })}
              />
              <div className="space-y-3">
                <div>
                  <label className={adminLabelClass} htmlFor={`impact-tile-${index}`}>
                    Tile title
                  </label>
                  <input
                    id={`impact-tile-${index}`}
                    value={card.tileTitle}
                    onChange={(e) =>
                      patchCard(index, { ...card, tileTitle: e.target.value })
                    }
                    className={adminFieldClass}
                  />
                </div>
                <div>
                  <label className={adminLabelClass} htmlFor={`impact-caption-${index}`}>
                    Tile caption
                  </label>
                  <input
                    id={`impact-caption-${index}`}
                    value={card.tileCaption}
                    onChange={(e) =>
                      patchCard(index, { ...card, tileCaption: e.target.value })
                    }
                    className={adminFieldClass}
                  />
                </div>
                <div>
                  <label className={adminLabelClass} htmlFor={`impact-pos-${index}`}>
                    Focal position
                  </label>
                  <input
                    id={`impact-pos-${index}`}
                    value={card.objectPosition}
                    onChange={(e) =>
                      patchCard(index, { ...card, objectPosition: e.target.value })
                    }
                    className={adminFieldClass}
                    placeholder="center"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <ImpactCmsEditorSection1 model={model} />

      {otherCards.map(({ card, index }) => (
        <div key={card.id || `card-${index}`} className={`${cmsCardClass} space-y-4 p-4 sm:p-5`}>
          <p className="text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-black/45">
            {cardLabel(card, index)}
          </p>

          {card.kind === "metric" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={adminLabelClass}>Metric</label>
                <input
                  value={card.metric ?? ""}
                  onChange={(e) =>
                    patchCard(index, { ...card, metric: e.target.value })
                  }
                  className={adminFieldClass}
                />
              </div>
              <div>
                <label className={adminLabelClass}>Supporting line</label>
                <input
                  value={card.description ?? ""}
                  onChange={(e) =>
                    patchCard(index, { ...card, description: e.target.value })
                  }
                  className={adminFieldClass}
                />
              </div>
            </div>
          ) : null}

          {card.kind === "cta" || card.kind === "statement" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={adminLabelClass}>Heading</label>
                <input
                  value={card.heading ?? ""}
                  onChange={(e) =>
                    patchCard(index, { ...card, heading: e.target.value })
                  }
                  className={adminFieldClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className={adminLabelClass}>Description</label>
                <textarea
                  rows={3}
                  value={card.description ?? ""}
                  onChange={(e) =>
                    patchCard(index, { ...card, description: e.target.value })
                  }
                  className={adminFieldClass}
                />
              </div>
              {card.kind === "cta" ? (
                <>
                  <div>
                    <label className={adminLabelClass}>Link label</label>
                    <input
                      value={card.linkLabel ?? ""}
                      onChange={(e) =>
                        patchCard(index, { ...card, linkLabel: e.target.value })
                      }
                      className={adminFieldClass}
                    />
                  </div>
                  <div>
                    <label className={adminLabelClass}>Link href</label>
                    <input
                      value={card.href ?? ""}
                      onChange={(e) =>
                        patchCard(index, { ...card, href: e.target.value })
                      }
                      className={adminFieldClass}
                    />
                  </div>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
