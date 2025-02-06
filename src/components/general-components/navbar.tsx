"use client";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function Navbar() {
  // State to manage selected name
  const [selectedName, setSelectedName] = useState("Employer");

  // Load selected name from localStorage on mount
  useEffect(() => {
    const storedName = localStorage.getItem("Employer");
    if (storedName) {
      setSelectedName(storedName);
    }
  }, []);


  // Handle selection change
  const handleSelectChange = (value: any) => {
    setSelectedName(value);
    localStorage.setItem("Employer", value);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 border border-b-2 border-gray-200 bg-blue-50 text-blue-950">
      <div className="flex justify-between  pt-6 pb-2 px-8 relative">
        <div></div>
        <div className="flex justify-end  gap-6 pt-2">
          <div className="flex flex-col justify-self-end text-end">
            <p className="text-lg">{selectedName}</p>
            <Link href={"/home"} className="text-primary-blue text-xs  italic ">
              Demo Mode
            </Link>
          </div>
          <div className="flex gap-1">
            <Select onValueChange={handleSelectChange} value={selectedName}>
              <SelectTrigger>
                {/* <SelectValue placeholder="Choose Business" /> */}
              </SelectTrigger>
              <SelectContent>
                {[
                  { value: "EAP", label: "EAP" },
                  { value: "Employer", label: "Employer" },
                ].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
