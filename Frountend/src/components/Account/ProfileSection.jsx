/*
 * ProfileSection
 * -------------------------------------------------------
 * Reusable profile information section.
 *
 * Responsibilities:
 * - Display user profile information
 * - Display basic account details
 * - Provide edit-profile action
 *
 * IMPORTANT:
 * This component does NOT handle authentication.
 * Backend/user data will be connected later.
 *
 * Future:
 * - User data API
 * - Profile image upload
 * - Edit profile
 * - Role / organization information
 * - Account security settings
 */

import { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  Building2,
  BriefcaseBusiness,
  Pencil,
  Check,
  X,
} from "lucide-react";

function ProfileSection() {
  /*
   * =======================================================
   * PROFILE STATE
   * =======================================================
   *
   * Temporary frontend data.
   *
   * Later this data will come from the authenticated
   * user's backend profile.
   */

  const [profile, setProfile] = useState({
    name: "Rohit Bhatnagar",
    email: "rohit@example.com",
    phone: "+91 98765 43210",
    organization: "Medical Sales Intelligence",
    role: "Sales Analyst",
  });

  /*
   * Controls edit mode.
   */

  const [isEditing, setIsEditing] = useState(false);

  /*
   * Temporary form state.
   *
   * Keeping form state separate from profile prevents
   * incomplete changes from immediately modifying the
   * displayed profile.
   */

  const [formData, setFormData] = useState(profile);

  /*
   * =======================================================
   * EDIT PROFILE
   * =======================================================
   */

  const handleEdit = () => {
    setFormData(profile);
    setIsEditing(true);
  };

  /*
   * =======================================================
   * CANCEL EDIT
   * =======================================================
   */

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  /*
   * =======================================================
   * SAVE PROFILE
   * =======================================================
   *
   * Currently saves only to frontend state.
   *
   * Later:
   * PATCH /api/profile
   *
   * Backend will validate and persist the data.
   */

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
  };

  /*
   * =======================================================
   * INPUT HANDLER
   * =======================================================
   */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* =================================================
          SECTION HEADER
          ================================================= */}

      <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#1769d1]">
            Account Profile
          </p>

          <h2 className="mt-1 text-xl font-bold text-[#102a4c]">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your account and professional information.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleEdit}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-semibold
              text-[#102a4c]
              transition
              hover:border-blue-200
              hover:bg-blue-50
              hover:text-[#1769d1]
            "
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        )}

      </div>


      {/* =================================================
          PROFILE CONTENT
          ================================================= */}

      <div className="p-6">

        {/* Profile identity */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">

          <div className="
            flex
            h-20
            w-20
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-[#102a4c]
            text-2xl
            font-bold
            text-white
          ">
            {profile.name
              .split(" ")
              .map((word) => word[0])
              .slice(0, 2)
              .join("")}
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#102a4c]">
              {profile.name}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {profile.role}
            </p>

            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
              <Building2 size={14} />
              {profile.organization}
            </div>
          </div>

        </div>


        {/* =================================================
            INFORMATION GRID
            ================================================= */}

        <div className="grid gap-5 md:grid-cols-2">

          {/* Name */}

          <ProfileField
            icon={UserRound}
            label="Full Name"
            name="name"
            value={formData.name}
            isEditing={isEditing}
            onChange={handleChange}
          />


          {/* Email */}

          <ProfileField
            icon={Mail}
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            isEditing={isEditing}
            onChange={handleChange}
          />


          {/* Phone */}

          <ProfileField
            icon={Phone}
            label="Phone Number"
            name="phone"
            value={formData.phone}
            isEditing={isEditing}
            onChange={handleChange}
          />


          {/* Organization */}

          <ProfileField
            icon={Building2}
            label="Organization"
            name="organization"
            value={formData.organization}
            isEditing={isEditing}
            onChange={handleChange}
          />


          {/* Role */}

          <ProfileField
            icon={BriefcaseBusiness}
            label="Professional Role"
            name="role"
            value={formData.role}
            isEditing={isEditing}
            onChange={handleChange}
          />

        </div>


        {/* =================================================
            EDIT ACTIONS
            ================================================= */}

        {isEditing && (
          <div className="
            mt-8
            flex
            flex-col
            gap-3
            border-t
            border-slate-100
            pt-6
            sm:flex-row
            sm:justify-end
          ">

            <button
              type="button"
              onClick={handleCancel}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-200
                px-5
                py-2.5
                text-sm
                font-semibold
                text-slate-600
                transition
                hover:bg-slate-50
              "
            >
              <X size={16} />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#1769d1]
                px-5
                py-2.5
                text-sm
                font-bold
                text-white
                transition
                hover:bg-[#0d4fa8]
                active:scale-[0.99]
              "
            >
              <Check size={16} />
              Save Changes
            </button>

          </div>
        )}

      </div>

    </section>
  );
}


/*
 * =========================================================
 * REUSABLE PROFILE FIELD
 * =========================================================
 *
 * Keeping the field separate makes the main component
 * cleaner and allows the same field UI to be reused later.
 */

function ProfileField({
  icon: Icon,
  label,
  name,
  type = "text",
  value,
  isEditing,
  onChange,
}) {
  return (
    <div>

      <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
        <Icon size={14} />
        {label}
      </label>

      {isEditing ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-3
            text-sm
            text-[#102a4c]
            outline-none
            transition
            focus:border-[#1769d1]
            focus:ring-4
            focus:ring-blue-100
          "
        />
      ) : (
        <div className="
          rounded-xl
          border
          border-slate-100
          bg-slate-50
          px-4
          py-3
          text-sm
          font-medium
          text-[#102a4c]
        ">
          {value}
        </div>
      )}

    </div>
  );
}

export default ProfileSection;