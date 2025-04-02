'use client'

import { useEffect, useState } from 'react'
import { userService } from '@src/core/services/auth/auth'
import { Input } from '@src/core/components/ui/input'
import { Button } from '@src/core/components/ui/button'

export default function UserProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ firstName: '', lastName: '' })

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [token, setToken] = useState('') // Có thể thay bằng token từ query hoặc logic reset riêng

  useEffect(() => {
    userService.getProfile().then(data => {
      setProfile(data)
      setFormData({ firstName: data.firstName || '', lastName: data.lastName || '' })
    })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleUpdateProfile = async () => {
    try {
      const updated = await userService.updateProfile(formData)
      setProfile(updated)
      setIsEditing(false)
      alert('Profile updated!')
    } catch (err) {
      console.error(err)
      alert('Failed to update profile')
    }
  }

  const handleChangePassword = async () => {
    if (!password || password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      await userService.resetPassword(password, token)
      setPassword('')
      setConfirmPassword('')
      alert('Password changed!')
    } catch (err) {
      console.error(err)
      alert('Failed to change password')
    }
  }

  if (!profile) return <p>Loading...</p>

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">User Profile</h1>

      <div className="space-y-4">
        <div>
          <label>Email</label>
          <Input value={profile.email} disabled />
        </div>

        <div>
          <label>First Name</label>
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div>
          <label>Last Name</label>
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>


        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleUpdateProfile}>Save</Button>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        )}
      </div>

      <hr className="my-6" />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Change Password</h2>
        <Input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        <Button onClick={handleChangePassword}>Update Password</Button>
      </div>
    </div>
  )
}
