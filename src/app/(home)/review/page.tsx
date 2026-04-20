"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useCV } from "@/lib/CVContext";

interface Experience {
  id: string;
  title: string;
  company: string;
  description: string;
  startDate?: string;
  endDate?: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  graduationDate?: string;
}

interface Skill {
  id: string;
  name: string;
}

export default function ReviewPage() {
  const { cvData, setCVData } = useCV();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("English");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);

  // Load extracted data on mount
  useEffect(() => {
    if (cvData) {
      // Load personal information
      if (cvData.personalInfo) {
        setFullName(cvData.personalInfo.name || "");
        setEmail(cvData.personalInfo.email || "");
        setPhone(cvData.personalInfo.phone || "");
        setAddress(cvData.personalInfo.location || "");
      }

      // Load summary
      if (cvData.summary) {
        setResume(cvData.summary);
      }

      // Load skills
      if (cvData.skills && Array.isArray(cvData.skills)) {
        const skillsArray: Skill[] = cvData.skills.map((skill, index) => ({
          id: `skill-${index}`,
          name: skill,
        }));
        setSkills(skillsArray);
      }

      // Load languages
      if (cvData.languages && Array.isArray(cvData.languages) && cvData.languages.length > 0) {
        setPreferredLanguage(cvData.languages[0]);
      }

      // Load experiences
      if (cvData.experience && Array.isArray(cvData.experience)) {
        const expArray: Experience[] = cvData.experience.map((exp, index) => ({
          id: `exp-${index}`,
          title: exp.position || "",
          company: exp.company || "",
          description: exp.description || "",
          startDate: exp.startDate || "",
          endDate: exp.endDate || "",
        }));
        setExperiences(expArray);
      }

      // Load education
      if (cvData.education && Array.isArray(cvData.education)) {
        const eduArray: Education[] = cvData.education.map((edu, index) => ({
          id: `edu-${index}`,
          school: edu.school || "",
          degree: edu.degree || "",
          field: edu.field || "",
          graduationDate: edu.graduationDate || "",
        }));
        setEducations(eduArray);
      }
    }
  }, [cvData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFullNameChange = (value: string) => {
    setFullName(value);
    updateCVData({ personalInfo: { ...cvData?.personalInfo, name: value } as any });
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    updateCVData({ personalInfo: { ...cvData?.personalInfo, email: value } as any });
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    updateCVData({ personalInfo: { ...cvData?.personalInfo, phone: value } as any });
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);
    updateCVData({ personalInfo: { ...cvData?.personalInfo, location: value } as any });
  };

  const handleResumeChange = (value: string) => {
    setResume(value);
    updateCVData({ summary: value });
  };

  const updateCVData = (updates: any) => {
    if (cvData) {
      setCVData({ ...cvData, ...updates });
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      const newSkillObj = { id: Date.now().toString(), name: newSkill };
      setSkills([...skills, newSkillObj]);
      setNewSkill("");
      const updatedSkills = [...(cvData?.skills || []), newSkill];
      updateCVData({ skills: updatedSkills });
    }
  };

  const removeSkill = (id: string) => {
    const skillName = skills.find((s) => s.id === id)?.name;
    const filteredSkills = skills.filter((skill) => skill.id !== id);
    setSkills(filteredSkills);
    const updatedSkills = cvData?.skills?.filter((s) => s !== skillName) || [];
    updateCVData({ skills: updatedSkills });
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      title: "",
      company: "",
      description: "",
      startDate: "",
      endDate: "",
    };
    setExperiences([...experiences, newExp]);
    const updatedExperiences = [
      ...(cvData?.experience || []),
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ];
    updateCVData({ experience: updatedExperiences });
  };

  const updateExperience = (
    id: string,
    field: keyof Experience,
    value: string,
  ) => {
    const updatedExps = experiences.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp,
    );
    setExperiences(updatedExps);

    // Map to CVData format
    const cvExperiences = updatedExps.map((exp) => ({
      company: exp.company,
      position: exp.title,
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      description: exp.description,
    }));
    updateCVData({ experience: cvExperiences });
  };

  const removeExperience = (id: string) => {
    const filteredExps = experiences.filter((exp) => exp.id !== id);
    setExperiences(filteredExps);
    const cvExperiences = filteredExps.map((exp) => ({
      company: exp.company,
      position: exp.title,
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      description: exp.description,
    }));
    updateCVData({ experience: cvExperiences });
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      field: "",
      graduationDate: "",
    };
    setEducations([...educations, newEdu]);
    const updatedEducations = [
      ...(cvData?.education || []),
      {
        school: "",
        degree: "",
        field: "",
        graduationDate: "",
      },
    ];
    updateCVData({ education: updatedEducations });
  };

  const updateEducation = (
    id: string,
    field: keyof Education,
    value: string,
  ) => {
    const updatedEdus = educations.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu,
    );
    setEducations(updatedEdus);
    const cvEducations = updatedEdus.map((edu) => ({
      school: edu.school,
      degree: edu.degree,
      field: edu.field,
      graduationDate: edu.graduationDate || "",
    }));
    updateCVData({ education: cvEducations });
  };

  const removeEducation = (id: string) => {
    const filteredEdus = educations.filter((edu) => edu.id !== id);
    setEducations(filteredEdus);
    const cvEducations = filteredEdus.map((edu) => ({
      school: edu.school,
      degree: edu.degree,
      field: edu.field,
      graduationDate: edu.graduationDate || "",
    }));
    updateCVData({ education: cvEducations });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 mb-2">
            Review extracted information
          </h1>
          <p className="text-zinc-600 mb-4">
            Your CV has been extracted and formatted to Swiss professional standards. Please review and make any edits before proceeding.
          </p>
          {cvData && (
            <div className="inline-block bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <p className="text-sm text-green-800">
                ✓ Data successfully extracted and processed in Swiss format
              </p>
            </div>
          )}
        </div>

        {/* Profile Section with Image Uploader */}
        <Card className="mb-8 p-8 bg-white border-0 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Image Upload Section */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 mb-4 rounded-lg border-2 border-dashed border-blue-200 bg-blue-50 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center flex flex-col items-center justify-center">
                    <Upload className="w-8 h-8 text-blue-400 mb-2" />
                    <p className="text-xs text-blue-600 font-medium">Add photo</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {profileImage ? (
                <button
                  onClick={removeImage}
                  className="text-sm text-red-600 hover:text-red-700 font-medium mb-2"
                >
                  Remove Photo
                </button>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-2"
                >
                  Upload Photo
                </button>
              )}
              <p className="text-xs text-zinc-500">JPG or PNG, max 5MB</p>
            </div>

            {/* Personal Information */}
            <div className="md:col-span-3 space-y-4">
              <div>
                <Label className="text-xs font-semibold text-zinc-700 uppercase tracking-wide mb-1 block">
                  Full Name
                </Label>
                <Input
                  value={fullName}
                  onChange={(e) => handleFullNameChange(e.target.value)}
                  placeholder="Your full name"
                  className="bg-zinc-50 border-zinc-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-zinc-700 uppercase tracking-wide mb-1 block">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="email@example.com"
                    className="bg-zinc-50 border-zinc-200"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-zinc-700 uppercase tracking-wide mb-1 block">
                    Phone Number
                  </Label>
                  <Input
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+41 XX XXX XX XX"
                    className="bg-zinc-50 border-zinc-200"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-zinc-700 uppercase tracking-wide mb-1 block">
                  Address
                </Label>
                <Input
                  value={address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  placeholder="Street, City, Country"
                  className="bg-zinc-50 border-zinc-200"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Resume Summary */}
        <Card className="mb-8 p-6 bg-white border-0 shadow-sm">
          <Label className="text-xs font-semibold text-zinc-700 uppercase tracking-wide mb-3 block">
            Professional Summary
          </Label>
          <Textarea
            value={resume}
            onChange={(e) => handleResumeChange(e.target.value)}
            placeholder="Your professional summary (Swiss style)..."
            className="bg-zinc-50 border-zinc-200 min-h-24"
          />
          <p className="text-xs text-zinc-500 mt-2">Formatted in Swiss professional standards</p>
        </Card>

        {/* Preferred Language */}
        <Card className="mb-8 p-6 bg-white border-0 shadow-sm">
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-zinc-700 uppercase tracking-wide mb-3 block">
                Preferred Language
              </Label>
              <div className="flex flex-wrap gap-2">
                {["German", "French", "English"].map((lang) => (
                  <Badge
                    key={lang}
                    variant={
                      preferredLanguage === lang ? "default" : "outline"
                    }
                    className={`cursor-pointer px-3 py-1 ${
                      preferredLanguage === lang
                        ? "bg-blue-600 text-white"
                        : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50"
                    }`}
                    onClick={() => setPreferredLanguage(lang)}
                  >
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Skills Section */}
            <div className="mt-6 pt-6 border-t border-zinc-200">
              <Label className="text-xs font-semibold text-zinc-700 uppercase tracking-wide mb-3 block">
                Skills
              </Label>
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill) => (
                  <Badge
                    key={skill.id}
                    className="bg-blue-100 text-blue-700 border-0 px-3 py-1 flex items-center gap-2 cursor-pointer hover:bg-blue-200"
                  >
                    {skill.name}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeSkill(skill.id)}
                    />
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  className="bg-zinc-50 border-zinc-200"
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                />
                <Button onClick={addSkill} variant="outline" className="px-4">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Professional Experience */}
        <Card className="mb-8 p-6 bg-white border-0 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Label className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">
              Professional Experience
            </Label>
            <Button
              onClick={addExperience}
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Experience
            </Button>
          </div>

          <div className="space-y-4">
            {experiences.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                <p>No experiences found - extracted data will appear here</p>
              </div>
            ) : (
              experiences.map((exp) => (
                <div key={exp.id} className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={(e) =>
                        updateExperience(exp.id, "title", e.target.value)
                      }
                      className="bg-white border-zinc-200"
                    />
                    <Input
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(exp.id, "company", e.target.value)
                      }
                      className="bg-white border-zinc-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input
                      placeholder="Start Date (MM/YYYY)"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(exp.id, "startDate", e.target.value)
                      }
                      className="bg-white border-zinc-200"
                    />
                    <Input
                      placeholder="End Date (MM/YYYY)"
                      value={exp.endDate}
                      onChange={(e) =>
                        updateExperience(exp.id, "endDate", e.target.value)
                      }
                      className="bg-white border-zinc-200"
                    />
                  </div>
                  <Textarea
                    placeholder="Description"
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(exp.id, "description", e.target.value)
                    }
                    className="bg-white border-zinc-200 min-h-20 mb-2"
                  />
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Education */}
        <Card className="mb-8 p-6 bg-white border-0 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Label className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">
              Education
            </Label>
            <Button
              onClick={addEducation}
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Education
            </Button>
          </div>

          <div className="space-y-4">
            {educations.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                <p>No education found - extracted data will appear here</p>
              </div>
            ) : (
              educations.map((edu) => (
                <div key={edu.id} className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input
                      placeholder="School/University"
                      value={edu.school}
                      onChange={(e) =>
                        updateEducation(edu.id, "school", e.target.value)
                      }
                      className="bg-white border-zinc-200"
                    />
                    <Input
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(edu.id, "degree", e.target.value)
                      }
                      className="bg-white border-zinc-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input
                      placeholder="Field of Study"
                      value={edu.field}
                      onChange={(e) =>
                        updateEducation(edu.id, "field", e.target.value)
                      }
                      className="bg-white border-zinc-200"
                    />
                    <Input
                      placeholder="Graduation Date (YYYY)"
                      value={edu.graduationDate}
                      onChange={(e) =>
                        updateEducation(edu.id, "graduationDate", e.target.value)
                      }
                      className="bg-white border-zinc-200"
                    />
                  </div>
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center gap-4 mb-8">
          <Link href="/">
            <Button
              variant="outline"
              className="border-zinc-300 text-zinc-700 hover:bg-zinc-50"
            >
              ← Back to extraction
            </Button>
          </Link>

          <Link href="/generate">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              Continue to template selection →
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
