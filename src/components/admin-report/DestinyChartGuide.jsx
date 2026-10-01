// Plain-language guide printed under the Destiny Chart grid, so a client can
// read the chart without a practitioner beside them. Personal lines come from
// rawChartDataV1 output; everything else is fixed explanation.

import { getProfileDisplay } from "../../data/profileDisplay";

const PILLARS = [
  { key: "year", zh: "年", en: "Year", ages: "birth to 16", meaning: "Your roots: family background, grandparents and early childhood." },
  { key: "month", zh: "月", en: "Month", ages: "17 to 40", meaning: "Your parents, upbringing and the working world you step into. It also sets the season you were born in." },
  { key: "day", zh: "日", en: "Day", ages: "all your life", meaning: "You and your closest relationship. The top character is you; the bottom one is your Spouse Palace." },
  { key: "hour", zh: "时", en: "Hour", ages: "40 onwards", meaning: "Your children, your ideas and plans, and later life." },
];

const ROWS = [
  ["天干 Heavenly Stem", "The top character. The energy you show openly: how you come across and what others notice first."],
  ["地支 Earthly Branch", "The bottom character, with its zodiac animal. Your ground: your surroundings and what supports you."],
  ["藏干 Hidden Stems", "Elements tucked inside each branch. Hidden talents and motives that come out over time; the first one listed is the strongest."],
  ["关系 Relations", "How a pillar reacts with the others. The letter in brackets shows which pillar: (H) Hour, (D) Day, (M) Month, (Y) Year."],
  ["旺衰 Season", "How strong each element is in the season you were born: 旺 Prosperous (strongest), 相 Strong, 休 Resting, 囚 Trapped, 死 Dead (weakest)."],
  ["十二长生 12 Growth Phase", "How energetic you feel when standing on that branch, like a life cycle: from 长生 Growth and 帝旺 Peak down to 墓 Grave, then 胎 Conceived and 养 Nurture as energy rebuilds."],
];

const RELATIONS = {
  "HS Combo": { zh: "合", label: "Stem Combo", meaning: "two top characters bond, bringing attraction and cooperation" },
  "EB Combo": { zh: "合", label: "Branch Combo", meaning: "two branches bond, bringing support and teamwork" },
  Clashes: { zh: "冲", label: "Clash", meaning: "opposing branches, bringing movement, change and sometimes friction" },
  Harms: { zh: "害", label: "Harm", meaning: "a quiet strain, such as misunderstandings or hidden friction" },
  Punishment: { zh: "刑", label: "Punishment", meaning: "pressure that teaches through difficulty; patience helps" },
  Destruction: { zh: "破", label: "Destruction", meaning: "small disruptions to plans; minor and easy to manage" },
};

const TEN_GODS = [
  ["DM", "日元", "Day Master", "You. Every other tag is read in relation to this."],
  ["F", "比肩", "Friend", "Peers, siblings, self-belief and independence."],
  ["RW", "劫财", "Rob Wealth", "Competition, drive and bold action."],
  ["EG", "食神", "Eating God", "Creativity, enjoyment and skill."],
  ["HO", "伤官", "Hurting Officer", "Self-expression, new ideas and questioning rules."],
  ["DW", "正财", "Direct Wealth", "Steady income, savings and hard-earned results."],
  ["IW", "偏财", "Indirect Wealth", "Opportunities, deals and wider networks."],
  ["DO", "正官", "Direct Officer", "Status, responsibility and doing things properly."],
  ["7K", "七杀", "Seven Killings", "Pressure, ambition and courage under fire."],
  ["DR", "正印", "Direct Resource", "Support, learning, mentors and care."],
  ["IR", "偏印", "Indirect Resource", "Intuition, research and unusual knowledge."],
];

const ELEMENTS = [
  ["木", "Wood", "#2E7D32"],
  ["火", "Fire", "#C62828"],
  ["土", "Earth", "#8D6E63"],
  ["金", "Metal", "#6B7280"],
  ["水", "Water", "#1565C0"],
];

const TAG_NAME = { H: "Hour", D: "Day", M: "Month", Y: "Year" };
const KEY_OF_TAG = { H: "hour", D: "day", M: "month", Y: "year" };
const KEEP = { breakInside: "avoid" };

// One line per natal pair, e.g. "Day 子 and Month 午: Clash (冲) — ...".
function natalInteractions(natal) {
  const seen = new Set();
  const lines = [];
  Object.entries(KEY_OF_TAG).forEach(([tag, key]) => {
    natal[key]?.relations?.forEach(({ type, with: tags }) => {
      tags.forEach((other) => {
        const id = [type, ...[tag, other].sort()].join("|");
        if (seen.has(id) || !RELATIONS[type]) return;
        seen.add(id);
        const part = type === "HS Combo" ? "stem" : "branch";
        const a = natal[key][part].zh;
        const b = natal[KEY_OF_TAG[other]]?.[part]?.zh;
        lines.push({ id, pair: `${TAG_NAME[tag]} ${a} and ${TAG_NAME[other]} ${b}`, ...RELATIONS[type] });
      });
    });
  });
  return lines;
}

