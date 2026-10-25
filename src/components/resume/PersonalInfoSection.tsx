
"use client";

export type PersonalInfo = {
  fullname: string;
  email: string;
  mobile: string;
  location: string;
  linkedIn: string;
  github: string;
  portfolio: string;
};

type PersonalInfoSectionProps = {
  personalInfo: PersonalInfo;
  onChange: (field: keyof PersonalInfo, value: string) => void;
  onSave: () => void;
  saving: boolean;
};

const inputClass =
  "w-full rounded-xl border border-[#353047] bg-[#100F19] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#777286] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10";

const labelClass = "mb-2 block text-sm text-[#D8D4E5]";

export default function PersonalInfoSection({
  personalInfo,
  onChange,
  onSave,
  saving,
}: PersonalInfoSectionProps) {
  return (
    <section className="mt-6 rounded-2xl border border-[#292536] bg-[#12111B] p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-sm font-semibold text-violet-300">
          02
        </div>

        <div>
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <p className="mt-1 text-sm text-[#A5A1B5]">
            Add the contact details you want employers to see.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullname" className={labelClass}>
            Full Name
          </label>
          <input
            id="fullname"
            value={personalInfo.fullname}
            onChange={(e) => onChange("fullname", e.target.value)}
            placeholder="Your full name"
            className={inputClass}
            maxLength={150}
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
            maxLength={254}
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="mobile" className={labelClass}>
            Mobile Number
          </label>
          <input
            id="mobile"
            type="tel"
            value={personalInfo.mobile}
            onChange={(e) => onChange("mobile", e.target.value)}
            placeholder="Your contact number"
            className={inputClass}
            maxLength={30}
            autoComplete="tel"
          />
        </div>

        <div>
          <label htmlFor="location" className={labelClass}>
            Location
          </label>
          <input
            id="location"
            value={personalInfo.location}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="City, State"
            className={inputClass}
            maxLength={150}
            autoComplete="address-level2"
          />
        </div>

        <div>
          <label htmlFor="linkedIn" className={labelClass}>
            LinkedIn URL
          </label>
          <input
            id="linkedIn"
            type="url"
            value={personalInfo.linkedIn}
            onChange={(e) => onChange("linkedIn", e.target.value)}
            placeholder="https://linkedin.com/in/..."
            className={inputClass}
            maxLength={300}
          />
        </div>

        <div>
          <label htmlFor="github" className={labelClass}>
            GitHub URL
          </label>
          <input
            id="github"
            type="url"
            value={personalInfo.github}
            onChange={(e) => onChange("github", e.target.value)}
            placeholder="https://github.com/..."
            className={inputClass}
            maxLength={300}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="portfolio" className={labelClass}>
            Portfolio URL
          </label>
          <input
            id="portfolio"
            type="url"
            value={personalInfo.portfolio}
            onChange={(e) => onChange("portfolio", e.target.value)}
            placeholder="https://yourportfolio.com"
            className={inputClass}
            maxLength={300}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="mt-7 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Saving Information..." : "Save Personal Information"}
      </button>
    </section>
  );
}
