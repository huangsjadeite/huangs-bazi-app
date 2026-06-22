export function renderWellnessFocus({
  health,
  narrativePersonalization,
}) {
  const recoveryStyle = String(
    health?.recoveryStyle || ""
  ).toLowerCase();

  const stressPattern = String(
    health?.stressPattern || ""
  ).toLowerCase();

  const structure =
    narrativePersonalization?.structure || "";

  const profile =
    narrativePersonalization?.profile || "";

  // Structure + Profile Wellness

  if (
    structure === "Connectors" &&
    profile === "Direct Wealth"
  ) {
    return "Your wellbeing improves when you become more selective about the responsibilities, opportunities and commitments you take on. You naturally see potential in people and situations, but sustainable energy comes from recognising that not everything deserves equal attention. Rest is not the absence of productivity—it is what allows your judgement, influence and effectiveness to remain strong over time.";
  }

  if (
    structure === "Connectors" &&
    profile === "Indirect Resource"
  ) {
    return "Your wellbeing improves when periods of connection and activity are balanced with enough space to reflect, process and reconnect with your own thoughts. Because you naturally absorb information, perspectives and emotional signals from your environment, quiet recovery becomes especially important. Sustainable wellbeing comes from creating space where your attention is no longer being pulled in multiple directions.";
  }

  if (
    structure === "Thinkers" &&
    profile === "Eating God"
  ) {
    return "Your wellbeing improves when mental stimulation is balanced with practical recovery. Reflection and learning are natural strengths, but sustainable energy comes from allowing your body to recover alongside your mind. Consistent routines, movement and rest often have a greater impact than trying to think your way through every challenge.";
  }

  if (
    structure === "Thinkers" &&
    profile === "Direct Resource"
  ) {
    return "Your wellbeing improves when you allow yourself enough recovery time between periods of responsibility and decision-making. Because your mind naturally remains engaged with problems, ideas and possibilities, intentional rest becomes an important part of maintaining clarity. Recovery is often most effective when both your thoughts and your environment are allowed to slow down.";
  }

  if (
    structure === "Supporters" &&
    profile === "Direct Resource"
  ) {
    return "Your wellbeing improves when caring for yourself becomes as important as caring for others. Reliability and support may come naturally to you, but sustainable energy requires healthy boundaries, rest and emotional replenishment. The more balanced your giving and receiving become, the stronger your overall resilience tends to be.";
  }

  // Fallback System

  if (
    stressPattern.includes("people") ||
    stressPattern.includes("opportunity") ||
    stressPattern.includes("overload")
  ) {
    return "Your wellbeing improves when you are selective about where your energy goes. Too many commitments, responsibilities or opportunities at once can create unnecessary strain and reduce your effectiveness. Sustainable wellbeing comes from recognising that not every opportunity deserves the same level of attention, allowing your energy to remain focused on what matters most.";
  }

  if (
    stressPattern.includes("mental") ||
    recoveryStyle.includes("reflection")
  ) {
    return "Your wellbeing improves when periods of thinking and activity are balanced with quiet reflection and mental recovery. Your mind may naturally remain active for long periods, which makes intentional rest especially important. Recovery is most effective when both your body and your thoughts are given permission to slow down and reset.";
  }

  if (
    stressPattern.includes("responsibility") ||
    recoveryStyle.includes("care")
  ) {
    return "Your wellbeing improves when you stop carrying every responsibility alone. While reliability and contribution may be important strengths, sustainable energy comes from balancing what you give with the support, rest and recovery you allow yourself to receive.";
  }

  if (
    recoveryStyle.includes("warmth") ||
    recoveryStyle.includes("joy") ||
    recoveryStyle.includes("expression")
  ) {
    return "Your wellbeing improves when life includes joy, connection and healthy emotional expression. Positive experiences are not distractions from wellbeing; they are part of it. Making space for meaningful relationships, creativity and enjoyment often helps restore energy more effectively than productivity alone.";
  }

  if (
    recoveryStyle.includes("routine") ||
    recoveryStyle.includes("stability") ||
    recoveryStyle.includes("structure")
  ) {
    return "Your wellbeing strengthens when daily routines create stability and predictability. Consistent sleep, movement, nutrition and recovery habits often have a greater impact than occasional bursts of motivation. Long-term wellbeing is usually built through small actions repeated consistently over time.";
  }

  return "Your wellbeing becomes stronger when recovery, emotional balance and sustainable routines are treated as important foundations rather than afterthoughts. The more consistently you care for your energy, the easier it becomes to navigate challenges with resilience and clarity.";
}

export default renderWellnessFocus;