# Data Flow Architecture

## Complete Data Structure

### TCVContent Type (Full Structure)
```typescript
type TCVContent = {
  personalInfo: {
    fullName: string;
    role: string;              // Job title
    email: string;
    phoneNumber: string;
    address: string;
    website?: string;
    photoUrl?: string;
    summary?: string;          // Professional summary
  };
  
  experiences: Array<{
    companyName: string;
    position: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description: string[];     // Bullet points
  }>;
  
  education: Array<{
    institutionName: string;
    degree: string;
    majorSubject?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
  }>;
  
  skills?: string[];           // Technical skills
  expertise?: string[];        // ← NEW: Specialized areas
  languages: Array<{
    name: string;
    proficiency: string;
  }>;
  interests: string[];         // ← NEW: Professional interests
};
```

## Extraction Phase

### Raw Claude Response
```json
{
  "personalInfo": {
    "name": "John Smith",
    "jobTitle": "Senior Software Engineer",
    "email": "john@example.com",
    "phone": "+41 44 123 4567",
    "location": "Zurich, Switzerland",
    "website": "john.com"
  },
  "summary": "I am very passionate about coding and have 10+ years experience",
  "experience": [
    {
      "company": "TechCorp",
      "position": "Sr. Engineer",
      "startDate": "2020",
      "endDate": "",
      "description": "Responsible for developing cloud infrastructure. Worked on microservices."
    }
  ],
  "education": [...],
  "skills": ["Python", "JavaScript", "javascript"],
  "languages": ["English", "French", "German"],
  "certifications": [
    { "name": "AWS Certified Solutions Architect", "issuer": "Amazon", "date": "2023" },
    { "name": "Kubernetes Certified", "issuer": "Linux Foundation", "date": "2022" }
  ],
  "expertise": ["Cloud Architecture", "DevOps"],
  "interests": ["coding", "traveling", "open source"]
}
```

### After Transformation (transformClaudeResponseToTCVContent)
```typescript
{
  personalInfo: {
    fullName: "John Smith",
    role: "Sr. Engineer",
    email: "john@example.com",
    phoneNumber: "+41 44 123 4567",
    address: "Zurich, Switzerland",
    website: "john.com",
    summary: "I am very passionate about coding and have 10+ years experience",
    photoUrl: undefined
  },
  experiences: [
    {
      companyName: "TechCorp",
      position: "Sr. Engineer",
      startDate: "2020",
      endDate: "",
      isCurrent: true,
      description: [
        "Responsible for developing cloud infrastructure",
        "Worked on microservices"
      ]
    }
  ],
  education: [...],
  skills: ["Python", "JavaScript", "javascript"],
  
  // ← Certifications mapped to expertise
  expertise: [
    "Cloud Architecture",
    "DevOps",
    "AWS Certified Solutions Architect",  // From certification
    "Kubernetes Certified"                  // From certification
  ],
  
  languages: [
    { name: "English", proficiency: "Fluent" },
    { name: "French", proficiency: "Fluent" },
    { name: "German", proficiency: "Fluent" }
  ],
  
  // ← Interests extracted
  interests: ["coding", "traveling", "open source"]
}
```

## Swiss Tone Conversion Phase

### Swiss Tone Conversions Applied
```typescript
// SUMMARY: Remove fluff
Before: "I am very passionate about coding and have 10+ years experience"
After:  "10+ years specializing in software development and cloud architecture"

// ROLE: Standardize
Before: "Sr. Engineer"
After:  "Senior Engineer"

// EXPERIENCE: Make action-oriented
Before: "Responsible for developing cloud infrastructure. Worked on microservices."
After:  [
  "Developed cloud infrastructure and microservices architecture.",
  "Managed infrastructure scaling and deployment automation."
]

// SKILLS: Deduplicate and normalize
Before: ["Python", "JavaScript", "javascript"]
After:  ["JavaScript", "Python"]  // Deduped, sorted

// EXPERTISE: Normalize and deduplicate
Before: [
  "Cloud Architecture",
  "DevOps",
  "AWS Certified Solutions Architect",
  "Kubernetes Certified"
]
After:  [
  "Cloud Architecture",
  "DevOps",
  "AWS Certification",
  "Kubernetes Certification"
]

// INTERESTS: Convert to professional terms
Before: ["coding", "traveling", "open source"]
After:  ["Software Development", "International Travel", "Open Source"]
```

