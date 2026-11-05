import { notFound, redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { parseQuiz } from '@/lib/daily'
import DailyPostForm from '../DailyPostForm'

export const dynamic = 'force-dynamic'

export default async function UrediDnevnuPorukuPage({ params }: { params: { id: string } }) {
  if (!(await requireAuth())) redirect('/admin')

  const post = await prisma.dailyPost.findUnique({ where: { id: parseInt(params.id) } })
  if (!post) notFound()

  return (
    <DailyPostForm
      id={post.id}
      initial={{
        rubric: post.rubric,
        date: post.date,
        title: post.title,
        teaser: post.teaser ?? '',
        body: post.body,
        source: post.source ?? '',
        videoUrl: post.videoUrl ?? '',
        link: post.link ?? '',
        quiz: parseQuiz(post.quiz) ?? [],
        published: post.published,
      }}
    />
  )
}
