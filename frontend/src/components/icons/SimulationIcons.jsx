import React from 'react';

export const ICONS = {
  router: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
      <rect x="4" y="12" width="32" height="16" rx="3" fill="#00607F" stroke="#53EEFF" strokeWidth="1.2"/>
      <circle cx="10" cy="20" r="2.5" fill="#53EEFF"/>
      <circle cx="18" cy="20" r="2.5" fill="#53EEFF"/>
      <circle cx="26" cy="20" r="2.5" fill="#53EEFF"/>
      <rect x="14" y="28" width="12" height="3" rx="1" fill="#53EEFF"/>
      <circle cx="20" cy="31" r="1.5" fill="#53EEFF"/>
      <rect x="7" y="9" width="2" height="3" rx="1" fill="#53EEFF"/>
      <rect x="19" y="7" width="2" height="5" rx="1" fill="#53EEFF"/>
      <rect x="31" y="9" width="2" height="3" rx="1" fill="#53EEFF"/>
    </svg>
  ),
  switch: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
      <rect x="4" y="14" width="32" height="12" rx="2" fill="#1a2332" stroke="#53EEFF" strokeWidth="1.2"/>
      <rect x="8" y="17" width="3" height="6" rx="1" fill="#53EEFF" opacity="0.7"/>
      <rect x="13" y="17" width="3" height="6" rx="1" fill="#53EEFF" opacity="0.7"/>
      <rect x="18" y="17" width="3" height="6" rx="1" fill="#53EEFF" opacity="0.7"/>
      <rect x="23" y="17" width="3" height="6" rx="1" fill="#53EEFF" opacity="0.7"/>
      <rect x="28" y="17" width="3" height="6" rx="1" fill="#53EEFF" opacity="0.7"/>
      <circle cx="34" cy="17" r="1.5" fill="#3fb950"/>
    </svg>
  ),
  pc: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
      <rect x="5" y="6" width="30" height="22" rx="2" fill="#1a2332" stroke="#53EEFF" strokeWidth="1.2"/>
      <rect x="8" y="9" width="24" height="16" rx="1" fill="#080616"/>
      <rect x="14" y="28" width="12" height="3" rx="1" fill="#53EEFF"/>
      <rect x="10" y="31" width="20" height="2" rx="1" fill="#53EEFF" opacity="0.5"/>
      <path d="M14 17 L18 13 L22 17 L26 13" stroke="#53EEFF" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  laptop: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
      <rect x="6" y="8" width="28" height="20" rx="2" fill="#1a2332" stroke="#53EEFF" strokeWidth="1.2"/>
      <rect x="9" y="11" width="22" height="14" rx="1" fill="#080616"/>
      <path d="M2 29 Q20 32 38 29" stroke="#53EEFF" strokeWidth="1.2" fill="none"/>
      <path d="M16 23 L20 19 L24 23" stroke="#53EEFF" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  server: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
      <rect x="8" y="6" width="24" height="8" rx="2" fill="#1a2332" stroke="#53EEFF" strokeWidth="1.2"/>
      <rect x="8" y="16" width="24" height="8" rx="2" fill="#1a2332" stroke="#53EEFF" strokeWidth="1.2"/>
      <rect x="8" y="26" width="24" height="8" rx="2" fill="#1a2332" stroke="#53EEFF" strokeWidth="1.2"/>
      <circle cx="28" cy="10" r="1.5" fill="#3fb950"/>
      <circle cx="28" cy="20" r="1.5" fill="#3fb950"/>
      <circle cx="28" cy="30" r="1.5" fill="#53EEFF"/>
      <rect x="11" y="8.5" width="10" height="3" rx="1" fill="#53EEFF" opacity="0.4"/>
    </svg>
  ),
  firewall: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
      <path d="M20 4 L34 10 V22 C34 30 20 36 20 36 C20 36 6 30 6 22 V10 Z" fill="#1a2332" stroke="#D40F0F" strokeWidth="1.5"/>
      <path d="M20 10 C22 14 18 16 20 20 C21 17 24 16 22 13 C25 15 26 19 24 22 C28 19 27 14 24 11 C26 14 24 18 22 18 C23 15 21 13 20 10Z" fill="#D40F0F" opacity="0.8"/>
    </svg>
  ),
  wifi: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
      <path d="M4 16 Q20 4 36 16" stroke="#53EEFF" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M9 21 Q20 13 31 21" stroke="#53EEFF" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M14 26 Q20 22 26 26" stroke="#53EEFF" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <circle cx="20" cy="31" r="3" fill="#53EEFF"/>
    </svg>
  ),
  tablet: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
      <rect x="9" y="4" width="22" height="32" rx="3" fill="#1a2332" stroke="#53EEFF" strokeWidth="1.2"/>
      <rect x="12" y="8" width="16" height="22" rx="1" fill="#080616"/>
      <circle cx="20" cy="33" r="1.5" fill="#53EEFF" opacity="0.7"/>
    </svg>
  ),
};

export const DEFAULT_ICON = (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
    <rect x="5" y="5" width="30" height="30" rx="4" fill="#1a2332" stroke="#53EEFF" strokeWidth="1.2"/>
    <circle cx="20" cy="20" r="8" stroke="#53EEFF" strokeWidth="1.5"/>
    <circle cx="20" cy="20" r="3" fill="#53EEFF" opacity="0.7"/>
  </svg>
);
