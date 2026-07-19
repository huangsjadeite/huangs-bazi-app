import GenerateProfilePanel from "./components/form/GenerateProfilePanel";
import LeadPopup from "./components/LeadPopup";
import EmotionalEnergyBalance from "./components/public-report/EmotionalEnergyBalance";
import EmotionalEnergyProfile from "./components/public-report/EmotionalEnergyProfile";
import { getFreePreviewReport } from "./components/public-report/helpers";
import LifeThemesSection from "./components/public-report/LifeThemesSection";
import PremiumInsights from "./components/public-report/PremiumInsights";
import ProductRecommendationsSection from "./components/public-report/ProductRecommendationsSection";
import RecommendedStones from "./components/public-report/RecommendedStones";
import RelationshipArchetypeSection from "./components/public-report/RelationshipArchetypeSection";
import TopProfileStrengthSection from "./components/public-report/TopProfileStrengthSection";
import TopStrengthsSection from "./components/public-report/TopStrengthsSection";
import WealthTeaserSection from "./components/public-report/WealthTeaserSection";
import { getBirthCountryTimezone } from "./data/birthCountryTimezones";
import { getProfileDisplay } from "./data/profileDisplay";
import React, { useMemo, useState } from "react";
import buildBaziChart from "./engine/buildBaziChart";
import { mapChartToUi } from "./data/mapChartToUi";
import { motion } from "framer-motion";
import BlindSpotsSection from "./components/admin-report/BlindSpotsSection";
import CareerSection from "./components/admin-report/CareerSection";
import ChartFoundationSection from "./components/admin-report/ChartFoundationSection";
import { deriveAdminReportData } from "./components/admin-report/deriveAdminReportData";
import { downloadReadingExport } from "./components/admin-report/downloadReadingExport";
import HiddenStrengthsSection from "./components/admin-report/HiddenStrengthsSection";
import RelationshipSection from "./components/admin-report/RelationshipSection";
import { AdminBulletList, AdminReportSection } from "./components/admin-report/shared";
import WealthSection from "./components/admin-report/WealthSection";
import WellnessSection from "./components/admin-report/WellnessSection";

