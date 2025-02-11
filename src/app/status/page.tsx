//@ts-nocheck
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/general-components/navbar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Column from "@/components/draggable/column/columns";
import axios from "axios";
import { HomeIcon, Lightbulb, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";

export default function Status() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [transcriptArray, setTranscriptArray] = useState([]);
  const [callStatus, setCallStatus] = useState({
    isInitiated: false,
    ssid: "",
    email: "",
  });
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [extractedData, setExtractedData] = useState<TaskType[]>([]);
  useEffect(() => {
    const storedData = sessionStorage.getItem("statusData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const sortedData = parsedData.results
        .slice(0, 10)
        .sort((a, b) => {
          if (a.rating == null && b.rating == null) return 0; // Both have no rating, keep order
          if (a.rating == null) return 1; // Move items without a rating to the bottom
          if (b.rating == null) return -1; // Keep rated items at the top
          return b.rating - a.rating; // Sort by rating (highest first)
        })
        .map((item, index) => ({
          ...item,
          name: `${index + 1}. ${item.name}`, // Preserve index logic
          id: item.place_id,
        }));

      setDoctors(sortedData);
    } else {
      router.push("/");
    }
  }, [router]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Get old & new indexes
    const oldIndex = doctors.findIndex((doctor) => doctor.id === active.id);
    const newIndex = doctors.findIndex((doctor) => doctor.id === over.id);

    // Move items in the array
    const newSortedDoctors = arrayMove(doctors, oldIndex, newIndex).map(
      (doctor, index) => ({
        ...doctor,
        name: `${index + 1}. ${doctor.name.replace(/^\d+\.\s*/, "")}`, // Renumber dynamically
      })
    );

    setDoctors(newSortedDoctors);
  };

  const fetchPhoneNumbers = async () => {
    return await Promise.all(
      doctors.map(async (doctor) => {
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json?fields=name,rating,formatted_phone_number,opening_hours,reviews,geometry&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&place_id=${doctor.place_id}`
          );
          return response.data.result.formatted_phone_number;
        } catch (error) {
          console.error(
            `Error fetching details for ${doctor.place_id}:`,
            error
          );
          return null;
        }
      })
    );
  };

  const handleConfirmSequence = async () => {
    setIsConfirmed(true); // Disable button and dragging

    try {
      const phoneNumbers = await Promise.all(
        doctors.map(async (doctor) => {
          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/place/details/json?fields=name,rating,formatted_phone_number,opening_hours,reviews,geometry&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&place_id=${doctor.place_id}`
            );
            console.log(`Response for ${doctor.place_id}:`, response.data);
            return response.data.result.formatted_phone_number;
          } catch (error) {
            console.error(
              `Error fetching details for ${doctor.place_id}:`,
              error
            );
            return null;
          }
        })
      );

      // console.log("Phone numbers:", phoneNumbers);

      // Extract email and objective from formData
      const formData = JSON.parse(sessionStorage.getItem("formData"));
      const { email, objective } = formData;

      // Initiate call with the first doctor's phone number
      const firstDoctorPhoneNumber = phoneNumbers[0];
      console.log("First doctor's phone number:", firstDoctorPhoneNumber);

      const response = await axios.post(
        "https://callai-backend-243277014955.us-central1.run.app/api/initiate-call",
        {
          // to_number: firstDoctorPhoneNumber,
          to_number: "+2348167238042",
          email: email,
          objective: objective,
        }
      );

      setCallStatus({
        isInitiated: true,
        ssid: response.data.call_sid,
        email: email,
      });

      router.push(
        `/status?ssid=${
          response.data.call_sid
        }&isInitiated=true&patient_number=${encodeURIComponent(
          firstDoctorPhoneNumber
        )}`
      );
    } catch (error) {
      console.error("Error fetching phone numbers or initiating call:", error);
      setIsConfirmed(false); // Re-enable button and dragging if there's an error
    }
  };

  // useEffect(() => {
  //   let ws: WebSocket | null = null;

  //   if (callStatus.isInitiated && callStatus.ssid) {
  //     setShowTranscript(true);
  //     setTranscriptArray([]);

  //     ws = new WebSocket(
  //       "wss://callai-backend-243277014955.us-central1.run.app/ws/notifications"
  //     );

  //     ws.onopen = () => {
  //       console.log("WebSocket connected.");
  //       ws?.send(JSON.stringify({ event: "start", transcription_id: callStatus.ssid }));
  //     };

  //     ws.onmessage = (event) => {
  //       const data = JSON.parse(event.data);
  //       console.log("WebSocket Message:", data);

  //       if (data.event === "call_ended") {
  //         console.log("Call Ended Data:", data);

  //         // ✅ Show success or error for transcript email
  //         // if (data.email_send) {
  //         //   toast.success(`Transcript sent to ${patientNumber}`);
  //         // } else {
  //         //   toast.error(`Failed to send transcript to ${patientNumber}`);
  //         // }

  //         // ✅ Check if the appointment was booked
  //         if (data.appointment_booked === "yes") {
  //           toast.success("Appointment successfully booked!");
  //         } else {
  //           toast.error("Appointment was not booked. Retrying...");
  //           handleConfirmSequence(); // Reinitiate call
  //         }

  //         ws?.close();
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

  //   return () => {
  //     ws?.close();
  //   };
  // }, [callStatus.isInitiated, callStatus.ssid]);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let doctorIndex = 0; // Track the doctor being called

    const initiateCall = async (doctorPhoneNumber: string) => {
      try {
        const formData = JSON.parse(sessionStorage.getItem("formData"));
        if (!formData) {
          console.error("No formData found in sessionStorage.");
          return;
        }

        const { email, objective } = formData;

        const callResponse = await axios.post(
          "https://callai-backend-243277014955.us-central1.run.app/api/initiate-call",
          {
            to_number: doctorPhoneNumber,
            email,
            objective,
          }
        );

        router.push(
          `/status?ssid=${
            callResponse.data.call_sid
          }&isInitiated=true&patient_number=${encodeURIComponent(
            doctorPhoneNumber
          )}`
        );
      } catch (error) {
        console.error("Error initiating call:", error);
      }
    };

    if (callStatus.isInitiated && callStatus.ssid) {
      setShowTranscript(true);
      setTranscriptArray([]);

      ws = new WebSocket(
        "wss://callai-backend-243277014955.us-central1.run.app/ws/notifications"
      );

      ws.onopen = () => {
        console.log("WebSocket connected.");
        ws.send(
          JSON.stringify({ event: "start", transcription_id: callStatus.ssid })
        );
      };

      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log("WebSocket Message:", data);

        if (data.event === "call_ended") {
          console.log("Call Ended Data:", data);

          if (data.appointment_booked === "yes") {
            toast.success("Appointment Booked Successfully");
            ws?.close();
            return;
          }

          if (data.appointment_booked === "no") {
            toast.warning("Doctor unavailable. Trying next doctor...");

            // Move to the next doctor
            doctorIndex++;

            if (doctorIndex < doctors.length) {
              const nextDoctor = doctors[doctorIndex];
              console.log("Calling next doctor:", nextDoctor);
              const phoneNumbers = await fetchPhoneNumbers();
              console.log(" phone numbers:", phoneNumbers);

              const phoneNumber = phoneNumbers[doctorIndex];
              console.log("Calling phone number:", phoneNumber);
              if (phoneNumber) {
                await initiateCall(phoneNumber);
              } else {
                console.error("No phone number available for the next doctor.");
                toast.error("Next doctor has no phone number. Skipping...");
                doctorIndex++; // Move to the next doctor
              }
            }
          }
        }

        if (data.event === "call_in_process") {
          const timestamp = new Date().toLocaleTimeString();
          setTranscriptArray((prev) => [
            ...prev,
            `[${timestamp}] ${data.transcription}`,
          ]);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected.");
      };

      ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };
    }

    return () => {
      ws?.close();
    };
  }, [callStatus.isInitiated, callStatus.ssid, doctors]);

  const getDisplayTranscript = () => {
    if (transcriptArray.length > 0) {
      return transcriptArray.map((transcript) => `${transcript}\n`).join("");
    }
    return "Waiting for conversation to begin...";
  };
  const handleEndCall = async () => {
    // await axios.post(`${"backendUrl"}/end-call`, { call_sid: callStatus.ssid });
    setIsCallEnded(true);
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
              collisionDetection={closestCenter}
            >
              <ScrollArea className="h-96 w-full">
                <Column tasks={doctors} isDraggable={!isConfirmed} />
              </ScrollArea>
              <div className="flex justify-between">
                <Button
                  className="px-4 py-6 bg-[#EB6F27] "
                  onClick={handleConfirmSequence}
                  disabled={isConfirmed}
                >
                  Confirm the doctor sequence
                </Button>
                <p className="px-2 py-2 text-sm text-gray-600">
                  NB: You can move cards to adjust sequence
                </p>
              </div>
            </DndContext>
          </Card>

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
