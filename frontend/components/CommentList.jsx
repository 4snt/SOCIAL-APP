'use client'

import Link from 'next/link'
import Avatar from './Avatar'
import TimeAgo from './TimeAgo'
import UserBadge from './UserBadge'

export default function CommentList({ comments, limit }) {
  if (!comments?.length) {
    return <p className="px-4 py-3 text-sm text-neutral-500">Seja o primeiro a comentar.</p>
  }

  const visible = limit ? comments.slice(-limit) : comments

  return (
    <ul className="divide-y divide-neutral-100">
      {visible.map((c) => (
        <li key={c.id} className={`flex gap-2 px-3 py-3 sm:gap-3 sm:px-4 ${c.userType === 'ADMIN' ? 'bg-violet-50/80 border-l-4 border-l-violet-400' : c.userType === 'UNIVERSITY' ? 'bg-sky-50/70 border-l-4 border-l-sky-400' : ''}`}>
          <Avatar username={c.username} avatarUrl={c.avatarUrl} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <Link
                href={`/u/${c.username}`}
                className="text-sm font-semibold text-neutral-900 hover:underline"
              >
                @{c.username}
              </Link>
              <UserBadge userType={c.userType} />
              <span title={c.authorOnline ? 'Online' : 'Offline'} className={`h-2 w-2 rounded-full ${c.authorOnline ? 'bg-green-500' : 'bg-neutral-300'}`} />
              <TimeAgo date={c.createdAt} />
            </div>
            <p className="break-words text-sm text-neutral-700">{c.content}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
