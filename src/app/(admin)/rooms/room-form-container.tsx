"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { type Room, type CreateRoomDto, roomService } from "@/core/services/user/list-room-service"
import { RoomForm } from "./room-form"
import toast from "react-hot-toast"
import { Card, CardContent } from "@src/core/components/ui/card"
import { Skeleton } from "@src/core/components/ui/skeleton"

interface RoomFormContainerProps {
    id?: number
}

export function RoomFormContainer({ id }: RoomFormContainerProps) {
    const [room, setRoom] = useState<Room | null>(null)
    const [isLoading, setIsLoading] = useState(id ? true : false)
    const router = useRouter()
    const isEditing = !!id

    useEffect(() => {
        if (id) {
            const fetchRoom = async () => {
                try {
                    setIsLoading(true)
                    const data = await roomService.getRoomById(id)
                    setRoom(data)
                } catch (error) {
                    console.error(error)
                    toast.error("Failed to fetch room details")
                    router.push("/rooms")
                } finally {
                    setIsLoading(false)
                }
            }

            fetchRoom()
        }
    }, [id, router])

    const handleSuccess = async (data: CreateRoomDto & { file?: File }) => {
        try {
            if (isEditing && room?.id) {
                await roomService.updateRoom(room.id, data)
                toast.success("Room updated successfully")
            } else {
                await roomService.createRoom(data)
                toast.success("Room created successfully")
            }
            router.push("/rooms")
        } catch (error) {
            console.error(error)
            toast.error(`Failed to ${isEditing ? "update" : "create"} room`)
        }
    }

    const handleCancel = () => {
        router.push("/rooms")
    }

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-[200px]" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <RoomForm
            room={room}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
        />
    )
} 