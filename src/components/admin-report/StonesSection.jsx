import { QRCodeSVG } from "qrcode.react";
import { ELEMENT_COLLECTION_URLS, SHOW_SHOP_LINKS } from "../../config/shopLinks";
import { AdminBulletList, AdminReportSection } from "./shared";

// Featured stones are picked for the client's focus areas; up to 6 more of
// that element's stones follow as one "also suitable" line, then a QR code and
// link to that element's shop collection.
const MAX_ALSO_SUITABLE = 6;

function ShopLink({ element }) {
  const url = ELEMENT_COLLECTION_URLS[element];
  if (!SHOW_SHOP_LINKS || !url) return null;
  return (
    <div className="mt-3 flex items-center gap-3" style={{ breakInside: "avoid" }}>
      <QRCodeSVG value={url} size={64} marginSize={1} aria-hidden="true" className="shrink-0" />
      <a href={url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-amber-700 hover:underline print:text-[#8B1A1A] print:no-underline">
        Shop {element} stones at HUANGS
      </a>
    </div>
  );
}

function StoneGroup({ label, group }) {
  return (
    <div className="mt-4">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
        {label} ({group.element})
      </p>
      <AdminBulletList
        items={group.stones}
        render={(item) => (
          <>
            <strong>{item.name}</strong> — {item.customerMessage}
            {item.pickedForLabel && (
              <span className="text-stone-500"> Picked for your {item.pickedForLabel} focus.</span>
            )}
          </>
        )}
      />
      {!!group.alsoSuitable?.length && (
        <p className="mt-2 text-sm text-stone-600">
          <span className="font-semibold text-slate-700">Also suitable for your {group.element}:</span>{" "}
          {group.alsoSuitable.slice(0, MAX_ALSO_SUITABLE).join(", ")}.
        </p>
      )}
      <ShopLink element={group.element} />
    </div>
  );
}

export default function StonesSection({ usefulGod, stones, primaryDzi, secondaryDzi }) {
  return (
    <>
      <AdminReportSection icon="💎" title="Main Supportive Elements & Stones">
        <p className="mt-3 text-base text-stone-700">
          Favourable:{" "}
          {[...(usefulGod.favourableElements || []), ...(usefulGod.secondaryFavourableElements || [])].join(", ") || "-"}{" "}
          · Strains your chart:{" "}
          {(usefulGod.cautionElements || []).join(", ") || "-"}
        </p>
        {[
          ["Primary Stones", stones.primaryRecommendations?.[0]],
          ["Secondary Stones", stones.secondaryRecommendations?.[0]],
        ].map(([label, group]) =>
          group?.stones?.length ? <StoneGroup key={label} label={label} group={group} /> : null
        )}
      </AdminReportSection>

      {(primaryDzi || secondaryDzi) && (
        <AdminReportSection icon="🪬" title="Optional Dzi Beads">
          <p className="mt-3 text-sm text-stone-500">
            Tibetan amulet recommendations based on your Elements to Enhance and energy needs.
          </p>
          <div className="mt-4 space-y-4">
            {primaryDzi && (
              <div className="rounded-xl border border-slate-200 p-4 print:border-[#8B1A1A] print:bg-[#FAE5D3]">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700 print:text-[#8B1A1A]">
                  Supporting your {usefulGod.primaryUsefulGod} energy
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  <a href={primaryDzi.url} target="_blank" rel="noreferrer" className="hover:underline print:no-underline print:text-slate-900">
                    {primaryDzi.label}
                  </a>
                  <span className="ml-2 text-sm font-normal text-stone-400">· {usefulGod.primaryUsefulGod} element</span>
                </p>
                <p className="mt-1 text-sm text-stone-600">{primaryDzi.why}</p>
              </div>
            )}
            {secondaryDzi && (
              <div className="rounded-xl border border-slate-200 p-4 print:border-[#8B1A1A] print:bg-[#FAE5D3]">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700 print:text-[#8B1A1A]">
                  Supporting your {usefulGod.secondaryUsefulGod} energy
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  <a href={secondaryDzi.url} target="_blank" rel="noreferrer" className="hover:underline print:no-underline print:text-slate-900">
                    {secondaryDzi.label}
                  </a>
                  <span className="ml-2 text-sm font-normal text-stone-400">· {usefulGod.secondaryUsefulGod} element</span>
                </p>
                <p className="mt-1 text-sm text-stone-600">{secondaryDzi.why}</p>
              </div>
            )}
          </div>
        </AdminReportSection>
      )}
    </>
  );
}