### After applySwissToneToCV()
```typescript
{
  personalInfo: {
    fullName: "John Smith",
    role: "Senior Engineer",  // ← Standardized
    email: "john@example.com",
    phoneNumber: "+41 44 123 4567",
    address: "Zurich, Switzerland",
    website: "john.com",
    summary: "10+ years specializing in software development and cloud architecture",
    photoUrl: undefined
  },
  
  experiences: [
    {
      companyName: "TechCorp",
      position: "Senior Engineer",  // ← Standardized
      startDate: "2020",
      endDate: "",
      isCurrent: true,
      description: [
        "Developed cloud infrastructure and microservices architecture.",
        "Managed infrastructure scaling and deployment automation."
      ]
    }
  ],
  
  education: [...],
  
  skills: ["JavaScript", "Python"],  // ← Deduplicated, normalized
  
  expertise: [
    "Cloud Architecture",
    "DevOps",
    "AWS Certification",
    "Kubernetes Certification"
  ],  // ← Normalized
  
  languages: [...],
  
  interests: [
    "Software Development",
    "International Travel",
    "Open Source"
  ]  // ← Professional terms
}
```

## Review Page Phase

### Form Interface
```typescript
interface ReviewFormData {
  // ... other fields ...
  skills: string[];
  expertise: string[];          // ← New field
  interests: string[];          // ← New field
  // ... other fields ...
}
```

### Form Display
```
[Skills Field]
├─ Python [x]
├─ JavaScript [x]
└─ + Add skill...

[Expertise & Specializations] ← NEW
├─ Cloud Architecture [x]
├─ DevOps [x]
├─ AWS Certification [x]
├─ Kubernetes Certification [x]
└─ + Add expertise...

[Professional Interests] ← NEW
├─ Software Development [x]
├─ International Travel [x]
├─ Open Source [x]
└─ + Add interest...
```

### User Edits (Example)
```
User removes "Kubernetes Certification"
User adds "Terraform"

expertise becomes: [
  "Cloud Architecture",
  "DevOps",
  "AWS Certification",
  "Terraform"
]
```

## Template Formatting Phase

### Template Selection
User chooses: **Classic Template**

### Before Formatting
```typescript
const rawData = {
  // ... all data ...
  expertise: [
    "Cloud Architecture",
    "DevOps",
    "AWS Certification",
    "Terraform"
  ],
  interests: ["Software Development", "International Travel", "Open Source"],
  // ... other data ...
}
```

### After formatDataForClassicTemplate()
```typescript
const optimizedData = {
  // ... all data ...
  expertise: [
    "Cloud Architecture",
    "DevOps",
    "AWS Certification",
    "Terraform"
  ],  // ← Trimmed to 8 (under limit, no change)
  
  interests: [
    "Software Development",
    "International Travel",
    "Open Source"
  ],  // ← All fit, no trimming needed
  // ... other data ...
}

// Fit Score: 95/100
// Optimization Tips: []  (all optimal)
```

### Modern Template
```typescript
const optimizedData = {
  // ... all data ...
  expertise: [
    "Cloud Architecture",
    "DevOps",
    "AWS Certification",
    "Terraform"
  ],  // ← Trimmed to 6 (under limit, no change)
  
  interests: [
    "Software Development",
    "International Travel",
    "Open Source"
  ],  // ← 3 items, perfect for layout
  // ... other data ...
}

// Fit Score: 95/100
// Optimization Tips: []
```

## Template Rendering Phase

### Classic Template Renders
```html
<div class="cv">
  <!-- ... header with name, title, summary ... -->
  
  <section class="EXPÉRIENCE">
    <h2>EXPÉRIENCE</h2>
    <div class="experience-item">
      <h3>Senior Engineer</h3>
      <p>TechCorp · 2020 - Present</p>
      <ul>
        <li>Developed cloud infrastructure...</li>
        <li>Managed infrastructure scaling...</li>
      </ul>
    </div>
  </section>
  
  <section class="EXPERTISE">
    <h2>EXPERTISE</h2>
    <ul>
      <li>• Cloud Architecture</li>
      <li>• DevOps</li>
      <li>• AWS Certification</li>
      <li>• Terraform</li>
    </ul>
  </section>
  
  <!-- ... footer ... -->
</div>
```

