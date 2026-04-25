# Swiss Tone Conversion & Template Optimization

## Overview

This system ensures that extracted CV data is automatically converted to Swiss professional standards and optimally formatted for each template layout.

## Components

### 1. Swiss Tone Converter (`src/lib/swissToneConverter.ts`)

Converts all CV content to authentic Swiss professional tone characterized by:
- **Conciseness**: Direct, no fluff or unnecessary adjectives
- **Results-oriented**: Focus on accomplishments, not processes
- **Professional precision**: Correct terminology and formal language
- **Competence emphasis**: Clear demonstration of skills and experience

#### Key Functions

```typescript
// Convert professional summary/bio
convertSummaryToSwissTone(summary: string): string

// Convert job position titles
convertRoleToSwissTone(role: string): string

// Convert experience descriptions to bullet points
convertExperienceDescriptionToSwissTone(descriptions: string[]): string[]

// Standardize and clean skills list
convertSkillsToSwissTone(skills: string[], maxSkills?: number): string[]

// Convert interests to professional terms
convertInterestsToSwissTone(interests: string[]): string[]

// Apply all conversions to entire CV data
applySwissToneToCV(cvData: TCVContent): TCVContent
```

#### Example Conversions

```
Input:  "I am very passionate about coding and looking for a role where I can 
         contribute my skills to a dynamic team"

Output: "Specialized in software development with focus on delivering 
         scalable solutions."
```

```
Input:  "Worked on developing the backend for a web application"
Output: "Developed backend infrastructure for web application."
```

### 2. Template Formatter (`src/lib/templateFormatter.ts`)

Optimizes content to fit each template's layout constraints while maintaining Swiss tone.

#### Template-Specific Formatting

**Classic Template**
- Sidebar: 300px width
- Max skills shown: 12
- Max experience bullets: 3 per role
- Max languages: 8
- Summary limit: ~200 characters

**Modern Template**
- Sidebar: 280px width (more constrained)
- Max skills shown: 10
- Max experience bullets: 2 per role (compact)
- Max languages: 6
- Summary limit: ~150 characters

#### Key Functions

```typescript
// Format data for Classic template
formatDataForClassicTemplate(data: TCVContent): TCVContent

// Format data for Modern template
formatDataForModernTemplate(data: TCVContent): TCVContent

// Get formatter for any template
formatDataForTemplate(data: TCVContent, templateId: "classic" | "modern"): TCVContent

// Get layout fit score (0-100)
calculateTemplateFitScore(data: TCVContent, templateId: string): number

// Get optimization recommendations
getTemplateOptimizationTips(data: TCVContent, templateId: string): string[]
```

### 3. Formatting Hook (`src/hooks/useCVFormatting.ts`)

React hook for easy integration with templates.

```typescript
// In your template component
import { useCVFormatting } from '@/hooks/useCVFormatting';

const { data, fitScore, optimizationTips, isOptimal } = useCVFormatting(cvData, {
  templateId: 'classic'
});
```

## How It Works

### Extraction Flow

```
1. User uploads CV (PDF/DOCX)
   ↓
2. Claude API extracts raw data
   ↓
3. Data transformed to TCVContent format
   ↓
4. Swiss Tone Converter applies transformations
   - Removes verbose language
   - Standardizes job titles
   - Condenses descriptions
   - Normalizes skills/interests
   ↓
5. Formatted CV sent to frontend
```

### Template Display Flow

```
1. CV data loaded in frontend
   ↓
2. useCVFormatting hook applies template-specific formatting
   ↓
3. Content trimmed to fit layout constraints
   ↓
4. Template receives optimized data
   ↓
5. User sees perfectly formatted Swiss professional CV
```

## Configuration

### SwissToneConfig

```typescript
interface SwissToneConfig {
  maxSummaryLength?: number;        // Default: 150
  maxDescriptionPoints?: number;    // Default: 3
  condenseFutureContent?: boolean;  // Default: true
}
```

### TemplateFormattingConfig

```typescript
interface TemplateFormattingConfig {
  enableCharacterLimits?: boolean;  // Default: true
  enableTrimming?: boolean;         // Default: true
}
```

## Swiss Tone Rules

### For Summaries/Bios

