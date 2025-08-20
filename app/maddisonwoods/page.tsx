"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, Heart, Eye, Share2, Star, Crown, Sparkles, BarChart3 } from "lucide-react"

const getReadableReferrer = (ref: string) => {
  if (!ref) return "Direct or unknown";
  if (ref.includes("instagram.com")) return "Instagram";
  if (ref.includes("twitter.com") || ref.includes("x.com")) return "Twitter/X";
  if (ref.includes("facebook.com")) return "Facebook";
  if (ref.includes("tiktok.com")) return "TikTok";
  if (ref.includes("linkedin.com")) return "LinkedIn";
  if (ref.includes("whatsapp.com") || ref.includes("wa.me")) return "WhatsApp";
  return ref;
};

export default function ProfilePage() {
  const [referrer, setReferrer] = useState<string>("");
  const [rawReferrer, setRawReferrer] = useState<string>("");

  useEffect(() => {
    const rawRef = document.referrer;
    setRawReferrer(rawRef);
    setReferrer(getReadableReferrer(rawRef));

    // Send analytics to Supabase with sendBeacon
    const send = () => {
      try {
        if (document.visibilityState !== 'visible') return;
        const payload = {
          page: "maddisonwoods",
          referrer: rawRef,
          timestamp: new Date().toISOString(),
          pathname: "/maddisonwoods",
          searchParams: "",
          click_type: "page_visit"
        };
        const body = JSON.stringify(payload);
        
        if (navigator.sendBeacon) {
          const blob = new Blob([body], { type: 'application/json' });
          navigator.sendBeacon('/api/maddisonwoods-analytics', blob);
        } else {
          fetch("/api/maddisonwoods-analytics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
            keepalive: true
          }).catch(() => {});
        }
      } catch (error) {
        console.error("Failed to track maddisonwoods analytics:", error);
      }
    };

    const timeout = setTimeout(send, 3000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        send();
      }
    };
    document.addEventListener('visibilitychange', onVisible, { once: true });
    return () => {
      clearTimeout(timeout);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  // Click tracking functions
  const trackClick = async (clickType: string) => {
    try {
      const payload = {
        page: "maddisonwoods",
        referrer: rawReferrer,
        timestamp: new Date().toISOString(),
        pathname: "/maddisonwoods",
        searchParams: "",
        click_type: clickType
      };
      
      await fetch("/api/maddisonwoods-analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error(`Failed to track ${clickType} click:`, error);
    }
  };

  const handleExclusiveContentClick = () => {
    trackClick("exclusive_content");
  };

  const handleSubscribeClick = () => {
    trackClick("subscribe_now");
  };

  const handleViewAllContentClick = () => {
    trackClick("view_all_content");
  };

  return (
    <div className="min-h-screen bg-black p-4 overflow-x-hidden">
      <div className="flex min-h-screen items-center justify-center px-2">
        <div className="w-full max-w-md mx-auto">
          {/* Main Profile Card */}
          <Card className="relative overflow-hidden border border-[#B6997B]/50 bg-[#B6997B]/10 shadow-lg backdrop-blur-sm">
            <CardContent className="p-8">
              {/* Premium Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1">
                <Crown className="h-4 w-4 text-[#8B7355]" />
                <Badge variant="secondary" className="bg-[#B6997B]/30 text-[#8B7355] border-[#B6997B]/50">
                  Premium
                </Badge>
              </div>

              {/* Profile Header */}
              <div className="flex flex-col items-center space-y-6">
                {/* Avatar with border */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-[#B6997B]/60 rounded-full opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <Avatar className="relative h-28 w-28 border-4 border-[#B6997B]/20 shadow-lg">
                    <AvatarImage src="/l1.png" alt="Maddison Woods" className="object-cover" />
                    <AvatarFallback className="bg-[#B6997B]/20 text-[#8B7355] text-2xl font-bold">
                      MW
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Verified Badge */}
                  <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#B6997B]/80 shadow-lg ring-4 ring-[#B6997B]/20">
                    <Image
                      src="/images/verified-badge.png"
                      alt="Verified Badge"
                      width={20}
                      height={20}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>

                {/* Name and Status */}
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-bold text-[#8B7355] flex items-center justify-center gap-2">
                    Maddison Woods
                    <Sparkles className="h-5 w-5 text-[#8B7355]" />
                  </h1>
                </div>

                {/* Platform Badge */}
                <div className="flex items-center gap-2 bg-[#B6997B]/10 rounded-full px-4 py-2 border border-[#B6997B]/30">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B6997B]/20 p-1">
                    <Image
                      src="/images/of-logo.png"
                      alt="OnlyFans Logo"
                      width={24}
                      height={24}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span className="text-[#8B7355] font-medium">OnlyFans Creator</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Preview Card - Now Clickable with Tracking */}
          <div onClick={handleExclusiveContentClick}>
            <Link href="https://onlyfans.com/maddison.woods" target="_blank" rel="noopener noreferrer">
              <Card className="mt-6 relative overflow-hidden border border-[#B6997B]/50 bg-[#B6997B]/10 shadow-lg backdrop-blur-sm cursor-pointer hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="relative group">
                    <Image
                      src="/l2.png"
                      alt="Exclusive Content Preview"
                      width={400}
                      height={300}
                      className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30"></div>
                    
                    {/* Content Badge */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <Badge className="bg-[#B6997B]/80 text-white border-0">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          Exclusive Content
                        </span>
                      </Badge>
                    </div>

                    {/* Lock Icon */}
                    <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#B6997B]/40 backdrop-blur-sm text-[#8B7355] border border-[#B6997B]/50">
                      <Lock className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-4">
            <div onClick={handleSubscribeClick}>
              <Link href="https://onlyfans.com/maddison.woods" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-[#B6997B]/60 hover:bg-[#B6997B]/70 text-white font-semibold py-3 shadow-lg backdrop-blur-sm">
                  <Heart className="h-5 w-5 mr-2" />
                  Subscribe Now
                </Button>
              </Link>
            </div>
            <div onClick={handleViewAllContentClick}>
              <Link href="https://onlyfans.com/maddison.woods" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full border-[#B6997B]/50 text-[#8B7355] hover:bg-[#B6997B]/20 backdrop-blur-sm">
                  View All Content
                </Button>
              </Link>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
               
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 



