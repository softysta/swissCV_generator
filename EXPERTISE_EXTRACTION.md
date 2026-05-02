# Expertise Extraction Improvement

## Overview

The CV extraction system has been enhanced to intelligently capture expertise areas from work experience descriptions in the **original CV language**. Expertise labels are automatically translated to match the detected CV language (English, French, German, Italian, Spanish, or Portuguese).

## Problem Solved

Previously:
- Expertise section could be empty even with clear specialization
- All expertise labels were forced to English regardless of CV language

Now:
- Actively identifies and extracts expertise from job descriptions
- Returns expertise labels in the **same language as the CV**
- Supports 6 languages with full translations
- Expertise section never empty if specialization is evident

## How It Works

### 1. **Language Detection**
- When CV data is extracted, the system analyzes content (summary, titles, descriptions)
- Detects language: English, French, German, Italian, Spanish, or Portuguese
- Example: French keywords like "expérience", "gestion", "comptabilité" → Language = FR

### 2. **Enhanced Claude Prompt** (`src/app/api/extract/route.ts`)
The extraction prompt explicitly instructs Claude to:
- Extract expertise from job descriptions, titles, and achievements
- Identify evidence of mastery or specialization
- Combine certifications with job experience to identify expertise areas
- **Not leave expertise empty** if the CV shows clear specialization

**Example guidance in prompt:**
```
- If a CV has 'Financial Analyst' role with 5+ years and descriptions mention 
  budgeting, forecasting, compliance → include 'Financial Analysis' as expertise
- If job descriptions mention 'managed team of 10+', 'led project' → include 
  'Team Leadership' or 'Project Management'
```

### 3. **Multilingual Expertise Extraction Library** (`src/lib/expertiseExtraction.ts`)

#### `extractExpertiseFromExperiences(language)`
Analyzes work experience descriptions for evidence of specialization in 14 domains.
Returns expertise **labels in the detected CV language**:
- **Management**: Team leadership, project oversight, supervision
- **Architecture**: System design, architectural decisions
- **Financial**: Accounting, budgeting, compliance, financial management
- **Marketing**: Brand strategy, campaigns, digital marketing
- **Technical**: Software development, engineering, infrastructure
- **Sales**: Revenue management, business development
- **Analysis**: Data analysis, business intelligence, forecasting
- **Operations**: Process management, efficiency, logistics
- **Consulting**: Strategic advisory, optimization
- **Documentation**: Technical writing, knowledge management
- **Training**: Mentoring, coaching, employee development
- **Compliance**: Governance, regulatory compliance
- **Security**: Cybersecurity, data protection
- **Database**: Database management, query optimization
**Multilingual Translations:**

| Domain | English | French | German | Italian | Spanish | Portuguese |
|--------|---------|--------|--------|---------|---------|------------|
| Management | Team & Project Management | Gestion d'équipe et de projet | Team- und Projektmanagement | Gestione del team e dei progetti | Gestión de equipos y proyectos | Gestão de equipes e projetos |
| Financial | Financial Management & Accounting | Gestion financière et comptabilité | Finanzmanagement und Buchhaltung | Gestione finanziaria e contabilità | Gestión financiera y contabilidad | Gestão financeira e contabilidade |
| Technical | Software Development & Engineering | Développement et ingénierie logicielle | Softwareentwicklung und Engineering | Sviluppo software e ingegneria | Desarrollo de software e ingeniería | Desenvolvimento de software e engenharia |
| Marketing | Marketing & Brand Strategy | Stratégie marketing et marque | Marketing und Markenstrategie | Strategia di marketing e branding | Estrategia de marketing y marca | Estratégia de marketing e marca |
| Security | Cybersecurity & Data Protection | Cybersécurité et protection des données | Cybersicherheit und Datenschutz | Cybersecurity e protezione dei dati | Ciberseguridad y protección de datos | Cibersegurança e proteção de dados |
| Sales | Sales & Business Development | Ventes et développement commercial | Vertrieb und Geschäftsentwicklung | Vendite e sviluppo commerciale | Ventas y desarrollo comercial | Vendas e desenvolvimento comercial |
| Analysis | Data Analysis & Business Intelligence | Analyse de données et intelligence d'affaires | Datenanalyse und Business Intelligence | Analisi dei dati e business intelligence | Análisis de datos e inteligencia empresarial | Análise de dados e inteligência de negócios |
| *... and 7 more* | | | | | | |
#### `extractSpecializedKeywords()`
Identifies granular expertise areas from technical and industry keywords:
- Technical: React, Node.js, Python, Java, Docker, Kubernetes, CI/CD, etc.
- Industry: Fintech, blockchain, e-commerce, SaaS, mobile-first, etc.

#### `mergeExpertise()`
Intelligently combines expertise from multiple sources with:
- Deduplication (case-insensitive)
- Removal of duplicates and empty values
- Prioritization of meaningful domains

### 3. **Integration in Extraction Flow**

```
1. Claude API extracts raw CV data
   ↓
2. Detect CV language from content
   ↓
3. Transform Claude response to TCVContent format
   ↓
4. Extract expertise from three sources IN DETECTED LANGUAGE:
   a) Direct extraction from Claude
   b) Certifications
   c) Inferred from job descriptions using pattern matching
   d) Specialized keywords from technical mentions
   ↓
5. Merge all expertise with intelligent deduplication
   ↓
6. Apply Swiss tone conversion to all content
   ↓
7. Return enriched CV data with expertise in original language
```

