"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { type Room, type CreateRoomDto } from "@/core/services/user/list-room-service"
import { Button } from "@src/core/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@src/core/components/ui/form"
import { Input } from "@src/core/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@src/core/components/ui/card"
import { Loader2, ImageIcon, Upload } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@src/core/components/ui/select"
import Image from "next/image"

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    privacy: z.enum(["public", "private"]),
    maxMembers: z.coerce.number().int().positive(),
    category: z.string().min(1, "Category is required"),
    status: z.enum(["active", "inactive", "pending"]),
})

type FormValues = z.infer<typeof formSchema>

interface RoomFormProps {
    room?: Room | null
    onSuccess: (data: CreateRoomDto) => void
    onCancel: () => void
}

export function RoomForm({ room, onSuccess, onCancel }: RoomFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>(room?.imageUrl || "")
    const isEditing = !!room

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: room?.name || "",
            privacy: room?.privacy || "public",
            maxMembers: room?.maxMembers || 10,
            category: room?.category || "",
            status: (room?.status as "active" | "inactive" | "pending") || "pending",
        },
    })

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true)
        try {
            const formData: CreateRoomDto = {
                ...data,
                category: data.category || undefined,
                file: selectedFile || undefined,
            }
            onSuccess(formData)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.type.startsWith('image/')) {
                setSelectedFile(file)
                setPreviewUrl(URL.createObjectURL(file))
            } else {
                alert('Please select an image file')
            }
        }
    }

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    return (
        <Card>
            <CardHeader>
                <CardTitle>{isEditing ? "Edit Room" : "Create New Room"}</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter room name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="privacy"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Privacy</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select privacy setting" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="public">Public</SelectItem>
                                            <SelectItem value="private">Private</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maxMembers"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max Members</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Enter maximum number of members" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter category (optional)" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select room status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* File Upload */}
                        <div className="space-y-2">
                            <FormLabel>Room Image</FormLabel>
                            <div className="flex items-center gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('file')?.click()}
                                    className="w-full">
                                    <Upload className="mr-2 h-4 w-4" />
                                    {isEditing ? 'Change Image' : 'Upload Image'}
                                </Button>
                                <Input
                                    id="file"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    required={!isEditing}
                                />
                            </div>
                        </div>

                        {/* Image Preview */}
                        {previewUrl && (
                            <div className="relative aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden border">
                                <Image
                                    src={previewUrl}
                                    alt="Room preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        {!previewUrl && (
                            <div className="relative aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                                <ImageIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                        )}

                        <div className="flex justify-end space-x-4">
                            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? "Update" : "Create"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
} 