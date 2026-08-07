import { AdminBulletList, AdminReportSection } from "./shared";

const THEME_DESCRIPTIONS = {
  "Creative Expression":
    "Your growth comes through expressing ideas, emotions and creativity more honestly. When you allow your voice, style and perspective to be seen, opportunities and self-confidence can open naturally.",

  "Building Support Systems":
    "Your path improves when you stop carrying everything alone and build reliable support around you. The right people, routines and systems can help you feel safer, steadier and less overwhelmed.",

  "Adaptability and Learning":
    "You grow through curiosity, flexibility and being willing to learn from changing situations. Rather than needing one fixed path, your chart benefits when you stay open and adjust with awareness.",

  "Sharing Ideas":
    "Your ideas are part of your value. Speaking, teaching, explaining or sharing your perspective can help others understand you better and create stronger opportunities over time.",

  "Innovation":
    "You are not meant to only repeat old methods. This theme supports fresh thinking, experimentation and finding better ways to solve problems or express your abilities.",

  "Relationships and Connections":
    "Your growth often comes through the people you meet, the trust you build and the communities you choose to be part of. The right connections can open doors, but weak boundaries may also make you feel stretched.",

  "Balancing Independence and Support":
    "One of your recurring lessons is knowing when to carry things yourself and when to allow the right people to support you. You do not need to prove your strength by doing everything alone.",

  "Strategic Decision Making":
    "Long-term progress becomes stronger when you slow down, choose clearly and avoid reacting to every opportunity at once. Your chart benefits from structure, timing and better prioritisation.",

  "Building Through People":
    "Opportunities become stronger when relationships, collaboration and shared direction are handled with care. People are not just distractions; the right people can become part of your growth system.",

  "Trust and Reciprocity":
    "Your path asks you to build exchanges where support, effort and loyalty can flow both ways. You grow when you stop overgiving and start noticing who also shows up for you.",

  "Knowledge and Wisdom":
    "Your growth is strongly linked to learning, reflection and turning insight into practical direction. The more you understand yourself and your environment, the easier it becomes to make aligned choices.",

  "Growth and Expansion":
    "This theme points to a period where new experiences, new people or new responsibilities can help you mature. Expansion works best when it is supported by grounding and clear priorities.",

  "Creating Stability":
    "Your chart benefits when you build routines, foundations and dependable systems instead of relying only on short bursts of motivation. Stability gives your potential somewhere safe to grow.",

  "Visibility and Influence":
    "This theme asks you to be seen more clearly, but in a way that feels grounded, intentional and aligned with your values. Your influence grows when visibility is supported by purpose.",

  "Emotional Clarity":
    "Your growth comes from understanding what you truly feel before reacting, pleasing others or withdrawing. Clear emotions help you communicate better and choose relationships more wisely.",

  "Personal Boundaries":
    "This theme asks you to protect your energy, time and emotional space. Healthy boundaries do not make you cold; they help your relationships and decisions become cleaner.",

  "Discipline and Responsibility":
    "You grow by turning pressure into maturity, structure and dependable action. This theme supports consistency, but also reminds you not to carry responsibility until it becomes emotional heaviness.",

  "Courage and Direction":
    "Your chart pushes you to act with more courage and clarity. When you stop waiting for perfect certainty, your direction becomes stronger through movement and experience.",

  "Emotional Recovery":
    "Your growth depends on knowing when to pause, rest and reset. Recovery is not a weakness here; it helps your system stay clear, sensitive and sustainable.",
};

export default function LifeDirectionSection({ lifeThemes, growthAdvice }) {
  return (
    <AdminReportSection icon="🧭" title="Your Life Direction">
      {!!lifeThemes.primaryThemes?.length && (
        <div className="mt-3 space-y-3">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
            Primary Themes
          </p>
          {lifeThemes.primaryThemes.map((theme) => (
            <div key={theme}>
              <p className="text-base font-semibold text-slate-900">{theme}</p>
              <p className="mt-1 text-base leading-7 text-stone-700">
                {THEME_DESCRIPTIONS[theme]}
              </p>
            </div>
          ))}
        </div>
      )}
      {!!lifeThemes.supportingThemes?.length && (
        <div className="mt-5 space-y-3">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
            Supporting Themes
          </p>
          {lifeThemes.supportingThemes.map((theme) => (
            <div key={theme}>
              <p className="text-base font-semibold text-slate-900">{theme}</p>
              <p className="mt-1 text-base leading-7 text-stone-700">
                {THEME_DESCRIPTIONS[theme]}
              </p>
            </div>
          ))}
        </div>
      )}
      {growthAdvice.summary && (
        <p className="mt-3 text-base leading-7 text-stone-700">{growthAdvice.summary}</p>
      )}
      {!!growthAdvice.nextLevelActions?.length && (
        <div className="mt-4">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
            Next Level Actions
          </p>
          <AdminBulletList items={growthAdvice.nextLevelActions} />
        </div>
      )}
    </AdminReportSection>
  );
}
