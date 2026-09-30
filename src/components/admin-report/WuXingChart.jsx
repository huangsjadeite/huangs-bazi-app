// Wu Xing (五行) cycle diagram: the five elements on a pentagon in generating
// order, sized by this chart's natal percentage. Solid arrows = generating
// cycle (生), dashed arrows through the middle = controlling cycle (克).

const ELEMENTS = [
  { name: "Fire", zh: "火", color: "#C62828" },
  { name: "Earth", zh: "土", color: "#8D6E63" },
  { name: "Metal", zh: "金", color: "#A67C00" },
  { name: "Water", zh: "水", color: "#1565C0" },
  { name: "Wood", zh: "木", color: "#2E7D32" },
];

const CENTER = { x: 210, y: 200 };
const RADIUS = 135;

function nodePosition(index) {
  const angle = ((-90 + index * 72) * Math.PI) / 180;
  return {
    x: CENTER.x + RADIUS * Math.cos(angle),
    y: CENTER.y + RADIUS * Math.sin(angle),
  };
}

function nodeRadius(pct) {
  return 24 + Math.min(pct, 60) * 0.4;
}

// Line from one node's edge to the other's, leaving room for the arrowhead.
function trimmedLine(from, to, fromR, toR) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: from.x + ux * (fromR + 4),
    y1: from.y + uy * (fromR + 4),
    x2: to.x - ux * (toR + 8),
    y2: to.y - uy * (toR + 8),
  };
}

export default function WuXingChart({ elementalBalance, dayMasterElement, enhanceElements = [] }) {
  const pctByName = Object.fromEntries(
    elementalBalance.map((item) => [item.name, item.natalPercentage || 0])
  );

  const nodes = ELEMENTS.map((element, i) => {
    const pct = pctByName[element.name] || 0;
    return { ...element, pct, r: nodeRadius(pct), ...nodePosition(i) };
  });

  const generating = nodes.map((node, i) => [node, nodes[(i + 1) % 5]]);
  const controlling = nodes.map((node, i) => [node, nodes[(i + 2) % 5]]);

  return (
    <div className="mt-8" style={{ breakInside: "avoid" }}>
      <h3 className="text-xl font-bold text-slate-950">Wu Xing (五行) Chart</h3>
      <p className="mt-2 text-sm text-stone-500">
        How the five elements feed and control each other, sized by the balance in your birth chart.
      </p>

      <div className="mt-4 flex flex-col items-center rounded-2xl border border-slate-200 p-4">
        <svg viewBox="0 0 420 420" className="w-full max-w-[420px]" role="img" aria-label="Wu Xing five element cycle">
          <defs>
            <marker id="wx-arrow-gen" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#57534e" />
            </marker>
            <marker id="wx-arrow-ctl" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#a8a29e" />
            </marker>
          </defs>

          {controlling.map(([from, to]) => (
            <line
              key={`ctl-${from.name}`}
              {...trimmedLine(from, to, from.r, to.r)}
              stroke="#a8a29e"
              strokeWidth="1.5"
              strokeDasharray="5 4"
              markerEnd="url(#wx-arrow-ctl)"
            />
          ))}

          {generating.map(([from, to]) => (
            <line
              key={`gen-${from.name}`}
              {...trimmedLine(from, to, from.r, to.r)}
              stroke="#57534e"
              strokeWidth="2"
              markerEnd="url(#wx-arrow-gen)"
            />
          ))}

          {nodes.map((node) => {
            const isDayMaster = node.name === dayMasterElement;
            const isEnhance = enhanceElements.includes(node.name);
            const tag = isDayMaster ? "Day Master" : isEnhance ? "Enhance" : null;
            const below = node.y > CENTER.y;
            return (
              <g key={node.name}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r}
                  fill={node.color}
                  fillOpacity={isEnhance || isDayMaster ? 1 : 0.8}
                  stroke={isEnhance ? "#16a34a" : isDayMaster ? "#1e293b" : "white"}
                  strokeWidth={isEnhance || isDayMaster ? 4 : 2}
                />
                <text x={node.x} y={node.y - 4} textAnchor="middle" fill="white" fontSize="18" fontWeight="700">
                  {node.zh}
                </text>
                <text x={node.x} y={node.y + 14} textAnchor="middle" fill="white" fontSize="12" fontWeight="600">
                  {Math.round(node.pct)}%
                </text>
                <text
                  x={node.x}
                  y={below ? node.y + node.r + 18 : node.y - node.r - 10}
                  textAnchor="middle"
                  fill="#1e293b"
                  fontSize="13"
                  fontWeight="700"
                >
                  {node.name}
                  {tag ? ` · ${tag}` : ""}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-stone-600">
          <span>⟶ Generates (生)</span>
          <span className="text-stone-400">- - → Controls (克)</span>
          <span><span className="font-bold text-green-700">Green ring</span> = element to enhance</span>
          <span><span className="font-bold text-slate-800">Dark ring</span> = Day Master</span>
        </div>
      </div>
    </div>
  );
}
