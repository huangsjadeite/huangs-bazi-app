export function downloadReadingExport({ report, clientName, derived }) {
  const {
    natalPillars, elementalBalance, usefulGod, rankedProfiles, monthlyOutlook,
    expandMonthlyNote, primaryDzi, secondaryDzi, eightMansions, lifePalace,
    conceptionPalace, shenSha, luckPillars, annualZodiacName,
  } = derived;

  const dayPillar = natalPillars?.day?.stem;
  const data = {
    meta: {
      exportedAt: new Date().toISOString().slice(0, 10),
      year: report.annualEnergy?.selectedYear || new Date().getFullYear(),
      annualPillar: annualZodiacName || null,
    },
    client: {
      name: clientName || null,
      gender: report.client?.gender || null,
    },
    dayMaster: {
      zh: dayPillar?.zh || null,
      stem: dayPillar?.name || null,
      element: dayPillar?.element || null,
      strength: report.chartFoundation?.dayMasterStrength?.status || null,
      strengthScore: report.chartFoundation?.dayMasterStrength?.strengthScore ?? null,
    },
    elementsBalance: elementalBalance.map((e) => ({
      element: e.name,
      role: e.role || null,
      roleDescription: e.roleDescription || null,
      natalPct: Math.round(e.natalPercentage),
      annualPct: Math.round(e.annualPercentage),
    })),
    usefulGod: {
      primary: usefulGod.primaryUsefulGod || null,
      secondary: usefulGod.secondaryUsefulGod || null,
      favourableElements: usefulGod.favourableElements || [],
      secondaryFavourableElements: usefulGod.secondaryFavourableElements || [],
      cautionElements: usefulGod.cautionElements || [],
    },
    personalityProfiles: rankedProfiles.map((p) => ({
      profile: p.profile,
      percentage: Math.round(p.percentage),
    })),
    monthlyOutlook: monthlyOutlook.map((m) => ({
      month: m.monthName,
      pillar: m.chinese,
      animal: m.branchAnimal,
      dominantElement: m.dominantElement,
      read: m.read,
      note: expandMonthlyNote(m),
    })),
    career: report.lifeAreas?.career || null,
    wealth: {
      ...(report.lifeAreas?.wealth || {}),
      ...(report.lifeAreas?.wealthArchetype || {}),
    },
    relationship: {
      ...(report.lifeAreas?.relationship || {}),
      ...(report.lifeAreas?.relationshipArchetype || {}),
    },
    wellness: report.lifeAreas?.health || null,
    blindSpots: report.personality?.blindSpots || null,
    hiddenStrengths: report.personality?.topStrengths || null,
    lifeThemes: report.lifeThemes || null,
    stones: report.stones || null,
    dziBeads: {
      primary: primaryDzi ? { element: usefulGod.primaryUsefulGod, ...primaryDzi } : null,
      secondary: secondaryDzi ? { element: usefulGod.secondaryUsefulGod, ...secondaryDzi } : null,
    },
    eightMansions: eightMansions || null,
    lifePalace: lifePalace
      ? {
          pillar: `${lifePalace.pillar.stem.zh}${lifePalace.pillar.branch.zh}`,
          stem: lifePalace.pillar.stem.name,
          element: lifePalace.pillar.stem.element,
          animal: lifePalace.pillar.branch.animal,
        }
      : null,
    conceptionPalace: conceptionPalace
      ? {
          pillar: `${conceptionPalace.pillar.stem.zh}${conceptionPalace.pillar.branch.zh}`,
          stem: conceptionPalace.pillar.stem.name,
          element: conceptionPalace.pillar.stem.element,
          animal: conceptionPalace.pillar.branch.animal,
        }
      : null,
    shenSha: shenSha.map((s) => ({
      name: s.name,
      zh: s.zh,
      active: s.active || false,
      theme: s.theme || null,
      caution: s.caution || null,
    })),
    luckPillars: luckPillars
      ? {
          startingAge: luckPillars.startingAge,
          direction: luckPillars.direction,
          pillars: luckPillars.pillars.map((p) => ({
            ageRange: p.ageRange,
            pillar: p.pillarLabel,
            element: p.element,
            tenGod: p.tenGod,
          })),
        }
      : null,
  };

  const filename = `${(clientName || "client").toLowerCase().replace(/\s+/g, "-")}-bazi-${data.meta.year}.json`;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
