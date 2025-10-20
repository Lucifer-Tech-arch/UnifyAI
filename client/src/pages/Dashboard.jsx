import React, { useEffect, useState } from "react";
import { Gem, Sparkles } from "lucide-react";
import CreationItem from "../components/CreationItem";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlan] = useState("Free");
  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-user-creations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCreations(Array.isArray(data.creations) ? data.creations : []);
        setActivePlan(data.plan?.charAt(0).toUpperCase() + data.plan?.slice(1) || "Free");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch creations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="h-full overflow-y-scroll p-6">
      {/* Stats Cards */}
      <div className="flex justify-start gap-4 mb-6 flex-wrap">
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Total Creations</p>
            <h2 className="text-xl font-semibold">{creations.length || 0}</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[linear-gradient(to_right,#2A65F5,#19D7B5)] text-white flex justify-center items-center">
            <Sparkles className="w-5 text-white" />
          </div>
        </div>

        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Active Plan</p>
            <h2 className="text-xl font-semibold">{activePlan}</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[linear-gradient(to_right,#2A65F5,#19D7B5)] text-white flex justify-center items-center">
            <Gem className="w-5 text-white" />
          </div>
        </div>
      </div>

      {/* Recent Creations */}
      {loading ? (
        <div className="flex items-center justify-center w-full h-[70vh]">
          <span className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></span>
        </div>
      ) : creations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <img
            src="/notfound.png"
            alt="No Creations"
            className="w-64 h-64 object-contain mb-3"
          />
          <p className="text-gray-500 text-sm">No creations found!</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="mb-4 text-slate-700 font-medium">Recent Creations</p>
          {creations.map((item) => (
            <CreationItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
