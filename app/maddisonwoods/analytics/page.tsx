"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Eye, Users, TrendingUp, Globe, Clock, ArrowLeft, RefreshCw, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/protected-route";

interface MaddisonwoodsAnalyticsData {
  id: number;
  page: string;
  referrer: string;
  readable_referrer: string;
  user_agent: string;
  ip_address: string;
  timestamp: string;
  pathname: string;
  search_params: string;
  click_type?: string; // Added for click tracking
  created_at: string;
}

export default function MaddisonwoodsAnalyticsPage() {
  return (
    <ProtectedRoute>
      <MaddisonwoodsAnalyticsContent />
    </ProtectedRoute>
  );
}

function MaddisonwoodsAnalyticsContent() {
  const [analyticsData, setAnalyticsData] = useState<MaddisonwoodsAnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMaddisonwoodsAnalytics();
  }, []);

  const fetchMaddisonwoodsAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/maddisonwoods-analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      const data = await response.json();
      setAnalyticsData(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Treat only 'page_visit' rows as visitors to keep metrics consistent
  const visitRows = analyticsData.filter(item => (item.click_type || 'page_visit') === 'page_visit');

  // Calculate statistics
  const totalVisits = visitRows.length;
  const uniqueIPs = new Set(visitRows.map(item => item.ip_address)).size;
  const referrerStats = visitRows.reduce((acc, item) => {
    const ref = item.readable_referrer;
    acc[ref] = (acc[ref] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topReferrers = Object.entries(referrerStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const getDeviceType = (userAgent: string) => {
    if (userAgent.includes("Mobile")) return "Mobile";
    if (userAgent.includes("Tablet")) return "Tablet";
    return "Desktop";
  };

  const deviceStats = visitRows.reduce((acc, item) => {
    const device = getDeviceType(item.user_agent);
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate click tracking statistics
  const clickStats = analyticsData.reduce((acc, item) => {
    const clickType = item.click_type || 'page_visit';
    acc[clickType] = (acc[clickType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pageVisits = clickStats.page_visit || 0;
  const exclusiveContentClicks = clickStats.exclusive_content || 0;
  const subscribeClicks = clickStats.subscribe_now || 0;
  const viewAllContentClicks = clickStats.view_all_content || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-gray-800 text-center py-20">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 animate-spin text-[#B19272]" />
            <h1 className="text-2xl font-bold">Loading Maddison Woods Analytics...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-gray-800 text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Error Loading Analytics</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchMaddisonwoodsAnalytics} className="bg-[#B19272] hover:bg-[#9A7B5F]">Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics for Maddison Woods</h1>
            <p className="text-gray-600">Track your page performance and visitor insights</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={fetchMaddisonwoodsAnalytics}
              variant="outline" 
              className="border-[#B19272] text-[#B19272] hover:bg-[#B19272] hover:text:white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Link href="/maddisonwoods">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Link Overview Card */}
        <Card className="mb-6 border-[#B19272]">
          <CardHeader>
            <CardTitle className="text-gray-900">Link Overview</CardTitle>
            <p className="text-gray-600">Link details and visitor metrics</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
              <Badge className="bg-gray-100 text-gray-800 border-gray-200">Redirect</Badge>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <LinkIcon className="h-4 w-4 text-[#B19272]" />
              <span className="text-[#B19272] font-medium"> lure.bio/maddisonwoods</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">{totalVisits} All-Time Visitors</span>
            </div>
            <div className="text-sm text-gray-500">Created on Aug 19, 2025</div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-[#B19272]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total period visitors</p>
                  <p className="text-3xl font-bold text-gray-900">{totalVisits}</p>
                </div>
                <Users className="h-8 w-8 text-[#B19272]" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-[#B19272]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unique visitors</p>
                  <p className="text-3xl font-bold text-gray-900">{uniqueIPs}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-[#B19272]" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-[#B19272]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Mobile visitors</p>
                  <p className="text-3xl font-bold text-gray-900">{deviceStats.Mobile || 0}</p>
                </div>
                <Globe className="h-8 w-8 text-[#B19272]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Click Tracking */}
        <Card className="mb-8 border-[#B19272]">
          <CardHeader>
            <CardTitle className="text-gray-900">Click Tracking</CardTitle>
            <p className="text-gray-600">Track interactions with your content and buttons</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-[#B19272]">{pageVisits}</div>
                <div className="text-sm text-gray-600">Page Visits</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-[#B19272]">{exclusiveContentClicks}</div>
                <div className="text-sm text-gray-600">Exclusive Content Clicks</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-[#B19272]">{subscribeClicks}</div>
                <div className="text-sm text-gray-600">Subscribe Clicks</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-[#B19272]">{viewAllContentClicks}</div>
                <div className="text-sm text-gray-600">View All Content Clicks</div>
              </div>
            </div>
            
            {/* Conversion Rates */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rates</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-[#B19272]">
                    {pageVisits > 0 ? ((exclusiveContentClicks / pageVisits) * 100).toFixed(1) : 0}%
                  </div>
                  <div className="text-sm text-gray-600">Exclusive Content CTR</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-[#B19272]">
                    {pageVisits > 0 ? ((subscribeClicks / pageVisits) * 100).toFixed(1) : 0}%
                  </div>
                  <div className="text-sm text-gray-600">Subscribe CTR</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-[#B19272]">
                    {pageVisits > 0 ? ((viewAllContentClicks / pageVisits) * 100).toFixed(1) : 0}%
                  </div>
                  <div className="text-sm text-gray-600">View All CTR</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visits by Referrer Chart */}
        <Card className="border-[#B19272]">
          <CardHeader>
            <CardTitle className="text-gray-900">Visits by Referrer</CardTitle>
            <p className="text-gray-600">Distribution of visits from different referring domains</p>
          </CardHeader>
          <CardContent>
            {topReferrers.length > 0 ? (
              <div className="space-y-4">
                {topReferrers.map(([referrer, count], index) => (
                  <div key={referrer} className="flex items:center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-4 w-4 rounded"
                        style={{ backgroundColor: index === 0 ? '#B19272' : '#E5E7EB' }}
                      />
                      <span className="text-gray-700 font-medium">{referrer}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${(count / Math.max(...topReferrers.map(([,c]) => c))) * 100}%`,
                            backgroundColor: index === 0 ? '#B19272' : '#9CA3AF'
                          }}
                        />
                      </div>
                      <span className="text-gray-900 font-semibold min-w-[3rem] text-right">{count}</span>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    {totalVisits} total visits • Showing click distribution across all referral sources
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No referrer data available yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



