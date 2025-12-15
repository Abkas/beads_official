import { useState, useEffect } from "react";
import { verifyToken } from "../../api/UserApi";
import toast from "react-hot-toast";

const ProfileInfo = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const result = await verifyToken();
      if (result.isValid) {
        setUserData(result.user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <p className="mt-4 text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-8" style={{ color: "var(--foreground)" }}>
        Profile Information
      </h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              First Name
            </label>
            <input
              type="text"
              value={userData?.firstname || ""}
              readOnly
              className="w-full px-4 py-3 border rounded-lg bg-muted/30"
              style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              Last Name
            </label>
            <input
              type="text"
              value={userData?.lastname || ""}
              readOnly
              className="w-full px-4 py-3 border rounded-lg bg-muted/30"
              style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
            Username
          </label>
          <input
            type="text"
            value={userData?.username || ""}
            readOnly
            className="w-full px-4 py-3 border rounded-lg bg-muted/30"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
            Email
          </label>
          <input
            type="email"
            value={userData?.email || ""}
            readOnly
            className="w-full px-4 py-3 border rounded-lg bg-muted/30"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
            Phone
          </label>
          <input
            type="tel"
            value={userData?.phone || "Not provided"}
            readOnly
            className="w-full px-4 py-3 border rounded-lg bg-muted/30"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>

        <div className="pt-4">
          <p className="text-xs text-muted-foreground">
            Account created: {userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
