import BlindSpotsSection from "./BlindSpotsSection";
import CareerSection from "./CareerSection";
import ChartFoundationSection from "./ChartFoundationSection";
import { deriveAdminReportData } from "./deriveAdminReportData";
import DisclaimerAndDebugSection from "./DisclaimerAndDebugSection";
import { downloadReadingExport } from "./downloadReadingExport";
import EightMansionsSection from "./EightMansionsSection";
import { exportAdminReportToPdf } from "./exportAdminReportToPdf";
import HiddenStrengthsSection from "./HiddenStrengthsSection";
import LifeDirectionSection from "./LifeDirectionSection";
import LifePalaceSection from "./LifePalaceSection";
import LuckPillarsSection from "./LuckPillarsSection";
import MonthlyOutlookSection from "./MonthlyOutlookSection";
import ReferenceTableSection from "./ReferenceTableSection";
import RelationshipSection from "./RelationshipSection";
import ShenShaSection from "./ShenShaSection";
import StonesSection from "./StonesSection";
import WealthSection from "./WealthSection";
import WellnessSection from "./WellnessSection";

export default function AdminFullReport({ report, clientName }) {
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

      <StonesSection
        usefulGod={usefulGod}
        stones={stones}
        primaryDzi={primaryDzi}
        secondaryDzi={secondaryDzi}
      />

      <LifeDirectionSection lifeThemes={lifeThemes} growthAdvice={growthAdvice} />

      <MonthlyOutlookSection
        monthlyOutlook={monthlyOutlook}
        selectedYear={report.annualEnergy?.selectedYear}
        expandMonthlyNote={expandMonthlyNote}
      />

      <EightMansionsSection eightMansions={eightMansions} />

      <LifePalaceSection lifePalace={lifePalace} conceptionPalace={conceptionPalace} />

      <ShenShaSection shenSha={shenSha} />

      <LuckPillarsSection
        luckPillars={luckPillars}
        usefulGod={usefulGod}
        elementalBalance={elementalBalance}
        birthDate={report.client?.birthDate}
      />

      <ReferenceTableSection />

      <DisclaimerAndDebugSection report={report} />
    </div>
  );
}
