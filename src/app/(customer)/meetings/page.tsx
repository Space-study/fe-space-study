import MeetingsPage from '@src/core/pages/customer/MeetPageClient'

const sampleData = [
  {
    image: 'https://www.dragosroua.com/wp-content/uploads/2019/03/coffee-shop-1149155_1920.jpg',
    alt: 'Meeting 1',
    title: 'Team Sync',
    category: 'Work',
    status: 'Online',
    count: 154,
  },
  {
    image: 'https://www.dragosroua.com/wp-content/uploads/2019/03/coffee-shop-1149155_1920.jpg',
    alt: 'Meeting 2',
    title: 'Study Group',
    category: 'Education',
    status: 'Active',
    count: 85,
  },
  {
    image: 'https://www.dragosroua.com/wp-content/uploads/2019/03/coffee-shop-1149155_1920.jpg',
    alt: 'Meeting 3',
    title: 'Remote Collaboration',
    category: 'Remote Work',
    status: 'Online',
    count: 230,
  },
  {
    image: 'https://www.dragosroua.com/wp-content/uploads/2019/03/coffee-shop-1149155_1920.jpg',
    alt: 'Meeting 2',
    title: 'Study Group',
    category: 'Education',
    status: 'Active',
    count: 85,
  },
  {
    image: 'https://www.dragosroua.com/wp-content/uploads/2019/03/coffee-shop-1149155_1920.jpg',
    alt: 'Meeting 3',
    title: 'Remote Collaboration',
    category: 'Remote Work',
    status: 'Online',
    count: 230,
  },
]

export default function CustomerPage() {
  return <MeetingsPage data={sampleData} />
}
