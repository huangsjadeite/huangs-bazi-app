import { AdminBulletList, AdminReportSection } from "./shared";

export default function BlindSpotsSection({ blindSpots }) {
  return (
    <AdminReportSection icon="⚠️" title="Personal Blind Spots">
      {blindSpots.summary && (
        <p className="mt-3 text-base leading-7 text-stone-700">{blindSpots.summary}</p>
      )}
      <AdminBulletList items={blindSpots.blindSpots} />
      {blindSpots.growthAdvice && (
        <p className="mt-4 text-base leading-7 text-stone-700">
          <strong>Growth advice:</strong> {blindSpots.growthAdvice}
        </p>
      )}
    </AdminReportSection>
  );
}
