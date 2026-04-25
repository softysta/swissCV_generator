/**
 * Hook for optimizing CV data for template display
 * Provides Swiss tone conversion and template-specific formatting
 */

import { useMemo } from "react";
import { TCVContent, TTemplateId } from "@/types/cvContent.tye";
import {
  formatDataForTemplate,
  calculateTemplateFitScore,
  getTemplateOptimizationTips,
} from "@/lib/templateFormatter";

export interface UseCVFormattingOptions {
  templateId: "classic" | "modern";
  enableCharacterLimits?: boolean;
  enableTrimming?: boolean;
}

export interface FormattedCVData {
  data: TCVContent;
  fitScore: number;
  optimizationTips: string[];
  isOptimal: boolean;
}

/**
 * Hook to get formatted and optimized CV data for a specific template
 *
 * @example
 * const { data, fitScore, optimizationTips } = useCVFormatting(
 *   cvData,
 *   { templateId: 'classic' }
 * );
 */
export function useCVFormatting(
  cvData: TCVContent | null,
  options: UseCVFormattingOptions
): FormattedCVData {
  return useMemo(() => {
    if (!cvData) {
      return {
        data: {} as TCVContent,
        fitScore: 0,
        optimizationTips: [],
        isOptimal: false,
      };
    }

    const formattedData = formatDataForTemplate(cvData, options.templateId, {
      enableCharacterLimits: options.enableCharacterLimits ?? true,
      enableTrimming: options.enableTrimming ?? true,
    });

    const fitScore = calculateTemplateFitScore(formattedData, options.templateId);
    const optimizationTips = getTemplateOptimizationTips(
      formattedData,
      options.templateId
    );

    return {
      data: formattedData,
      fitScore,
      optimizationTips,
      isOptimal: fitScore >= 85,
    };
  }, [cvData, options.templateId, options.enableCharacterLimits, options.enableTrimming]);
}

/**
 * Standalone function to format CV data without React hook
 * Useful for server-side operations
 */
export function formatCVForTemplate(
  cvData: TCVContent,
  templateId: "classic" | "modern"
): FormattedCVData {
  const formattedData = formatDataForTemplate(cvData, templateId);
  const fitScore = calculateTemplateFitScore(formattedData, templateId);
  const optimizationTips = getTemplateOptimizationTips(formattedData, templateId);

  return {
    data: formattedData,
    fitScore,
    optimizationTips,
    isOptimal: fitScore >= 85,
  };
}
