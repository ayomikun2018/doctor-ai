// @ts-nocheck
"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  StethoscopeIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/general-components/navbar";
import { DatePickerDemo } from "@/components/ui/date-picker";
import {
  GoogleMap,
  useJsApiLoader,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

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
const validationSchema = Yup.object().shape({
  phoneNumber: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  objective: Yup.string().required("Objective is required"),
  specialty: Yup.string().required("Specialty is required"), // Ensure specialty is required
});

export default function Contact() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const inputRefs = useRef([]);
  const [selectedOption, setSelectedOption] = useState("no");

  const [doctors, setDoctors] = useState([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDd1e56OQkVXAJRUchOqHNJTGkCyrA2e3A",
    libraries: ["places"],
  });

  const formik = useFormik({
    initialValues: {
      patientName: "",
      phoneNumber: "",
      email: "",
      patientHistory: "",
      objective: "",
      specialty: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!selectedLocation) {
        toast.error("No location selected");
        return;
      }

      try {
        const { lat, lng } = selectedLocation || { lat: 0, lng: 0 };
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=2000&type=${formik.values.specialty}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`
        );

        sessionStorage.setItem("formData", JSON.stringify(values));
        sessionStorage.setItem("statusData", JSON.stringify(response.data));

        console.log("Form Data:", values);
        console.log("API Response Data:", response.data);
        // Navigate to status page
        router.push("/status");
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  const handleOnPlacesChanged = (index) => {
    if (inputRefs.current[index]) {
      const places = inputRefs.current[index].getPlaces();
      if (places.length > 0) {
        const place = places[0];
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setSelectedLocation({ lat, lng });
      }
    }
  };
  const handleFindDoctors = async () => {
    try {
      const { lat, lng } = selectedLocation || { lat: 0, lng: 0 };
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=2000&type=${formik.values.specialty}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`
      );
      setDoctors(response.data.results.slice(0, 10));
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  return (
    <div className=" ">
      <Navbar />
      <form
        onSubmit={formik.handleSubmit}
        className="md:px-8 px-2 bg-blue-100  gap-6 pb-16 pt-32 "
      >
        <div className=" text-blue-950 grid grid-cols-2 gap-8">
          <Card className=" p-6 text-blue-950  ">
            <p className="text-xl font-semibold ">User Details</p>
            <div className="grid gap-4 pt-4 ">
              <div className="flex flex-col space-y-4 pt-6">
                <Label htmlFor="name" className="w-auto font-semibold ">
                  Name
                </Label>
                <Input
                  name="patientName"
                  placeholder="Patient Name"
                  onChange={formik.handleChange}
                  value={formik.values.patientName}
                />
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
                <Input
                  name="email"
                  placeholder=""
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  className={
                    formik.errors.email && formik.touched.email
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.errors.email && formik.touched.email && (
                  <div className="text-red-500">{formik.errors.email}</div>
                )}
              </div>
              <div className="flex flex-col space-y-4">
                <Label htmlFor="phone" className=" w-auto  font-semibold ">
                  Phone number
                </Label>
                <Input
                  name="phoneNumber"
                  placeholder="Phone Number"
                  onChange={formik.handleChange}
                  value={formik.values.phoneNumber}
                  className={
                    formik.errors.phoneNumber && formik.touched.phoneNumber
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                  <div className="text-red-500">
                    {formik.errors.phoneNumber}
                  </div>
                )}
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
            <p className="text-xl font-semibold">Address Details</p>

            <div className="grid gap-6 pt-4 ">
              <div className="flex flex-col space-y-4 w-full pt-4">
                <Label className="font-semibold" htmlFor="specialty">
                  Doctor Specialty
                </Label>
                <Select
                  id="specialty"
                  name="specialty"
                  value={formik.values.specialty || ""}
                  onValueChange={(value) => {
                    formik.setFieldValue("specialty", value);
                  }}
                >
                  <SelectTrigger
                    className={
                      formik.errors.specialty && formik.touched.specialty
                        ? "border-red-500"
                        : ""
                    }
                  >
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
                {formik.errors.specialty && formik.touched.specialty && (
                  <div className="text-red-500">{formik.errors.specialty}</div>
                )}
              </div>
              <div className="flex flex-col space-y-4">
                <Label htmlFor="email" className=" w-auto  font-semibold ">
                  Preferred Location
                </Label>

                {isLoaded && (
                  <StandaloneSearchBox
                    onLoad={(ref) => (inputRefs.current[0] = ref)}
                    onPlacesChanged={() => handleOnPlacesChanged(0)}
                  >
                    <Input placeholder="Search Location" />
                  </StandaloneSearchBox>
                )}
              </div>
              <div className="flex flex-col gap-4 pt-2">
                <p className="font-bold text-sm">Time of appointment</p>

                <RadioGroup
                  // value={selectedOption}
                  // onValueChange={(value) => setSelectedOption(value)}
                  className="flex md:gap-12 "
                  defaultValue="as"
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
                    // value={selectedDate}
                    // onValueChange={(value) => setSelectedDate(value)}
                    defaultValue="anytime"
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
                </div>
              </div>
              <div className="flex flex-col space-y-4 w-full pt-4">
                <Label className="font-semibold" htmlFor="insurance">
                  Your insurance details
                </Label>

                <RadioGroup
                  value={selectedOption}
                  onValueChange={(value) => setSelectedOption(value)}
                  defaultValue="no"
                  className="flex flex-col gap-4  md:gap-8"
                >
                  <div className="flex gap-12">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="r2" />
                      <Label htmlFor="r2">No, I don't have insurance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="r1" />
                      <Label htmlFor="r1">I have an insurance</Label>
                    </div>
                  </div>

                  {selectedOption === "yes" && (
                    <div className="flex flex-col space-y-2">
                      <div className="flex flex-col space-y-4">
                        <Label
                          htmlFor="subscriber-id"
                          className="w-auto font-semibold"
                        >
                          Subscriber ID
                        </Label>
                        <Input id="subscriber-id" />
                      </div>
                      <div className="flex flex-col space-y-4">
                        <Label
                          htmlFor="group-id"
                          className="w-auto font-semibold"
                        >
                          Group ID
                        </Label>
                        <Input id="group-id" />
                      </div>
                      <div className="flex flex-col space-y-4">
                        <Label
                          htmlFor="insurer-id"
                          className="w-auto font-semibold"
                        >
                          Insurer ID
                        </Label>
                        <Input id="insurer-id" />
                      </div>
                    </div>
                  )}
                </RadioGroup>
              </div>
              <div className="flex flex-col space-y-4">
                <Label htmlFor="patient" className=" w-auto  font-semibold ">
                  Main medical concerns
                </Label>
                <Textarea
                  name="objective"
                  placeholder=""
                  onChange={formik.handleChange}
                  value={formik.values.objective}
                  className={
                    formik.errors.objective && formik.touched.objective
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.errors.objective && formik.touched.objective && (
                  <div className="text-red-500">{formik.errors.objective}</div>
                )}
              </div>
            </div>
          </Card>
        </div>
        {/* <Button
          className="flex items-center justify-center "
          // href="/status"
          onClick={handleFindDoctors}
        > */}
        <div className="flex items-center justify-center">
          <Button
            className=" w-[20%] mt-8 bg-blue-950"
            onClick={handleFindDoctors}
          >
            {" "}
            <StethoscopeIcon />
            Find Doctors
          </Button>
        </div>
      </form>
    </div>
  );
}