## Examples

### Example 1: French Financial Professional ✨
**Input CV (French):**
```
Position: Analyste Financier Senior
Company: Finance Global Inc
Description: Géré les budgets annuels de $2M+, réalisé des prévisions 
trimestrielles, assuré la conformité fiscale, optimisé l'allocation 
de portefeuille, dirigé l'équipe financière.
```

**Expertise Extracted (French):**
- Gestion financière et comptabilité
- Gestion d'équipe et de projet
- Analyse de données et intelligence d'affaires

### Example 2: German Tech Manager ✨
**Input CV (German):**
```
Position: Tech Lead / Engineering Manager
Company: TechCorp
Description: Architektur von Microservices mit Docker/Kubernetes, 
Leitung eines 8-köpfigen Ingenieursteams, CI/CD-Pipeline implementiert, 
Junior-Entwickler betreut.
```

**Expertise Extracted (German):**
- Systemarchitektur und Design
- Team- und Projektmanagement
- Softwareentwicklung und Engineering
- Schulung und Mentoring

### Example 3: Italian Marketing Manager ✨
**Input CV (Italian):**
```
Position: Responsabile Marketing
Description: Sviluppato strategia di marca, lanciato campagne 
multi-canale, gestito SEO/SEM, coordinato con agenzie, aumentato 
quota di mercato del 30%.
```

**Expertise Extracted (Italian):**
- Strategia di marketing e branding
- Analisi dei dati e business intelligence

## Key Features

✅ **Multilingual** - Expertise labels in original CV language (EN, FR, DE, IT, ES, PT)
✅ **Automatic Detection** - No manual intervention needed
✅ **Multi-Source Analysis** - Extracts from descriptions, titles, certifications, keywords
✅ **Intelligent Deduplication** - Case-insensitive matching, removes redundancy
✅ **Domain Recognition** - 14 specialized business/technical domains
✅ **Keyword Extraction** - Captures specific technologies and methodologies
✅ **Fallback Logic** - Even if Claude misses expertise, patterns catch it
✅ **Non-Breaking** - Seamlessly integrates with existing extraction pipeline

## Technical Implementation

### Pattern Matching
Uses regex patterns to identify expertise indicators:
```typescript
management: /\b(led|managed|directed|oversaw|supervised|headed|managed team|team lead|leadership|managed group)\b/gi,
architecture: /\b(architected|designed system|system design|architecture|architectural|solution architect)\b/gi,
// ... 12 more domain patterns
```

### Keyword Extraction
Identifies specific technologies and methodologies:
```typescript
techKeywords: /\b(react|nodejs|python|java|typescript|...|ci\/cd)\b/gi,
industryKeywords: /\b(fintech|blockchain|e-commerce|saas|...|accessibility)\b/gi,
```

### Deduplication Algorithm
- Maps all expertise to lowercase for comparison
- Keeps first occurrence (original case)
- Removes true duplicates while preserving formatting

## Files Modified

1. **`src/lib/expertiseExtraction.ts`** (UPDATED - Now Multilingual)
   - `extractExpertiseFromExperiences(experiences, language)` - Now accepts language parameter
   - `extractSpecializedKeywords()` - Keyword extraction
   - `mergeExpertise()` - Intelligent merging
   - `EXPERTISE_LABELS_BY_LANGUAGE` - Translations in 6 languages:
     - English (en)
     - French (fr) 
     - German (de)
     - Italian (it)
     - Spanish (es)
     - Portuguese (pt)
   - `getExpertiseLabels(language)` - Retrieves language-specific labels
   - `EXPERTISE_PATTERNS` - 14 domain detection patterns

2. **`src/app/api/extract/route.ts`** (UPDATED)
   - Added language detection from extracted CV content
   - Updated `transformClaudeResponseToTCVContent()` to accept language parameter
   - Passes detected language to expertise extraction functions
   - Expertise labels are now returned in original CV language
   - Integrated `detectCVLanguage()` helper from language localization

## No Changes Required

- ✅ Frontend components work as-is
- ✅ Review page displays enriched expertise **in original CV language**
- ✅ Generate page receives complete expertise data **in original CV language**
- ✅ Automatic Swiss tone conversion still applies
- ✅ Automatic language detection - no user configuration needed

## Testing the Feature

### Test Case 1: French CV
1. Upload a French CV with "Analyste Financier" role
2. Check review page - expertise should display in French
3. Example: "Gestion financière et comptabilité" (not "Financial Management")

### Test Case 2: German CV
1. Upload a German CV with technical roles
2. Expertise should show German labels
3. Example: "Softwareentwicklung und Engineering"

### Test Case 3: Any Language
1. Upload CV in any supported language
2. Expertise labels automatically match that language
3. PDF export preserves original language throughout

## Future Enhancements

Possible improvements:
- Add more languages (Dutch, Swedish, Polish, etc.)
- Custom domain patterns for specific industries
- Machine learning-based expertise extraction
- Confidence scoring for inferred expertise
- User override/edit capability in review form
- Expertise localization based on target job market
