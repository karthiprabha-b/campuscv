"use client";

import React from "react";

const DEFAULT_COVER = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80";
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800";

interface ProfileHeaderProps {
  data?: any;
}

export default function ProfileHeader({ data = {} }: ProfileHeaderProps) {
  const name = data?.name || data?.fullName || data?.hero?.name || data?.profile?.name || data?.basics?.name || data?.personal?.name || "Alex Rivera";
  const preferredName = data?.hero?.preferredName || data?.preferredName || name;
  const role = data?.role || data?.headline || data?.hero?.role || data?.profile?.subRole || data?.profile?.role || data?.basics?.label || data?.personal?.role || "Full Stack Software Engineer & Builder";
  
  // 1. Separate Avatar Override / Data extraction
  const rawAvatarOverride = data?.contentOverrides?.['image:hero:avatar:0']?.src ||
    (typeof data?.contentOverrides?.['image:hero:avatar:0'] === 'string' ? data?.contentOverrides?.['image:hero:avatar:0'] : null) ||
    data?.contentOverrides?.['image:hero:root:img:0']?.src ||
    (typeof data?.contentOverrides?.['image:hero:root:img:0'] === 'string' ? data?.contentOverrides?.['image:hero:root:img:0'] : null) ||
    data?.imageOverrides?.['hero.avatarUrl'] ||
    data?.imageOverrides?.['hero.profileImage'] ||
    data?.imageOverrides?.['profileImage'] ||
    data?.imageOverrides?.['avatarUrl'];

  const avatar = rawAvatarOverride ||
    data?.profileImage ||
    data?.avatarUrl ||
    data?.avatar ||
    data?.photo ||
    data?.profilePhoto ||
    data?.hero?.profileImage ||
    data?.hero?.avatarUrl ||
    data?.about?.avatarUrl ||
    data?.about?.image ||
    data?.profile?.avatar ||
    data?.basics?.image ||
    DEFAULT_AVATAR;

  // 2. Separate Cover Banner Override / Data extraction (NEVER fallback to profile photos)
  const rawCoverOverride = data?.contentOverrides?.['image:hero:cover:0']?.src ||
    (typeof data?.contentOverrides?.['image:hero:cover:0'] === 'string' ? data?.contentOverrides?.['image:hero:cover:0'] : null) ||
    data?.imageOverrides?.['hero.coverImage'] ||
    data?.imageOverrides?.['coverImage'] ||
    data?.imageOverrides?.['bannerImage'];

  const coverImage = rawCoverOverride ||
    data?.coverImage ||
    data?.hero?.coverImage ||
    data?.hero?.bannerImage ||
    data?.bannerImage ||
    data?.profile?.coverImage ||
    DEFAULT_COVER;

  const availability = data?.availability ||
    data?.hero?.availability ||
    data?.status ||
    "Open for Opportunities & Collaborations";

  const firstEdu = Array.isArray(data?.education) && data.education.length > 0 ? data.education[0] : null;
  const badgeText = data?.hero?.badge || data?.badge || (firstEdu ? `${firstEdu.degree ? firstEdu.degree + (firstEdu.school || firstEdu.institution ? ' @ ' : '') : ''}${firstEdu.school || firstEdu.institution || ''}` : "CS Senior @ UC Berkeley");

  return (
    <div id="hero" className="relative bg-white border-b border-gray-200" data-cv-section="hero" data-node-id="section:hero:root:section:0">
      {/* Cover Banner */}
      <div className="h-48 sm:h-60 md:h-68 w-full relative overflow-hidden bg-gray-100">
        <img
          src={coverImage}
          alt="Profile Cover Banner"
          className="w-full h-full object-cover"
          data-cv="hero.coverImage"
          data-node-id="image:hero:cover:0"
        />
        {/* Status Badge */}
        {availability && (
          <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center gap-2 bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-gray-800 shadow-sm border border-white/80 z-10">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span data-cv="hero.availability">{availability}</span>
          </div>
        )}
      </div>

      {/* Profile Header Content Container */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 pb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 sm:gap-7">
          {/* Avatar */}
          <div className="relative -mt-20 sm:-mt-24 md:-mt-28 flex-shrink-0 z-10">
            <div className="relative inline-block">
              <img
                src={avatar}
                alt={name}
                className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full object-cover border-4 sm:border-[5px] border-white shadow-xl bg-white ring-1 ring-gray-200/60"
                data-cv="hero.profileImage"
                data-cv-image="hero.avatarUrl"
                data-node-id="image:hero:avatar:0"
              />
              <div className="absolute bottom-1.5 right-1.5 p-1 bg-white rounded-full shadow-md">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
            </div>
          </div>

          {/* Profile Name & Headline */}
          <div className="pt-2 sm:pt-4 pb-1 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-2">
              <h1 
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 font-heading tracking-tight leading-tight"
                data-cv="hero.name"
                data-node-id="text:hero:name:0"
              >
                {preferredName}
              </h1>
              {badgeText && (
                <span 
                  className="text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 shadow-2xs"
                  data-cv="hero.badge"
                >
                  {badgeText}
                </span>
              )}
            </div>
            {role && (
              <p 
                className="text-sm sm:text-base md:text-lg text-gray-600 font-medium leading-relaxed max-w-3xl"
                data-cv="hero.role"
                data-node-id="text:hero:role:0"
              >
                {role}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
