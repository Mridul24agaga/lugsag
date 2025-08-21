import { NextRequest, NextResponse } from "next/server";
import { supabase, BrookeAnalyticsData } from "@/lib/supabase";

export async function GET() {
  try {
    const { count, error: countError } = await supabase
      .from('maddisonwoods_analytics')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      return NextResponse.json({ success: false, error: countError.message }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('maddisonwoods_analytics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100000);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: data || [],
      totalRecords: count,
      fetchedRecords: data?.length || 0
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { referrer, timestamp, page, pathname, searchParams, click_type } = body;
    
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";
    
    const userAgent = req.headers.get("user-agent") || "unknown";
    
    const getReadableReferrer = (ref: string) => {
      if (!ref) return "Direct or unknown";
      if (ref.includes("instagram.com") || ref.includes("m.instagram.com")) return "Instagram";
      if (ref.includes("twitter.com") || ref.includes("x.com") || ref.includes("mobile.twitter.com")) return "Twitter/X";
      if (ref.includes("facebook.com") || ref.includes("m.facebook.com") || ref.includes("fb.com")) return "Facebook";
      if (ref.includes("tiktok.com") || ref.includes("vm.tiktok.com")) return "TikTok";
      if (ref.includes("linkedin.com") || ref.includes("m.linkedin.com")) return "LinkedIn";
      if (ref.includes("whatsapp.com") || ref.includes("wa.me") || ref.includes("web.whatsapp.com")) return "WhatsApp";
      if (ref.includes("snapchat.com")) return "Snapchat";
      if (ref.includes("youtube.com") || ref.includes("youtu.be") || ref.includes("m.youtube.com")) return "YouTube";
      if (ref.includes("reddit.com") || ref.includes("m.reddit.com")) return "Reddit";
      if (ref.includes("pinterest.com") || ref.includes("m.pinterest.com")) return "Pinterest";
      if (ref.includes("t.me") || ref.includes("telegram.org")) return "Telegram";
      if (ref.includes("discord.com") || ref.includes("discord.gg")) return "Discord";
      return ref;
    };

    const readableReferrer = getReadableReferrer(referrer || "");

    const analyticsData: BrookeAnalyticsData = {
      page: page || "maddisonwoods",
      referrer: referrer || "",
      readable_referrer: readableReferrer,
      user_agent: userAgent,
      ip_address: ip,
      timestamp: timestamp || new Date().toISOString(),
      pathname: pathname || "/maddisonwoods",
      search_params: searchParams || "",
      click_type: click_type || "page_visit"
    };

    const { data, error } = await supabase
      .from('maddisonwoods_analytics')
      .insert([analyticsData])
      .select();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: analyticsData,
      supabaseData: data 
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to store analytics" }, { status: 500 });
  }
} 



