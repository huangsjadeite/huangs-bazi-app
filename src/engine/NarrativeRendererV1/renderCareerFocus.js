export function renderCareerFocus({
  career,
  narrativePersonalization,
}) {
  const careerStyle = String(
    career?.careerStyle || ""
  ).toLowerCase();

  const leadershipStyle = String(
    career?.leadershipStyle || ""
  ).toLowerCase();

  const idealWorkEnvironment = String(
    career?.idealWorkEnvironment || ""
  ).toLowerCase();

  const careerFlavor =
    narrativePersonalization?.careerFlavor || "";

  const profile =
    narrativePersonalization?.profile || "";

  // CONNECTORS
  if (
    careerStyle.includes("connector") ||
    leadershipStyle.includes("influence")
  ) {
    if (profile === "Direct Wealth") {
      return "Your career growth is strongest when communication, visibility and relationship-building are part of your work. You naturally recognise opportunities that can be converted into tangible outcomes, making you well suited to environments where networking, business development, partnerships and execution matter. Progress often accelerates when you position yourself where trust, influence and practical decision-making create measurable results.";
    }

    if (profile === "Indirect Resource") {
      return "Your career growth is strongest when communication, visibility and relationship-building are combined with insight and understanding. You are often able to recognise patterns, motivations and opportunities that others overlook. Progress tends to accelerate when you use your knowledge, observations and relationship awareness to guide decisions, create alignment and influence outcomes.";
    }

    if (profile === "Friend") {
      return "Your career growth is strongest when collaboration, teamwork and long-term relationships are part of your work. You often create value by building trust, strengthening connections and bringing people together around shared goals. Opportunities frequently develop through goodwill, reciprocity and the reputation you build over time.";
    }

    return "Your career growth is strongest when communication, visibility and relationship-building are part of your work. You are naturally suited to environments where opportunities flow through people, trust and collaboration rather than purely technical execution. Progress often accelerates when you allow yourself to be seen, build meaningful connections and position yourself where your influence and judgement can create value.";
  }

  // THINKERS
  if (
    careerStyle.includes("analytical") ||
    leadershipStyle.includes("technical") ||
    idealWorkEnvironment.includes("knowledge")
  ) {
    return "Your career growth is strongest when your thinking, knowledge and problem-solving ability are properly valued. You may do well in environments where analysis, strategy, research or expertise matter more than constant social performance. While preparation is one of your strengths, growth often comes from trusting your knowledge enough to act rather than waiting until everything feels completely certain.";
  }

  // SUPPORTERS
  if (
    careerStyle.includes("support") ||
    leadershipStyle.includes("mentor") ||
    idealWorkEnvironment.includes("service")
  ) {
    return "Your career growth is strongest when your reliability, care and long-term contribution are recognised. You may do well in environments where people value steady support, guidance and practical responsibility. Success often comes from consistently creating value over time rather than chasing rapid progress or short-term recognition.";
  }

  return "Your career growth improves when your work environment allows you to use your natural strengths consistently, while also giving you enough room to grow with clarity and purpose. Sustainable progress tends to come from focusing your energy on opportunities that align with your strengths rather than trying to force growth in every direction at once.";
}

export default renderCareerFocus;