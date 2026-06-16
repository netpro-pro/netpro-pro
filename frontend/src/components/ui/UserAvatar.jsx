export function getUserInitials(name) {
  return name.split(/[\s_]/).map(p => p[0]?.toUpperCase()).slice(0, 2).join('')
}

const AVATAR_COLORS = [
  '#00607F', '#1557A8', '#8D5D04', '#3fb950', '#6f42c1', '#d63384',
]

export function getUserAvatarColor(id) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length]
}

export default function UserAvatar({ name, id, size = 36, fontSize = '0.75rem' }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: getUserAvatarColor(id),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        fontWeight: '700',
        color: '#fff',
        flexShrink: 0,
      }}
    >
      {getUserInitials(name)}
    </div>
  )
}