export function AdminFullReport({ report, clientName }) {
  if (!report) {
    return (
      <p className="mt-6 text-sm italic text-stone-400">
        Full report data is not available for this chart.
      </p>
    );
  }

  const derived = deriveAdminReportData(report);
  const {
    narrative, personality, usefulGod, stones, eightMansions, shenSha,
    luckPillars, lifePalace, conceptionPalace, natalPillars, tenGodByPillar,
    annualPillar, annualZodiac,
    rankedProfiles,
    career, wealth, wealthArchetype, relationship, relationshipArchetype,
    relationshipPattern, health, blindSpots, lifeThemes, growthAdvice,
    elementalBalance, monthlyOutlook, strongerElements, moderateElements, weakerElements,
    directWealthPct, indirectWealthPct,
    dayMasterLabel, dayMasterTrait,
    careerAuthorityProfile, careerOutputProfile,
    weakestElement,
    favourableSet,
    dayBranchAnimal, dayBranchZh, dayBranchElement, spousePalaceNoteText,
    peachBlossomAnimal, peachBlossomYears, peachBlossomMonth,
    careerStrongMonths, careerCautionMonths,
    wealthStrongMonths, wealthCautionMonths,
    relationshipGoodMonths, relationshipCautionMonths,
    wellnessEasierMonths, wellnessCautionMonths,
    coverYearLabel, expandMonthlyNote,
    primaryDzi, secondaryDzi,
  } = derived;

  return (
    <div>
      <ChartFoundationSection
        report={report}
        clientName={clientName}
        natalPillars={natalPillars}
        tenGodByPillar={tenGodByPillar}
        annualPillar={annualPillar}
        annualZodiac={annualZodiac}
        dayMasterLabel={dayMasterLabel}
        dayMasterTrait={dayMasterTrait}
        strongerElements={strongerElements}
        moderateElements={moderateElements}
        weakerElements={weakerElements}
        usefulGod={usefulGod}
        elementalBalance={elementalBalance}
        rankedProfiles={rankedProfiles}
        coverYearLabel={coverYearLabel}
        onExportJson={() => downloadReadingExport({ report, clientName, derived })}
        onExportPdf={() => exportAdminReportToPdf()}
      />

      <p className="mt-10 text-xs font-bold uppercase tracking-[0.3em] text-amber-700">
        The Four Key Areas
      </p>

      <HiddenStrengthsSection topStrengths={personality.topStrengths} />

      <BlindSpotsSection blindSpots={blindSpots} />

      <CareerSection
        careerAuthorityProfile={careerAuthorityProfile}
        careerOutputProfile={careerOutputProfile}
        careerStrongMonths={careerStrongMonths}
        careerCautionMonths={careerCautionMonths}
        career={career}
        careerFocus={narrative.careerFocus}
      />

      <WealthSection
        directWealthPct={directWealthPct}
        indirectWealthPct={indirectWealthPct}
        wealthStrongMonths={wealthStrongMonths}
        wealthCautionMonths={wealthCautionMonths}
        wealthArchetype={wealthArchetype}
        wealth={wealth}
        wealthFocus={narrative.wealthFocus}
      />

      <RelationshipSection
        relationshipArchetype={relationshipArchetype}
        relationshipPattern={relationshipPattern}
        dayBranchAnimal={dayBranchAnimal}
        dayBranchZh={dayBranchZh}
        dayBranchElement={dayBranchElement}
        spousePalaceNoteText={spousePalaceNoteText}
        relationshipGoodMonths={relationshipGoodMonths}
        relationshipCautionMonths={relationshipCautionMonths}
        relationshipFocus={narrative.relationshipFocus}
        relationship={relationship}
        favourableSet={favourableSet}
        selectedYear={report.annualEnergy?.selectedYear}
        peachBlossomAnimal={peachBlossomAnimal}
        peachBlossomYears={peachBlossomYears}
        peachBlossomMonth={peachBlossomMonth}
      />

      <WellnessSection
        dayMasterStrengthStatus={report.chartFoundation?.dayMasterStrength?.status}
        dayMasterStrengthScore={report.chartFoundation?.dayMasterStrength?.strengthScore}
        wellnessEasierMonths={wellnessEasierMonths}
        wellnessCautionMonths={wellnessCautionMonths}
        health={health}
        wellnessFocus={narrative.wellnessFocus}
        weakestElement={weakestElement}
      />


      <AdminReportSection icon="💎" title="Main Supportive Elements & Stones">
        <p className="mt-3 text-base text-stone-700">
          Favourable: {(usefulGod.favourableElements || []).join(", ") || "-"} · Use carefully:{" "}
          {(usefulGod.cautionElements || []).join(", ") || "-"}
        </p>
        {!!stones.primaryRecommendations?.length && (
          <div className="mt-4">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
              Primary Stones ({stones.primaryRecommendations[0]?.element})
            </p>
            <AdminBulletList
              items={stones.primaryRecommendations[0]?.stones}
              render={(item) => (
                <>
                  <strong>{item.name}</strong> — {item.customerMessage.split(/\.\s+(?:Best|Helpful|Good)\s/)[0]}.
                </>
              )}
            />
          </div>
        )}
        {!!stones.secondaryRecommendations?.length && (
          <div className="mt-4">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
              Secondary Stones ({stones.secondaryRecommendations[0]?.element})
            </p>
            <AdminBulletList
              items={stones.secondaryRecommendations[0]?.stones}
              render={(item) => (
                <>
                  <strong>{item.name}</strong> — {item.customerMessage.split(/\.\s+(?:Best|Helpful|Good)\s/)[0]}.
                </>
              )}
            />
          </div>
        )}
      </AdminReportSection>

      {(primaryDzi || secondaryDzi) && (
        <AdminReportSection icon="🪬" title="Optional Dzi Beads">
          <p className="mt-3 text-sm text-stone-500">
            Tibetan amulet recommendations based on this chart's Useful God and energy needs.
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

      {!!monthlyOutlook.length && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-slate-950">
            🗓️ Monthly Outlook — {report.annualEnergy?.selectedYear || ""}
          </h3>
          <p className="mt-2 text-sm text-stone-500">
            Each month's energy is read against this chart's favourable and caution elements. In the Chinese calendar, each month carries its own pillar — a heavenly stem and earthly branch pair — so every month has a different zodiac animal (the month's branch). This follows the classical Bazi methodology and is not related to the Western zodiac.
          </p>
          <p className="mt-1 text-xs text-stone-400">
            Why a different animal each month: the 12 earthly branches are permanently mapped to the 12 Chinese months — Tiger is always the first month of spring, Rabbit the second, Dragon the third, and so on. Each calendar month corresponds to one of these branches, so the animal naturally changes every month.
          </p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 print:rounded-none print:border-[#8B1A1A]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600 print:bg-[#8B1A1A] print:text-white">
                  <th className="px-4 py-2.5">Month</th>
                  <th className="px-4 py-2.5">Read</th>
                  <th className="px-4 py-2.5">Note</th>
                </tr>
              </thead>
              <tbody>
                {monthlyOutlook.map((item) => (
                  <tr
                    key={item.month}
                    className="border-t border-slate-100 align-top print:border-[#e5d5c0] odd:print:bg-white even:print:bg-[#FAE5D3]"
                  >
                    <td className="px-4 py-2.5 font-semibold text-slate-800">
                      {item.monthName}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          item.read === "Good"
                            ? "bg-green-50 text-green-700"
                            : item.read === "Caution"
                            ? "bg-red-50 text-red-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.read}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-stone-600 leading-6">{expandMonthlyNote(item)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {eightMansions && (
        <AdminReportSection icon="🧭" title="Personal Directions (Eight Mansions)">
          <p className="mt-3 text-base leading-7 text-stone-600">
            Based on your birth year, Eight Mansions assigns you a Kua number that determines which compass directions support or drain your energy. Use your favourable directions for your desk, bed headboard and where you sit during important conversations or decisions. Avoiding unfavourable directions for sleep and major commitments helps reduce unnecessary friction over time.
          </p>
          <div className="mt-4 flex items-start gap-5 rounded-xl border border-slate-200 bg-slate-50 p-4 print:bg-[#FAF3EF] print:border-[#e5d5c0]">
            <svg width="110" height="110" viewBox="0 0 110 110" className="flex-shrink-0" aria-label="iPhone compass diagram">
              <circle cx="55" cy="55" r="52" fill="#1C1C1E" stroke="#3A3A3C" strokeWidth="1.5"/>
              <circle cx="55" cy="55" r="44" fill="none" stroke="#3A3A3C" strokeWidth="1"/>
              {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => {
                const r1 = deg % 90 === 0 ? 36 : 41;
                const r2 = 44;
                const a = (deg - 90) * Math.PI / 180;
                return <line key={deg} x1={55 + r1*Math.cos(a)} y1={55 + r1*Math.sin(a)} x2={55 + r2*Math.cos(a)} y2={55 + r2*Math.sin(a)} stroke="#636366" strokeWidth={deg % 90 === 0 ? 1.5 : 0.75}/>;
              })}
              <polygon points="55,12 50,55 55,48 60,55" fill="#FF3B30"/>
              <polygon points="55,98 50,55 55,62 60,55" fill="#EBEBF5"/>
              <text x="55" y="10" textAnchor="middle" fill="#FF3B30" fontSize="11" fontWeight="bold" fontFamily="system-ui">N</text>
              <text x="55" y="106" textAnchor="middle" fill="#EBEBF5" fontSize="11" fontWeight="bold" fontFamily="system-ui">S</text>
              <text x="104" y="59" textAnchor="middle" fill="#EBEBF5" fontSize="11" fontWeight="bold" fontFamily="system-ui">E</text>
              <text x="6" y="59" textAnchor="middle" fill="#EBEBF5" fontSize="11" fontWeight="bold" fontFamily="system-ui">W</text>
              <circle cx="55" cy="55" r="4" fill="#636366"/>
              <circle cx="55" cy="55" r="2" fill="#EBEBF5"/>
            </svg>
            <div className="text-xs text-stone-500 leading-relaxed">
              <p className="font-semibold text-stone-700 mb-1">How to find your directions</p>
              <p>Open the <strong>Compass app</strong> on your iPhone. Hold your phone flat and level. The <span className="text-red-600 font-bold">red needle always points North</span> — the white needle points South.</p>
              <p className="mt-1.5">Once you know where North is, East is to your right, West to your left, and South is behind you. Use this to position your desk, bed headboard and seating accordingly.</p>
            </div>
          </div>
          <p className="mt-3 text-base text-stone-700">
            <strong>
              {eightMansions.lifeStar} ({eightMansions.trigram}, {eightMansions.element})
            </strong>{" "}
            · Personal direction: {eightMansions.personalDirection} · {eightMansions.group}
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
                Favourable Directions
              </p>
              <AdminBulletList
                items={eightMansions.favourableDirections}
                render={(item) => (
                  <>
                    <strong>{item.direction}</strong> — {item.name} ({item.label}):{" "}
                    {item.theme}
                  </>
                )}
              />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-700">
                Unfavourable Directions
              </p>
              <AdminBulletList
                items={eightMansions.unfavourableDirections}
                render={(item) => (
                  <>
                    <strong>{item.direction}</strong> — {item.name} ({item.label})
                  </>
                )}
              />
            </div>
          </div>
        </AdminReportSection>
      )}

      {(lifePalace || conceptionPalace) && (() => {
        const palaceStemMeaning = {
          Metal: "the life path is oriented around clarity, precision and building things of lasting value",
          Water: "the life path is oriented around wisdom, adaptability and the accumulation of deep inner knowing",
          Wood: "the life path is oriented around growth, initiation and laying foundations that others can build on",
          Fire: "the life path is oriented around vision, recognition and bringing people together through inspiration and warmth",
          Earth: "the life path is oriented around stability, service and building structures that stand the test of time",
        };
        const palaceBranchFlavour = {
          Rat: "resourcefulness and social intelligence",
          Ox: "perseverance and patient accumulation",
          Tiger: "boldness and forward momentum",
          Rabbit: "diplomacy and creative refinement",
          Dragon: "ambition and transformative scale",
          Snake: "depth, strategy and quiet power",
          Horse: "freedom, movement and dynamic energy",
          Goat: "compassion, creativity and collaborative flow",
          Monkey: "adaptability, wit and versatile execution",
          Rooster: "precision, discernment and high standards",
          Dog: "loyalty, duty and principled commitment",
          Pig: "abundance-mindedness, generosity and natural ease",
        };
        const conceptionStemMeaning = {
          Metal: "arrived with a natural inclination toward precision, discernment and structural thinking",
          Water: "arrived with heightened intuition, emotional depth and an innate capacity for reading situations",
          Wood: "arrived with an instinctive drive toward growth, ambition and forward momentum",
          Fire: "arrived with a natural warmth, expressiveness and an innate awareness of how things are perceived",
          Earth: "arrived with an instinctive groundedness, practicality and a deep orientation toward service and stability",
        };
        return (
          <AdminReportSection icon="🔮" title="Life Palace & Conception Palace">
            <p className="mt-3 text-base leading-7 text-stone-600">
              These two pillars reveal your soul-level purpose and the energy of your arrival into this life. The <strong>Life Palace</strong> reflects your innate potential and natural life path — the deeper mission your chart is oriented toward beyond day-to-day circumstances. The <strong>Conception Palace</strong> shows the energetic conditions surrounding your earliest formation, offering insight into inherited tendencies and what you came into this life already carrying. Together they provide a wider lens on who you came here to be.
            </p>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              {lifePalace && (
                <div className="rounded-xl border border-slate-200 p-4 print:border-[#8B1A1A] print:bg-[#FAE5D3]">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700 print:text-[#8B1A1A]">Life Palace 命宮</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {lifePalace.pillar.stem.zh}{lifePalace.pillar.branch.zh}{" "}
                    ({lifePalace.pillar.stem.element} {lifePalace.pillar.branch.animal})
                  </p>
                  {palaceStemMeaning[lifePalace.pillar.stem.element] && (
                    <p className="mt-2 text-sm text-stone-600">
                      With a {lifePalace.pillar.stem.element} Life Palace, {palaceStemMeaning[lifePalace.pillar.stem.element]}
                      {palaceBranchFlavour[lifePalace.pillar.branch.animal]
                        ? `, expressed through the ${lifePalace.pillar.branch.animal}'s quality of ${palaceBranchFlavour[lifePalace.pillar.branch.animal]}.`
                        : "."}
                    </p>
                  )}
                </div>
              )}
              {conceptionPalace && (
                <div className="rounded-xl border border-slate-200 p-4 print:border-[#8B1A1A] print:bg-[#FAE5D3]">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700 print:text-[#8B1A1A]">Conception Palace 胎元</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {conceptionPalace.pillar.stem.zh}{conceptionPalace.pillar.branch.zh}{" "}
                    ({conceptionPalace.pillar.stem.element} {conceptionPalace.pillar.branch.animal})
                  </p>
                  {conceptionStemMeaning[conceptionPalace.pillar.stem.element] && (
                    <p className="mt-2 text-sm text-stone-600">
                      This person {conceptionStemMeaning[conceptionPalace.pillar.stem.element]}
                      {palaceBranchFlavour[conceptionPalace.pillar.branch.animal]
                        ? `, coloured by the ${conceptionPalace.pillar.branch.animal}'s energy of ${palaceBranchFlavour[conceptionPalace.pillar.branch.animal]}.`
                        : "."}
                    </p>
                  )}
                </div>
              )}
            </div>
          </AdminReportSection>
        );
      })()}

      {!!shenSha.length && (() => {
        const activeStars = shenSha.filter((s) => s.active);
        const referenceStars = shenSha.filter((s) => !s.active);

        const starStatusNote = {
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

        const starNote = (item) => {
          if (item.key === "noblePeople") {
            const animals = item.branches?.length
              ? item.branches.map(b => b.animal)
              : item.branch ? [item.branch.animal] : [];
            if (!animals.length) return null;
            return `${animals.join(" & ")} year people are likely to be your natural benefactors and helpful connections.`;
          }
          if (starStatusNote[item.key]) {
            const entry = starStatusNote[item.key];
            return item.active ? entry.active : entry.inactive;
          }
          return null;
        };

        const starTarget = (item) =>
          item.branches
            ? item.branches.map((b) => `${b.zh} ${b.animal}`).join(" / ")
            : item.branch
            ? `${item.branch.zh} ${item.branch.animal}`
            : item.stem
            ? `${item.stem.zh} ${item.stem.name}`
            : "";

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
      })()}

      {!!luckPillars?.pillars?.length && (() => {
        // Compute client's current age to highlight the active pillar
        const birthYear = report.client?.birthDate
          ? Number(report.client.birthDate.split("-")[0])
          : null;
        const birthMonth = report.client?.birthDate
          ? Number(report.client.birthDate.split("-")[1])
          : null;
        const now = new Date();
        const currentAge = birthYear
          ? now.getFullYear() - birthYear - (now.getMonth() + 1 < birthMonth ? 1 : 0)
          : null;

        const tenGodTheme = {
          "Friend":           "A decade of peer connection, mutual support and building through relationships. Collaborative energy — shared goals and alliances matter most.",
          "Rob Wealth":       "A decade of competition, ambition and fighting for position. Drive is high but so is rivalry — stay focused on long-term strategy over short-term wins.",
          "Eating God":       "A decade of creative expression, skill-building and personal output. A productive window to develop expertise and share your work with the world.",
          "Hurting Officer":  "A decade of independence, innovation and breaking with convention. Strong drive to do things your own way — powerful if channelled, disruptive if unchecked.",
          "Direct Wealth":    "A decade oriented toward building tangible assets, financial discipline and steady, structured growth. Hard work pays off reliably during this period.",
          "Indirect Wealth":  "A decade of opportunity, opportunistic gains and wealth through non-traditional routes. Flexible thinking and timing matter more than routine effort.",
          "Direct Officer":   "A decade of responsibility, reputation and institutional advancement. Status and career structure are prominent — authority is earned through discipline.",
          "Seven Killings":   "A decade of pressure, intensity and ambition. Challenges are sharper here, but so is the drive to overcome them — breakthrough potential is high for those who persevere.",
          "Direct Resource":  "A decade of support, mentorship and learning. A nurturing period — help arrives from others, and investing in knowledge or credentials pays long-term dividends.",
          "Indirect Resource":"A decade of intuition, spiritual insight and unconventional wisdom. Less structured support, more inner-guided clarity — trust gut instinct over outside opinion.",
        };

        const primaryEl = usefulGod.primaryUsefulGod;
        const secondaryEl = usefulGod.secondaryUsefulGod;

        function pillarRead(stemElement) {
          if (stemElement === primaryEl) return "favourable";
          if (stemElement === secondaryEl) return "supported";
          // Elements that produce or are produced by the useful god are broadly neutral;
          // elements that clash or drain it lean caution. Keep it simple: anything
          // that isn't a useful-god element is caution if it's in the top-2 strongest
          // natal elements (already excess in the chart).
          const strongEls = elementalBalance
            .slice(0, 2)
            .map((e) => e.name);
          if (strongEls.includes(stemElement)) return "caution";
          return "neutral";
        }

        const readStyle = {
          favourable: { badge: "bg-emerald-100 text-emerald-800", label: "Favourable" },
          supported:  { badge: "bg-teal-100 text-teal-700",      label: "Supported"  },
          caution:    { badge: "bg-amber-100 text-amber-800",     label: "Caution"    },
          neutral:    { badge: "bg-slate-100 text-slate-600",     label: "Neutral"    },
        };

        return (
          <AdminReportSection icon="📈" title="Luck Pillars (大運)">
            <p className="mt-3 text-base leading-7 text-stone-600">
              Luck Pillars are 10-year energy cycles that map the broader seasons of your life. Each pillar brings a different elemental emphasis that colours your career, relationships, wealth and personal growth during that period. Knowing which pillar you are currently in helps you work with the energy of your season rather than against it — some pillars accelerate growth, others call for consolidation, and understanding the difference allows you to pace yourself wisely.
            </p>
            <p className="mt-2 text-sm text-stone-400">
              Cycles begin from age {luckPillars.startingAge.years}y{luckPillars.startingAge.months}m, stepping{" "}
              {luckPillars.direction === "forward" ? "forward" : "in reverse"}{" "}
              through the cycle from the month pillar.
              {currentAge !== null && ` Current age: ${currentAge}.`}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {elementalBalance.map((e) => (
                <span key={e.name} className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-stone-600 border border-slate-200 print:bg-[#FAE5D3] print:border-[#e5d5c0]">
                  <strong className="text-stone-800">{e.name}</strong> — {e.roleDescription}
                </span>
              ))}
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 print:rounded-none print:border-[#8B1A1A]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600 print:bg-[#8B1A1A] print:text-white">
                    <th className="px-4 py-2.5">Age</th>
                    <th className="px-4 py-2.5">Decade Energy</th>
                    <th className="px-4 py-2.5">Read</th>
                    <th className="px-4 py-2.5">Decade Theme</th>
                    <th className="px-4 py-2.5">Wear & Display</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const elementWear = {
                      Wood:  "green jadeite or green aventurine",
                      Fire:  "red jadeite or garnet",
                      Earth: "yellow jadeite or citrine",
                      Metal: "white jadeite or clear quartz",
                      Water: "black jadeite or aquamarine",
                    };
                    const elementDisplay = {
                      Wood:  "plants or wooden decor",
                      Fire:  "warm lighting or red accents",
                      Earth: "crystal clusters or earthy ceramics",
                      Metal: "metal ornaments or white crystals",
                      Water: "a small water feature or dark stone decor",
                    };
                    const primaryUsefulEl = usefulGod.primaryUsefulGod || null;
                    return luckPillars.pillars.map((p, i) => {
                      const isCurrent = currentAge !== null &&
                        currentAge >= p.startAge.years &&
                        currentAge < p.endAge.years;
                      const read = pillarRead(p.pillar.stem.element);
                      const rs = readStyle[read];
                      const theme = tenGodTheme[p.tenGod] || null;
                      const recEl = read === "Caution" && primaryUsefulEl ? primaryUsefulEl : p.pillar.stem.element;
                      const wearText = elementWear[recEl] || "—";
                      const displayText = elementDisplay[recEl] || "—";
                      const wearNote = read === "Caution" && primaryUsefulEl
                        ? `Support with your Useful God (${primaryUsefulEl}). Wear ${wearText}. Display ${displayText}.`
                        : `Wear ${wearText}. Display ${displayText}.`;
                      return (
                        <tr
                          key={i}
                          className={`border-t border-slate-100 align-top print:border-[#e5d5c0] odd:print:bg-white even:print:bg-[#FAE5D3] ${isCurrent ? "bg-amber-50 print:bg-[#FAE5D3]" : ""}`}
                        >
                          <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                            {p.startAge.years}y–{p.endAge.years}y
                            {isCurrent && (
                              <span className="ml-2 rounded-full bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white print:bg-[#8B1A1A]">
                                NOW
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-stone-800">{p.pillar.stem.element}</span>
                            {getProfileDisplay(p.tenGod)?.name && (
                              <span className="text-stone-500"> · {getProfileDisplay(p.tenGod).name}</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${rs.badge}`}>
                              {rs.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-stone-600 leading-5">
                            {theme || "—"}
                          </td>
                          <td className="px-4 py-3 text-xs text-stone-500 leading-5">
                            {wearNote}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </AdminReportSection>
        );
      })()}

      <AdminReportSection icon="📖" title="Bazi Reference — The 10 Energy Archetypes">
        <p className="mt-3 text-sm text-stone-500">
          Each personality pattern in this report is derived from one of ten classical Bazi archetypes. Use this table as a quick reference when explaining any term that appears in the chart above.
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 print:rounded-none print:border-[#8B1A1A]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600 print:bg-[#8B1A1A] print:text-white">
                <th className="px-4 py-2.5">Bazi Term</th>
                <th className="px-4 py-2.5">Also Called</th>
                <th className="px-4 py-2.5">In Simple Terms</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Friend",           "The Companion",   "Loyalty, peer support, building through relationships"],
                ["Rob Wealth",       "The Challenger",  "Drive, ambition, bold self-assertion and healthy competition"],
                ["Eating God",       "The Creator",     "Creative expression, skill-building and personal output"],
                ["Hurting Officer",  "The Rebel Voice", "Independence, innovation and questioning the status quo"],
                ["Direct Wealth",    "The Builder",     "Stability, discipline and steady, structured results"],
                ["Indirect Wealth",  "The Opportunist", "Spotting opportunities, flexibility and network-driven gains"],
                ["Direct Officer",   "The Guardian",    "Responsibility, reputation and doing what is right"],
                ["Seven Killings",   "The Warrior",     "Pressure, decisiveness and breakthrough intensity"],
                ["Direct Resource",  "The Nurturer",    "Support, mentorship and investing in knowledge"],
                ["Indirect Resource","The Mystic",      "Intuition, reflection and unconventional insight"],
              ].map(([term, name, desc], i) => (
                <tr key={term} className="border-t border-slate-100 align-top print:border-[#e5d5c0] odd:print:bg-white even:print:bg-[#FAE5D3]">
                  <td className="px-4 py-2.5 font-semibold text-slate-800 whitespace-nowrap">{term}</td>
                  <td className="px-4 py-2.5 font-semibold text-amber-800 whitespace-nowrap">{name}</td>
                  <td className="px-4 py-2.5 text-stone-600">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminReportSection>

      <p className="mt-10 text-xs text-stone-400 leading-relaxed border-t border-slate-100 pt-6 print:text-[#9A7060]">
        <strong className="text-stone-500">Disclaimer:</strong> This Bazi analysis is intended as a tool for self-reflection and personal awareness. It is not a prediction of fixed outcomes and should not replace professional advice in areas of health, finance, law or relationships. Results are based on classical Bazi methodology and are provided as guidance only.
      </p>

      <details
        className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 print-no-export"
      >
        <summary className="cursor-pointer text-sm font-bold text-slate-700">
          Raw report data (debug)
        </summary>
        <pre className="mt-3 overflow-x-auto text-xs leading-5 text-slate-600">
          {JSON.stringify(report, null, 2)}
        </pre>
      </details>
    </div>
  );
}

function exportAdminReportToPdf() {
  const style = document.createElement("style");
  style.id = "huangs-print-style";
  style.textContent = `
    @media print {
      @page {
        margin: 1.5cm;
        size: A4;
        /* Blank out browser-injected URL/date/page-number headers and footers */
        @top-left { content: ""; }
        @top-center { content: ""; }
        @top-right { content: ""; }
        @bottom-left { content: ""; }
        @bottom-center { content: "Bazi Analysis generated by huangsjadeiteandjewelry.com."; font-size: 9pt; color: #888; }
        @bottom-right { content: ""; }
      }
      body * { visibility: hidden !important; }
      #admin-full-report, #admin-full-report * { visibility: visible !important; }
      #admin-full-report { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; border: none !important; box-shadow: none !important; border-radius: 0 !important; padding: 0 !important; }
      .print-no-export { display: none !important; }
      .print-footer { display: none !important; }
      .print-cover {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
        min-height: 85vh;
        padding: 5cm 2cm 3cm 2cm !important;
        page-break-after: always;
      }
      .print-cover img {
        display: block !important;
        margin: 0 auto 1.5rem auto !important;
        max-width: 200px !important;
        width: auto !important;
        height: auto !important;
      }
      .print-cover > h1,
      .print-cover > p {
        text-align: center !important;
        width: 100% !important;
      }
      .print-cover-body {
        text-align: left !important;
        max-width: 480px !important;
        margin: 1rem auto 0 auto !important;
      }
      table { border-collapse: collapse; width: 100%; }
      .print-break-before { page-break-before: always; }
    }
  `;
  document.head.appendChild(style);
  window.print();
  setTimeout(() => {
    const existing = document.getElementById("huangs-print-style");
    if (existing) existing.remove();
  }, 1500);
}

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

export default function HuangsBaZiUIFrontend() {
  // Admin mode: visit with ?admin=PASSWORD to unlock the full paid report.
  // Password comes from VITE_ADMIN_PASSWORD (set in Vercel / .env); falls back
  // to a default for local dev. Light internal gate, not strong security.
  const isAdmin = (() => {
    if (typeof window === "undefined") return false;
    try {
      const provided = new URLSearchParams(window.location.search).get("admin");
      if (!provided) return false;
      const expected = import.meta.env?.VITE_ADMIN_PASSWORD || "huangs2026";
      return provided === expected;
    } catch {
      return false;
    }
  })();

  const [form, setForm] = useState({
    name: "",
    birthDate: "",
    birthHour: "00",
    birthMinute: "00",
    birthTime: "",
    birthTimeUnknown: false,
    useBirthTime: true,
    gender: "",
    birthCountry: "",
    selectedYear: 2026,
  });

  const [submittedInput, setSubmittedInput] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const chart = useMemo(() => {
    if (!submittedInput) return null;

    return buildBaziChart({
      name: submittedInput.name,
      birthDate: submittedInput.birthDate,
      birthTime: submittedInput.birthTime,
      birthCountry: submittedInput.birthCountry,
      timezone: submittedInput.timezone,
      selectedYear: submittedInput.selectedYear,
      gender: submittedInput.gender,
      useBirthTime: submittedInput.useBirthTime,
    });
  }, [submittedInput]);

  const uiChart = useMemo(() => {
    if (!chart || !submittedInput) return null;

    return mapChartToUi(chart, submittedInput.selectedYear);
  }, [chart, submittedInput]);

  function updateForm(nextValue) {
    setForm((current) => ({ ...current, ...nextValue }));
  }

  function generateProfile() {
    if (!form.birthDate) {
      alert("Please select your birth date.");
      return;
    }

    if (!form.gender) {
      alert("Please select your gender.");
      return;
    }

    if (!form.birthCountry) {
      alert("Please select your birth country.");
      return;
    }

    const hour24 = Number(form.birthHour || "00");
    const minute = form.birthMinute || "00";

    const birthTime = form.birthTimeUnknown
      ? ""
      : `${String(hour24).padStart(2, "0")}:${minute}`;

    setSubmittedInput({
      ...form,
      birthTime,
      timezone: getBirthCountryTimezone(form.birthCountry),
      useBirthTime: !form.birthTimeUnknown && Boolean(birthTime),
    });

    setPopupOpen(true);
  }

  const wealthArchetype =
    chart?.wealthArchetypeV2 ||
    chart?.wealthArchetypeV1 ||
    chart?.wealthArchetype ||
    uiChart?.wealthArchetype ||
    null;

  const relationshipArchetype =
    chart?.relationshipArchetypeV1 ||
    chart?.relationshipArchetype ||
    uiChart?.relationshipArchetype ||
    uiChart?.lifeAreas?.relationshipArchetype ||
    uiChart?.guidance?.relationship?.relationshipArchetype ||
    null;

  const topStrengths =
    chart?.topStrengthsV1 ||
    chart?.topStrengths ||
    uiChart?.topStrengths ||
    uiChart?.personalityAndStructure?.topStrengths ||
    [];

  const previewReport = getFreePreviewReport(
    chart?.pdfReportSchemaV2 ||
      chart?.pdfReportSchemaV1 ||
      chart?.pdfReportSchema
  );

  return (
    <main className="min-h-screen bg-[#F7F3EB]">
      <LeadPopup open={popupOpen} setOpen={setPopupOpen} />

      <div className="mx-auto max-w-[1600px] space-y-5 px-4 py-6 md:px-8 md:pb-6">
        <GenerateProfilePanel
          form={form}
          onChange={updateForm}
          onGenerate={generateProfile}
        />

        {uiChart ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="space-y-10"
          >
            {isAdmin && (
              <div className="rounded-2xl border border-amber-300 bg-amber-50 px-6 py-4 text-center">
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-amber-800">
                  🔓 Admin Mode — Full Report Unlocked
                </p>
                <p className="mt-1 text-xs text-amber-700">
                  This view shows the complete paid report. Customers see the teaser version.
                </p>
              </div>
            )}

            {chart?.readingConfidence?.level === "approximate" && (
              <div className="rounded-2xl border border-sky-200 bg-sky-50 px-6 py-4">
                <p className="text-sm font-semibold text-sky-800">
                  ⏱️ Approximate reading (no birth time)
                </p>
                <p className="mt-1 text-xs leading-5 text-sky-700">
                  {chart.readingConfidence.note}
                </p>
              </div>
            )}

                                                                     <EmotionalEnergyProfile profile={uiChart.profile} />

            <TopStrengthsSection strengths={topStrengths} />

            <TopProfileStrengthSection chart={chart} uiChart={uiChart} />

            <EmotionalEnergyBalance elements={uiChart?.elements} />

            <RelationshipArchetypeSection
              relationshipArchetype={relationshipArchetype}
            />

            <WealthTeaserSection wealth={wealthArchetype} />

            <LifeThemesSection
              lifeThemes={
                chart?.lifeThemes ||
                uiChart?.lifeThemes ||
                uiChart?.lifeAreas?.lifeThemes ||
                chart?.lifeAreas?.lifeThemes
              }
            />

            <RecommendedStones
              stones={
                chart?.recommendations?.stones ||
                chart?.practicalSupport?.stones ||
                uiChart?.stones ||
                uiChart?.stoneRecommendations
              }
            />

            <ProductRecommendationsSection
              products={
                chart?.recommendations?.products ||
                chart?.practicalSupport?.products
              }
            />

            <PremiumInsights
              report={previewReport}
              isAdmin={isAdmin}
              fullReport={chart?.paidReportSchemaV1}
              clientName={submittedInput?.name}
            />
          </motion.div>
        ) : null}
      </div>
    </main>
  );
}