❌ **Avoid:**
- Emotional language: "passionate", "excited", "love"
- Vague statements: "dynamic", "innovative", "forward-thinking"
- Self-referential: "I am", "my goal is"
- Uncertain: "looking to", "hoping to", "trying to"

✅ **Use:**
- Concrete experience: "8 years in software development"
- Specific competencies: "specialized in React and Node.js"
- Direct language: "Managing teams", "Designing systems"
- Results: "Improved performance by 40%"

### For Position Titles

Convert variations to standard titles:
- "Sr. Engineer" → "Senior Engineer"
- "Junior Developer" → "Developer"
- "Tech Lead" → "Lead Engineer"

### For Experience Descriptions

Format as:
1. Action verb (managed, developed, designed, led)
2. What was done
3. Outcome/scope if relevant

```
❌ "I was responsible for working on the frontend development"
✅ "Developed React components for e-commerce platform."
```

### For Skills

- Remove duplicates and variations
- Order by relevance (technical first)
- Limit to 10-15 most relevant
- Normalize naming

### For Interests

Convert personal interests to professional terms:
- "Coding" → "Software Development"
- "Sports" → "Sports"
- "Traveling" → "International Travel"
- "Volunteering" → "Volunteering"

## Usage Examples

### In Extract API (Automatic)

Already integrated! The extraction endpoint automatically applies Swiss tone.

```typescript
// src/app/api/extract/route.ts
const extractedData = applySwissToneToCV(transformedData);
```

### In Template Components

```typescript
'use client';
import { useCVFormatting } from '@/hooks/useCVFormatting';
import { TCVTemplateProps } from '@/types/cvContent.tye';

export default function ClassicTemplate({ data }: TCVTemplateProps) {
  // Get optimized data for Classic template
  const { data: optimizedData, fitScore, optimizationTips } = useCVFormatting(data, {
    templateId: 'classic'
  });

  return (
    <div>
      {/* Use optimizedData instead of data */}
      <h1>{optimizedData.personalInfo.fullName}</h1>
      {/* ... rest of template */}
    </div>
  );
}
```

### Server-Side Usage

```typescript
import { formatCVForTemplate } from '@/lib/templateFormatter';

const formatted = formatCVForTemplate(cvData, 'modern');
console.log(`Fit Score: ${formatted.fitScore}`);
console.log('Tips:', formatted.optimizationTips);
```

## Fit Score Interpretation

- **90-100**: Excellent fit, no optimization needed
- **75-89**: Good fit, minor adjustments possible
- **60-74**: Fair fit, consider following optimization tips
- **Below 60**: Poor fit, significant changes recommended

### Factors Affecting Fit Score

- Summary length (target: 150-200 chars)
- Number of skills (target: 10-15)
- Number of experiences (target: 4-5)
- Experience description length (target: 200-400 chars)
- Languages listed (target: 6-8)

## Maintenance & Updates

### Adding New Swiss Tone Rules

Edit `src/lib/swissToneConverter.ts`:

```typescript
// Add to convertSummaryToSwissTone function
point = point
  .replace(/your_pattern/gi, "replacement_text")
  .replace(/another_pattern/gi, "another_replacement");
```

### Adjusting Template Limits

Edit `src/lib/templateFormatter.ts`:

```typescript
// For Classic template
skills: config.enableTrimming ? data.skills?.slice(0, 15) : data.skills // Changed from 12
```

### Testing

Run extraction with test CV to verify:
1. Swiss tone applied correctly
2. Content fits template layout
3. No important information lost

## Integration Checklist

- ✅ Swiss tone converter created and integrated
- ✅ Template formatters implemented
- ✅ Extract route updated with Swiss tone conversion
- ✅ useCVFormatting hook provided for component usage
- ✅ CVContext extraction steps updated
- ✅ Documentation complete

## Next Steps for Full Integration

1. Update template components to use `useCVFormatting` hook
2. Add fit score indicator to template preview
3. Show optimization tips to user if score < 85
4. Optional: Add Swiss tone customization UI

## Performance Considerations

- All conversions are memoized in hooks
- Template formatting is O(n) where n = content items
- Fit score calculation is fast (< 1ms)
- No external API calls needed for formatting
