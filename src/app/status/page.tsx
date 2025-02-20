//@ts-nocheck
"use client";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
import Swal from 'sweetalert2'
import axios from "axios";
import { HomeIcon, Lightbulb, ArrowRight, OctagonX } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";


export default function Status() {
  const wsRef = useRef<WebSocket | null>(null);
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState<(string | null)[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isAppointmentBooked,setIsAppointmentBooked] = useState(false)
  const [transcriptArray, setTranscriptArray] = useState([]);
  const [callStatus, setCallStatus] = useState({
    isInitiated: false,
    ssid: "",
    email: "",
  });
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [extractedData, setExtractedData] = useState<TaskType[]>([]);
  const [activeCallIndex, setActiveCallIndex] = useState(0);

  const getPhoneNumbers = () => {
    const numbers = doctors.map((doctor) => doctor.phone_number || null);
    // console.log(numbers)
    setPhoneNumbers(numbers);
  };

  useEffect(() => {
    const storedData = sessionStorage.getItem("statusData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const sortedData = parsedData.results.slice(0, 10).map((item, index) => ({
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
    // console.log(doctors)
    getPhoneNumbers()
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
},[doctors])


  const handleConfirmSequence = useCallback(async()=> {
    await connectWebSocket();
    try {
      setIsConfirmed(true); // Disable button and dragging
      const firstDoctorPhoneNumber =   phoneNumbers[activeCallIndex]; // '+2348168968260'
      await initiateCall(firstDoctorPhoneNumber, doctors[activeCallIndex]?.name)
      return
    } catch (error) {
      console.error("Error fetching phone numbers or initiating call:", error);
      setIsConfirmed(false); // Re-enable button and dragging if there's an error
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[activeCallIndex,phoneNumbers,doctors])

  useEffect(() => {
    if (callStatus.isInitiated && callStatus.ssid && wsRef.current) {
      setShowTranscript(true);
      setTranscriptArray((prev) => [
        ...prev,
        `---CALL BEGINS FOR ${doctors[activeCallIndex]?.name}---\n`,
      ]);
      console.log('ws listener added for id:', callStatus?.ssid)
      if (wsRef.current.readyState !== WebSocket.OPEN) {
        console.log('WebSocket not in OPEN state:', wsRef.current.readyState);
        return;
      }
      try {
        wsRef.current.send(
          JSON.stringify({ 
            event: "start", 
            transcription_id: callStatus.ssid 
          })
        );
        // console.log('WebSocket message sent successfully');
      } catch (error) {
        console.log('Failed to send WebSocket message:', error);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callStatus, doctors, wsRef]);

  const terminateRequest = () => {
    // sent ws event to cancel call
    wsRef?.current?.close();
    setIsConfirmed(false);
    terminateCurrentCall(callStatus?.ssid)
    setTimeout(() => {
      setCallStatus({
        isInitiated: false,
        ssid: "",
        email: "",
      })
    }, 500);

  }
  const initiateCall = useCallback(async (doctorPhoneNumber: string, nameOfOrg: string) => {
    console.log('new call initiated for', doctorPhoneNumber, nameOfOrg);
    const formData = JSON.parse(sessionStorage.getItem("formData"));
    if (!formData) {
      console.error("No formData found in sessionStorage.");
      return;
    }

    const { email, phoneNumber, patientName, objective, subscriberId, groupId, selectedOption, dob, address, selectedAvailability, timeOfAppointment, isnewPatient, zipcode, insurer } = formData;

    let context = 'Clinical concerns:' + objective+'; ' +"Patient has insurance:"+selectedOption;

    if (insurer) context += `; Insurance Provider:${insurer}`;
    if (subscriberId) context += `; Subscriber Id:${subscriberId}`;
    if (groupId) context += `; Group Id:${groupId}`;
    if (dob) context += `; Date of birth:${dob}`;
    if (address) context += `; Address of the patient:${address}`;
    if (selectedAvailability) context += `; Availability of the patient:${selectedAvailability}`;
    if (timeOfAppointment) context += `; Time Of Appointment:${timeOfAppointment}`;
    if (isnewPatient) context += `; Is New Patient:${isnewPatient}`;
    if (zipcode) context += `; Zipcode:${zipcode}`;

    const data = {
      objective: "Schedule an appointment",
      context: context,
      caller_number: phoneNumber,
      caller_name: patientName,
      name_of_org: nameOfOrg,
      caller_email: email,
      phone_number: doctorPhoneNumber,
    };
    // console.log(data);
    try {
      const callResponse = await axios.post(
        "https://callai-backend-243277014955.us-central1.run.app/api/assistant-initiate-call",
        data
      );
      setCallStatus({
        isInitiated: true,
        ssid: callResponse.data.call_id,
        email: email,
      });
    } catch (error) {
      console.log(error, 'error initiating bland AI');
      toast.error(error?.response?.data?.detail);
    }
  }, []);

  const moveToNextDoctor = async (id: string) => {
    let newIndex = 0;
    if(id){
      terminateCurrentCall(id)
    }
    // Move to the next doctor
    setActiveCallIndex((prevIndex) => {
      newIndex = prevIndex + 1;
      return newIndex;
    });
     // console.log(newIndex,activeCallIndex)
    if (newIndex+1 <= doctors.length) {
      const nextDoctor = doctors[newIndex];
      console.log("Calling next doctor:", nextDoctor);

      const phoneNumber = phoneNumbers[newIndex]  //+2348168968260
      const nameOfOrg = nextDoctor?.name  //+2348168968260
      if (phoneNumber) {
        await initiateCall(phoneNumber,nameOfOrg);
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
    if(wsRef?.current){
      //check if exisiting connection exists and disconnect
      console.log('disconnect exisiting connection if it exists...')
      wsRef?.current?.close()
    }
    wsRef.current = new WebSocket(
      "wss://callai-backend-243277014955.us-central1.run.app/ws/notifications"
    );

    wsRef.current.onopen = () => {
      console.log("WebSocket connected successfully and opened.",);
    };

    wsRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      // console.log("WebSocket Message:", data);

      if (data.event === "call_ended") {
       // console.log("Call Ended Data:", data);
        setTimeout(async() => {
          const call_ended_result = await handleEndCall(data?.call_sid)
          console.log({call_ended_result})
          if (call_ended_result?.status == "yes") {
            // toast.success("Appointment Booked Successfully");
            Swal.fire({
              icon: "success",
              title: "Appointment Booked",
              text: call_ended_result?.confirmation_message ?? 'Appointment Booked Successfully',
              confirmButtonText:"Okay",
              //confirmButtonColor:""
            });
            setIsAppointmentBooked(true)
            wsRef?.current?.close();
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

    wsRef.current.onclose = () => {
     console.log("WebSocket disconnected");
    };

    wsRef.current.onerror = (error) => {
      //console.error("WebSocket Error:", error);
      console.log("Retrying WebSocket connection in 5 seconds...");
      setTimeout(connectWebSocket, 5000);
    };
  };

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
        { 
          call_id: id,
          phone_number:phoneNumbers[activeCallIndex], 
          address:doctors[activeCallIndex]?.vicinity }
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
  const terminateCurrentCall = async (id: string): Promise<any> => {
    // console.log(id,'xxx')
    try {
      const resp = await axios.post(
        `https://callai-backend-243277014955.us-central1.run.app/api/terminate-call`, 
        { call_id: id }
      );
      return resp.data;
    } catch (error) {
      console.error('Error ending call:', error);
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
                <Column activeCallIndex={activeCallIndex} tasks={doctors} isDraggable={!isConfirmed} callStatus={callStatus} isAppointmentBooked={isAppointmentBooked} />
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
            <Button onClick={()=>wsRef?.current?.close()} className="px-8 py-6">
              {" "}
              <HomeIcon />
              Home
            </Button>
          </Link>
            <Button onClick={()=>moveToNextDoctor(callStatus?.ssid)} disabled={!callStatus?.isInitiated} className="bg-blue-900 px-8 py-6">
              {" "}
              <ArrowRight /> Move to Next Doctor
            </Button>
            <Button onClick={()=> terminateRequest()} disabled={!callStatus?.isInitiated}  className="bg-red-900 px-8 py-6">
              {" "}
              <OctagonX /> Terminate request
            </Button>
        </div>
      </div>
    </div>
  );
}
