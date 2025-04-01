"use client";

import { useEffect, useState } from "react";
import { RoomFormContainer } from "../room-form-container";

interface RoomEditPageProps {
  params: Promise<{id: string}>
}

export default function EditRoomPage({ params }: RoomEditPageProps) {
  const [paramId, setParamId] = useState<string | null>(null)

   useEffect(() => {
      params.then(({id}) => {
        setParamId(id)
      })
    }, [params])

  const id = Number(paramId);

  if (isNaN(id)) {
    return (
      <div className="container mx-auto py-10 text-red-500">
        <h1 className="text-3xl font-bold mb-6">Invalid Room ID</h1>
        <p>The provided room ID is not valid.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Room</h1>
      <RoomFormContainer id={id} />
    </div>
  );
}