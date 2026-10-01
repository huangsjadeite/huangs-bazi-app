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
import LuckCyclesSection from "./LuckCyclesSection";
import LuckPillarsSection from "./LuckPillarsSection";
import MonthlyOutlookSection from "./MonthlyOutlookSection";
import RawChartDataSection from "./RawChartDataSection";
import ReferenceTableSection from "./ReferenceTableSection";
import RelationshipSection from "./RelationshipSection";
import { UpgradedOnly } from "./shared";
import ShenShaSection from "./ShenShaSection";
import StonesSection from "./StonesSection";
import WealthSection from "./WealthSection";
import WellnessSection from "./WellnessSection";

// One report for both PDF exports: "Export Client PDF" prints this page with the
// <UpgradedOnly> sections hidden, "Export Upgraded PDF" prints all of it. Keep
// it a single page fed by the same engine output so engine changes reach both.
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
    luckPillars, luckTimeline, lifePalace, conceptionPalace,
    blindSpots, lifeThemes, growthAdvice,
    natalPillars, tenGodByPillar, rankedProfiles,
    annualPillar, annualZodiac,
    currentLuck, annualRead, ageInSelectedYear, luckOverview,
    career, wealth, wealthArchetype, relationship, relationshipArchetype,
    relationshipPattern, health,
    elementalBalance, monthlyOutlook, strongerElements, moderateElements, weakerElements,
    directWealthPct, indirectWealthPct,
    dayMasterLabel, dayMasterTrait,
    careerAuthorityProfile, careerOutputProfile,
    weakestElement,
    favourableSet,
    dayBranchAnimal, dayBranchZh, dayBranchElement, spousePalaceNoteText,
    peachBlossomAnimal, peachBlossomYears, peachBlossomMonth, peachBlossomRating,
    careerStrongMonths, careerCautionMonths,
    wealthStrongMonths, wealthCautionMonths,
    relationshipGoodMonths, relationshipCautionMonths,
    wellnessEasierMonths, wellnessCautionMonths,
    coverYearLabel,
    primaryDzi, secondaryDzi,
    rawChartData,
  } = derived;

  return (
    <div>
      <ChartFoundationSection
        report={report}
        clientName={clientName}
        natalPillars={natalPillars}
        tenGodByPillar={tenGodByPillar}
        rawChartData={rawChartData}
        rankedProfiles={rankedProfiles}
        annualPillar={annualPillar}
        annualZodiac={annualZodiac}
        dayMasterLabel={dayMasterLabel}
        dayMasterTrait={dayMasterTrait}
        strongerElements={strongerElements}
        moderateElements={moderateElements}
        weakerElements={weakerElements}
        usefulGod={usefulGod}
        elementalBalance={elementalBalance}
        coverYearLabel={coverYearLabel}
        onExportJson={() => downloadReadingExport({ report, clientName, derived })}
        onExportPdf={() => exportAdminReportToPdf()}
        onExportUpgradedPdf={() => exportAdminReportToPdf({ upgraded: true })}
        destinyChart={
          rawChartData && (
            <UpgradedOnly>
              <RawChartDataSection
                rawChartData={rawChartData}
                birthDate={report.client?.birthDate}
                birthTime={report.client?.birthTime}
              />
            </UpgradedOnly>
          )
        }
      />

      <UpgradedOnly>
        <HiddenStrengthsSection topStrengths={personality.topStrengths || []} />
        {blindSpots && <BlindSpotsSection blindSpots={blindSpots} />}
      </UpgradedOnly>

      <LuckCyclesSection
        currentLuck={currentLuck}
        annualPillar={annualPillar}
        annualZodiac={annualZodiac}
        annualRead={annualRead}
        selectedYear={report.annualEnergy?.selectedYear}
        ageInSelectedYear={ageInSelectedYear}
        luckOverview={luckOverview}
        usefulGod={usefulGod}
      />

      <UpgradedOnly>
        <LuckPillarsSection
          luckPillars={luckPillars}
          luckTimeline={luckTimeline}
          usefulGod={usefulGod}
          ageInSelectedYear={ageInSelectedYear}
          selectedYear={report.annualEnergy?.selectedYear}
        />
      </UpgradedOnly>

      <p className="mt-10 text-xs font-bold uppercase tracking-[0.3em] text-amber-700">
        The Four Key Areas
      </p>
      <p className="mt-2 text-sm text-stone-500">
        The Easiest months and Pace yourself months in each area come from the Monthly Outlook (流月) further down.
      </p>

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
        peachBlossomRating={peachBlossomRating}
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

      <UpgradedOnly>
        <LifeDirectionSection lifeThemes={lifeThemes || {}} growthAdvice={growthAdvice || {}} />
      </UpgradedOnly>

      <StonesSection
        usefulGod={usefulGod}
        stones={stones}
        primaryDzi={primaryDzi}
        secondaryDzi={secondaryDzi}
      />

      <MonthlyOutlookSection
        monthlyOutlook={monthlyOutlook}
        selectedYear={report.annualEnergy?.selectedYear}
      />

      <UpgradedOnly>
        <EightMansionsSection eightMansions={eightMansions} />
        <LifePalaceSection lifePalace={lifePalace} conceptionPalace={conceptionPalace} />
        <ShenShaSection shenSha={shenSha || []} />
      </UpgradedOnly>

      <ReferenceTableSection />

      <DisclaimerAndDebugSection report={report} />
    </div>
  );
}
