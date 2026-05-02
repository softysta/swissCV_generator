# Language Localization for CV Proficiency Levels

## Overview

The CV Generator now automatically detects the CV's language and displays language proficiency levels in that same language, rather than always using English labels like "Fluent" or "Native".

## How It Works

### 1. **Language Detection** (`src/lib/languageLocalization.ts`)
When the review page loads with extracted CV data, the system automatically detects the CV's language by analyzing:
- Professional summary
- Job titles
- Experience descriptions
- Education degrees

The detection engine uses keyword matching for: French, German, Italian, Spanish, and Portuguese.

### 2. **Proficiency Level Translations**
The system includes translations for language proficiency levels:

| Level | English | French | German | Italian | Spanish | Portuguese |
|-------|---------|--------|--------|---------|---------|------------|
| Native | Native | Langue maternelle | Muttersprache | Madrelingua | Nativo | Nativo |
| Fluent | Fluent | Niveau professionnel | Fließend | Fluente | Fluido | Fluente |
| Intermediate | Intermediate | Intermédiaire | Mittelstufe | Intermedio | Intermedio | Intermediário |
| Basic | Basic | Niveau débutant | Grundlagen | Base | Básico | Básico |

### 3. **Automatic Conversion**
When data is loaded in the review page:
1. CV language is detected from the content
2. Language proficiency labels are converted to match the CV's language
3. FormSelectLanguage component displays localized proficiency options
4. Users add languages with proficiency levels in the CV's language

## Component Changes

### Modified Files

#### `src/lib/languageLocalization.ts` (NEW)
- `detectCVLanguage()` - Detects language from CV content
- `detectLanguageFromText()` - Analyzes text for language indicators
- `getLocalizedProficiency()` - Gets translated proficiency label
- `convertProficiencyToLanguage()` - Converts English labels to target language
- `getAllProficienciesInLanguage()` - Gets all proficiency options in a language

#### `src/store/CVContext.tsx` (UPDATED)
Added:
- `cvLanguage: TLanguageCode` - Stores detected CV language
- `setCVLanguage: (language: TLanguageCode) => void` - Updates CV language

#### `src/app/(home)/review/_components/FormSelectLanguage.tsx` (UPDATED)
- Gets CV language from context
- Displays proficiency options in the CV's language
- Converts default proficiency based on language

#### `src/app/(home)/review/page.tsx` (UPDATED)
- Detects CV language on data load
- Converts existing proficiency labels to the detected language
- Sets language in context for FormSelectLanguage to use

## Example Flow

**Input CV in French:**
```
Summary: "Comptable avec plus de 15 ans d'expérience..."
Experience: "Supervisé la gestion des bilans..."
```

**Detection Process:**
1. System detects French keywords: "avec", "plus", "ans", "expérience"
2. Determines language = "fr"
3. Sets proficiency options to French

**Form Display:**
```
Languages dropdown shows:
- Langue maternelle
- Niveau professionnel
- Intermédiaire
- Niveau débutant
```

Instead of English: Native, Fluent, Intermediate, Basic

## Supported Languages

- 🇬🇧 English (en)
- 🇫🇷 French (fr)
- 🇩🇪 German (de)
- 🇮🇹 Italian (it)
- 🇪🇸 Spanish (es)
- 🇵🇹 Portuguese (pt)

## Technical Implementation

### Type Definitions
```typescript
type TLanguageCode = "en" | "fr" | "de" | "it" | "es" | "pt";
type TProficiencyLevel = "Native" | "Fluent" | "Intermediate" | "Basic";
```

### Language Detection Algorithm
1. Scans CV content for language-specific patterns
2. Counts keyword matches for each language
3. Returns language with highest match score
4. Defaults to English if no strong match (score > 5)

### Proficiency Conversion
- Maps English proficiency levels to localized versions
- Falls back gracefully if proficiency is in unexpected format
- Preserves original proficiency if translation not found

## No Manual Configuration Needed

The system works automatically:
- ✅ No user selection of document language
- ✅ No manual proficiency level conversion
- ✅ Language detected from content on data load
- ✅ Proficiency labels update in real-time

## Future Enhancements

Possible additions:
- Language selector UI for manual override
- Additional languages (Dutch, Swedish, etc.)
- More sophisticated language detection (ML-based)
- Per-language CV formatting rules
- Proficiency level customization per language
