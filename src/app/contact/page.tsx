//@ts-nocheck
"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import {
  PlusCircleIcon,
  Trash2,
  PhoneCallIcon,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/general-components/navbar";
import { DatePickerDemo } from "@/components/ui/date-picker";

export default function Contact() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const ehrOptions = [
    { value: "abeldent", label: "ABELDent" },
    { value: "advancedmd", label: "AdvancedMD" },
    { value: "allscripts", label: "Allscripts" },
    { value: "athenahealth", label: "Athenahealth" },
    { value: "carecloud", label: "CareCloud" },
    { value: "carestream_dental", label: "Carestream Dental" },
    { value: "cerner_oracle_health", label: "Cerner (Oracle Health)" },
    { value: "cloud9ortho", label: "Cloud 9 Ortho" },
    { value: "curve_dental", label: "Curve Dental" },
    { value: "dentrix_henry_schein", label: "Dentrix (Henry Schein)" },
    { value: "dentimax", label: "DentiMax" },
    { value: "drchrono", label: "DrChrono" },
    {
      value: "eaglesoft_patterson_dental",
      label: "Eaglesoft (Patterson Dental)",
    },
    { value: "easy_dental", label: "Easy Dental" },
    { value: "eclinicalworks", label: "eClinicalWorks" },
    { value: "epic_systems", label: "Epic Systems" },
    { value: "icanotes", label: "ICANotes" },
    { value: "kareo_behavioral_health", label: "Kareo Behavioral Health" },
    { value: "luminello", label: "Luminello" },
    { value: "mentalyc", label: "Mentalyc" },
    { value: "nextgen_healthcare", label: "NextGen Healthcare" },
    { value: "open_dental", label: "Open Dental" },
    { value: "practice_fusion", label: "Practice Fusion" },
    { value: "simplepractice", label: "SimplePractice" },
    {
      value: "softdent_carestream_dental",
      label: "SoftDent (Carestream Dental)",
    },
    { value: "therabill", label: "TheraBill" },
    { value: "theranest", label: "TheraNest" },
    { value: "therapynotes", label: "TherapyNotes" },
    { value: "valant", label: "Valant" },
  ];

  const insuranceOptions = [
    {
      value: "subscriber_id",
      label: "Subscriber ID.",
    },
    {
      value: "group_id",
      label: "Group ID.",
    },
    {
      value: "insurer",
      label: "Insurer",
    },
    {
      value: "no_insurance",
      label: "I don't have insurance.",
    },
  ];
  const medicalSpecialtiesOptions = [
    { value: "Allergy and Immunology", label: "Allergy and Immunology" },
    { value: "Anesthesiology", label: "Anesthesiology" },
    { value: "Cardiology", label: "Cardiology" },
    { value: "Cardiothoracic Surgery", label: "Cardiothoracic Surgery" },
    {
      value: "Colon and Rectal Surgery (Proctology)",
      label: "Colon and Rectal Surgery (Proctology)",
    },
    { value: "Critical Care Medicine", label: "Critical Care Medicine" },
    { value: "Dermatology", label: "Dermatology" },
    { value: "Emergency Medicine", label: "Emergency Medicine" },
    { value: "Endocrinology", label: "Endocrinology" },
    { value: "Family Medicine", label: "Family Medicine" },
    { value: "Gastroenterology", label: "Gastroenterology" },
    { value: "General Surgery", label: "General Surgery" },
    { value: "Genetics", label: "Genetics" },
    { value: "Geriatrics", label: "Geriatrics" },
    { value: "Hematology", label: "Hematology" },
    { value: "Infectious Disease", label: "Infectious Disease" },
    { value: "Internal Medicine", label: "Internal Medicine" },
    { value: "Nephrology", label: "Nephrology" },
    { value: "Neurology", label: "Neurology" },
    { value: "Neurosurgery", label: "Neurosurgery" },
    { value: "Ophthalmology", label: "Ophthalmology" },
    {
      value: "Oral and Maxillofacial Surgery",
      label: "Oral and Maxillofacial Surgery",
    },
    { value: "Orthopedic Surgery", label: "Orthopedic Surgery" },
    { value: "Otolaryngology (ENT)", label: "Otolaryngology (ENT)" },
    { value: "Pediatric Surgery", label: "Pediatric Surgery" },
    { value: "Pediatrics", label: "Pediatrics" },
    {
      value: "Physical Medicine and Rehabilitation (Physiatry)",
      label: "Physical Medicine and Rehabilitation (Physiatry)",
    },
    { value: "Plastic Surgery", label: "Plastic Surgery" },
    { value: "Psychiatry", label: "Psychiatry" },
    { value: "Pulmonology", label: "Pulmonology" },
    { value: "Radiology", label: "Radiology" },
    { value: "Rheumatology", label: "Rheumatology" },
    { value: "Sleep Medicine", label: "Sleep Medicine" },
    { value: "Sports Medicine", label: "Sports Medicine" },
    { value: "Urology", label: "Urology" },
    { value: "Vascular Surgery", label: "Vascular Surgery" },
  ];

  const [selectedOption, setSelectedOption] = useState("manual");
  const [selectedInsurance, setSelectedInsurance] = useState("");
  const [loading, setLoading] = useState(false);
  const [journeys, setJourneys] = useState([
    { id: 1, ehr: "", group: "", step: "" },
  ]);

  const handleAddJourney = () => {
    setJourneys((prev) => [
      ...prev,
      { id: Date.now(), ehr: "", group: "", step: "" },
    ]);
  };

  const handleRemoveJourney = (id: number) => {
    if (journeys.length > 1) {
      setJourneys((prev) => prev.filter((journey) => journey.id !== id));
    }
  };

  const handleJourneyChange = (id: number, field: string, value: string) => {
    setJourneys((prev) =>
      prev.map((journey) =>
        journey.id === id ? { ...journey, [field]: value } : journey
      )
    );
  };
  const [phoneNumber, setPhoneNumber] = useState(""); // State for phone number input
  const [patientName, setPatientName] = useState(""); // State for phone number input
  const [email, setEmail] = useState(""); // State for email input
  const [patientHistory, setPatientHistory] = useState(""); // State for email input
  const [objective, setObjective] = useState(""); // State for call objective
  const [responseMessage, setResponseMessage] = useState("");

  // Handle input change
  const handleInputChange = (setter: any) => (e: any) => setter(e.target.value);

  // Function to make the call
  const handleMakeCall = async () => {
    if (!phoneNumber || !patientName || !objective || !patientHistory) {
      setResponseMessage("Please fill in all the fields.");
      return;
    }

    setLoading(true); // Start loading

    try {
      const backendUrl =
        "https://callai-backend-243277014955.us-central1.run.app/api/v2/initiate-call";

      const selectedBusiness = localStorage.getItem("selectedBusiness");
      const response = await axios.post(backendUrl, {
        patient_number: phoneNumber,
        patient_name: patientName,
        objective,
        patient_history: patientHistory,
        name_of_org: selectedBusiness,
      });

      router.push(
        `/status?ssid=${
          response.data.call_sid
        }&isInitiated=true&patient_number=${encodeURIComponent(
          phoneNumber
        )}&patient_name=${encodeURIComponent(
          patientName
        )}&objective=${encodeURIComponent(
          objective
        )}&patient_history=${encodeURIComponent(
          patientHistory
        )}&selectedBusiness=${encodeURIComponent(selectedBusiness)}`
      );
    } catch (error: any) {
      setResponseMessage(
        `Failed to initiate the call. Error: ${
          error.response?.data?.detail || error.message
        }`
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };
  return (
    <div className=" ">
      <Navbar />
      <div className="md:px-8 px-2 bg-blue-100  gap-6 pb-16 pt-32 ">
        <div className=" text-blue-950 grid grid-cols-2 gap-8">
          <Card className=" p-6 text-blue-950  ">
            <p className="text-xl font-semibold ">User Details</p>
            <div className="grid gap-4 pt-4 ">
              <div className="flex flex-col space-y-4 pt-6">
                <Label htmlFor="name" className="w-auto font-semibold ">
                  Name
                </Label>
                <Input />
              </div>
              <div className="flex flex-col space-y-4 pt-6 w-full">
                <Label htmlFor="number" className="w-auto font-semibold ">
                  Date of birth
                </Label>
                <Input />
              </div>
              <div className="flex flex-col space-y-4">
                <Label htmlFor="email" className=" w-auto  font-semibold ">
                  Email
                </Label>
                <Input></Input>
              </div>
              <div className="flex flex-col space-y-4">
                <Label htmlFor="phone" className=" w-auto  font-semibold ">
                  Phone number
                </Label>
                <Input></Input>
              </div>
              <div className="flex flex-col space-y-4">
                <Label htmlFor="phone" className=" w-auto  font-semibold ">
                  Address
                </Label>
                <Input></Input>
              </div>
            </div>
          </Card>
          <Card className=" p-6 px-10 text-blue-950 ">
            <p className="text-xl font-semibold">User Details</p>

            <div className="grid gap-6 pt-4 ">
              <div className="flex flex-col space-y-4 w-full pt-4">
                <Label className="font-semibold " htmlFor={"specialty"}>
                  Doctor specialty
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicalSpecialtiesOptions.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-4">
                <Label htmlFor="email" className=" w-auto  font-semibold ">
                  Zip code
                </Label>
                <Input></Input>
              </div>
              <div className="flex flex-col gap-4 pt-2">
                <p className="font-bold text-sm">Time of appointment</p>

                <RadioGroup
                  value={selectedOption}
                  onValueChange={(value) => setSelectedOption(value)}
                  className="flex md:gap-12 "
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="as" id="r1" className=" " />
                    <Label htmlFor="r1">As soon as possible</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ass" id="r2" className="" />
                    <Label htmlFor="r2">This week </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="asss" id="r2" className="" />
                    <Label htmlFor="r3">Next week </Label>
                  </div>{" "}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="assss" id="r2" className="" />
                    <Label htmlFor="r4">I am in no rush </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex flex-col gap-4 pt-2">
                <p className="font-bold text-sm">Your availability</p>

                <div>
                  <RadioGroup
                    value={selectedDate}
                    onValueChange={(value) => setSelectedDate(value)}
                    className="flex flex-col gap-4 md:flex-row md:gap-12"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="anytime" id="r1" />
                      <Label htmlFor="r1">I am available anytime</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="r2" />
                      <Label htmlFor="r2">Input your availability</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="calendar" id="r3" />
                      <Label htmlFor="r3">Link your calendar</Label>
                    </div>
                  </RadioGroup>

                  {/* Conditionally render input field */}
                  {(selectedDate === "custom" ||
                    selectedDate === "calendar") && (
                    <div className="mt-4">
                      <Label htmlFor="availability-input">
                        {selectedDate === "custom"
                          ? "Enter your available times:"
                          : "Enter your calendar link:"}
                      </Label>
                      <Input
                        id="availability-input"
                        type="text"
                        placeholder={
                          selectedDate === "custom"
                            ? "E.g., Monday-Friday, 9AM - 5PM"
                            : "Paste your calendar link here"
                        }
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-4 w-full pt-4">
                <Label className="font-semibold" htmlFor="insurance">
                  Your insurance details
                </Label>

                <Select onValueChange={setSelectedInsurance}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {insuranceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Show input field for all selections except "no_insurance" */}
                {selectedInsurance && selectedInsurance !== "no_insurance" && (
                  <div>
                    <Label htmlFor="insurance-input">
                      Enter{" "}
                      {
                        insuranceOptions.find(
                          (o) => o.value === selectedInsurance
                        )?.label
                      }
                    </Label>
                    <Input
                      id="insurance-input"
                      type="text"
                      placeholder="Enter details here"
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col space-y-4">
                <Label htmlFor="patient" className=" w-auto  font-semibold ">
                  Main medical concerns
                </Label>
                <Textarea id="concerns" />
              </div>
            </div>
          </Card>
        </div>
        <Link className="flex items-center justify-center " href="/status">
          <Button className=" w-[20%] mt-8 bg-blue-950">
            {" "}
            <PhoneCallIcon />
            Call
          </Button>
        </Link>
      </div>
    </div>
  );
}
