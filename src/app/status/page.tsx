//@ts-nocheck
"use client";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { ChevronDown, HomeIcon, Lightbulb, Phone } from "lucide-react";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/general-components/navbar";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";

import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import dynamic from "next/dynamic";
const Column = dynamic(
  () => import("@/components/draggable/column/columns"),
  { ssr: false }
);
function StatusPage() {
  const searchParams = useSearchParams();
  // Extract query parameters
  const callStatus = {
    isInitiated: searchParams.get("isInitiated") === "true",
    ssid: searchParams.get("ssid") || "N/A",
    objective: searchParams.get("objective") || "",
    patient_number: searchParams.get("patient_number") || "",
    patient_name: searchParams.get("patient_name") || "",
    patient_history: searchParams.get("patient_history") || "",
  };

  // const [isSatisfied, setIsSatisfied] = useState(null);
  // const [objective, setObjective] = useState(callStatus.objective);
  // const [phoneNumber] = useState(callStatus.patient_number);
  // const [patientHistory] = useState(callStatus.patient_history);
  // const [patientName] = useState(callStatus.patient_name);
  // const [transcriptArray, setTranscriptArray] = useState([]);
  const [showTranscript, setShowTranscript] = useState(false);
  // const [isCallEnded, setIsCallEnded] = useState(false);
  // const router = useRouter();
  const [tasks, setTasks] = useState([
    { id: 1, name: "Dr. Smith" },
    { id: 2, name: "Dr. Johnson" },
    { id: 3, name: "Dr. Williams" },
    { id: 4, name: "Dr. Brown" },
    { id: 5, name: "Dr. Taylor" },
    { id: 6, name: "Dr. Anderson" },
    { id: 7, name: "Dr. Thomas" },
    { id: 8, name: "Dr. Jackson" },
    { id: 9, name: "Dr. White" },
    { id: 10, name: "Dr. Harris" },
  ]);

  // const handleSatisfied = () => {
  //   router.push("/");
  // };

  // const addTask = (title) => {
  //   setTasks((tasks) => [...tasks, { id: tasks.length + 1, title }]);
  // };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getTaskPos = (id: any) => tasks.findIndex((task) => task.id === id);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    setTasks((tasks) => {
      const originalPos = getTaskPos(active.id);
      const newPos = getTaskPos(over.id);

      const updatedTasks = [...tasks];
      const [movedTask] = updatedTasks.splice(originalPos, 1);
      updatedTasks.splice(newPos, 0, movedTask);

      return updatedTasks;
    });
  };
  // const handleEndCall = async () => {
  //   // Example endpoint
  //   // await axios.post(`${"backendUrl"}/end-call`, { call_sid: callStatus.ssid });
  //   setIsCallEnded(true);
  // };

  // const handleMakeCall = async () => {
  //   try {
  //     const backendUrl =
  //       "https://callai-backend-243277014955.us-central1.run.app/api/v2/initiate-call";

  //     if (!phoneNumber || !patientName || !objective || !patientHistory) {
  //       router.push("/contact");
  //       throw "Fill all fields";
  //     }

  //     const response = await axios.post(backendUrl, {
  //       patient_number: phoneNumber,
  //       patient_name: patientName,
  //       objective,
  //       patient_history: patientHistory,
  //     });

  //     router.push({
  //       pathname: "/status",
  //       query: {
  //         ssid: response.data.call_sid,
  //         isInitiated: true,
  //         patient_number: phoneNumber,
  //         patient_name: patientName,
  //         objective,
  //         patient_history: patientHistory,
  //       },
  //     });
  //   } catch (error) {
  //     console.error(
  //       "Failed to initiate the call. Error:",
  //       error.response?.data?.detail || error.message
  //     );
  //   }
  // };

  // useEffect(() => {
  //   let ws;

  //   if (callStatus.isInitiated) {
  //     setShowTranscript(true);
  //     setTranscriptArray([]);
  //     ws = new WebSocket(
  //       "wss://callai-backend-243277014955.us-central1.run.app/ws/notifications"
  //     );
  //     // ws = new WebSocket(
  //     //   "wss://dc6b-103-199-205-140.ngrok-free.app/ws/notifications"
  //     // );
  //     ws.onopen = () => {
  //       console.log("WebSocket connected.");
  //       ws.send(
  //         JSON.stringify({ event: "start", transcription_id: "YOUR_ID" })
  //       );
  //     };

  //     ws.onmessage = (event) => {
  //       const data = JSON.parse(event.data);

  //       if (data.event === "call_ended") {
  //         // const emailStatus = data.email_send;
  //         // console.log(data)
  //         // if (emailStatus){
  //         //     toast({
  //         //       title: "Call Ended",
  //         //       duration: 20000,
  //         //       className: "bg-white text-black font-semibold",
  //         //     });
  //         // }
  //         // else{
  //         //   toast({
  //         //     title: "Call Ended",
  //         //     description: `Failed to Send Transcript to ${email}`,
  //         //     duration: 20000,
  //         //     className: "bg-white text-red font-semibold",
  //         //   });
  //         // }
  //         if (ws) ws.close();
  //       }

  //       if (data.event === "call_in_process") {
  //         const timestamp = new Date().toLocaleTimeString();
  //         setTranscriptArray((prev) => [
  //           ...prev,
  //           `[${timestamp}] ${data.transcription}`,
  //         ]);
  //       }
  //     };

  //     ws.onclose = () => {
  //       console.log("WebSocket disconnected.");
  //     };

  //     ws.onerror = (error) => {
  //       console.error("WebSocket Error:", error);
  //     };
  //   }
  // }, [callStatus.isInitiated, callStatus.ssid, callStatus.email]);

  const getDisplayTranscript = () => {
    if (transcriptArray.length > 0) {
      return transcriptArray.map((transcript) => `${transcript}\n`).join("");
    }
    return "Waiting for conversation to begin...";
  };

  return (
    <div className="mt-20 h-screen ">
      <Navbar />
      <div className="px-8 flex  flex-col bg-blue-100 py-8 h-full overflow-hidden">
        <p className="text-xl font-bold">Call Status Page </p>
        <p className="flex text-gray-600 text-lg pt-4">
          <Lightbulb className="text-red-500" />
          Note: Feel free to close this browser. A summary of the interaction(s)
          will be sent to your email.
        </p>
        <div className="md:grid md:grid-cols-2 flex flex-col gap-2 md:gap-12 w-full md:mt-6 mt-2 text-lg h-2/3">
          <Card className="rounded-lg space-y-4 px-6 py-6 ">
            <p className="text-xl font-bold bg-[#E86F2714] text-[#EB6F27] px-2 py-2">
              Request Status
            </p>
            <p className=" font-semibold  text-[#EB6F27] px-2 py-2">
              Al will call the following doctors in this sequence:
            </p>
            <DndContext
              onDragEnd={handleDragEnd}
              sensors={sensors}
              collisionDetection={closestCorners}
            >
              {/* <ol className="list-decimal list-inside">
                {doctors.map((doctor, index) => (
                  <li key={doctor.id}>
                    {index === 0 ? "✅" : "❌"} {doctor.name}
                  </li>
                ))}
              </ol> */}
              <ScrollArea className="h-96">
                <Column id="toDo" tasks={tasks} />
              </ScrollArea>
              <div className="flex justify-between">
                <Button className="px-4 py-6 bg-[#EB6F27] ">
                  {" "}
                  Confirm the doctor sequence
                </Button>
                <p className="px-2 py-2 text-sm text-gray-600">
                  NB: You can move cards to adjust sequence
                </p>
              </div>
            </DndContext>

            {/* {callStatus.isInitiated ? (
              <div className="flex flex-col gap-4">
                ✅ Call Initiated Successfully!
                <p className="text-gray-600">
                  AI is calling the following patient(s):
                </p>
                <p>Patient name: {callStatus.patient_name || "N/A"}</p>
                <p>Patient phone number: {phoneNumber || "N/A"}</p>
                <p>Objective: {objective}</p>
              </div>
            ) : (
              <div>⏳ Call Not Initiated... Please Wait.</div>
            )} */}
          </Card>

          <Suspense>
            <Card className="flex-grow rounded-lg space-y-4 px-6 py-6 overflow-y-auto">
              <p className="text-xl font-bold bg-[#24AD4214] text-[#24AD42] px-2 py-2">
                Call transcript
              </p>
              <ScrollArea className="h-full">
                {showTranscript && (
                  <pre className="whitespace-pre-wrap pt-4 max-h-96 overflow-y-auto">
                    {getDisplayTranscript()}
                  </pre>
                )}
              </ScrollArea>
            </Card>
          </Suspense>
        </div>
        <div className="flex  w-full items-center justify-center self-center mt-20 gap-12 pl-16 ">
          <Link href="/home ">
            <Button className="px-8 py-6">
              {" "}
              <HomeIcon />
              Home
            </Button>
          </Link>
          <Link href="/contact">
            <Button className="bg-blue-900 px-8 py-6">
              {" "}
              <Phone /> Call more patients
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default function Status() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StatusPage />
    </Suspense>
  );
}
