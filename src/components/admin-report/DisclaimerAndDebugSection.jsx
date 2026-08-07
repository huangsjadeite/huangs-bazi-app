export default function DisclaimerAndDebugSection({ report }) {
  return (
    <>
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
    </>
  );
}
