const ICONS = {
  cash: `<svg viewBox="0 0 32 32" fill="none"><defs><linearGradient id="ic_cash" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse"><stop stop-color="#67E8F9"/><stop offset="1" stop-color="#0284C7"/></linearGradient></defs><path d="M16 3C16 3 6.5 13.6 6.5 20a9.5 9.5 0 0 0 19 0C25.5 13.6 16 3 16 3Z" fill="url(#ic_cash)" stroke="#E0F2FE" stroke-width="1.6"/><path d="M12.5 20.5c0-2.5 1.8-5.5 3.5-8" stroke="#FFFFFF" stroke-opacity="0.7" stroke-width="2" stroke-linecap="round"/><circle cx="22.5" cy="23.5" r="6" fill="#FBBF24" stroke="#FEF08A" stroke-width="1.3"/><path d="M22.5 20.4v6.2M20.7 22c0-.9 3.6-.9 3.6 0s-3.6 1.2-3.6 2.3 3.6.9 3.6 0" stroke="#78350F" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  power: `<svg viewBox="0 0 32 32" fill="none"><defs><linearGradient id="ic_pwr" x1="6" y1="2" x2="26" y2="30" gradientUnits="userSpaceOnUse"><stop stop-color="#FEF08A"/><stop offset="0.5" stop-color="#38BDF8"/><stop offset="1" stop-color="#0284C7"/></linearGradient></defs><path d="M18.5 2.5 7.5 17h7.5l-2 12.5L24.5 15H17l1.5-12.5Z" fill="url(#ic_pwr)" stroke="#E0F2FE" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  crystal: `<svg viewBox="0 0 32 32" fill="none"><defs><linearGradient id="ic_cry" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse"><stop stop-color="#F0ABFC"/><stop offset="0.5" stop-color="#A855F7"/><stop offset="1" stop-color="#4F46E5"/></linearGradient></defs><path d="M16 2.5 26.5 11 16 29.5 5.5 11 16 2.5Z" fill="url(#ic_cry)" stroke="#F5D0FE" stroke-width="1.5" stroke-linejoin="round"/><path d="M16 2.5 20.5 11 16 29.5 11.5 11 16 2.5Z" fill="#FFFFFF" fill-opacity="0.24"/><path d="M5.5 11h21" stroke="#F5D0FE" stroke-width="1.2"/></svg>`,
  sound_on: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 9.5h4.2L14 5v14l-5.8-4.5H4v-5Z" fill="#E0F2FE"/><path d="M17.2 8.8a5 5 0 0 1 0 6.4M19.8 6.4a8.5 8.5 0 0 1 0 11.2" stroke="#38BDF8" stroke-width="2" stroke-linecap="round"/></svg>`,
  sound_off: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 9.5h4.2L14 5v14l-5.8-4.5H4v-5Z" fill="#64748B"/><path d="m17 9 4 6m0-6-4 6" stroke="#F87171" stroke-width="2" stroke-linecap="round"/></svg>`,
  fullscreen: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke="#BAE6FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  pan: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12h18M12 3l-2.5 2.5M12 3l2.5 2.5M12 21l-2.5-2.5M12 21l2.5-2.5M3 12l2.5-2.5M3 12l2.5 2.5M21 12l-2.5-2.5M21 12l-2.5 2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  valley: `<svg viewBox="0 0 24 24" fill="none"><path d="M3 19h18l-5.5-9-3.5 5-3-4L3 19Z" fill="#34D399" stroke="#A7F3D0" stroke-width="1.4" stroke-linejoin="round"/><circle cx="17.5" cy="6.5" r="2.5" fill="#FBBF24"/></svg>`,
  glacier: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2.5v19M4.5 7l15 10M19.5 7l-15 10" stroke="#BAE6FD" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="2.4" fill="#38BDF8" stroke="#FFFFFF" stroke-width="1.2"/></svg>`,
  cyber: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="3" fill="#1E1B4B" stroke="#22D3EE" stroke-width="1.5"/><path d="M7 16v-5m5 5V8m5 8v-3" stroke="#F472B6" stroke-width="2.2" stroke-linecap="round"/></svg>`,

  // Stations
  s0: `<svg viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="11" stroke="#F59E0B" stroke-width="2.8"/><circle cx="18" cy="18" r="4" fill="#38BDF8" stroke="#E0F2FE" stroke-width="1.5"/><path d="M18 4v6m0 16v6M4 18h6m16 0h6M8.1 8.1l4.2 4.2m11.4 11.4 4.2 4.2m0-19.8-4.2 4.2M12.3 23.7l-4.2 4.2" stroke="#FBBF24" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  s1: `<svg viewBox="0 0 36 36" fill="none"><circle cx="13" cy="18" r="7.5" stroke="#38BDF8" stroke-width="2.4"/><circle cx="23" cy="18" r="7.5" stroke="#0EA5E9" stroke-width="2.4"/><circle cx="13" cy="18" r="2.5" fill="#FDE047"/><circle cx="23" cy="18" r="2.5" fill="#FDE047"/><path d="M5 18h26" stroke="#E0F2FE" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  s2: `<svg viewBox="0 0 36 36" fill="none"><circle cx="20" cy="18" r="9.5" fill="#0F172A" stroke="#38BDF8" stroke-width="2.2"/><path d="M20 8.5v19M10.5 18h19M13.3 11.3l13.4 13.4m0-13.4L13.3 24.7" stroke="#67E8F9" stroke-width="1.8"/><path d="M4 14h9l-2 4H4v-4Z" fill="#22D3EE"/></svg>`,
  s3: `<svg viewBox="0 0 36 36" fill="none"><path d="M5 27h26l-3-16H8L5 27Z" fill="#CBD5E1" stroke="#F8FAFC" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 14v13m6-13v13m6-13v13" stroke="#38BDF8" stroke-width="2.8" stroke-linecap="round"/><rect x="9" y="8" width="18" height="3.5" rx="1.5" fill="#0284C7"/></svg>`,
  s4: `<svg viewBox="0 0 36 36" fill="none"><path d="M5 27C8 14 28 14 31 27H5Z" fill="#E2E8F0" stroke="#38BDF8" stroke-width="1.6"/><path d="M11 26c2-7 12-7 14 0" stroke="#06B6D4" stroke-width="3" stroke-linecap="round"/><path d="M8 9h20" stroke="#67E8F9" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  s5: `<svg viewBox="0 0 36 36" fill="none"><polygon points="18,4 29,11 29,25 18,32 7,25 7,11" fill="#0F172A" stroke="#22D3EE" stroke-width="2"/><circle cx="18" cy="18" r="5.5" fill="#67E8F9"/><ellipse cx="18" cy="18" rx="13" ry="5" transform="rotate(-25 18 18)" stroke="#F472B6" stroke-width="1.6"/></svg>`,

  // Upgrades
  flow: `<svg viewBox="0 0 32 32" fill="none"><path d="M4 12c4-3 8 3 12 0s8-3 12 0M4 19c4-3 8 3 12 0s8-3 12 0" stroke="#38BDF8" stroke-width="2.8" stroke-linecap="round"/></svg>`,
  dam: `<svg viewBox="0 0 32 32" fill="none"><rect x="7" y="8" width="18" height="18" rx="3" fill="#0284C7" stroke="#BAE6FD" stroke-width="1.6"/><path d="M17 11l-4 6h4l-1 5 4-6h-4l1-5Z" fill="#FEF08A"/></svg>`,
  tap: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="13" r="8" stroke="#67E8F9" stroke-width="1.8" stroke-dasharray="3 2"/><path d="M16 9v14m-4-4 4 4 4-4" stroke="#FBBF24" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  tariff: `<svg viewBox="0 0 32 32" fill="none"><rect x="5" y="13" width="6" height="13" rx="1.5" fill="#38BDF8"/><rect x="13" y="7" width="6" height="19" rx="1.5" fill="#34D399"/><rect x="21" y="10" width="6" height="16" rx="1.5" fill="#FBBF24"/></svg>`,

  // Boosters & Shop
  turbo_3x: `<svg viewBox="0 0 32 32" fill="none"><path d="M17 4 7 18h7l-2 10 13-14h-7l-1-10Z" fill="#FBBF24" stroke="#FEF08A" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  rain_2x: `<svg viewBox="0 0 32 32" fill="none"><path d="M9 18a5 5 0 0 1-.5-9.9 6.5 6.5 0 0 1 12.6-1.4A4.5 4.5 0 0 1 23 18H9Z" fill="#BAE6FD"/><path d="M11 22l-1.5 4M16 22l-1.5 4M21 22l-1.5 4" stroke="#38BDF8" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  auto_tap: `<svg viewBox="0 0 32 32" fill="none"><rect x="7" y="9" width="18" height="14" rx="4" fill="#1E293B" stroke="#67E8F9" stroke-width="1.8"/><circle cx="12.5" cy="16" r="2" fill="#34D399"/><circle cx="19.5" cy="16" r="2" fill="#34D399"/><path d="M16 4v5" stroke="#67E8F9" stroke-width="2" stroke-linecap="round"/></svg>`,
  cash_pack: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="17" r="10" fill="#FBBF24" stroke="#FEF08A" stroke-width="1.6"/><path d="M16 11v12m-3-9.5c0-1.5 6-1.5 6 0s-6 2-6 3.8 6 1.5 6 0" stroke="#78350F" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  gold_blades: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="9.5" stroke="#FBBF24" stroke-width="2.5"/><path d="M16 6.5v19M6.5 16h19" stroke="#FEF08A" stroke-width="2.2"/></svg>`,
  crystal_battery: `<svg viewBox="0 0 32 32" fill="none"><rect x="9" y="7" width="14" height="20" rx="3" fill="#312E81" stroke="#C084FC" stroke-width="1.8"/><rect x="13" y="4" width="6" height="3" rx="1" fill="#E9D5FF"/><path d="M17 11l-4 6h4l-1 5 4-6h-4l1-5Z" fill="#67E8F9"/></svg>`,
  offline_amp: `<svg viewBox="0 0 32 32" fill="none"><path d="M21 6a10 10 0 1 0 5 16.5A8.5 8.5 0 0 1 21 6Z" fill="#67E8F9" stroke="#E0F2FE" stroke-width="1.4"/></svg>`,

  // Avatars
  av_0: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="#0284C7"/><circle cx="16" cy="14" r="5" fill="#FDE68A"/><path d="M8 26c1.5-4.5 14.5-4.5 16 0" fill="#38BDF8"/><path d="M9 12h14l-2-5H11l-2 5Z" fill="#FBBF24"/></svg>`,
  av_1: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="#4F46E5"/><path d="M18 5 9 18h6l-2 9 10-13h-6l1-9Z" fill="#FEF08A"/></svg>`,
  av_2: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="#059669"/><path d="M6 18c3-3 6 3 10 0s7-3 10 0v6H6v-6Z" fill="#67E8F9"/></svg>`,
  av_3: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="#7C3AED"/><path d="M16 5c4 4 5 10 3 15h-6c-2-5-1-11 3-15Z" fill="#F8FAFC"/><circle cx="16" cy="14" r="2.2" fill="#38BDF8"/></svg>`,
  av_4: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="#B45309"/><path d="M7 22l2-10 7 5 7-5 2 10H7Z" fill="#FBBF24" stroke="#FEF08A" stroke-width="1.4"/></svg>`
};

export function iconHtml(name, className = "svg-ic") {
  const svg = ICONS[name] || ICONS.power;
  return `<span class="${className}" aria-hidden="true">${svg}</span>`;
}
