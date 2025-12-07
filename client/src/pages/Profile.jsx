import React, { useState } from 'react'
import { Edit2, Mail, Activity, Trophy, Users, RefreshCw, ExternalLink, Award, LayoutList } from 'lucide-react'
import { motion } from 'framer-motion'

// Final ProfilePage — Avatar & userHandle are locked (non-editable).
// Added extra components: LeaderboardCard, RecentMatches, BadgeList, SettingsPanel.

export default function ProfilePage({ user }) {
  const fallback = {
    displayName: 'God_itachii',
    userHandle: '@testHandle',
    avatarUrl: '/avatar7.png',
    bio: 'Noob Coder',
    elo: 620,
    wins: 0,
    losses: 0,
    friends: ['YIJSzU3ypbfVHYmfXBHtzFjkRbl1'],
    socials: { github: '', linkedin: '', website: '' },
    solvedProblems: { easy: 0, medium: 0, hard: 0, total: 0 },
    createdAt: 'November 24, 2025',
    email: null,
    recentMatches: [],
    badges: [],
  }

  const data = { ...fallback, ...(user || {}) }

  const [editOpen, setEditOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [form, setForm] = useState({ displayName: data.displayName, bio: data.bio || '', email: data.email || '' })

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // persist to API in a real app
    setEditOpen(false)
  }

  // derived
  const gamesPlayed = (data.wins || 0) + (data.losses || 0)
  const rank = data.elo ? Math.max(1, Math.floor(1000 - data.elo / 2)) : '—'
  const progress = Math.min(100, Math.max(0, (data.elo / 1000) * 100))

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07070a] to-[#0f0f11] p-6 text-gray-200">
      <div className="max-w-6xl mx-auto">
        <Header onEdit={() => setEditOpen(true)} onOpenSettings={() => setSettingsOpen(v => !v)} />

        <main className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          <aside className="lg:col-span-1 space-y-4">
            <AvatarCard
              avatar={data.avatarUrl}
              displayName={data.displayName}
              userHandle={data.userHandle}
              bio={data.bio}
              elo={data.elo}
              joined={data.createdAt}
            />

            <LeaderboardCard />

            <div className="flex gap-2">
              <button onClick={() => window.location.href = '/'} className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 text-white">Dashboard</button>
              <button onClick={() => window.location.reload()} className="px-3 py-2 rounded-lg border border-[#232326]">Refresh</button>
            </div>
          </aside>

          <section className="lg:col-span-3 space-y-6">
            <ProfileHeader data={data} progress={progress} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#0f0f11] border border-[#232326] rounded-2xl p-5">
                <ContactCard email={data.email} socials={data.socials} />
                <div className="mt-4">
                  <h5 className="text-sm text-gray-400">Recent activity</h5>
                  <RecentMatches matches={data.recentMatches} />
                </div>
              </div>

              <div className="bg-[#0f0f11] border border-[#232326] rounded-2xl p-5">
                <h4 className="font-medium text-white">Performance</h4>
                <div className="mt-3 space-y-3">
                  <PerformanceRow label="Games played" value={gamesPlayed} />
                  <PerformanceRow label="Wins" value={data.wins ?? 0} />
                  <PerformanceRow label="Losses" value={data.losses ?? 0} />
                  <PerformanceRow label="Rank" value={data.elo ? `#${rank}` : '—'} />
                </div>

                <div className="mt-6">
                  <h5 className="text-sm text-gray-400">Badges</h5>
                  <BadgeList badges={data.badges} />
                </div>
              </div>
            </div>

            <div className="bg-[#0f0f11] border border-[#232326] rounded-2xl p-5">
              <h4 className="font-medium text-white">Activity feed</h4>
              <p className="text-sm text-gray-400 mt-2">Full feed coming soon.</p>
            </div>
          </section>
        </main>

        {/* Edit modal */}
        {editOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/50" onClick={() => setEditOpen(false)} aria-hidden />

            <motion.form initial={{ y: 20 }} animate={{ y: 0 }} className="relative bg-[#0e0e10] rounded-2xl shadow-lg max-w-2xl w-full p-6 z-50" onSubmit={handleSubmit}>
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-white">Edit profile</h3>
                <button type="button" onClick={() => setEditOpen(false)} className="text-gray-400">Close</button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="text-xs text-gray-400">Display name</span>
                  <input name="displayName" value={form.displayName} onChange={handleChange} className="mt-1 p-2 border rounded bg-[#0b0b0d] text-white" required />
                </label>

                <label className="flex flex-col">
                  <span className="text-xs text-gray-400">Handle (locked)</span>
                  <input name="userHandle" value={data.userHandle} readOnly className="mt-1 p-2 border rounded bg-[#0b0b0d] text-gray-400" />
                </label>

                <label className="flex flex-col md:col-span-2">
                  <span className="text-xs text-gray-400">Bio</span>
                  <textarea name="bio" value={form.bio} onChange={handleChange} className="mt-1 p-2 border rounded bg-[#0b0b0d] text-white" rows={3} />
                </label>

                <label className="flex flex-col">
                  <span className="text-xs text-gray-400">Email</span>
                  <input name="email" value={form.email} onChange={handleChange} type="email" className="mt-1 p-2 border rounded bg-[#0b0b0d] text-white" placeholder="you@example.com" />
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setEditOpen(false)} className="px-4 py-2 rounded-lg border text-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 text-white">Save changes</button>
              </div>
            </motion.form>
          </motion.div>
        )}

      </div>
    </div>
  )
}

