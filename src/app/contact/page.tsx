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
import React, { useEffect, useRef, useState } from "react";
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
import { GOOGLE_MAP_API_KEY } from "@/constants/global";

const medicalSpecialtiesOptions = [
  { value: "allergy and immunology", label: "Allergy and Immunology" },
  { value: "anesthesiology", label: "Anesthesiology" },
  { value: "cardiology", label: "Cardiology" },
  { value: "cardiothoracic surgery", label: "Cardiothoracic Surgery" },
  {
    value: "colon and rectal surgery (proctology)",
    label: "colon and Rectal surgery (Proctology)",
  },
  {
    value: "Cosmetic & Restorative Dentistry",
    label: "Cosmetic & Restorative Dentistry",
  },
  { value: "critical care medicine", label: "Critical Care Medicine" },
  { value: "dentist", label: "Dentist" },
  { value: "Dermatology", label: "Dermatology" },
  { value: "Emergency Medicine", label: "Emergency Medicine" },
  { value: "Endodontics", label: "Endodontics" },
  { value: "Endocrinology", label: "Endocrinology" },
  { value: "Family Medicine", label: "Family Medicine" },
  { value: "Gastroenterology", label: "Gastroenterology" },
  {
    value: "General & Preventive Dentistry",
    label: "General & Preventive Dentistry",
  },
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
  { value: "Orthodontics", label: "Orthodontics" },
  { value: "Orthopedic Surgery", label: "Orthopedic Surgery" },
  { value: "Otolaryngology (ENT)", label: "Otolaryngology (ENT)" },
  { value: "Pediatric Dentistry", label: "Pediatric Dentistry" },
  { value: "Pediatric Surgery", label: "Pediatric Surgery" },
  { value: "Pediatrics", label: "Pediatrics" },
  {
    value: "Periodontics & Implant Dentistry",
    label: "Periodontics & Implant Dentistry",
  },
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
  { value: "Therapy and Counseling", label: "Therapy and Counseling" },
  { value: "Urology", label: "Urology" },
  { value: "Vascular Surgery", label: "Vascular Surgery" },
];
const insurerOptions = [
  { value: "Aetna", label: "Aetna" },
  { value: "Aflac", label: "Aflac" },
  { value: "Alignment Healthcare", label: "Alignment Healthcare" },
  { value: "Allstate Insurance Company", label: "Allstate Insurance Company" },
  { value: "AlohaCare", label: "AlohaCare" },
  { value: "AMA Insurance Agency, Inc.", label: "AMA Insurance Agency, Inc." },
  {
    value: "American Fidelity Assurance Company",
    label: "American Fidelity Assurance Company",
  },
  { value: "American Specialty Health", label: "American Specialty Health" },
  { value: "AmeriHealth", label: "AmeriHealth" },
  { value: "AmeriHealth Administrators", label: "AmeriHealth Administrators" },
  {
    value: "AmeriHealth Caritas Family of Companies",
    label: "AmeriHealth Caritas Family of Companies",
  },
  {
    value: "Arkansas BlueCross Blue Shield",
    label: "Arkansas BlueCross Blue Shield",
  },
  { value: "AultCare Corporation", label: "AultCare Corporation" },
  { value: "Avera Health Plans", label: "Avera Health Plans" },
  { value: "AvMed Health Plan", label: "AvMed Health Plan" },
  {
    value: "Bankers Life and Casualty Company",
    label: "Bankers Life and Casualty Company",
  },
  { value: "Birdsong Hearing Benefits", label: "Birdsong Hearing Benefits" },
  {
    value: "Blue Cross and Blue Shield of Georgia",
    label: "Blue Cross and Blue Shield of Georgia",
  },
  {
    value: "Blue Cross and Blue Shield of Illinois",
    label: "Blue Cross and Blue Shield of Illinois",
  },
  {
    value: "Blue Cross and Blue Shield of Montana",
    label: "Blue Cross and Blue Shield of Montana",
  },
  {
    value: "Blue Cross and Blue Shield of New Mexico",
    label: "Blue Cross and Blue Shield of New Mexico",
  },
  {
    value: "Blue Cross Blue Shield of Michigan",
    label: "Blue Cross Blue Shield of Michigan",
  },
  {
    value: "Blue Cross Blue Shield of North Carolina",
    label: "Blue Cross Blue Shield of North Carolina",
  },
  { value: "Blue Cross of Idaho", label: "Blue Cross of Idaho" },
  { value: "Blue Shield of California", label: "Blue Shield of California" },
  {
    value: "BlueCross BlueShield of Oklahoma",
    label: "BlueCross BlueShield of Oklahoma",
  },
  {
    value: "BlueCross BlueShield of Tennessee",
    label: "BlueCross BlueShield of Tennessee",
  },
  {
    value: "BlueCross BlueShield of Texas",
    label: "BlueCross BlueShield of Texas",
  },
  { value: "Cambia Health Solutions", label: "Cambia Health Solutions" },
  {
    value: "Capital District Physicians´ Health Plan",
    label: "Capital District Physicians´ Health Plan",
  },
  { value: "CareFirst", label: "CareFirst" },
  { value: "CareOregon", label: "CareOregon" },
  { value: "CareSource", label: "CareSource" },
  { value: "Celtic Insurance Company", label: "Celtic Insurance Company" },
  { value: "CENTENE Corp.", label: "CENTENE Corp." },
  { value: "Clever Care Health Plan", label: "Clever Care Health Plan" },
  { value: "CNO Financial Group", label: "CNO Financial Group" },
  { value: "Commonwealth Care Alliance", label: "Commonwealth Care Alliance" },
  {
    value: "Community Health Network of Connecticut",
    label: "Community Health Network of Connecticut",
  },
  { value: "Curative Inc", label: "Curative Inc" },
  { value: "CVS Health", label: "CVS Health" },
  { value: "Davies Life & Health", label: "Davies Life & Health" },
  { value: "Dean Health Plan, Inc.", label: "Dean Health Plan, Inc." },
  {
    value: "Delta Dental Plans Association",
    label: "Delta Dental Plans Association",
  },
  { value: "Elevance Health", label: "Elevance Health" },
  { value: "FedPoint", label: "FedPoint" },
  { value: "Fidelity", label: "Fidelity" },
  { value: "Florida Blue", label: "Florida Blue" },
  { value: "Gen Re", label: "Gen Re" },
  {
    value: "Guarantee Trust Life Insurance Company",
    label: "Guarantee Trust Life Insurance Company",
  },
  {
    value: "Harvard Pilgrim Health Care",
    label: "Harvard Pilgrim Health Care",
  },
  {
    value: "Health Alliance Medical Plan",
    label: "Health Alliance Medical Plan",
  },
  {
    value: "Health Care Service Corporation",
    label: "Health Care Service Corporation",
  },
  { value: "Health Plan of San Joaquin", label: "Health Plan of San Joaquin" },
  { value: "HealthEquity", label: "HealthEquity" },
  { value: "Healthfirst, Inc.", label: "Healthfirst, Inc." },
  { value: "HealthPartners", label: "HealthPartners" },
  { value: "Highmark Health", label: "Highmark Health" },
  { value: "Hometown Health Plan", label: "Hometown Health Plan" },
  {
    value: "Horizon BC/BS of New Jersey",
    label: "Horizon BC/BS of New Jersey",
  },
  { value: "Humana Inc.", label: "Humana Inc." },
  { value: "Independence Blue Cross", label: "Independence Blue Cross" },
  { value: "Independent Health", label: "Independent Health" },
  {
    value: "Insurance Administrative Solutions, L.L.C.",
    label: "Insurance Administrative Solutions, L.L.C.",
  },
  {
    value: "John Hancock Financial Services",
    label: "John Hancock Financial Services",
  },
  { value: "Johns Hopkins Health Plans", label: "Johns Hopkins Health Plans" },
  { value: "Kaiser Permanente", label: "Kaiser Permanente" },
  { value: "L.A. Care", label: "L.A. Care" },
  { value: "Liberty Dental Plan", label: "Liberty Dental Plan" },
  {
    value: "LifeSecure Insurance Company",
    label: "LifeSecure Insurance Company",
  },
  { value: "Magellan Health", label: "Magellan Health" },
  { value: "Martin’s Point Health Care", label: "Martin’s Point Health Care" },
  {
    value: "Mass General Brigham Health Plan",
    label: "Mass General Brigham Health Plan",
  },
  { value: "Medica Health Plan", label: "Medica Health Plan" },
  { value: "Medical Card System (MCS)", label: "Medical Card System (MCS)" },
  { value: "Medical Mutual of Ohio", label: "Medical Mutual of Ohio" },
  { value: "Meridian Health Plan", label: "Meridian Health Plan" },
  { value: "MetroPlusHealth", label: "MetroPlusHealth" },
  { value: "Moda Health", label: "Moda Health" },
  { value: "Molina Healthcare", label: "Molina Healthcare" },
  { value: "MVP Health Care", label: "MVP Health Care" },
  {
    value: "National General Accident & Health",
    label: "National General Accident & Health",
  },
  { value: "National Guardian Life", label: "National Guardian Life" },
  {
    value: "Neighborhood Health Plan of Rhode Island",
    label: "Neighborhood Health Plan of Rhode Island",
  },
  {
    value: "New York Life Insurance Company",
    label: "New York Life Insurance Company",
  },
  { value: "PacificSource Health Plans", label: "PacificSource Health Plans" },
  { value: "Paramount Health Care", label: "Paramount Health Care" },
  {
    value: "Physicians Mutual Insurance Company",
    label: "Physicians Mutual Insurance Company",
  },
  { value: "Point32Health", label: "Point32Health" },
  { value: "Providence Health Plans", label: "Providence Health Plans" },
  { value: "Quartz Health Solutions", label: "Quartz Health Solutions" },
  { value: "Regence BC/BS of Oregon", label: "Regence BC/BS of Oregon" },
  { value: "Regence Blue Shield", label: "Regence Blue Shield" },
  {
    value: "Regence BlueCross BlueShield of Utah",
    label: "Regence BlueCross BlueShield of Utah",
  },
  {
    value: "Regence BlueShield of Idaho",
    label: "Regence BlueShield of Idaho",
  },
  { value: "Sanford Health Plans", label: "Sanford Health Plans" },
  { value: "SCAN Health Plan", label: "SCAN Health Plan" },
  { value: "Sentara Healthcare", label: "Sentara Healthcare" },
  { value: "Sharp Health Plan", label: "Sharp Health Plan" },
  { value: "St. Luke’s Health Plan", label: "St. Luke’s Health Plan" },
  {
    value: "State Farm Insurance Companies",
    label: "State Farm Insurance Companies",
  },
  { value: "SummaCare", label: "SummaCare" },
  { value: "Sutter Health Plan", label: "Sutter Health Plan" },
  { value: "Swiss Re America", label: "Swiss Re America" },
  { value: "The Cigna Group", label: "The Cigna Group" },
  {
    value: "Thrivent Financial for Lutherans",
    label: "Thrivent Financial for Lutherans",
  },
  {
    value: "Trustmark Insurance Company",
    label: "Trustmark Insurance Company",
  },
  { value: "Tufts Health Plan", label: "Tufts Health Plan" },
  { value: "UCare", label: "UCare" },
  {
    value: "UNICARE Life & Health Insurance Company",
    label: "UNICARE Life & Health Insurance Company",
  },
  { value: "University Health Alliance", label: "University Health Alliance" },
  {
    value: "UPMC Health Insurance Plans",
    label: "UPMC Health Insurance Plans",
  },
  { value: "USAA", label: "USAA" },
  { value: "VIVA Health, Inc.", label: "VIVA Health, Inc." },
  { value: "Wellabe", label: "Wellabe" },
  { value: "Wellfleet", label: "Wellfleet" },
  { value: "Western Health Advantage", label: "Western Health Advantage" },
  { value: "Zurich North America", label: "Zurich North America" },
];
const validationSchema = Yup.object().shape({
  phoneNumber: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  objective: Yup.string().required("Required"),
  specialty: Yup.string().required("Specialty is required"), // Ensure specialty is required
});

