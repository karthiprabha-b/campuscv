"use client";

/**
 * UniversalAddModal — CampusCV Add Portfolio Content Modal
 *
 * Structured content modal for managing real portfolio data records.
 * Template = Design / Structure, User Data = Content, Data Bindings = Connection.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderKanban, Code, Briefcase, GraduationCap, Award,
  Mail, User, Contact as ContactIcon, HelpCircle,
  Plus, X, Sparkles, Info, FileText
} from 'lucide-react';
import { useEditorContext } from '../../context/EditorContext';
import { PortfolioData } from '../../utils/mockDb';
import { createUniversalCollectionObject } from '../../utils/universalEditorEngine';

interface UniversalAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioData;
  onPortfolioChange: (p: PortfolioData) => void;
  onOpenResumeSync?: () => void;
}

export interface AddOption {
  id: string;
  label: string;
  description: string;
  section: 'content' | 'profile';
  icon: React.ReactNode;
  dataKey?: string;
}

const ADD_OPTIONS: AddOption[] = [
  {
    id: 'add-project',
    label: 'Projects',
    description: 'Add a software project, web app, or placement case study',
    section: 'content',
    icon: <FolderKanban className="w-5 h-5 text-violet-500" />,
    dataKey: 'projects',
  },
  {
    id: 'add-skill',
    label: 'Skills',
    description: 'Add a programming language, framework, database, or tool',
    section: 'content',
    icon: <Code className="w-5 h-5 text-cyan-500" />,
    dataKey: 'skills',
  },
  {
    id: 'add-experience',
    label: 'Experience',
    description: 'Add an internship, work history, or leadership role',
    section: 'content',
    icon: <Briefcase className="w-5 h-5 text-emerald-500" />,
    dataKey: 'experience',
  },
  {
    id: 'add-education',
    label: 'Education',
    description: 'Add a university degree, college academic milestone, or GPA',
    section: 'content',
    icon: <GraduationCap className="w-5 h-5 text-indigo-500" />,
    dataKey: 'education',
  },
  {
    id: 'add-certification',
    label: 'Certifications',
    description: 'Add a professional certification, course badge, or award',
    section: 'content',
    icon: <Award className="w-5 h-5 text-rose-500" />,
    dataKey: 'certifications',
  },
  {
    id: 'add-social',
    label: 'Social Links',
    description: 'Add GitHub, LinkedIn, Twitter, or personal portfolio link',
    section: 'content',
    icon: <Mail className="w-5 h-5 text-purple-500" />,
    dataKey: 'socialLinks',
  },
  {
    id: 'profile-personal',
    label: 'Personal Information',
    description: 'Manage your name, headline, bio, avatar, and career summary',
    section: 'profile',
    icon: <User className="w-5 h-5 text-blue-500" />,
    dataKey: 'personal',
  },
  {
    id: 'profile-contact',
    label: 'Contact Information',
    description: 'Manage your email, phone, city location, and resume file link',
    section: 'profile',
    icon: <ContactIcon className="w-5 h-5 text-amber-500" />,
    dataKey: 'contact',
  },
  {
    id: 'import-resume',
    label: 'Import from Resume',
    description: 'Upload a new PDF or Word resume to auto-populate or refresh your portfolio',
    section: 'profile',
    icon: <FileText className="w-5 h-5 text-indigo-600" />,
    dataKey: 'resume_sync',
  },
];

export default function UniversalAddModal({
  isOpen,
  onClose,
  portfolio,
  onPortfolioChange,
  onOpenResumeSync,
}: UniversalAddModalProps) {
  const { setSelectedElement, setInspectorMode } = useEditorContext();
  const [activeTab, setActiveTab] = useState<'all' | 'content' | 'profile'>('all');
  const [showHelpDrawer, setShowHelpDrawer] = useState(false);

  if (!isOpen) return null;

  const handleSelectOption = (option: AddOption) => {
    if (option.id === 'import-resume' && onOpenResumeSync) {
      onClose();
      onOpenResumeSync();
      return;
    }

    const dataKey = option.dataKey || 'projects';

    if (option.section === 'profile') {
      // Profile data target — select personal/contact in inspector
      setSelectedElement({
        id: `profile-${dataKey}`,
        fieldPath: `personal.${dataKey === 'contact' ? 'email' : 'fullName'}`,
        elementType: 'text',
        sectionId: 'about',
        label: option.label,
      });
      setInspectorMode('element');
      onClose();
      return;
    }

    // Collection item target (Projects, Skills, Experience, Education, Certifications, Social Links)
    const rawKey = dataKey;
    let canonicalKey = rawKey;
    if (rawKey === 'timeline' || rawKey === 'work' || rawKey === 'workexperience') canonicalKey = 'experience';
    if (rawKey === 'certificates' || rawKey === 'awards' || rawKey === 'achievements') canonicalKey = 'certifications';
    if (rawKey === 'academics') canonicalKey = 'education';
    if (rawKey === 'portfolio') canonicalKey = 'projects';

    const targetList = Array.isArray((portfolio as any)?.[canonicalKey])
      ? (portfolio as any)[canonicalKey]
      : (Array.isArray((portfolio as any)?.[rawKey]) ? (portfolio as any)[rawKey] : []);

    const newItem = createUniversalCollectionObject(canonicalKey, targetList);
    const updatedList = [...targetList, newItem];

    const sectionName = canonicalKey;
    let updatedSections = Array.isArray(portfolio?.sections)
      ? [...(portfolio?.sections || [])]
      : ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];

    if (!updatedSections.includes(sectionName)) {
      updatedSections.push(sectionName);
    }

    const activatedSections = Array.isArray((portfolio as any)?.activatedSections)
      ? [...((portfolio as any)?.activatedSections || [])]
      : [];

    if (!activatedSections.includes(sectionName)) {
      activatedSections.push(sectionName);
    }
    if (!activatedSections.includes(canonicalKey)) {
      activatedSections.push(canonicalKey);
    }

    // Clear any deletedNodes or hiddenNodes entries hiding this collection
    const deletedNodes = { ...(portfolio?.deletedNodes || {}) };
    delete deletedNodes[`section:${sectionName}:root:section:0`];
    delete deletedNodes[sectionName];
    delete deletedNodes[canonicalKey];
    delete deletedNodes[rawKey];
    Object.keys(deletedNodes).forEach((k) => {
      if (k.toLowerCase().includes(sectionName.toLowerCase()) || k.toLowerCase().includes(canonicalKey.toLowerCase())) {
        delete deletedNodes[k];
      }
    });

    const hiddenNodes = { ...((portfolio as any)?.hiddenNodes || {}) };
    delete hiddenNodes[sectionName];
    delete hiddenNodes[`section:${sectionName}:root:section:0`];

    const hiddenFields = (portfolio?.hiddenFields || []).filter(
      (f: string) => f !== sectionName && f !== `sections.${sectionName}` && f !== canonicalKey
    );

    const updatedPortfolio: any = {
      ...(portfolio || {}),
      [canonicalKey]: updatedList,
      sections: updatedSections,
      activatedSections,
      deletedNodes,
      hiddenNodes,
      hiddenFields,
    };

    if (canonicalKey === 'experience') {
      updatedPortfolio.timeline = updatedList;
      updatedPortfolio.work = updatedList;
      updatedPortfolio.workExperience = updatedList;
    } else if (canonicalKey === 'certifications') {
      updatedPortfolio.certificates = updatedList;
      updatedPortfolio.awards = updatedList;
    }

    if (updatedPortfolio.canonicalProfile && typeof updatedPortfolio.canonicalProfile === 'object') {
      updatedPortfolio.canonicalProfile[canonicalKey] = updatedList;
      if (canonicalKey === 'experience') {
        updatedPortfolio.canonicalProfile.experience = updatedList;
      }
    }

    onPortfolioChange(updatedPortfolio as PortfolioData);

    const newIdx = updatedList.length - 1;
    const isList = canonicalKey === 'skills' || typeof newItem === 'string';

    setTimeout(() => {
      setSelectedElement({
        id: `item-${canonicalKey}-${newIdx}`,
        fieldPath: `${canonicalKey}[${newIdx}]`,
        elementType: isList ? 'list' : 'card',
        sectionId: sectionName,
        index: newIdx,
        label: typeof newItem === 'string' ? newItem : (newItem.title || newItem.name || newItem.degree || newItem.role || 'New Item'),
      });
      setInspectorMode(isList ? 'list' : 'card');
    }, 50);

    onClose();
  };

  const filteredOptions = activeTab === 'all'
    ? ADD_OPTIONS
    : ADD_OPTIONS.filter((o) => o.section === activeTab);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-xl bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-zinc-900 leading-none font-bricolage">
                  Add Portfolio Content
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Add real information to your portfolio. Your template controls how it looks.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-zinc-200/60 text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Tab Filter & Help Trigger */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-100 bg-white">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'all', label: 'All Content' },
                { id: 'content', label: 'Content Collections' },
                { id: 'profile', label: 'Profile Information' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowHelpDrawer(!showHelpDrawer)}
              className="inline-flex items-center gap-1.5 text-xs text-purple-700 font-bold hover:text-purple-900 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <span>How data works</span>
            </button>
          </div>

          {/* Help Drawer Banner */}
          {showHelpDrawer && (
            <div className="bg-purple-50/80 border-b border-purple-100 px-6 py-3.5 text-xs text-purple-950 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-purple-900">
                <Info className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Structured Portfolio Architecture</span>
              </div>
              <p className="text-[11px] text-purple-800 leading-relaxed">
                CampusCV keeps your career content separate from template styling. Adding items here appends structured data records (e.g. projects, skills, experience). Your active template automatically binds and renders your data.
              </p>
            </div>
          )}

          {/* Options Grid */}
          <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt)}
                className="group flex items-start gap-3 p-3.5 rounded-2xl border border-zinc-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-100 group-hover:bg-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
                  {opt.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-zinc-900 group-hover:text-purple-700 transition-colors">
                      {opt.label}
                    </h4>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-zinc-400 group-hover:text-purple-600">
                      {opt.section}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-tight mt-0.5 line-clamp-2">
                    {opt.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
