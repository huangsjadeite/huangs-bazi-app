export function renderWealthFocus({
  wealth,
  narrativePersonalization,
}) {
  const incomeStyle = String(
    wealth?.incomeStyle || ""
  ).toLowerCase();

  const wealthBehaviour = String(
    wealth?.wealthBehaviour || ""
  ).toLowerCase();

  const moneyMindset = String(
    wealth?.moneyMindset || ""
  ).toLowerCase();

  const wealthFlavor =
    narrativePersonalization?.wealthFlavor || "";

  const profile =
    narrativePersonalization?.profile || "";

  // NETWORK / RELATIONSHIP WEALTH
  if (
    incomeStyle.includes("network") ||
    wealthBehaviour.includes("relationship")
  ) {
    if (profile === "Direct Wealth") {
      return "Your wealth pattern is closely linked to trust, reputation and the relationships you build over time. Financial opportunities often come through people, visibility and strategic positioning rather than purely individual effort. You are naturally inclined to recognise opportunities that can be converted into tangible results, making networking, business development and practical execution important parts of your financial growth. Wealth tends to increase when strong relationships are supported by disciplined follow-through and clear decision-making.";
    }

    if (profile === "Indirect Resource") {
      return "Your wealth pattern is closely linked to trust, reputation and the relationships you build over time. Financial opportunities often emerge through insight, understanding and the ability to recognise value before it becomes obvious to others. You may create wealth by combining relationship awareness, knowledge and long-term positioning. Financial growth tends to strengthen when your understanding, credibility and reputation become recognised assets.";
    }

    if (profile === "Friend") {
      return "Your wealth pattern is closely linked to trust, goodwill and the strength of your relationships. Financial opportunities often develop through collaboration, reciprocity and the support of people who value your contribution. Wealth tends to grow when strong relationships are nurtured consistently over time and when opportunities are approached with mutual benefit in mind.";
    }

    return "Your wealth pattern is closely linked to trust, reputation and the relationships you build over time. Financial opportunities often come through people, visibility and strategic positioning rather than purely individual effort. Wealth tends to grow when you invest in meaningful connections, maintain credibility and place yourself where opportunities can naturally find you. One of the biggest lessons is recognising that relationships are not separate from financial growth—they are often part of the same ecosystem.";
  }

  // KNOWLEDGE / EXPERTISE
  if (
    incomeStyle.includes("expertise") ||
    wealthBehaviour.includes("knowledge") ||
    moneyMindset.includes("knowledge")
  ) {
    return "Your wealth pattern grows through knowledge, skill and recognised expertise. The more you develop something that people trust you for, the easier it becomes to create stable and meaningful income. Financial progress often accelerates when you stop waiting to feel completely ready and begin sharing, applying or monetising what you already know. Expertise creates value most effectively when it is visible and consistently applied.";
  }

  // STABILITY / SERVICE
  if (
    incomeStyle.includes("service") ||
    wealthBehaviour.includes("security") ||
    moneyMindset.includes("security")
  ) {
    return "Your wealth pattern improves through consistency, reliability and long-term planning. Rather than chasing fast gains, your financial strength grows when you build trust, create dependable value and make steady decisions over time. Progress may feel slower at times, but strong foundations often create greater resilience and stability than short bursts of success. Wealth is built by protecting and strengthening what already works.";
  }

  // STRUCTURE / SYSTEMS
  if (
    incomeStyle.includes("structure") ||
    wealthBehaviour.includes("structure") ||
    wealthBehaviour.includes("system")
  ) {
    return "Your wealth pattern strengthens when systems, discipline and long-term planning are in place. Financial growth often comes from creating repeatable processes, clear structures and habits that continue producing results over time. Rather than relying on motivation alone, your success tends to increase when good decisions become part of a consistent framework.";
  }

  return `Your wealth pattern improves when your financial choices are steady, intentional and aligned with your long-term direction. Sustainable wealth is usually created when your decisions support both present opportunities and future stability.${
    wealthFlavor
      ? ` Your strongest financial advantage comes through ${wealthFlavor.toLowerCase()}.`
      : ""
  }`;
}

export default renderWealthFocus;