function GuideBlock({ title, children }) {
  return (
    <div className="mt-4" style={KEEP}>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700 print:text-[#8B1A1A]">{title}</p>
      <div className="mt-1 text-sm leading-6 text-stone-700">{children}</div>
    </div>
  );
}

export default function DestinyChartGuide({ rawChartData }) {
  const { natal, dayMaster, voidBranches, seasonElement, annual, currentLuck, luck } = rawChartData;
  const interactions = natalInteractions(natal);
  const voidHere = Object.entries(natal).filter(([, cell]) => cell.isVoid).map(([key]) => key);
  const luckTheme = currentLuck ? getProfileDisplay(currentLuck.stem.tenGod)?.name : null;

  return (
    <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/40 p-4 print:rounded-none print:border-[#e5d5c0] print:bg-transparent">
      <h4 className="text-lg font-bold text-slate-900 print:text-[#8B1A1A]">How to read your Destiny Chart</h4>
      <p className="mt-2 text-sm leading-6 text-stone-700">
        Bazi (八字) means &ldquo;eight characters&rdquo;. Your chart is four pillars, one each for the year, month, day
        and hour you were born, and each pillar has two characters: a Heavenly Stem on top and an Earthly Branch
        below. The columns run right to left, from Year to Hour, as in a traditional chart.
      </p>

      <GuideBlock title="Start with you">
        You are the top character of the Day column:{" "}
        <strong>
          {dayMaster.zh} {dayMaster.name}, {natal.day?.stem?.polarity} {dayMaster.element}
        </strong>
        . This is your Day Master (日元), tagged DM. Every other character in the chart is read by how it relates to
        it, which is what the small tags beside each character show.
      </GuideBlock>

      <GuideBlock title="What each pillar stands for">
        <div className="grid gap-x-5 gap-y-1.5 md:grid-cols-2 print:grid-cols-2">
          {PILLARS.filter((p) => natal[p.key]).map((p) => (
            <p key={p.key}>
              <strong>
                {p.zh} {p.en}
              </strong>{" "}
              <span className="text-stone-500">({p.ages})</span>: {p.meaning}
            </p>
          ))}
        </div>
      </GuideBlock>

      <GuideBlock title="What each row shows">
        <div className="space-y-1">
          {ROWS.map(([label, text]) => (
            <p key={label}>
              <strong>{label}:</strong> {text}
            </p>
          ))}
        </div>
      </GuideBlock>

      <GuideBlock title="The small tags: your 10 energies (Ten Gods)">
        <p>
          Each tag shows what that character means for you. The same names appear as the archetypes in the
          reference table at the end of this report.
        </p>
        <div className="mt-1.5 grid gap-x-5 gap-y-1 md:grid-cols-2 print:grid-cols-2">
          {TEN_GODS.map(([abbr, zh, name, text]) => {
            const archetype = getProfileDisplay(name)?.name;
            return (
              <p key={abbr}>
                <span className="inline-block w-8 font-bold">{abbr}</span>
                {zh} {name}
                {archetype ? ` (${archetype})` : ""}: <span className="text-stone-600">{text}</span>
              </p>
            );
          })}
        </div>
      </GuideBlock>

      <GuideBlock title="Colours">
        Each character is coloured by its element:{" "}
        {ELEMENTS.map(([zh, en, color], i) => (
          <span key={en}>
            <strong style={{ color }}>
              {zh} {en}
            </strong>
            {i < ELEMENTS.length - 1 ? ", " : "."}
          </span>
        ))}
        {seasonElement && ` You were born in a ${seasonElement} season, so any ${seasonElement} characters in your chart are at full seasonal strength (旺).`}
      </GuideBlock>

      <GuideBlock title="Interactions in your birth chart">
        {interactions.length ? (
          <div className="space-y-1">
            {interactions.map((line) => (
              <p key={line.id}>
                <strong>{line.pair}</strong>: {line.label} ({line.zh}), {line.meaning}.
              </p>
            ))}
          </div>
        ) : (
          <p>Your four pillars sit quietly together, with no combos or clashes between them.</p>
        )}
      </GuideBlock>

      {voidBranches?.length > 0 && (
        <GuideBlock title="Void (空亡)">
          Two branches are &ldquo;empty&rdquo; for you: {voidBranches.join(" and ")}. A branch marked 空亡 promises more
          than it delivers, so matters linked to it can feel delayed or less solid until you put in steady effort.
          {voidHere.length
            ? ` In your chart this touches your ${voidHere.map((key) => PILLARS.find((p) => p.key === key)?.en).join(" and ")} pillar.`
            : " None of your four birth pillars is void."}
        </GuideBlock>
      )}

      {(annual || currentLuck) && (
        <GuideBlock title="The shaded columns">
          Your birth chart never changes, but time adds new characters on top of it.
          {annual && ` The 流年 column is the energy of ${annual.year}, which affects everyone but reacts with your chart in its own way.`}
          {currentLuck &&
            ` The 大运 column is your current 10-year Luck Pillar, which began at age ${currentLuck.startAge}${luckTheme ? ` and brings out ${luckTheme}` : ""}.`}{" "}
          Their Relations row shows which of your pillars each one clashes or combines with, which is where change is
          most likely to be felt.
        </GuideBlock>
      )}

      {luck?.length > 0 && (
        <GuideBlock title="The Luck Pillar row">
          The bottom table lists every 10-year Luck Pillar in your life, earliest on the left. The number on top is
          the age each one begins, and the shaded one is active now. A full reading of every decade, with best years
          and years to watch, is in the 10-Year Luck Pillars section near the end of this report.
        </GuideBlock>
      )}
    </div>
  );
}
