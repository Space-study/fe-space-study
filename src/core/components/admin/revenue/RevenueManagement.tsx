'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@src/core/components/ui/card'
import { Button } from '@src/core/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

const sampleData = [
  { month: 'January', revenue: 5000, expenses: 3000 },
  { month: 'February', revenue: 6000, expenses: 4000 },
  { month: 'March', revenue: 8000, expenses: 4500 },
  { month: 'April', revenue: 7000, expenses: 3500 },
  { month: 'May', revenue: 9000, expenses: 5000 },
  { month: 'June', revenue: 10000, expenses: 7000 },
]

// Colors for Pie Chart
const COLORS = ['#4caf50', '#f44336']

export default function RevenueManagement() {
  const [selectedMonth, setSelectedMonth] = useState('')

  const handleMonthClick = (month: string) => {
    setSelectedMonth(month)
  }

  const totalRevenue = sampleData.reduce((acc, item) => acc + item.revenue, 0)
  const totalExpenses = sampleData.reduce((acc, item) => acc + item.expenses, 0)

  const pieData = [
    { name: 'Revenue', value: totalRevenue },
    { name: 'Expenses', value: totalExpenses },
  ]

  return (
    <div className="p-4 flex flex-col min-h-screen">
   
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Revenue Management</h1>
        <Button variant="default" onClick={() => alert('Add New Report')}>
          Add Report
        </Button>
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
       
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart width={600} height={300} data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#4caf50" />
              <Bar dataKey="expenses" fill="#f44336" />
            </BarChart>
          </CardContent>
        </Card>

       
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <PieChart width={300} height={300}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </CardContent>
        </Card>
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleData.map((data) => (
          <Card
            key={data.month}
            className={`hover:shadow-lg ${
              selectedMonth === data.month ? 'border border-blue-500' : ''
            }`}
            onClick={() => handleMonthClick(data.month)}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold">{data.month}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p>Revenue: ${data.revenue}</p>
              <p>Expenses: ${data.expenses}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
