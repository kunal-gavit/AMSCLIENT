import { useEffect, useMemo, useState } from "react";
import { Camera, KeyRound, Save, UserCircle2, X } from "lucide-react";
import useAuth from "../context/useAuth";
import { profileApi } from "../services/api";

const roleLabel = (role) => {
  if (role === "teacher") return "Faculty";
  return role ? role[0].toUpperCase() + role.slice(1) : "User";
};

const toInitials = (name = "User") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const ProfilePage = () => {
  const { refreshUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmNewPassword: "" });

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    profileImage: "",
    extraDetails: {},
    attendanceSummary: null,
  });

  const [form, setForm] = useState({
    name: "",
    profileImage: "",
    branch: "",
    year: "",
    division: "",
    rollNo: "",
    department: "",
    designation: "",
    subjectsText: "",
  });

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await profileApi.getProfile();
      setProfile(data);
      setForm({
        name: data.name || "",
        profileImage: data.profileImage || "",
        branch: data.extraDetails?.branch || "",
        year: data.extraDetails?.year || "",
        division: data.extraDetails?.division || "",
        rollNo: data.extraDetails?.rollNo || "",
        department: data.extraDetails?.department || "",
        designation: data.extraDetails?.designation || "",
        subjectsText: Array.isArray(data.extraDetails?.subjects) ? data.extraDetails.subjects.join(", ") : "",
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const avatarSrc = useMemo(() => {
    if (form.profileImage) return form.profileImage;
    const initials = encodeURIComponent(toInitials(form.name || profile.name));
    return `https://ui-avatars.com/api/?name=${initials}&background=0A2A66&color=fff`;
  }, [form.profileImage, form.name, profile.name]);

  const onImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, profileImage: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const onSaveProfile = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        name: form.name?.trim(),
      };

      if (form.profileImage !== "") {
        payload.profileImage = form.profileImage;
      }

      if (profile.role === "student") {
        if (form.branch?.trim()) payload.branch = form.branch.trim();
        if (form.year?.trim()) payload.year = form.year.trim();
        if (form.division?.trim()) payload.division = form.division.trim();
        if (form.rollNo?.trim()) payload.rollNo = form.rollNo.trim();
      }

      if (profile.role === "teacher") {
        if (form.department?.trim()) payload.department = form.department.trim();
        if (form.designation?.trim()) payload.designation = form.designation.trim();
        payload.subjects = form.subjectsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      const { data } = await profileApi.updateProfile(payload);
      setProfile(data);
      await refreshUser();
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async () => {
    setPasswordSaving(true);
    setMessage("");
    setError("");

    try {
      if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
        setError("New password and confirm password do not match");
        return;
      }

      await profileApi.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      setShowPasswordModal(false);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
      setMessage("Password updated successfully");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card-academic">
        <p className="text-sm text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card-academic !p-0 overflow-hidden">
        <div className="bg-primary text-white px-6 py-5">
          <h2 className="text-xl font-bold">User Profile</h2>
          <p className="text-sm text-blue-100">MITAOE Smart Attendance & Academic Intelligence System</p>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100">
            <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-2xl font-bold text-gray-900">{profile.name}</p>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
            <span className="inline-flex rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
              {roleLabel(profile.role)}
            </span>
          </div>
        </div>
      </div>

      {message ? <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{message}</div> : null}
      {error ? <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
        <div className="card-academic space-y-5">
          <h3 className="text-lg font-bold text-gray-900">Edit Profile</h3>

          <div>
            <label className="form-label">Profile Image</label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="btn-secondary cursor-pointer">
                <Camera size={16} /> Upload Image
                <input type="file" accept="image/*" className="hidden" onChange={onImageUpload} />
              </label>
              <input
                className="input-academic"
                placeholder="Or paste image URL"
                value={form.profileImage}
                onChange={(e) => setForm((prev) => ({ ...prev, profileImage: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Full Name</label>
            <input
              className="input-academic"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <label className="form-label">Email</label>
            <input className="input-academic bg-gray-100" value={profile.email} disabled />
          </div>

          {profile.role === "student" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Branch</label>
                <input className="input-academic" value={form.branch} onChange={(e) => setForm((prev) => ({ ...prev, branch: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Year</label>
                <input className="input-academic" value={form.year} onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Division</label>
                <input className="input-academic" value={form.division} onChange={(e) => setForm((prev) => ({ ...prev, division: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Roll No</label>
                <input className="input-academic" value={form.rollNo} onChange={(e) => setForm((prev) => ({ ...prev, rollNo: e.target.value }))} />
              </div>
            </div>
          )}

          {profile.role === "teacher" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Department</label>
                <input className="input-academic" value={form.department} onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Designation</label>
                <input className="input-academic" value={form.designation} onChange={(e) => setForm((prev) => ({ ...prev, designation: e.target.value }))} />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Subjects (comma separated)</label>
                <input className="input-academic" value={form.subjectsText} onChange={(e) => setForm((prev) => ({ ...prev, subjectsText: e.target.value }))} />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="button" className="btn-primary" onClick={onSaveProfile} disabled={saving}>
              <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setShowPasswordModal(true)}>
              <KeyRound size={16} /> Change Password
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-academic">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Details</h3>
            {profile.role === "student" && (
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-semibold">Branch:</span> {profile.extraDetails?.branch || "-"}</p>
                <p><span className="font-semibold">Year:</span> {profile.extraDetails?.year || "-"}</p>
                <p><span className="font-semibold">Division:</span> {profile.extraDetails?.division || "-"}</p>
                <p><span className="font-semibold">Roll No:</span> {profile.extraDetails?.rollNo || "-"}</p>
              </div>
            )}

            {profile.role === "teacher" && (
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-semibold">Department:</span> {profile.extraDetails?.department || "-"}</p>
                <p><span className="font-semibold">Designation:</span> {profile.extraDetails?.designation || "-"}</p>
                <div>
                  <p className="font-semibold mb-1">Subjects Taught:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {(profile.extraDetails?.subjectsTaught || []).length > 0 ? (
                      profile.extraDetails.subjectsTaught.map((item) => (
                        <li key={item._id}>{item.name} {item.code ? `(${item.code})` : ""}</li>
                      ))
                    ) : (
                      <li>No subjects assigned</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {profile.role === "admin" && (
              <p className="text-sm text-gray-700">Administrator account with platform oversight access.</p>
            )}
          </div>

          {profile.role === "student" && profile.attendanceSummary && (
            <div className="card-academic">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Attendance Summary</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-semibold">Total Classes:</span> {profile.attendanceSummary.totalClasses}</p>
                <p><span className="font-semibold">Attended:</span> {profile.attendanceSummary.attendedClasses}</p>
                <p><span className="font-semibold">Percentage:</span> {profile.attendanceSummary.percentage}%</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
              <button type="button" className="text-gray-500 hover:text-gray-700" onClick={() => setShowPasswordModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="form-label">Old Password</label>
              <input
                type="password"
                className="input-academic"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, oldPassword: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="input-academic"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="input-academic"
                value={passwordForm.confirmNewPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmNewPassword: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" className="btn-secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button>
              <button type="button" className="btn-primary" onClick={onChangePassword} disabled={passwordSaving}>
                {passwordSaving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
