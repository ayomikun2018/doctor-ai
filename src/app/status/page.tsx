//@ts-nocheck
"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  const [phoneNumbers, setPhoneNumbers] = useState<(string | null)[]>([]);
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
  const [activeCallIndex, setActiveCallIndex] = useState(0);
  useEffect(() => {
    const storedData = sessionStorage.getItem("statusData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const sortedData = parsedData.results.slice(0, 5).map((item, index) => ({
        ...item,
        id: item.place_id, // Keep unique ID
      }));
      setDoctors(sortedData);
    } else {
      router.push("/");
    }
  }, [router]);

  const handleDragEnd = (event) => {
    if (isConfirmed) return; // Prevent reordering if call sequence has started

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = doctors.findIndex((doctor) => doctor.id === active.id);
    const newIndex = doctors.findIndex((doctor) => doctor.id === over.id);

    const newSortedDoctors = arrayMove(doctors, oldIndex, newIndex).map(
      (doctor, index) => ({
        ...doctor,
        name: `${doctor.name.replace(/^\d+\.\s*/, "")}`, // Renumber dynamically
      })
    );

    setDoctors(newSortedDoctors);
  };
  const fetchPhoneNumbers = async () => {
    const numbers = await Promise.all(
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
    setPhoneNumbers(numbers);
     // console.log(doctors,numbers,'xxxx')
  };
useEffect(()=> {
  if(doctors.length){
    fetchPhoneNumbers()
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
},[doctors])



  const handleConfirmSequence = async () => {
    setIsConfirmed(true); // Disable button and dragging

    try {

      // console.log("Phone numbers:", phoneNumbers);

      // Extract email and objective from formData
      const formData = JSON.parse(sessionStorage.getItem("formData"));
      const { email,phoneNumber,patientName,objective } = formData;
      // console.log({formData})

      // Initiate call with the first doctor's phone number
      const firstDoctorPhoneNumber =   phoneNumbers[activeCallIndex]; // '+2348168968260'
      console.log("current doctor's phone number:", firstDoctorPhoneNumber);
      const data = {
        objective: "Schedule an appointment",
        context: objective,
        //context:"dob,address_of_patient,availability_of_patient,insurance_details,clinical_concerns",
        caller_number: phoneNumber,
        caller_name: patientName,
        name_of_org: doctors[activeCallIndex]?.name,
        caller_email: email,
        phone_number: firstDoctorPhoneNumber,
      }
      // console.log({data})
      const response = await axios.post(
        "https://callai-backend-243277014955.us-central1.run.app/api/assistant-initiate-call",
        data
      );

      setCallStatus({
        isInitiated: true,
        ssid: response.data.call_id,
        email: email,
      });
      console.log('new idx',response.data.call_id)

      router.push(
        `/status?ssid=${
          response.data.call_id
        }&isInitiated=true&patient_num
        ber=${encodeURIComponent(
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

    const initiateCall = async (doctorPhoneNumber: string) => {
      console.log('new call initiated for', doctorPhoneNumber)
      try {
        const formData = JSON.parse(sessionStorage.getItem("formData"));
        if (!formData) {
          console.error("No formData found in sessionStorage.");
          return;
        }

        const { email,phoneNumber,patientName,objective } = formData;
        const data = {
          objective: "Schedule an appointment",
          context: objective,
          //context:"dob,address_of_patient,availability_of_patient,insurance_details,clinical_concerns",
          caller_number: phoneNumber,
          caller_name: patientName,
          name_of_org: doctors[activeCallIndex]?.name,
          caller_email: email,
          phone_number: doctorPhoneNumber,
        }

        const callResponse = await axios.post(
          "https://callai-backend-243277014955.us-central1.run.app/api/assistant-initiate-call",
          data
        );
        setCallStatus({
          isInitiated: true,
          ssid: callResponse.data.call_id,
          email: email,
        });
        console.log('new idddd',callResponse.data.call_id)
        router.push(
          `/status?ssid=${
            callResponse.data.call_id
          }&isInitiated=true&patient_number=${encodeURIComponent(
            doctorPhoneNumber
          )}`
        );
      } catch (error) {
        console.error("Error initiating call:", error);
      }
    };

    const moveToNextDoctor = async () => {
      let newIndex = 0;

      // Move to the next doctor
      setActiveCallIndex((prevIndex) => {
        newIndex = prevIndex + 1;
        return newIndex;
      });
      // console.log(newIndex,activeCallIndex)
      if (newIndex <= doctors.length) {
        const nextDoctor = doctors[newIndex];
        console.log("Calling next doctor:", nextDoctor);
        // ws?.close()

        const phoneNumber = phoneNumbers[newIndex]  //+2348168968260
        if (phoneNumber) {
          await initiateCall(phoneNumber);
        } else {
          console.log("No phone number available for the next doctor.");
          toast.error("Next doctor has no phone number. Skipping...");
         // setActiveCallIndex((prevIndex) => prevIndex + 1); // Move to the next doctor
        }
      }else {
        toast.success("All doctors have been called successfully..");
        setIsConfirmed(false)
      }
    }
    const connectWebSocket = () => {
      ws = new WebSocket(
        "wss://callai-backend-243277014955.us-central1.run.app/ws/notifications"
      );

      ws.onopen = () => {
        console.log("WebSocket connected.", callStatus);
        ws.send(
          JSON.stringify({ event: "start", transcription_id: callStatus.ssid })
        );
      };

      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        //console.log("WebSocket Message:", data);

        if (data.event === "call_ended") {
         // console.log("Call Ended Data:", data);
          setTimeout(async() => {
            const call_ended_result = await handleEndCall(data?.call_sid)
            // console.log({call_ended_result})
            if (call_ended_result?.data?.status == "yes") {
              toast.success("Appointment Booked Successfully");
              ws?.close();
              return;
            }
            else {
              toast.warning("Appointment could not be booked. Trying next doctor...");
              moveToNextDoctor()
            }
          }, 5000);
        }

        if (data.event === "call_in_process") {
          const timestamp = new Date().toLocaleTimeString();
          setTranscriptArray((prev) => [
            ...prev,
            `[${timestamp}] ${data.transcription}`,
          ]);
        }

        if(data.event === "call_not_picked") {
        // doctor did not pick call...move to next
        toast.info("Doctor did not pick call. Trying next doctor...");

        moveToNextDoctor()

        }
      };

      ws.onclose = () => {
       // console.log("WebSocket disconnected");
      };

      ws.onerror = (error) => {
        //console.error("WebSocket Error:", error);
        console.log("Retrying WebSocket connection in 5 seconds...");
        ws?.close();
        setTimeout(connectWebSocket, 5000);
      };
    };

    if (callStatus.isInitiated && callStatus.ssid) {
      setShowTranscript(true);
      setTranscriptArray([]);
      connectWebSocket();
    }

    return () => {
      ws?.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callStatus,phoneNumbers, doctors, activeCallIndex]);

  const getDisplayTranscript = () => {
    if (transcriptArray.length > 0) {
      return transcriptArray.map((transcript) => `${transcript}\n`).join("");
    }
    return "Waiting for conversation to begin...";
  };
  const handleEndCall = async (id: string, retries = 5): Promise<any> => {
    try {
      const resp = await axios.post(
        `https://callai-backend-243277014955.us-central1.run.app/api/appointment-booked-status`, 
        { call_id: id }
      );
      return resp.data;
    } catch (error) {
      //console.error('Error ending call:', error);
      if (error.response && error.response.status === 500 && retries > 0) {
        console.log(`Retrying to end call in 5 seconds... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        return handleEndCall(id, retries - 1);
      }
      console.log('Failed to end call after multiple attempts. Returning true.');
      return true;
    }
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
                <Column activeCallIndex={activeCallIndex} tasks={doctors} isDraggable={!isConfirmed} callStatus={callStatus} />
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
                <pre className=" whitespace-pre-wrap py-4 overflow-y-auto">
                  {getDisplayTranscript()}
                </pre>
              )}
            </ScrollArea>
          </Card>
        </div>

        <div className="flex  w-full items-center justify-center self-center mt-20 gap-12 pl-16 ">
          <Link href="/contact ">
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
