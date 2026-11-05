import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { addDays, DAILY_RUBRICS, DATE_RE, rubricOf, todayKey, weekdayOf } from '@/lib/daily'
import DailyPostForm from '../DailyPostForm'

export const dynamic = 'force-dynamic'

// ?date=YYYY-MM-DD&rubric=key come from the empty days in the plan
export default async function NovaDnevnaPorukaPage({ searchParams }: { searchParams: { date?: string; rubric?: string } }) {
  if (!(await requireAuth())) redirect('/admin')

  const date = searchParams.date && DATE_RE.test(searchParams.date) ? searchParams.date : addDays(todayKey(), 1)
  const rubric = rubricOf(searchParams.rubric ?? '')?.key ?? DAILY_RUBRICS.find(r => r.weekday === weekdayOf(date))!.key

  return (
    <DailyPostForm
      initial={{ rubric, date, title: '', teaser: '', body: '', source: '', videoUrl: '', link: '', quiz: [], published: true }}
    />
  )
}
