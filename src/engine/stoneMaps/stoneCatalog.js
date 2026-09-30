// src/engine/stoneMaps/stoneCatalog.js
//
// Owner's stone list per element (2026-09-30), plus the shop's White, Lavender
// and Blue Jadeite. `areas` are the life areas a stone supports; the report
// features the stones whose areas match the client's focus areas, so the list
// order only breaks ties. Messages address the client as "you".

const CAREER = "CAREER";
const WEALTH = "WEALTH";
const RELATIONSHIP = "RELATIONSHIP";
const WELLNESS = "WELLNESS";

const stone = (name, type, areas, message) => ({ name, type, areas, message });

export const STONE_CATALOG = {
  Wood: [
    stone("Emerald", "Gemstone", [RELATIONSHIP, WEALTH, WELLNESS], "Supports loyalty, heart-centred growth and lasting harmony, helping your relationships and personal progress grow together."),
    stone("Green Jadeite", "Jadeite", [WEALTH, WELLNESS, CAREER], "Supports steady growth, renewal and good fortune, a classic choice when you want progress that stays grounded."),
    stone("Green Serpentine", "Crystal", [WELLNESS], "Supports calm renewal and inner balance, helping you recover your energy after demanding periods."),
    stone("Green Fluorite", "Crystal", [CAREER, WELLNESS], "Supports focus, clear thinking and a tidy mind, useful when you need to learn quickly or sort through a busy workload."),
    stone("Green Aventurine", "Crystal", [WEALTH, CAREER], "Supports optimism, fresh starts and openness to opportunity, helping you try something new with more confidence."),
    stone("Green Nephrite", "Jade", [WELLNESS, RELATIONSHIP], "Supports peace, patience and gentle protection, helping you stay steady and kind under everyday pressure."),
    stone("Green Malachite", "Crystal", [CAREER, WELLNESS], "Supports transformation and protection, helping you move past habits or situations that no longer fit you."),
    stone("Green Moldavite", "Crystal", [CAREER], "Supports bold change and new direction, for when you are ready for a real step forward in your path."),
    stone("Green Zircon", "Gemstone", [WEALTH, CAREER], "Supports prosperity and growing ambition, helping you turn fresh ideas into steady gains."),
    stone("Green Phantom Quartz", "Crystal", [WEALTH, CAREER], "Supports growth in layers, a traditional wealth crystal for building your career and income step by step."),
    stone("Green Diamond", "Gemstone", [WEALTH, RELATIONSHIP], "Supports rare, lasting growth and abundance, a strong statement piece for your long-term goals."),
    stone("Chrysoprase", "Crystal", [RELATIONSHIP, WELLNESS], "Supports forgiveness, hope and emotional lightness, helping you let go of old hurts and open up again."),
    stone("Green Tourmaline", "Gemstone", [WELLNESS, WEALTH], "Supports vitality and steady growth, helping you feel refreshed and keep your plans moving."),
  ],

  Fire: [
    stone("Ruby", "Gemstone", [CAREER, RELATIONSHIP], "Supports passion, vitality and bold self-belief, helping you lead with courage and presence."),
    stone("Red Jadeite", "Jadeite", [CAREER, WELLNESS], "Supports warmth, vitality and a confident presence, helping you put yourself forward with energy."),
    stone("Lavender Jadeite", "Jadeite", [RELATIONSHIP, WELLNESS], "Supports gentle charm, compassion and calm, bringing warmth to your connections without overexposure."),
    stone("Red Garnet", "Gemstone", [RELATIONSHIP, CAREER], "Supports passion, commitment and steady motivation, helping you follow through on what matters to you."),
    stone("Red Spinel", "Gemstone", [WELLNESS, CAREER], "Supports renewed energy and resilience, helping you rebuild momentum after a tiring stretch."),
    stone("Red Tourmaline", "Gemstone", [RELATIONSHIP, WELLNESS], "Supports warmth, courage in love and emotional strength, helping you open your heart with confidence."),
    stone("Red Beryl", "Gemstone", [CAREER], "Supports vision, drive and standing out, a rare stone for when you want your work to be noticed."),
    stone("Red Cinnabar", "Crystal", [WEALTH, WELLNESS], "A traditional protective and wealth-attracting stone in Chinese custom, helping you guard what you have built."),
    stone("Red Zircon", "Gemstone", [WEALTH, CAREER], "Supports ambition and prosperity, adding confident energy to your money and career moves."),
    stone("Sunstone", "Crystal", [CAREER, WEALTH], "Supports optimism, leadership and personal warmth, helping you step into visible roles and attract opportunity."),
    stone("Carnelian", "Crystal", [CAREER, WELLNESS], "Supports motivation, courage and creative drive, helping you take action instead of waiting."),
    stone("Fire Opal", "Gemstone", [CAREER, RELATIONSHIP], "Supports creativity, enthusiasm and self-expression, helping your ideas and personality shine."),
    stone("Red Jasper", "Crystal", [WELLNESS], "Supports stamina, endurance and steady action, helping you keep going through long or demanding stretches."),
    stone("Amethyst", "Crystal", [WELLNESS], "Supports calm, intuition and restful sleep, helping you slow down and avoid impulsive reactions."),
    stone("Pink Charoite", "Crystal", [WELLNESS, RELATIONSHIP], "Supports emotional release and inner calm, helping you let go of worry and connect more openly."),
    stone("Purple Spinel", "Gemstone", [WELLNESS], "Supports calm renewal and spiritual balance, helping you recharge when you feel drained."),
    stone("Purple Zircon", "Gemstone", [WELLNESS, CAREER], "Supports wisdom and calm confidence, helping you make decisions from a settled mind."),
    stone("Purple Fluorite", "Crystal", [CAREER, WELLNESS], "Supports focus, intuition and mental order, helping you think clearly when things feel scattered."),
    stone("Pink Kunzite", "Gemstone", [RELATIONSHIP], "Supports tenderness, unconditional love and emotional openness, softening your relationships."),
    stone("Purple Sapphire", "Gemstone", [CAREER, WELLNESS], "Supports wisdom, dignity and calm focus, helping you lead with quiet authority."),
    stone("Ametrine", "Crystal", [WEALTH, WELLNESS], "Blends calm with optimism, helping you pursue prosperity while keeping a clear, balanced mind."),
    stone("Purple Garnet", "Gemstone", [RELATIONSHIP, WELLNESS], "Supports warmth, devotion and emotional steadiness, helping your closest bonds feel secure."),
    stone("Copper Rutilated Quartz", "Crystal", [WEALTH, CAREER], "Supports energy, drive and wealth attraction, helping you push your plans and income forward."),
    stone("Super 7 Quartz", "Crystal", [WELLNESS], "Supports overall balance and renewal, a gentle all-round stone for your wellbeing."),
    stone("Rose Quartz", "Crystal", [RELATIONSHIP], "Supports love, self-worth and gentle connection, the classic stone for your relationship luck."),
    stone("Strawberry Quartz", "Crystal", [RELATIONSHIP, WELLNESS], "Supports joy, affection and a lighter heart, helping you enjoy your connections more."),
    stone("Rhodonite", "Crystal", [RELATIONSHIP, WELLNESS], "Supports emotional healing and compassion, helping you mend relationships and treat yourself kindly."),
    stone("Morganite", "Gemstone", [RELATIONSHIP], "Supports softness, heart-opening and emotional healing, bringing more warmth to your relationships."),
    stone("Pink Tourmaline", "Gemstone", [RELATIONSHIP], "Supports love, kindness and emotional safety, helping you give and receive affection more easily."),
    stone("Pink Sapphire", "Gemstone", [RELATIONSHIP, CAREER], "Supports grace, resilience and loving confidence, helping you be warm without losing your standards."),
    stone("Pink Spinel", "Gemstone", [RELATIONSHIP], "Supports warmth, hope and renewed affection, helping you open up after disappointment."),
    stone("Pink Topaz", "Gemstone", [RELATIONSHIP], "Supports charm, sincerity and a warm first impression, helping you attract the right people."),
    stone("Pink Zircon", "Gemstone", [RELATIONSHIP, WEALTH], "Supports attraction and good fortune, adding warmth to your relationships and social opportunities."),
    stone("Coral", "Gemstone", [WELLNESS, RELATIONSHIP], "A traditional protective stone that supports vitality and harmony, helping you feel strong and well supported."),
    stone("Conch Pearl", "Gemstone", [RELATIONSHIP, WEALTH], "Supports grace, prosperity and harmonious relationships, a rare piece for your long-term fortune."),
    stone("Pink Opal", "Gemstone", [RELATIONSHIP, WELLNESS], "Supports gentleness and emotional calm, helping you feel soothed and open to love."),
    stone("Pink Agate (Sakura Agate)", "Crystal", [RELATIONSHIP, WELLNESS], "Supports new beginnings, gentleness and emotional balance, helping you welcome fresh connections."),
    stone("Rubellite", "Gemstone", [RELATIONSHIP], "Supports passion and devoted love, helping you express your feelings with confidence."),
    stone("Pink Diamond", "Gemstone", [RELATIONSHIP, WEALTH], "Supports lasting love and rare good fortune, a meaningful piece for your most important commitments."),
  ],

  Earth: [
    stone("Citrine", "Crystal", [WEALTH], "Known as the merchant's stone, it supports confidence, optimism and wealth attraction, helping you notice and act on opportunities."),
    stone("Yellow Jadeite", "Jadeite", [WEALTH, WELLNESS], "Supports stability, abundance and practical wisdom, a steady daily support for reliable progress."),
    stone("Orange Jadeite", "Jadeite", [CAREER, RELATIONSHIP], "Supports warmth, joy and creative confidence, helping you connect easily and share your ideas."),
    stone("Brown Jadeite", "Jadeite", [WELLNESS], "Supports grounding, patience and inner security, helping you feel settled and build on firm foundations."),
    stone("Yellow Sapphire", "Gemstone", [WEALTH, CAREER], "Supports prosperity, wisdom and good judgement, helping you build long-term wealth with sound decisions."),
    stone("Yellow Spinel", "Gemstone", [CAREER, WEALTH], "Supports confidence and steady ambition, helping you back yourself in work and money decisions."),
    stone("Yellow Topaz", "Gemstone", [WEALTH, CAREER], "Supports clear goals, generosity and self-confidence, helping you attract the support to reach your targets."),
    stone("Yellow Chalcedony", "Crystal", [RELATIONSHIP, WELLNESS], "Supports calm warmth and kind communication, helping you keep harmony with the people around you."),
    stone("Yellow Jasper (Bumblebee Jasper)", "Crystal", [WELLNESS, CAREER], "Supports steadiness, confidence and clear thinking, helping you handle practical responsibilities calmly."),
    stone("Amber", "Gemstone", [WELLNESS], "Supports warmth, comfort and a sunny outlook, helping you feel protected and at ease."),
    stone("Yellow Apatite", "Crystal", [WELLNESS, CAREER], "Supports motivation and healthy routines, helping you stay disciplined with your goals."),
    stone("Yellow Rutilated Quartz", "Crystal", [WEALTH], "A traditional wealth crystal that supports prosperity and drive, helping you grow and hold on to your income."),
    stone("Yellow Zircon", "Gemstone", [WEALTH], "Supports abundance and confident choices, helping you make the most of money opportunities."),
    stone("Realgar", "Crystal", [WELLNESS], "A traditional protective stone in Chinese custom, used to ward off negative energy around you."),
    stone("Yellow Tiger Eye Quartz", "Crystal", [CAREER, WEALTH], "Supports courage, focus and practical judgement, helping you make decisions with confidence and control."),
    stone("Yellow Diamond", "Gemstone", [WEALTH, CAREER], "Supports success, confidence and lasting prosperity, a strong piece for your wealth and status goals."),
  ],

  Metal: [
    stone("Diamond", "Gemstone", [RELATIONSHIP, CAREER], "Supports commitment, confidence and high standards, helping you keep a strong sense of direction and self-worth."),
    stone("White Jadeite", "Jadeite", [CAREER, RELATIONSHIP, WELLNESS], "Supports calm confidence, clean decisions and a good reputation, a balanced daily support that never feels forceful."),
    stone("Clear Quartz", "Crystal", [CAREER, WELLNESS], "Supports focus, intention and mental clarity, a versatile stone that strengthens the direction you choose."),
    stone("White Topaz", "Gemstone", [CAREER], "Supports clarity, truth and clear goals, helping you see your next step and act on it."),
    stone("White Sapphire", "Gemstone", [CAREER], "Supports clarity, integrity and clear boundaries, helping you make principled decisions under pressure."),
    stone("Howlite", "Crystal", [WELLNESS], "Supports calm, patience and restful sleep, helping you quiet a busy mind."),
    stone("White Agate", "Crystal", [WELLNESS, RELATIONSHIP], "Supports balance, gentleness and emotional stability, helping you stay composed with others."),
    stone("White Zircon", "Gemstone", [CAREER, WEALTH], "Supports clarity and confident ambition, helping you present yourself well and seize good opportunities."),
    stone("White Phantom Quartz", "Crystal", [CAREER, WELLNESS], "Supports clarity and personal growth in layers, helping you move past old limits step by step."),
  ],

  Water: [
    stone("Blue Sapphire", "Gemstone", [CAREER], "Supports wisdom, focus and disciplined thinking, helping you make sound long-term decisions."),
    stone("Blue Tanzanite", "Gemstone", [CAREER, RELATIONSHIP], "Supports insight and heartfelt communication, helping you speak from both the head and the heart."),
    stone("Blue Topaz", "Gemstone", [RELATIONSHIP, CAREER], "Supports clear, calm communication, helping you express yourself honestly and be understood."),
    stone("Blue Kyanite", "Crystal", [RELATIONSHIP, WELLNESS], "Supports alignment and calm communication, helping you stay centred in difficult conversations."),
    stone("Aquamarine", "Gemstone", [RELATIONSHIP, WELLNESS], "Supports calm communication, emotional flow and trust, helping you express yourself without becoming defensive."),
    stone("Lapis Lazuli", "Crystal", [CAREER], "Supports wisdom and clear self-expression, helping you speak with authority and inner truth."),
    stone("Blue Zircon", "Gemstone", [WEALTH, CAREER], "Supports prosperity and wise choices, helping your money and career decisions flow more smoothly."),
    stone("Blue Chalcedony", "Crystal", [RELATIONSHIP, WELLNESS], "Supports calm, kind words and emotional ease, helping you communicate gently in close relationships."),
    stone("Larimar", "Crystal", [WELLNESS, RELATIONSHIP], "Supports peace, calm and emotional ease, helping you let go of stress and soften tension."),
    stone("Turquoise", "Crystal", [WELLNESS, CAREER], "A traditional protective stone for travel and new ventures, helping you move forward safely and with confidence."),
    stone("Blue Apatite", "Crystal", [CAREER], "Supports motivation, learning and clear goals, helping you stay driven and keep developing your skills."),
    stone("Blue Kunzite", "Gemstone", [RELATIONSHIP, WELLNESS], "Supports calm love and emotional openness, helping you feel peaceful in your connections."),
    stone("Blue Tourmaline", "Gemstone", [RELATIONSHIP, CAREER], "Supports honest communication and tolerance, helping you speak your mind and understand others."),
    stone("Labradorite", "Crystal", [CAREER, WELLNESS], "Supports intuition, protection and transformation, helping you trust your instincts through change."),
    stone("Black Jadeite", "Jadeite", [WELLNESS, CAREER], "Supports grounding, protection and emotional steadiness, helping you stay less affected by outside pressure."),
    stone("Blue Jadeite", "Jadeite", [RELATIONSHIP, CAREER], "Supports communication, emotional flow and calm expression, helping you connect gently and stay composed."),
    stone("Bluish-Green Jadeite", "Jadeite", [WEALTH, WELLNESS], "Supports calm flow and steady prosperity, helping your plans and finances move forward smoothly."),
    stone("Onyx", "Crystal", [CAREER, WELLNESS], "Supports strength, self-control and resilience, helping you stay firm when things get demanding."),
    stone("Black Obsidian", "Crystal", [WELLNESS], "Supports protection, grounding and firm energetic boundaries, helping you cut through emotional noise."),
    stone("Hypersthene", "Crystal", [WELLNESS, CAREER], "Supports calm, clear thinking and self-trust, helping you settle an overactive mind."),
    stone("Black Tourmaline", "Gemstone", [WELLNESS], "A strong protective stone that supports grounding, helping you shield yourself from stress and negative energy."),
    stone("Black Diamond", "Gemstone", [CAREER], "Supports inner strength, determination and power, helping you hold your ground and lead."),
    stone("Black Sapphire", "Gemstone", [WEALTH, CAREER], "Supports protection of wealth and steady focus, helping you keep hold of what you earn."),
    stone("Shungite", "Crystal", [WELLNESS], "Supports cleansing and grounding, helping you reset when you feel drained or overloaded."),
    stone("Black Opal", "Gemstone", [CAREER, RELATIONSHIP], "Supports creativity, confidence and charisma, helping you make a strong and memorable impression."),
    stone("Black Moissanite", "Gemstone", [CAREER], "Supports confidence and inner strength, helping you stand firm and be noticed."),
    stone("Black Agate", "Crystal", [WELLNESS, WEALTH], "Supports stability, courage and protection, helping you feel secure and keep your resources safe."),
    stone("Black Rutilated Quartz", "Crystal", [WELLNESS, CAREER], "Supports protection and determination, helping you push through obstacles with resilience."),
    stone("Blue Diamond", "Gemstone", [CAREER, WEALTH], "Supports clarity, calm confidence and lasting success, a rare piece for your biggest goals."),
    stone("Moonstone", "Crystal", [RELATIONSHIP, WELLNESS], "Supports intuition, emotional softness and smoother connection, helping you stay receptive without losing your centre."),
  ],
};

export const FOCUS_AREA_LABELS = {
  CAREER: "career",
  WEALTH: "wealth",
  RELATIONSHIP: "relationships",
  WELLNESS: "wellness",
};