/* ---------------- Components ---------------- */
function Header({ onEdit, onOpenSettings }) {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-sm text-gray-400">Welcome to your Codamigos profile</p>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onEdit} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#141416] border border-[#28282b] hover:shadow-md">
          <Edit2 size={16} />
          <span className="hidden sm:inline">Edit profile</span>
        </button>
      </div>
    </header>
  )
}

function AvatarCard({ avatar, displayName, userHandle, bio, elo, joined }) {
  return (
    <div className="bg-[#111113] border border-[#232326] rounded-2xl p-5 text-center">
      <img src={avatar} alt="avatar" className="w-28 h-28 rounded-full mx-auto object-cover ring-2 ring-[#1f1f23]" />
      <h3 className="mt-3 text-lg font-semibold text-white">{displayName}</h3>
      <p className="text-sm text-gray-400">{userHandle}</p>
      <p className="mt-2 text-sm text-gray-200">{bio}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div>
          <div className="text-xs text-gray-400">ELO</div>
          <div className="font-medium text-white">{elo ?? '—'}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Joined</div>
          <div className="font-medium text-white">{joined}</div>
        </div>
      </div>

      {/* Notice: no change-avatar controls — avatar is locked */}
    </div>
  )
}

function LeaderboardCard() {
  // small mocked leaderboard
  const leaders = [
    { name: 'Ace', handle: '@ace', elo: 920 },
    { name: 'Byte', handle: '@byte', elo: 870 },
    { name: 'God_itachii', handle: '@testHandle', elo: 620 },
  ]

  return (
    <div className="bg-[#111113] border border-[#232326] rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <h5 className="text-sm text-gray-400">Leaderboard</h5>
        <span className="text-xs text-gray-400">Top</span>
      </div>

      <ul className="mt-3 space-y-2">
        {leaders.map((l, i) => (
          <li key={i} className="flex items-center justify-between text-sm">
            <div>
              <div className="font-medium text-white">{l.name}</div>
              <div className="text-xs text-gray-400">{l.handle}</div>
            </div>
            <div className="font-semibold text-white">{l.elo}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProfileHeader({ data, progress }) {
  return (
    <div className="bg-[#111113] border border-[#232326] rounded-2xl p-5 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-white">{data.displayName}</h2>
        <p className="text-sm text-gray-400">{data.bio || 'No bio provided.'}</p>
      </div>

      <div className="w-48">
        <div className="text-xs text-gray-400">Rank progress</div>
        <div className="mt-2 bg-[#0b0b0d] rounded-full h-3 overflow-hidden border border-[#242427]">
          <div className="h-3 rounded-full" style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#7c3aed,#06b6d4)' }} />
        </div>
        <div className="mt-1 text-xs text-gray-400">ELO: <span className="font-medium text-white">{data.elo ?? '—'}</span></div>
      </div>
    </div>
  )
}

function ContactCard({ email, socials }) {
  return (
    <div>
      <h4 className="font-medium text-white">Contact</h4>
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Mail size={14} />
          <span className="text-gray-200">{email || 'Not provided'}</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {socials?.github ? <a href={socials.github} className="text-sm underline" target="_blank" rel="noreferrer">GitHub</a> : null}
          {socials?.linkedin ? <a href={socials.linkedin} className="text-sm underline" target="_blank" rel="noreferrer">LinkedIn</a> : null}
          {socials?.website ? <a href={socials.website} className="text-sm underline" target="_blank" rel="noreferrer">Website</a> : null}
        </div>
      </div>
    </div>
  )
}

function RecentMatches({ matches }) {
  if (!matches || matches.length === 0) return <p className="text-sm text-gray-400">No recent matches.</p>
  return (
    <ul className="space-y-2 mt-2">
      {matches.map((m, i) => (
        <li key={i} className="flex items-center justify-between text-sm text-gray-200">
          <div>{m.opponent}</div>
          <div className="text-xs text-gray-400">{m.result}</div>
        </li>
      ))}
    </ul>
  )
}

function BadgeList({ badges }) {
  if (!badges || badges.length === 0) return <p className="text-sm text-gray-400">No badges yet.</p>
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {badges.map((b, i) => (
        <div key={i} className="px-2 py-1 bg-[#0b0b0d] border border-[#232326] rounded-md text-sm">{b}</div>
      ))}
    </div>
  )
}

function PerformanceRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="font-medium text-white">{value}</div>
    </div>
  )
}

