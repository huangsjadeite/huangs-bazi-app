import { AdminBulletList, AdminReportSection } from "./shared";

export default function HiddenStrengthsSection({ topStrengths }) {
  return (
    <AdminReportSection icon="✨" title="Hidden Strengths">
      <AdminBulletList
        items={topStrengths}
        render={(item) => (
          <>
            <strong>{item.title}</strong> — {item.description}
          </>
        )}
      />
    </AdminReportSection>
  );
}
