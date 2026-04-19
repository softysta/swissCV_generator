'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Lightbulb, FileText, Copy } from 'lucide-react';

const steps = [
  { id: 1, label: 'UPLOAD CV', path: '/', icon: Home },
  { id: 2, label: 'AI EXTRACTION', path: '/extraction', icon: Lightbulb },
  { id: 3, label: 'REVIEW & EDIT', path: '/review', icon: FileText },
  { id: 4, label: 'GENERATE PDF', path: '/generate', icon: Copy },
];

export function StepsIndicator() {
  const pathname = usePathname();

  // Determine current step based on pathname
  const getCurrentStep = () => {
    const step = steps.find((s) => s.path === pathname);
    return step?.id || 1;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="w-full py-2.5 sm:py-3 md:py-4 bg-zinc-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex justify-between items-center gap-1 sm:gap-2 md:gap-3">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            const isClickable = step.id <= currentStep;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex items-center flex-1">
                {/* Connector Line */}
                {index > 0 && (
                  <div
                    className={`h-1 flex-1 mx-0.5 sm:mx-1 md:mx-1.5 transition-colors ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-zinc-300'
                    }`}
                  />
                )}

                {/* Step Box */}
                <Link
                  href={isClickable ? step.path : '#'}
                  className="flex flex-col items-center shrink-0"
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center transition-colors shrink-0 ${isActive
                        ? 'bg-[#003FB1] text-white'
                        : isCompleted
                          ? 'bg-green-100 text-green-600'
                          : 'bg-[#E1E8FD] text-[#003FB1]'
                    } ${isClickable ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed'}`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </div>
                  {/* Label */}
                  <span
                    className={`text-xs md:text-sm font-bold whitespace-nowrap tracking-tight md:tracking-normal mt-1 md:mt-1.5 text-center leading-tight ${isActive
                        ? 'text-[#003FB1]'
                        : isCompleted
                          ? 'text-green-600'
                          : 'text-zinc-600'
                    }`}
                  >
                    {step.label}
                  </span>
                </Link>

                {/* Connector Line After (only add if not last step) */}
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-0.5 sm:mx-1 md:mx-1.5 transition-colors ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-zinc-300'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
