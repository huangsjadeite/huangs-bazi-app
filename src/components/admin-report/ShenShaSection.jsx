import { AdminBulletList, AdminReportSection } from "./shared";

const STAR_STATUS_NOTE = {
  peachBlossom: {
    active:   "Active in your chart — natural magnetism; romance, popularity and social opportunities flow more easily to you.",
    inactive: "Not active in your chart — social charm is built through effort rather than coming naturally.",
  },
  skyHorse: {
    active:   "Active in your chart — movement, travel and change of environment are recurring themes in your life.",
    inactive: "Not active in your chart — your energy is more settled; major relocations or restlessness are less driven by external push.",
  },
  intelligenceStar: {
    active:   "Active in your chart — strong alignment with study and exams; academic or intellectual recognition comes more naturally.",
    inactive: "Not active in your chart — intellectual success comes through sustained effort rather than natural exam luck.",
  },
  solitary: {
    active:   "Active in your chart — a natural pull toward self-reliance; deep meaningful connections may take more effort to sustain.",
    inactive: "Not active in your chart — this pattern of emotional solitude does not apply to you.",
  },
  monthlyVirtue: {
    active:   "Active in your chart — this protective energy is reinforced in your natal chart; disputes and setbacks are more likely to resolve smoothly.",
    inactive: "Not directly reinforced in your chart — this protection is still present but works more subtly in the background.",
  },
  heavenlyVirtue: {
    active:   "Active in your chart — one of the most auspicious signs; serious difficulties, illness or legal matters are more likely to resolve in your favour.",
    inactive: "Not directly reinforced in your chart — this heavenly protection still supports you as a background influence.",
  },
  fiveGhosts: {
    active:   "Active in your chart — friction, misunderstandings or hidden obstacles may appear more often than usual.",
    inactive: "Not active in your chart — you are less prone to hidden obstacles and interpersonal friction.",
  },
  widow: {
    active:   "Active in your chart — a natural pull toward independence; be mindful of emotional distance in close relationships.",
    inactive: "Not active in your chart — this pattern of emotional isolation does not apply to you.",
  },
  robberySha: {
    active:   "Active in your chart — exercise extra caution with sudden decisions involving finances or resources.",
    inactive: "Not active in your chart — sudden setbacks from this star do not apply to you.",
  },
};

function starNote(item) {
  if (item.key === "noblePeople") {
    const animals = item.branches?.length
      ? item.branches.map(b => b.animal)
      : item.branch ? [item.branch.animal] : [];
    if (!animals.length) return null;
    return `${animals.join(" & ")} year people are likely to be your natural benefactors and helpful connections.`;
  }
  if (STAR_STATUS_NOTE[item.key]) {
    const entry = STAR_STATUS_NOTE[item.key];
    return item.active ? entry.active : entry.inactive;
  }
  return null;
}

function starTarget(item) {
  return item.branches
    ? item.branches.map((b) => `${b.zh} ${b.animal}`).join(" / ")
    : item.branch
    ? `${item.branch.zh} ${item.branch.animal}`
    : item.stem
    ? `${item.stem.zh} ${item.stem.name}`
    : "";
}

export default function ShenShaSection({ shenSha }) {
  if (!shenSha.length) return null;

  const activeStars = shenSha.filter((s) => s.active);
  const referenceStars = shenSha.filter((s) => !s.active);

  return (
    <AdminReportSection icon="🌸" title="Personal Stars (Shen Sha)">
      <p className="mt-3 text-base leading-7 text-stone-600">
        Shen Sha are auxiliary stars derived from your natal chart that highlight specific recurring themes in your life — from romance and travel to learning, protection and hidden obstacles. They are not dominant forces like your Day Master or Useful God, but they colour how certain energies show up in your experiences.
      </p>
      {activeStars.length > 0 && (
        <>
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-stone-400">Active in your chart</p>
          <AdminBulletList
            items={activeStars}
            render={(item) => {
              const note = starNote(item);
              return (
                <>
                  <strong>{item.name} ({item.zh})</strong> — {item.theme}
                  {item.caution ? ` ${item.caution}` : ""}
                  {note && <span className="block text-xs text-stone-400 mt-0.5">{note}</span>}
                </>
              );
            }}
          />
        </>
      )}
      {referenceStars.length > 0 && (
        <>
          <p className="mt-5 text-xs font-bold uppercase tracking-widest text-stone-400">Other classical stars</p>
          <AdminBulletList
            items={referenceStars}
            render={(item) => {
              const target = starTarget(item);
              const note = starNote(item);
              return (
                <>
                  <strong>{item.name} ({item.zh})</strong>
                  {target ? ` — ${target}` : ""}. {item.theme}
                  {item.caution ? ` ${item.caution}` : ""}
                  {note && <span className="block text-xs text-stone-400 mt-0.5">{note}</span>}
                </>
              );
            }}
          />
        </>
      )}
    </AdminReportSection>
  );
}
