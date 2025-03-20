'use client'

import MeetingCard from '@/core/components/customer/MeetingCard'

interface MeetingsPageProps {
  data: {
    id: number
    image: string
    alt: string
    title: string
    category: string
    status: string
    count: number
    privacy: 'public' | 'private'
    inviteLink?: string
  }[]
}

const MeetingsPage = ({ data }: MeetingsPageProps) => {

  return (
    <div className="h-full w-full">
      <section className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">All Meetings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.map((item) => {
              return <MeetingCard key={item.id} data={item} />;
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MeetingsPage
