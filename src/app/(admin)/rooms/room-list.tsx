"use client";

import { useState } from "react";
import type { Room } from "@/core/services/user/list-room-service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@src/core/components/ui/table";
import { Button } from "@src/core/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@src/core/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash2, Users, Lock, Globe, Filter } from "lucide-react";
import { Card, CardContent } from "@src/core/components/ui/card";
import { Skeleton } from "@src/core/components/ui/skeleton";
import Link from "next/link";

interface RoomListProps {
    rooms: Room[];
    isLoading: boolean;
    onDelete: (id: number) => void;
}

export function RoomList({ rooms, isLoading, onDelete }: RoomListProps) {
    const [filter, setFilter] = useState<"all" | "public" | "private">("all");

    const handleDeleteClick = (id: number) => {
        if (window.confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
            onDelete(id);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const filteredRooms = rooms.filter((room) => {
        if (filter === "public") return room.privacy !== "private";
        if (filter === "private") return room.privacy === "private";
        return true;
    });

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center space-x-4 mb-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (rooms.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No rooms found</h3>
                <p className="text-sm text-muted-foreground mt-2">Get started by creating a new room.</p>
            </div>
        );
    }

    return (
        <div>
            {/* Filter UI */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Room List</h2>
                <div className="flex space-x-2">
                    <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
                        <Filter className="h-4 w-4 mr-2" /> All
                    </Button>
                    <Button variant={filter === "public" ? "default" : "outline"} onClick={() => setFilter("public")}>
                        <Globe className="h-4 w-4 mr-2" /> Public
                    </Button>
                    <Button variant={filter === "private" ? "default" : "outline"} onClick={() => setFilter("private")}>
                        <Lock className="h-4 w-4 mr-2" /> Private
                    </Button>
                </div>
            </div>

            {/* Table UI */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Privacy</TableHead>
                            <TableHead>Max Members</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRooms.map((room) => (
                            <TableRow key={room.id}>
                                <TableCell>{room.id}</TableCell>
                                <TableCell className="font-medium">{room.name}</TableCell>
                                <TableCell>
                                    {room.privacy === "private" ? (
                                        <Lock className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </TableCell>
                                <TableCell>{room.maxMembers}</TableCell>
                                <TableCell>{room.category || "N/A"}</TableCell>
                                <TableCell>{room.status}</TableCell>
                                <TableCell>{formatDate(room.createdAt)}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <Link href={`/rooms/${room.id}`}>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                            </Link>
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onClick={() => handleDeleteClick(room.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