export default function Contact() {
  const router = useRouter();
  const [selectedAvailability, setSelectedAvailability] = useState("anytime");
  const [timeOfAppointment, settimeOfAppointment] = useState("soonest");
  const [isnewPatient, setisnewPatient] = useState("yes");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [addressLocation, setAddressLocation] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const inputRefs = useRef([]);
  const addressRefs = useRef([]);
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
      groupId: "",
      subscriberId: "",
      insurer: "",
      zipcode: "",
      dob: "",
      address: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const updatedValues = {
        ...values,
        selectedAvailability,
        timeOfAppointment,
        isnewPatient,
        selectedOption,
      };
      // console.log(updatedValues)
      setisLoading(true);
      if (!selectedLocation) {
        toast.error("No location selected");
        return;
      }

      try {
        const { lat, lng } = selectedLocation || { lat: 0, lng: 0 };
        const response = await axios.get(
          `https://callai-backend-243277014955.us-central1.run.app/api/search_places?location=${lat},${lng}&radius=20000&keyword=${formik.values.specialty}`
        );

        sessionStorage.setItem("formData", JSON.stringify(updatedValues));
        sessionStorage.setItem("statusData", JSON.stringify(response.data));

        // console.log("Form Data:", values);
        // console.log("API Response Data:", response.data);
        // Navigate to status page
        router.push("/status");
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  useEffect(() => {
    if (selectedOption === "no") {
      formik.setFieldValue("subscriberId", "");
      formik.setFieldValue("groupId", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption]);

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
  const handleOnAddressChanged = (index) => {
    if (addressRefs.current[index]) {
      const places = addressRefs.current[index].getPlaces();
      if (places && places.length > 0) {
        // <-- Added defensive check
        const address = places[0];
        //console.log(address)
        formik.setFieldValue("address", address?.formatted_address);
      }
    }
  };
  // const handleFindDoctors = async () => {
  //   try {
  //     const { lat, lng } = selectedLocation || { lat: 0, lng: 0 };
  //     const response = await axios.get(
  //       `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=2000&type=${formik.values.specialty}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`
  //     );
  //     setDoctors(response.data.results.slice(0, 10));
  //     console.log(response?.data?.results)
  //   } catch (error) {
  //     console.error("Error fetching doctors:", error);
  //   }
  // };

  return (
    <div className=" ">
      <Navbar />
      <form
        onSubmit={formik.handleSubmit}
        className="md:px-8 px-2 bg-blue-100  gap-6 pb-16 pt-32 "
      >
        <div className=" text-blue-950 grid grid-cols-2 gap-8">
          <Card className=" p-6 text-blue-950  ">
            <p className="text-xl font-semibold ">Patient Details</p>
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
                <Input
                  id="dob-id"
                  name="dob"
                  onChange={formik.handleChange}
                  value={formik.values.dob}
                />
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
                <Label htmlFor="address" className=" w-auto  font-semibold ">
                  Address
                </Label>
                {isLoaded && (
                  <StandaloneSearchBox
                    onLoad={(ref) => (addressRefs.current[0] = ref)}
                    onPlacesChanged={() => handleOnAddressChanged(0)}
                  >
                    <Input placeholder="Search Address" />
                  </StandaloneSearchBox>
                )}
              </div>
              <div className="flex flex-col space-y-4">
                <Label htmlFor="phone" className=" w-auto  font-semibold ">
                  Zipcode
                </Label>
                <Input
                  id="zipcode"
                  name="zipcode"
                  onChange={formik.handleChange}
                  value={formik.values.zipcode}
                />
              </div>
            </div>
          </Card>
          <Card className=" p-6 px-10 text-blue-950 ">
            <p className="text-xl font-semibold">Appointment Details</p>

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
                <p className="font-bold text-sm">Are you a new patient</p>
                <RadioGroup
                  value={isnewPatient}
                  onValueChange={(value) => setisnewPatient(value)}
                  className="flex md:gap-12 "
                  defaultValue="yes"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="r1" className=" " />
                    <Label htmlFor="r1">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="r2" className="" />
                    <Label htmlFor="r2">No </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex flex-col gap-4 pt-2">
                <p className="font-bold text-sm">Time of appointment</p>

                <RadioGroup
                  value={timeOfAppointment}
                  onValueChange={(value) => settimeOfAppointment(value)}
                  className="flex md:gap-12 "
                  defaultValue="as"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="soonest" id="r1" className=" " />
                    <Label htmlFor="r1">As soon as possible</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="this week" id="r2" className="" />
                    <Label htmlFor="r2">This week </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="next week" id="r2" className="" />
                    <Label htmlFor="r3">Next week </Label>
                  </div>{" "}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="anytime" id="r2" className="" />
                    <Label htmlFor="r4">I am in no rush </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex flex-col gap-4 pt-2">
                <p className="font-bold text-sm">Your availability</p>

                <div>
                  <RadioGroup
                    value={selectedAvailability}
                    // onValueChange={(value) => setSelectedAvailability(value)}
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
                      <div className="flex flex-col space-y-4 mb-4">
                        <Label className="font-semibold" htmlFor="insurer">
                          Select Insurance (Optional)
                        </Label>
                        <Select
                          id="insurer"
                          name="insurer"
                          value={formik.values.insurer || ""}
                          onValueChange={(value) => {
                            formik.setFieldValue("insurer", value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select insurer" />
                          </SelectTrigger>
                          <SelectContent>
                            {insurerOptions.map((p) => (
                              <SelectItem key={p.value} value={p.value}>
                                {p.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col space-y-4">
                        <Label
                          htmlFor="subscriber-id"
                          className="w-auto font-semibold"
                        >
                          Subscriber ID
                        </Label>
                        <Input
                          id="subscriber-id"
                          name="subscriberId"
                          onChange={formik.handleChange}
                          value={formik.values.subscriberId}
                        />
                      </div>
                      <div className="flex flex-col space-y-4">
                        <Label
                          htmlFor="group-id"
                          className="w-auto font-semibold"
                        >
                          Group ID
                        </Label>
                        <Input
                          id="group-id"
                          name="groupId"
                          onChange={formik.handleChange}
                          value={formik.values.groupId}
                        />
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
            disabled={isLoading}
            className=" w-[20%] mt-8 bg-blue-950"
            //onClick={handleFindDoctors}
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
