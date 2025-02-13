//@ts-nocheck
"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useRef, useEffect } from "react";

const TranscriptCard = ({ transcript, showTranscript }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (showTranscript && scrollRef.current) {
      // Option 1: Scroll to bottom smoothly (better user experience)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;

      // Option 2: Scroll to bottom instantly (if smooth scrolling is too slow)
      // scrollRef.current.scrollTo({
      //   top: scrollRef.current.scrollHeight,
      //   behavior: 'instant' // or 'auto' for smooth
      // });
    }
  }, [transcript, showTranscript]); // Crucial: Add transcript to dependency array

  return (
    <Card className="flex-grow rounded-lg px-6 py-4 overflow-y-auto">
      <p className="text-xl font-bold bg-[#24AD4214] text-[#24AD42] px-2 py-2">
        Call transcript
      </p>
      <ScrollArea className="h-full pt-4 overflow-y-auto" ref={scrollRef}>
        {showTranscript && (
          <pre className="whitespace-pre-wrap">{transcript}</pre>
        )}
      </ScrollArea>
    </Card>
  );
};

export default TranscriptCard;
