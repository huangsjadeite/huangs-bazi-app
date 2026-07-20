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
import React, { useMemo, useState } from "react";
import buildBaziChart from "./engine/buildBaziChart";
import { mapChartToUi } from "./data/mapChartToUi";
import { motion } from "framer-motion";

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