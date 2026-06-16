const AVATAR_COLORS = ['#00607F', '#1557A8', '#8D5D04', '#3fb950', '#6f42c1', '#d63384'];

export function getUserInitials(name) {
  return name.split(/[\s_]/).map(p => p[0]?.toUpperCase()).slice(0, 2).join('');
}

export function getUserAvatarColor(id) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}
