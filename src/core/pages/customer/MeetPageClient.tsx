'use client'
import MeetingCard from '@/core/components/customer/MeetingCard'

const meetings = [
  {
    image: 'https://museumhack.com/wp-content/uploads/2023/05/Interactive-meeting-ideas.jpg',
    view: '10000',
    date: 'Nov 12',
    title: 'New Lecturers Meeting',
    description: 'Morbi in libero blandit lectus cursus ullamcorper.',
    link: '/meeting-details',
  },
  {
    image:
      'https://media.licdn.com/dms/image/v2/D4D12AQG8sF209pYlQA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1701409813124?e=2147483647&v=beta&t=rcK3hCpOLJA9xQYQJu0QuebFhIdFW9clcQSfjy0wJaw',
    view: '5000',
    date: 'Nov 14',
    title: 'Online Teaching Techniques',
    description: 'Morbi in libero blandit lectus cursus ullamcorper.',
    link: '/meeting-details',
  },
  // Add more meetings here...
]

const MeetingsPage = () => {
  return (
    <div className='h-full w-full'>
      <section className='bg-gray-100 py-8'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-gray-800 mb-6'>Upcoming Meetings</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {meetings.map((meeting, index) => (
              <MeetingCard key={index} {...meeting} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default MeetingsPage
