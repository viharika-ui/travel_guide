import { useTranslation } from "react-i18next";

const STEPS = ["step1", "step2", "step3", "step4"];

export default function BookingStepper({ currentStep }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((key, i) => {
        const stepNum = i + 1;
        const active = stepNum === currentStep;
        const done = stepNum < currentStep;
        return (
          <div key={key} className="flex items-center flex-1">
            <div
              className={`flex flex-col items-center flex-1 ${active ? "text-saffron" : done ? "text-green" : "text-slate-400"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold border-2 ${
                  active ? "border-saffron bg-saffron/10" : done ? "border-green bg-green/10" : "border-slate-300"
                }`}
              >
                {done ? "✓" : stepNum}
              </div>
              <span className="mt-1 text-xs font-medium hidden sm:block">{t(`booking.${key}`)}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 ${done ? "bg-green" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