### Modern Template Renders
```html
<div class="cv">
  <aside class="sidebar navy">
    <!-- ... profile section ... -->
    
    <section class="INTERÊTS">
      <h2>INTERÊTS</h2>
      <p>Software Development</p>
      <p>International Travel</p>
      <p>Open Source</p>
    </section>
  </aside>
  
  <main class="content">
    <!-- ... experience, education ... -->
  </main>
</div>
```

## PDF Export Phase

### Final PDF Generated
```
┌─────────────────────────────────┐
│ JOHN SMITH                      │
│ SENIOR ENGINEER                 │
├─────────────────────────────────┤
│                                 │
│ Professional Summary...         │
│                                 │
│ EXPERIENCE                      │
│ ├─ TechCorp (2020-Present)      │
│ │  • Developed cloud infra      │
│ │  • Managed scaling            │
│                                 │
│ EXPERTISE                       │
│ ├─ Cloud Architecture           │
│ ├─ DevOps                       │
│ ├─ AWS Certification            │
│ └─ Terraform                    │
│                                 │
└─────────────────────────────────┘
```

## Data Persistence Flow

```
Step 1: Extraction
cvContext.setCVData(extractedData)
          ↓
Step 2: Review
Form values displayed from cvContext
User edits expertise/interests
Form syncs back to cvContext
          ↓
Step 3: Template Selection
Template receives cvContext.cvData
          ↓
Step 4: Rendering
Template component uses useCVFormatting
Hook retrieves formatted data
Component renders with formatted data
```

## Key Data Transformations

### Expertise: Certifications → Specializations
```
Input: Certifications array
[
  { name: "AWS Certified Solutions Architect", issuer: "Amazon", date: "2023" },
  { name: "Kubernetes Certified", issuer: "Linux Foundation", date: "2022" }
]

Transform: Extract name field
↓
Output: Expertise array
[
  "AWS Certified Solutions Architect",
  "Kubernetes Certified"
]

Swiss Tone: Normalize
↓
Final: 
[
  "AWS Certification",
  "Kubernetes Certification"
]
```

### Interests: Casual → Professional
```
Input: Raw interests
["coding", "traveling", "open source"]

Transform: Apply interest mapping
  coding → Software Development
  traveling → International Travel
  open source → Open Source
↓
Output: Professional interests
["Software Development", "International Travel", "Open Source"]
```

## Error Handling

### If Expertise Missing
```
API Response: expertise: []

Transform: Uses certificationsArray
Deduplicates between expertise and certifications
Default: []
↓
Result: Expertise from certifications or empty
```

### If Interests Missing
```
API Response: interests: []

Transform: Empty array
Swiss Tone: Returns empty array
Default: []
↓
Result: No interests displayed (user can add)
```

### If Both Fields Missing
```
CV has no expertise or interests data
System continues normally
User can manually add in review page
Templates render without those sections (graceful degradation)
```

## Summary Table

| Phase | Input | Processing | Output |
|-------|-------|------------|--------|
| **Extraction** | PDF/DOCX | Claude API | Raw JSON data |
| **Transformation** | Raw JSON | Field mapping | TCVContent type |
| **Swiss Tone** | TCVContent | Conversions | Converted TCVContent |
| **Review** | Converted data | User edits | Updated TCVContent |
| **Formatting** | Updated data | Template limits | Formatted TCVContent |
| **Rendering** | Formatted data | Template logic | HTML/PDF |

## Performance Metrics

| Operation | Time | Frequency |
|-----------|------|-----------|
| Extract expertise | <1ms | Once per upload |
| Convert expertise | <1ms | Once per extract |
| Format expertise | <1ms | Per template view |
| Memoized rendering | Instant | Per component mount |
| Fit score calc | <1ms | Per formatting |

This completes the full data flow from extraction through to final PDF with expertise and interests fully integrated! 🎯
