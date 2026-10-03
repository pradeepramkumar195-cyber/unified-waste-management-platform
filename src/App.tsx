import { useEffect, useMemo, useRef, useState } from "react"

type Role = "citizen" | "operator" | "worker" | "agency"
type Screen = "home" | "report" | "homeService" | "track" | "schedule" | "impact" | "rewards" | "notifications" | "profile" | "complaints" | "map" | "collection" | "workers" | "hotspots" | "analytics" | "tasks" | "route" | "history" | "scanner" | "incoming"

type Status = "Reported" | "Assigned" | "In Progress" | "Verified" | "Resolved"

type Complaint = {
  id: string
  category: string
  location: string
  ward: string
  status: Status
  priority: "Critical" | "High" | "Medium" | "Normal"
  reason: string
  worker?: string
  weight?: number
  photo?: string
  description?: string
  requestType?: "report" | "home-service"
  reassignmentRequested?: boolean
  createdAt: string
}

type IconName = "home" | "report" | "track" | "calendar" | "impact" | "gift" | "bell" | "user" | "building" | "truck" | "recycle" | "map" | "list" | "chart" | "pin" | "camera" | "check" | "clock" | "alert" | "arrow" | "menu" | "close" | "scan" | "scale" | "logout" | "language" | "shield" | "leaf"

const iconPaths: Record<IconName, React.ReactNode> = {
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </>
  ),
  report: (
    <>
      <path d="M12 5v14M5 12h14" />
      <circle cx="12" cy="12" r="9" />
    </>
  ),
  track: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4m8-4v4M3 10h18" />
    </>
  ),
  impact: (
    <>
      <path d="M12 22V10" />
      <path d="M12 14C5 13 4 7 4 4c5 0 9 2 8 10Zm0 4c6 0 8-4 8-8-5 0-8 2-8 8Z" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="9" width="18" height="12" rx="2" />
      <path d="M12 9v12M3 13h18M7.5 9C4 9 4 4 7 4c2 0 5 5 5 5m4.5 0C20 9 20 4 17 4c-2 0-5 5-5 5" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-5 3-8 8-8s8 3 8 8" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V5l8-3 8 3v16M2 21h20M8 8h1m6 0h1M8 12h1m6 0h1M8 16h1m6 0h1" />
    </>
  ),
  truck: (
    <>
      <path d="M3 5h11v12H3zM14 9h4l3 4v4h-7z" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
    </>
  ),
  recycle: (
    <>
      <path d="m7 19-3-5 3-5m10-4 3 5-3 5M4 14h7m2-9h4l3 5M7 9l3-5h4m3 11-3 5H8" />
    </>
  ),
  map: (
    <>
      <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" />
      <path d="M9 3v15m6-12v15" />
    </>
  ),
  list: (
    <>
      <path d="M9 6h12M9 12h12M9 18h12" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V10m6 10V4m6 16v-7m4 7H2" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2" />
    </>
  ),
  camera: (
    <>
      <path d="M4 7h4l2-3h4l2 3h4v13H4Z" />
      <circle cx="12" cy="13" r="4" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3 2 21h20Z" />
      <path d="M12 9v5m0 3h.01" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14m-5-5 5 5-5 5" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  scan: <path d="M8 3H3v5m13-5h5v5M8 21H3v-5m13 5h5v-5M7 12h10" />,
  scale: (
    <>
      <path d="M5 7h14l2 14H3Z" />
      <path d="M12 7V3m-3 8c2-2 4-2 6 0" />
    </>
  ),
  logout: (
    <>
      <path d="M10 4H4v16h6m5-4 4-4-4-4m4 4H9" />
    </>
  ),
  language: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4 6v6c0 5 3 8 8 10 5-2 8-5 8-10V6Z" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4C10 4 4 9 4 16c0 3 2 5 5 5 7 0 11-7 11-17Z" />
      <path d="M4 20c3-5 7-8 12-11" />
    </>
  ),
}

function Icon({ name, size = 20 }: { name: IconName size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  )
}

const roleInfo = {
  citizen: {
    label: "Citizen",
    sub: "Report waste and track collection",
    icon: "user" as IconName,
    demo: "Ananya Rao",
  },
  operator: {
    label: "Municipal Operator",
    sub: "Manage wards and field operations",
    icon: "building" as IconName,
    demo: "Priya Sharma",
  },
  worker: {
    label: "Waste Collector",
    sub: "View and verify collection tasks",
    icon: "truck" as IconName,
    demo: "Ramesh Kumar",
  },
  agency: {
    label: "Recycling Agency",
    sub: "Receive and verify materials",
    icon: "recycle" as IconName,
    demo: "GreenLoop Agency",
  },
}

const nav: Record<Role, { label: string screen: Screen icon: IconName }[]> = {
  citizen: [
    { label: "Home", screen: "home", icon: "home" },
    { label: "Report Waste", screen: "report", icon: "report" },
    { label: "Request Home Service", screen: "homeService", icon: "truck" },
    { label: "Track Report", screen: "track", icon: "track" },
    { label: "Schedule", screen: "schedule", icon: "calendar" },
    { label: "Eco Impact", screen: "impact", icon: "impact" },
    { label: "Rewards", screen: "rewards", icon: "gift" },
    { label: "Notifications", screen: "notifications", icon: "bell" },
    { label: "Profile", screen: "profile", icon: "user" },
  ],
  operator: [
    { label: "Dashboard", screen: "home", icon: "home" },
    { label: "Complaints", screen: "complaints", icon: "list" },
    { label: "Live Map", screen: "map", icon: "map" },
    { label: "Collection", screen: "collection", icon: "truck" },
    { label: "Workers", screen: "workers", icon: "user" },
    { label: "Hotspots", screen: "hotspots", icon: "alert" },
    { label: "Recycling", screen: "incoming", icon: "recycle" },
    { label: "Analytics", screen: "analytics", icon: "chart" },
    { label: "Notifications", screen: "notifications", icon: "bell" },
  ],
  worker: [
    { label: "Today", screen: "home", icon: "home" },
    { label: "Route", screen: "route", icon: "map" },
    { label: "Tasks", screen: "tasks", icon: "list" },
    { label: "Scan QR", screen: "scanner", icon: "scan" },
    { label: "History", screen: "history", icon: "chart" },
    { label: "Profile", screen: "profile", icon: "user" },
  ],
  agency: [
    { label: "Dashboard", screen: "home", icon: "home" },
    { label: "Incoming Material", screen: "incoming", icon: "truck" },
    { label: "Verification", screen: "tasks", icon: "shield" },
    { label: "History", screen: "history", icon: "chart" },
    { label: "Profile", screen: "profile", icon: "user" },
  ],
}

const initialComplaints: Complaint[] = [
  {
    id: "SW-10482",
    category: "Overflowing Bin",
    location: "Street 5, Lakshmi Nagar",
    ward: "Ward 14",
    status: "Reported",
    priority: "High",
    reason: "4 reports from this location in the last 24 hours",
    createdAt: "Today, 10:32 AM",
  },
  {
    id: "SW-10479",
    category: "Waste Near Drain",
    location: "Govt. School Road",
    ward: "Ward 14",
    status: "Assigned",
    priority: "Critical",
    reason: "Waste is close to a school and storm drain",
    worker: "Ramesh Kumar",
    createdAt: "Today, 8:45 AM",
  },
  {
    id: "SW-10471",
    category: "Missed Pickup",
    location: "Market Road",
    ward: "Ward 12",
    status: "In Progress",
    priority: "High",
    reason: "Two consecutive scheduled pickups were missed",
    worker: "Sunita Devi",
    createdAt: "Yesterday, 4:12 PM",
  },
  {
    id: "SW-10460",
    category: "Illegal Dumping",
    location: "Bus Stand Lane",
    ward: "Ward 9",
    status: "Verified",
    priority: "Medium",
    reason: "Single confirmed report",
    worker: "Arjun Naik",
    weight: 18.5,
    createdAt: "Yesterday, 11:20 AM",
  },
]

const statusOrder: Status[] = [
  "Reported",
  "Assigned",
  "In Progress",
  "Verified",
  "Resolved",
]

function Button({
  children,
  onClick,
  variant = "primary",
  icon,
  type = "button",
  disabled,
  className = "",
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "ghost" | "danger"
  icon?: IconName
  type?: "button" | "submit"
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${className}`}
    >
      {icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
    </button>
  )
}

function Badge({
  children,
  tone = "purple",
}: {
  children: React.ReactNode
  tone?: string
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return <section className={`card ${className}`}>{children}</section>
}

function PageTitle({ title, subtitle }: { title: string subtitle?: string }) {
  return (
    <div className="page-title">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: Status }) {
  const tones: Record<Status, string> = {
    Reported: "yellow",
    Assigned: "blue",
    "In Progress": "orange",
    Verified: "green",
    Resolved: "green",
  }
  return (
    <Badge tone={tones[status]}>
      <span className="status-dot" />
      {status}
    </Badge>
  )
}

function PriorityBadge({ priority }: { priority: Complaint["priority"] }) {
  const tones = {
    Critical: "red",
    High: "orange",
    Medium: "yellow",
    Normal: "green",
  }
  return (
    <Badge tone={tones[priority]}>
      <Icon name="alert" size={14} />
      {priority}
    </Badge>
  )
}


function changeLanguage(value: string) {
  const map: Record<string, string> = { English: "en", हिन्दी: "hi", తెలుగు: "te" }
  const lang = map[value] || "en"
  const select = document.querySelector(".goog-te-combo") as HTMLSelectElement | null
  if (select) {
    select.value = lang
    select.dispatchEvent(new Event("change"))
  } else {
    window.setTimeout(() => changeLanguage(value), 500)
  }
}

function Login({ onLogin }: { onLogin: (role: Role) => void }) {
  const [selected, setSelected] = useState<Role>("citizen")
  const [language, setLanguage] = useState("English")
  return (
    <main className="login-shell">
      <header className="public-header">
        <Brand />
        <label className="language-select">
          <Icon name="language" size={18} />
          <span className="sr-only">Language</span>
          <select
            value={language}
            onChange={(e) => { setLanguage(e.target.value); changeLanguage(e.target.value) }}
          >
            <option>English</option>
            <option>हिन्दी</option>
            <option>తెలుగు</option>
          </select>
        </label>
      </header>
      <div className="login-grid">
        <section className="login-story">
          <Badge tone="purple">
            <Icon name="shield" size={15} /> Municipal service platform
          </Badge>
          <h1>Cleaner streets begin with one simple action.</h1>
          <p>
            Report, collect, verify and recycle — together. SwachhSetu connects
            every person who helps keep our community clean.
          </p>
          <div className="quote">
            <Icon name="leaf" size={24} />
            <span>
              “Clean surroundings, healthy families, stronger communities.”
            </span>
          </div>
          <div className="journey">
            {[
              ["report", "Report"],
              ["alert", "Prioritize"],
              ["truck", "Collect"],
              ["shield", "Verify"],
              ["recycle", "Recycle"],
            ].map(([i, label], index) => (
              <div className="journey-step" key={label}>
                <span>
                  <Icon name={i as IconName} />
                </span>
                <b>{label}</b>
                {index < 4 && <Icon name="arrow" size={16} />}
              </div>
            ))}
          </div>
          <div className="trust-row">
            <span>
              <Icon name="check" size={18} /> Easy to use
            </span>
            <span>
              <Icon name="check" size={18} /> Track every request
            </span>
            <span>
              <Icon name="check" size={18} /> Verified rewards
            </span>
          </div>
        </section>
        <Card className="login-card">
          <div className="login-heading">
            <span className="login-mark">
              <Icon name="user" size={24} />
            </span>
            <h2>Welcome to SwachhSetu</h2>
            <p>Choose how you serve the community</p>
          </div>
          <div className="role-grid">
            {(Object.keys(roleInfo) as Role[]).map((role) => {
              const info = roleInfo[role]
              return (
                <button
                  key={role}
                  className={`role-card ${selected === role ? "selected" : ""}`}
                  onClick={() => setSelected(role)}
                  aria-pressed={selected === role}
                >
                  <span className="role-icon">
                    <Icon name={info.icon} size={25} />
                  </span>
                  <span>
                    <strong>{info.label}</strong>
                    <small>{info.sub}</small>
                  </span>
                  <span className="radio">{selected === role && <span />}</span>
                </button>
              )
            })}
          </div>
          <Button
            className="login-button"
            onClick={() => onLogin(selected)}
            icon="arrow"
          >
            Continue as {roleInfo[selected].label}
          </Button>
          <p className="demo-note">Demo access · No password required</p>
        </Card>
      </div>
      <footer className="login-footer">
        <span>SwachhSetu · A cleaner community, connected</span>
        <span>Accessible in English · हिन्दी · తెలుగు</span>
      </footer>
    </main>
  )
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand">
      <span className="brand-mark">
        <Icon name="recycle" size={compact ? 20 : 25} />
      </span>
      <span>
        <strong>SwachhSetu</strong>
        {!compact && <small>Clean communities, connected</small>}
      </span>
    </div>
  )
}

function AppShell({
  role,
  screen,
  setScreen,
  onLogout,
  children,
}: {
  role: Role
  screen: Screen
  setScreen: (s: Screen) => void
  onLogout: () => void
  children: React.ReactNode
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const bottom = nav[role].slice(0, 5)
  return (
    <div className={`app-shell role-${role}`}>
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <Brand />
          <button
            className="mobile-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="role-label">
          <span>
            <Icon name={roleInfo[role].icon} />
          </span>
          <div>
            <small>Signed in as</small>
            <strong>{roleInfo[role].label}</strong>
          </div>
        </div>
        <nav className="side-nav" aria-label="Main navigation">
          {nav[role].map((item) => (
            <button
              key={item.screen}
              className={screen === item.screen ? "active" : ""}
              onClick={() => {
                setScreen(item.screen)
                setMenuOpen(false)
              }}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button className="logout-button" onClick={onLogout}>
          <Icon name="logout" />
          <span>Switch role / Sign out</span>
        </button>
      </aside>
      {menuOpen && (
        <button
          className="backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div className="app-main">
        <header className="app-header">
          <button
            className="menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Icon name="menu" />
          </button>
          <Brand compact />
          <div className="header-actions">
            <label className="language-select">
              <Icon name="language" size={18} />
              <select aria-label="Choose language" defaultValue="English" onChange={(e) => changeLanguage(e.target.value)}>
                <option>English</option>
                <option>हिन्दी</option>
                <option>తెలుగు</option>
              </select>
            </label>
            <button
              className="icon-button"
              onClick={() => setScreen("notifications")}
              aria-label="Notifications"
            >
              <Icon name="bell" />
              <span className="notification-dot" />
            </button>
            <span className="avatar">
              {roleInfo[role].demo
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </span>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {bottom.map((item) => (
          <button
            key={item.screen}
            className={screen === item.screen ? "active" : ""}
            onClick={() => setScreen(item.screen)}
          >
            <Icon name={item.icon} />
            <span>{item.label.split(" ")[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

function CitizenHome({
  setScreen,
  active,
}: {
  setScreen: (s: Screen) => void
  active: Complaint
}) {
  return (
    <>
      <div className="welcome-row">
        <div>
          <p className="eyebrow">NAMASTE, ANANYA</p>
          <h1>What can we help you with today?</h1>
          <p>Ward 14 · Lakshmi Nagar</p>
        </div>
        <div className="clean-message">
          <Icon name="leaf" />
          <span>Small actions make a cleaner ward.</span>
        </div>
      </div>
      <div className="hero-action-grid">
        <button
          className="big-action primary-action"
          onClick={() => setScreen("report")}
        >
          <span>
            <Icon name="camera" size={30} />
          </span>
          <strong>Report Waste</strong>
          <small>Photo and location · under 1 minute</small>
          <Icon name="arrow" />
        </button>
        <button className="big-action" onClick={() => setScreen("schedule")}>
          <span>
            <Icon name="calendar" size={30} />
          </span>
          <strong>View Collection</strong>
          <small>See your weekly schedule</small>
          <Icon name="arrow" />
        </button>
      </div>
      <div className="citizen-stats">
        <Card className="next-collection">
          <div className="card-head">
            <span className="icon-tile">
              <Icon name="truck" />
            </span>
            <Badge tone="green">Today</Badge>
          </div>
          <p className="label">NEXT COLLECTION</p>
          <h2>Dry Waste</h2>
          <div className="big-time">7:00 – 9:00 AM</div>
          <p className="muted">
            <Icon name="pin" size={16} /> Collection Zone 14A
          </p>
          <Button variant="secondary" onClick={() => setScreen("schedule")}>
            Full schedule
          </Button>
        </Card>
        <Card>
          <div className="card-head">
            <span className="icon-tile">
              <Icon name="track" />
            </span>
            <StatusBadge status={active.status} />
          </div>
          <p className="label">ACTIVE REPORT</p>
          <h3>{active.category}</h3>
          <p className="muted">
            {active.id} · {active.location}
          </p>
          <Button variant="ghost" onClick={() => setScreen("track")}>
            Track report <Icon name="arrow" size={16} />
          </Button>
        </Card>
        <Card>
          <div className="card-head">
            <span className="icon-tile">
              <Icon name="impact" />
            </span>
            <Badge tone="purple">This month</Badge>
          </div>
          <p className="label">COMMUNITY IMPACT</p>
          <h3>1.8 tonnes recycled</h3>
          <div className="mini-progress">
            <span style={{ width: "68%" }} />
          </div>
          <p className="muted">68% of collected recyclable waste</p>
          <Button variant="ghost" onClick={() => setScreen("impact")}>
            View impact <Icon name="arrow" size={16} />
          </Button>
        </Card>
        <Card>
          <div className="card-head">
            <span className="icon-tile gift">
              <Icon name="gift" />
            </span>
            <Badge tone="yellow">Verified</Badge>
          </div>
          <p className="label">YOUR ECO POINTS</p>
          <h3>540 points</h3>
          <p className="muted">You can redeem a cloth bag now</p>
          <Button variant="ghost" onClick={() => setScreen("rewards")}>
            View rewards <Icon name="arrow" size={16} />
          </Button>
        </Card>
      </div>
      <Card className="missed-banner">
        <span className="missed-icon">
          <Icon name="clock" />
        </span>
        <div>
          <h3>Did we miss your pickup?</h3>
          <p>
            Tell us once. Your location and schedule will be added
            automatically.
          </p>
        </div>
        <Button variant="secondary" onClick={() => setScreen("report")}>
          Report missed pickup
        </Button>
      </Card>
    </>
  )
}

const categories = [
  ["Overflowing Bin", "A bin is full or spilling", "alert"],
  ["Missed Pickup", "Scheduled collection did not happen", "truck"],
  ["Recycling Issue", "Problem with recyclable waste", "recycle"],
  ["Illegal Dumping", "Waste dumped in an open area", "shield"],
  ["Waste Near Drain", "Waste blocking or near a drain", "impact"],
  ["Other", "Any other waste problem", "list"],
] as const

function ReportFlow({
  onSubmit,
  onDone,
}: {
  onSubmit: (complaint: Complaint) => void
  onDone: () => void
}) {
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState("Overflowing Bin")
  const [description, setDescription] = useState("")
  const [photo, setPhoto] = useState<string>()
  const [submitted, setSubmitted] = useState<Complaint>()
  const fileRef = useRef<HTMLInputElement>(null)
  const create = () => {
    const complaint: Complaint = {
      id: "SW-10482",
      category,
      location: "Street 5, Lakshmi Nagar",
      ward: "Ward 14",
      status: "Reported",
      priority: category === "Waste Near Drain" ? "Critical" : "High",
      reason:
        category === "Waste Near Drain"
          ? "Sensitive location near a drain"
          : "4 reports from this location in the last 24 hours",
      description,
      photo,
      createdAt: "Just now",
    }
    onSubmit(complaint)
    setSubmitted(complaint)
  }
  if (submitted)
    return (
      <div className="confirmation">
        <span className="confirmation-icon">
          <Icon name="check" size={38} />
        </span>
        <Badge tone="green">Report submitted successfully</Badge>
        <h1>Report received</h1>
        <p>Thank you. The municipal team can now see your report.</p>
        <Card className="receipt">
          <div>
            <span>Report ID</span>
            <strong>{submitted.id}</strong>
          </div>
          <div>
            <span>Category</span>
            <strong>{submitted.category}</strong>
          </div>
          <div>
            <span>Location</span>
            <strong>{submitted.ward}, Street 5</strong>
          </div>
          <div>
            <span>Priority</span>
            <PriorityBadge priority={submitted.priority} />
          </div>
          <div>
            <span>Status</span>
            <StatusBadge status="Reported" />
          </div>
        </Card>
        <div className="priority-reason">
          <Icon name="alert" />
          <span>
            <strong>{submitted.priority} priority</strong>
            {submitted.reason}
          </span>
        </div>
        <Button onClick={onDone} icon="track">
          Track this report
        </Button>
      </div>
    )
  return (
    <div className="report-page">
      <PageTitle
        title="Report a waste problem"
        subtitle="Four simple steps. It usually takes less than one minute."
      />
      <div className="stepper">
        {["Problem", "Photo", "Location", "Confirm"].map((s, i) => (
          <div className={`step ${step >= i + 1 ? "active" : ""}`} key={s}>
            <span>
              {step > i + 1 ? <Icon name="check" size={16} /> : i + 1}
            </span>
            <b>{s}</b>
          </div>
        ))}
      </div>
      <Card className="report-card">
        {step === 1 && (
          <>
            <div className="form-heading">
              <p className="eyebrow">STEP 1 OF 4</p>
              <h2>What is the problem?</h2>
              <p>Choose the picture that best matches what you see.</p>
            </div>
            <div className="category-grid">
              {categories.map(([label, sub, icon]) => (
                <button
                  className={`category-card ${
                    category === label ? "selected" : ""
                  }`}
                  key={label}
                  onClick={() => setCategory(label)}
                >
                  <span>
                    <Icon name={icon as IconName} />
                  </span>
                  <strong>{label}</strong>
                  <small>{sub}</small>
                  {category === label && (
                    <i>
                      <Icon name="check" size={14} />
                    </i>
                  )}
                </button>
              ))}
            </div>
            <div className="form-footer">
              <span />
              <Button onClick={() => setStep(2)}>
                Continue <Icon name="arrow" size={17} />
              </Button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="form-heading">
              <p className="eyebrow">STEP 2 OF 4</p>
              <h2>Add a clear photo</h2>
              <p>
                A photo helps the team understand what vehicle or equipment is
                needed.
              </p>
            </div>
            <input
              ref={fileRef}
              className="sr-only"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) setPhoto(URL.createObjectURL(f))
              }}
            />
            {photo ? (
              <div className="photo-preview">
                <img src={photo} alt="Selected waste problem" />
                <button onClick={() => setPhoto(undefined)}>
                  <Icon name="close" /> Remove
                </button>
              </div>
            ) : (
              <button
                className="upload-zone"
                onClick={() => fileRef.current?.click()}
              >
                <span>
                  <Icon name="camera" size={35} />
                </span>
                <strong>Take or upload a photo</strong>
                <small>JPG or PNG · Maximum 10 MB</small>
              </button>
            )}
            <div className="form-footer">
              <Button variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)}>
                {photo ? "Continue" : "Skip for demo"}{" "}
                <Icon name="arrow" size={17} />
              </Button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div className="form-heading">
              <p className="eyebrow">STEP 3 OF 4</p>
              <h2>Confirm the location</h2>
              <p>We found your current area. Move the pin if needed.</p>
            </div>
            <div className="location-map">
              <div className="road road-one" />
              <div className="road road-two" />
              <span className="map-pin">
                <Icon name="pin" size={30} />
              </span>
              <span className="map-label">Street 5</span>
            </div>
            <div className="location-confirm">
              <span>
                <Icon name="pin" />
              </span>
              <div>
                <small>CURRENT LOCATION</small>
                <strong>Street 5, Lakshmi Nagar</strong>
                <p>Ward 14 · Collection Zone 14A</p>
              </div>
              <Badge tone="green">
                <Icon name="check" size={14} /> Confirmed
              </Badge>
            </div>
            <div className="form-footer">
              <Button variant="ghost" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={() => setStep(4)}>
                Use this location <Icon name="arrow" size={17} />
              </Button>
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <div className="form-heading">
              <p className="eyebrow">STEP 4 OF 4</p>
              <h2>Review and send</h2>
              <p>You may add a short note. This is optional.</p>
            </div>
            <label className="field-label">
              Describe the problem (optional)
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="For example: The bin is blocking the footpath"
                maxLength={180}
              />
              <small>{description.length}/180</small>
            </label>
            <div className="review-box">
              <div>
                <Icon name="alert" />
                <span>
                  <small>Problem</small>
                  <strong>{category}</strong>
                </span>
              </div>
              <div>
                <Icon name="pin" />
                <span>
                  <small>Location</small>
                  <strong>Street 5, Ward 14</strong>
                </span>
              </div>
              <div>
                <Icon name="camera" />
                <span>
                  <small>Photo</small>
                  <strong>{photo ? "Attached" : "Not attached"}</strong>
                </span>
              </div>
            </div>
            <div className="form-footer">
              <Button variant="ghost" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button onClick={create} icon="report">
                Report waste
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

function HomeServiceRequest({ onSubmit, onDone }: { onSubmit: (request: Complaint) => void; onDone: () => void }) {
  const [wasteType, setWasteType] = useState("Mixed household waste")
  const [address, setAddress] = useState("Street 5, Lakshmi Nagar")
  const [notes, setNotes] = useState("")
  const [submitted, setSubmitted] = useState<Complaint>()
  const submit = () => {
    const request: Complaint = {
      id: `HS-${Math.floor(10000 + Math.random() * 89999)}`,
      category: "Home Service Request",
      location: address || "Citizen address",
      ward: "Ward 14",
      status: "Reported",
      priority: "Normal",
      reason: `Citizen requested door-to-door collection for ${wasteType.toLowerCase()}`,
      description: notes,
      requestType: "home-service",
      createdAt: "Just now",
    }
    onSubmit(request)
    setSubmitted(request)
  }
  if (submitted) return (
    <div className="confirmation">
      <span className="confirmation-icon"><Icon name="check" size={38} /></span>
      <Badge tone="green">Home service request submitted</Badge>
      <h1>Request received</h1>
      <p>Your request is now with the municipal operator. A waste collector will be assigned after review.</p>
      <Card className="receipt">
        <div><span>Request ID</span><strong>{submitted.id}</strong></div>
        <div><span>Service</span><strong>Door-to-door collection</strong></div>
        <div><span>Location</span><strong>{submitted.location}</strong></div>
        <div><span>Waste type</span><strong>{wasteType}</strong></div>
        <div><span>Status</span><StatusBadge status="Reported" /></div>
      </Card>
      <Button onClick={onDone} icon="track">Track request</Button>
    </div>
  )
  return (
    <div className="report-page">
      <PageTitle title="Request home waste collection" subtitle="Send a door-to-door collection request to the municipal operator." />
      <Card className="report-card">
        <div className="form-heading"><p className="eyebrow">HOME SERVICE</p><h2>Tell us what you need collected</h2><p>The operator will review your request and assign an available collector.</p></div>
        <label className="field-label">Waste type<select value={wasteType} onChange={e => setWasteType(e.target.value)}><option>Mixed household waste</option><option>Dry recyclable waste</option><option>Organic waste</option><option>Bulk waste</option><option>Electronic waste</option></select></label>
        <label className="field-label">Pickup address<input value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter pickup address" /></label>
        <label className="field-label">Additional instructions<textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Gate number, preferred time, special instructions..." maxLength={180} /></label>
        <div className="review-box"><div><Icon name="truck" /><span><small>WORKFLOW</small><strong>Citizen → Municipal Operator → Waste Collector</strong></span></div><div><Icon name="clock" /><span><small>STATUS AFTER SUBMIT</small><strong>Waiting for operator assignment</strong></span></div></div>
        <div className="form-footer"><span /><Button onClick={submit} icon="truck">Submit home service request</Button></div>
      </Card>
    </div>
  )
}

function TrackReport({ complaint }: { complaint: Complaint }) {
  const current = statusOrder.indexOf(complaint.status)
  return (
    <>
      <PageTitle
        title="Track your report"
        subtitle="See exactly what is happening and what comes next."
      />
      <Card className="track-summary">
        <div>
          <p className="eyebrow">{complaint.id}</p>
          <h2>{complaint.category}</h2>
          <p>
            <Icon name="pin" size={16} />
            {complaint.location} · {complaint.ward}
          </p>
        </div>
        <div>
          <StatusBadge status={complaint.status} />
          <small>Updated just now</small>
        </div>
      </Card>
      <Card className="timeline-card">
        <h3>Report progress</h3>
        <div className="status-timeline">
          {statusOrder.map((status, i) => (
            <div
              className={`timeline-item ${i <= current ? "done" : ""} ${
                i === current ? "current" : ""
              }`}
              key={status}
            >
              <span>{i <= current ? <Icon name="check" /> : i + 1}</span>
              <div>
                <strong>{status}</strong>
                <p>
                  {
                    [
                      "Complaint received by the municipal team",
                      "A collection worker has been assigned",
                      "Collection work is underway",
                      "Evidence and weight have been verified",
                      "Complaint closed successfully",
                    ][i]
                  }
                </p>
                {i === current && <Badge tone="purple">Current status</Badge>}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <div className="two-col">
        <Card>
          <h3>Priority details</h3>
          <div className="priority-line">
            <PriorityBadge priority={complaint.priority} />
          </div>
          <p>{complaint.reason}.</p>
          <p className="help-text">
            Priority is calculated from category, repeat reports, time pending
            and nearby sensitive locations.
          </p>
        </Card>
        <Card>
          <h3>Assigned team</h3>
          {complaint.worker ? (
            <div className="person-row">
              <span className="avatar">RK</span>
              <div>
                <strong>{complaint.worker}</strong>
                <p>Collection Team 04</p>
              </div>
              <Badge tone="green">On task</Badge>
            </div>
          ) : (
            <div className="empty-compact">
              <Icon name="clock" />
              <p>
                Assignment is pending. We will notify you when a team is
                assigned.
              </p>
            </div>
          )}
        </Card>
      </div>
    </>
  )
}

function Schedule() {
  const [remind, setRemind] = useState(false)
  return (
    <>
      <PageTitle
        title="Collection schedule"
        subtitle="Ward 14 · Zone 14A · Keep segregated waste ready before 7:00 AM"
      />
      <div className="week-grid">
        {[
          ["Monday", "Organic Waste", "Food and garden waste", "green"],
          ["Tuesday", "No collection", "Next collection Wednesday", "neutral"],
          ["Wednesday", "Dry Waste", "Paper, plastic and metal", "blue"],
          ["Thursday", "No collection", "Next collection Friday", "neutral"],
          ["Friday", "Recyclables", "Clean and sorted items", "purple"],
          ["Saturday", "Organic Waste", "Food and garden waste", "green"],
        ].map(([day, type, desc, tone]) => (
          <Card className={`day-card ${tone}`} key={day}>
            <div>
              <span>{day.slice(0, 3)}</span>
              <strong>{day}</strong>
            </div>
            <h3>{type}</h3>
            <p>{desc}</p>
            {type !== "No collection" && (
              <small>
                <Icon name="clock" size={15} /> 7:00 – 9:00 AM
              </small>
            )}
          </Card>
        ))}
      </div>
      <Card className="reminder-card">
        <span className="icon-tile">
          <Icon name="bell" />
        </span>
        <div>
          <h3>Collection reminder</h3>
          <p>Get a reminder one evening before each collection.</p>
        </div>
        <Button
          variant={remind ? "secondary" : "primary"}
          onClick={() => setRemind(!remind)}
        >
          {remind ? "Reminder is on" : "Remind me"}
        </Button>
      </Card>
    </>
  )
}

const rewards = [
  ["Cloth Bag", 300, "Reusable everyday shopping bag", "bag"],
  ["Pen Box", 450, "Recycled-material pen box", "box"],
  ["Stationery Kit", 700, "Notebook, pencils and ruler", "kit"],
  ["Steel Bottle", 1000, "Durable reusable water bottle", "bottle"],
  ["Plant Sapling", 1200, "Native plant for your home", "plant"],
]

function Rewards() {
  const [redeemed, setRedeemed] = useState<string>()
  return (
    <>
      <PageTitle
        title="Eco rewards"
        subtitle="Points come only from verified recycling records."
      />
      <Card className="points-hero">
        <div>
          <p>AVAILABLE BALANCE</p>
          <h2>
            540 <span>Eco Points</span>
          </h2>
          <small>
            <Icon name="shield" size={16} /> All points are verified
          </small>
        </div>
        <Icon name="gift" size={54} />
      </Card>
      <div className="section-heading">
        <div>
          <h2>Choose a reward</h2>
          <p>Simple, useful rewards for cleaner habits.</p>
        </div>
      </div>
      <div className="reward-grid">
        {rewards.map(([name, points, desc, visual]) => (
          <Card className="reward-card" key={name}>
            <div className={`reward-visual ${visual}`}>
              <Icon
                name={
                  visual === "plant"
                    ? "leaf"
                    : visual === "bottle"
                      ? "scale"
                      : "gift"
                }
                size={35}
              />
            </div>
            <h3>{name}</h3>
            <p>{desc}</p>
            <strong>{points} points</strong>
            <Button
              variant={Number(points) <= 540 ? "primary" : "secondary"}
              disabled={Number(points) > 540}
              onClick={() => setRedeemed(String(name))}
            >
              {Number(points) <= 540
                ? "Redeem reward"
                : `${Number(points) - 540} more needed`}
            </Button>
          </Card>
        ))}
      </div>
      <Card className="history-card">
        <h3>Points history</h3>
        <div className="table-row table-head">
          <span>Activity</span>
          <span>Collection</span>
          <span>Points</span>
        </div>
        <div className="table-row">
          <span>
            <strong>Plastic recycling · 5.4 kg</strong>
            <small>12 June 2025</small>
          </span>
          <span>COL-4821</span>
          <b>+54</b>
        </div>
        <div className="table-row">
          <span>
            <strong>Paper recycling · 2.8 kg</strong>
            <small>4 June 2025</small>
          </span>
          <span>COL-4754</span>
          <b>+28</b>
        </div>
      </Card>
      {redeemed && (
        <Modal title="Reward reserved" onClose={() => setRedeemed(undefined)}>
          <div className="modal-success">
            <Icon name="gift" size={42} />
            <p>
              Your <strong>{redeemed}</strong> is reserved. Show code{" "}
              <strong>RW-1842</strong> at the Ward 14 community office.
            </p>
            <Button onClick={() => setRedeemed(undefined)}>Done</Button>
          </div>
        </Modal>
      )}
    </>
  )
}

function Impact() {
  return (
    <>
      <PageTitle
        title="Community impact"
        subtitle="Verified Ward 14 records · June 2025"
      />
      <div className="filter-row">
        <Badge tone="purple">This month</Badge>
        <span>Updated today at 11:30 AM</span>
      </div>
      <div className="kpi-grid impact-kpis">
        {[
          ["recycle", "Plastic recycled", "1,240 kg", "+8% from May"],
          ["scale", "Waste collected", "8.4 tonnes", "Verified weights"],
          ["check", "Reports resolved", "327", "92% resolution"],
          ["map", "Active zones", "18", "Across 6 wards"],
        ].map(([icon, label, value, note]) => (
          <Card key={label}>
            <span className="icon-tile">
              <Icon name={icon as IconName} />
            </span>
            <p>{label}</p>
            <h2>{value}</h2>
            <small>{note}</small>
          </Card>
        ))}
      </div>
      <div className="two-col chart-layout">
        <Card>
          <h3>Waste collected by type</h3>
          <p className="help-text">Verified collection records · June 1–30</p>
          {[
            ["Organic", 38],
            ["Dry waste", 31],
            ["Recyclable", 22],
            ["Other", 9],
          ].map(([label, value]) => (
            <div className="bar-row" key={label}>
              <span>{label}</span>
              <div>
                <i style={{ width: `${value}%` }} />
              </div>
              <b>{value}%</b>
            </div>
          ))}
        </Card>
        <Card>
          <h3>How your community improved</h3>
          {[
            ["check", "327 reports resolved"],
            ["truck", "94% scheduled pickups completed"],
            ["recycle", "1.8 tonnes sent to recyclers"],
            ["shield", "All recycling weights verified"],
          ].map(([icon, text]) => (
            <div className="improvement" key={text}>
              <span>
                <Icon name={icon as IconName} />
              </span>
              <strong>{text}</strong>
            </div>
          ))}
        </Card>
      </div>
    </>
  )
}

function OperatorHome({
  complaints,
  setScreen,
}: {
  complaints: Complaint[]
  setScreen: (s: Screen) => void
}) {
  const open = complaints.filter(
    (c) => !["Resolved", "Verified"].includes(c.status),
  ).length
  return (
    <>
      <div className="welcome-row">
        <div>
          <p className="eyebrow">OPERATIONS OVERVIEW</p>
          <h1>Good morning, Priya</h1>
          <p>Greater Hyderabad Municipal Ward Cluster · Live as of 11:30 AM</p>
        </div>
        <Button onClick={() => setScreen("complaints")} icon="list">
          Review open requests
        </Button>
      </div>
      <div className="kpi-grid operator-kpis">
        {[
          ["scale", "Today's collection", "1,240 kg", "+12% vs yesterday"],
          ["list", "Open requests", String(open + 39), "8 high priority"],
          ["clock", "Missed pickups", "8", "3 reassigned"],
          ["recycle", "Recycling rate", "68%", "June verified data"],
          ["check", "Resolved today", "127", "Avg. 3h 42m"],
          ["user", "Active workers", "34", "6 teams in field"],
        ].map(([icon, label, value, note]) => (
          <Card key={label}>
            <div className="kpi-top">
              <span className="icon-tile">
                <Icon name={icon as IconName} />
              </span>
              <small>{note}</small>
            </div>
            <p>{label}</p>
            <h2>{value}</h2>
          </Card>
        ))}
      </div>
      <div className="operations-grid">
        <Card className="ops-map-card">
          <div className="card-title-row">
            <div>
              <h2>Live operations</h2>
              <p>Collection activity across wards</p>
            </div>
            <Button variant="ghost" onClick={() => setScreen("map")}>
              Open full map
            </Button>
          </div>
          <MiniMap complaints={complaints} />
          <div className="map-legend">
            <span>
              <i className="red" />
              Critical
            </span>
            <span>
              <i className="orange" />
              Pending
            </span>
            <span>
              <i className="blue" />
              In progress
            </span>
            <span>
              <i className="green" />
              Resolved
            </span>
          </div>
        </Card>
        <Card className="attention-card">
          <div className="card-title-row">
            <div>
              <h2>Needs attention</h2>
              <p>Prioritized by defined municipal rules</p>
            </div>
            <Badge tone="red">8 urgent</Badge>
          </div>
          {complaints.slice(0, 3).map((c) => (
            <button
              className="attention-item"
              key={c.id}
              onClick={() => setScreen("complaints")}
            >
              <PriorityBadge priority={c.priority} />
              <div>
                <strong>{c.category}</strong>
                <span>{c.location}</span>
                <small>{c.reason}</small>
              </div>
              <Icon name="arrow" />
            </button>
          ))}
        </Card>
      </div>
      <div className="two-col">
        <Card>
          <div className="card-title-row">
            <div>
              <h2>Zone progress</h2>
              <p>Today's scheduled collection</p>
            </div>
            <Button variant="ghost" onClick={() => setScreen("collection")}>
              Manage
            </Button>
          </div>
          {[
            ["14A", "Team 04", 18, 24],
            ["12B", "Team 02", 22, 26],
            ["09C", "Team 07", 15, 18],
          ].map(([zone, team, done, total]) => (
            <div className="zone-row" key={zone}>
              <span className="zone-badge">{zone}</span>
              <div>
                <strong>Zone {zone}</strong>
                <small>
                  {team} · {done}/{total} locations
                </small>
                <div className="progress">
                  <i
                    style={{
                      width: `${(Number(done) / Number(total)) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <b>{Math.round((Number(done) / Number(total)) * 100)}%</b>
            </div>
          ))}
        </Card>
        <Card>
          <div className="card-title-row">
            <div>
              <h2>Waste hotspots</h2>
              <p>Repeated issues this month</p>
            </div>
            <Button variant="ghost" onClick={() => setScreen("hotspots")}>
              View all
            </Button>
          </div>
          {[
            ["Street 5", "12 complaints", "High"],
            ["Market Road", "9 complaints", "High"],
            ["School Road", "7 complaints", "Critical"],
          ].map(([place, count, priority]) => (
            <div className="hotspot-compact" key={place}>
              <span>
                <Icon name="alert" />
              </span>
              <div>
                <strong>{place}</strong>
                <small>{count}</small>
              </div>
              <PriorityBadge priority={priority as Complaint["priority"]} />
            </div>
          ))}
        </Card>
      </div>
    </>
  )
}

function MiniMap({ complaints }: { complaints: Complaint[] }) {
  return (
    <div className="mini-map">
      <div className="map-road a" />
      <div className="map-road b" />
      <div className="map-road c" />
      <div className="map-road d" />
      {complaints.slice(0, 4).map((c, i) => (
        <button
          aria-label={`${c.priority} issue at ${c.location}`}
          className={`map-marker marker-${i} ${c.priority.toLowerCase()}`}
          key={c.id}
        >
          <Icon name={c.status === "Verified" ? "check" : "pin"} size={17} />
          <span>{c.id}</span>
        </button>
      ))}
      <div className="facility">
        <Icon name="recycle" />
        <span>GreenLoop</span>
      </div>
    </div>
  )
}

function Complaints({
  complaints,
  assign,
  requestReassignment,
  advance,
}: {
  complaints: Complaint[]
  assign: (id: string, worker?: string) => void
  requestReassignment: (id: string) => void
  advance: (id: string) => void
}) {
  const [filter, setFilter] = useState("All")
  const shown =
    filter === "All"
      ? complaints
      : complaints.filter((c) => c.priority === filter || c.status === filter)
  return (
    <>
      <PageTitle
        title="Complaint management"
        subtitle="Review, prioritize, assign and verify community reports."
      />
      <div className="toolbar">
        <div className="tabs">
          {["All", "Critical", "High", "Assigned", "In Progress"].map((f) => (
            <button
              className={filter === f ? "active" : ""}
              onClick={() => setFilter(f)}
              key={f}
            >
              {f}
            </button>
          ))}
        </div>
        <span>{shown.length} records</span>
      </div>
      <Card className="table-card">
        <div className="complaint-table table-header">
          <span>Request</span>
          <span>Location</span>
          <span>Priority & reason</span>
          <span>Status</span>
          <span>Action</span>
        </div>
        {shown.map((c) => (
          <div className="complaint-table" key={c.id}>
            <span>
              <strong>{c.id}</strong>
              <small>
                {c.category}
                <br />
                {c.createdAt}
              </small>
            </span>
            <span>
              <strong>{c.location}</strong>
              <small>{c.ward}</small>
            </span>
            <span>
              <PriorityBadge priority={c.priority} />
              <small className="reason">{c.reason}</small>
            </span>
            <span>
              <StatusBadge status={c.status} />
              {c.reassignmentRequested && <Badge tone="orange">Reassignment requested</Badge>}
              {c.worker && <small>{c.worker}</small>}
            </span>
            <span>
              {c.status === "Reported" ? (
                <Button onClick={() => assign(c.id)}>Assign worker</Button>
              ) : c.reassignmentRequested ? (
                <Button onClick={() => assign(c.id, c.worker === "Ramesh Kumar" ? "Sunita Devi" : "Ramesh Kumar")}>Reassign</Button>
              ) : c.status === "Assigned" ? (
                <Button onClick={() => advance(c.id)}>Start task</Button>
              ) : c.status === "Verified" ? (
                <Button variant="secondary" onClick={() => advance(c.id)}>Close report</Button>
              ) : (
                <Button variant="ghost" onClick={() => advance(c.id)}>Advance status</Button>
              )}
            </span>
          </div>
        ))}
      </Card>
    </>
  )
}

function FullMap({ complaints }: { complaints: Complaint[] }) {
  const [selected, setSelected] = useState<Complaint>(complaints[0])
  return (
    <>
      <PageTitle
        title="Live operations map"
        subtitle="Verified field activity and open issues across all wards."
      />
      <div className="full-map-layout">
        <Card className="map-list">
          <h3>Active locations</h3>
          {complaints.map((c) => (
            <button
              className={selected.id === c.id ? "active" : ""}
              onClick={() => setSelected(c)}
              key={c.id}
            >
              <PriorityBadge priority={c.priority} />
              <span>
                <strong>{c.location}</strong>
                <small>
                  {c.category} · {c.id}
                </small>
              </span>
            </button>
          ))}
        </Card>
        <Card className="full-map">
          <div className="real-map-wrap">
            <iframe
              title="Waste collection location map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(selected.location)}&output=embed`}
              loading="lazy"
            />
            <a className="map-open-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.location)}`} target="_blank" rel="noreferrer">Open in Google Maps</a>
          </div>
          <MiniMap complaints={complaints} />
          <div className="map-detail">
            <div className="card-title-row">
              <div>
                <p className="eyebrow">{selected.id}</p>
                <h2>{selected.location}</h2>
              </div>
              <StatusBadge status={selected.status} />
            </div>
            <dl>
              <div>
                <dt>Problem</dt>
                <dd>{selected.category}</dd>
              </div>
              <div>
                <dt>Priority</dt>
                <dd>
                  <PriorityBadge priority={selected.priority} />
                </dd>
              </div>
              <div>
                <dt>Assigned worker</dt>
                <dd>{selected.worker || "Not yet assigned"}</dd>
              </div>
              <div>
                <dt>Reported</dt>
                <dd>{selected.createdAt}</dd>
              </div>
            </dl>
          </div>
        </Card>
      </div>
    </>
  )
}

function WorkerHome({
  tasks,
  setScreen,
}: {
  tasks: Complaint[]
  setScreen: (s: Screen) => void
}) {
  const current =
    tasks.find((t) => t.status === "Assigned" || t.status === "In Progress") ||
    tasks[0]
  return (
    <>
      <div className="welcome-row">
        <div>
          <p className="eyebrow">TODAY · TEAM 04</p>
          <h1>Good morning, Ramesh</h1>
          <p>Your route is ready. Complete one task at a time.</p>
        </div>
        <Badge tone="green">
          <span className="status-dot" /> On duty
        </Badge>
      </div>
      <Card className="worker-progress">
        <div>
          <p>TODAY'S COLLECTION</p>
          <h2>
            18 <span>of 24 locations complete</span>
          </h2>
        </div>
        <div className="progress-ring">
          <strong>75%</strong>
        </div>
        <div>
          <span>
            <b>6</b> remaining
          </span>
          <span>
            <b>126 kg</b> collected
          </span>
        </div>
      </Card>
      <div className="section-heading">
        <div>
          <h2>Next task</h2>
          <p>Highest-priority assigned location</p>
        </div>
        <Button variant="ghost" onClick={() => setScreen("tasks")}>
          View all tasks
        </Button>
      </div>
      {current ? (
        <Card className="task-feature">
          <div className="task-top">
            <PriorityBadge priority={current.priority} />
            <StatusBadge status={current.status} />
          </div>
          <div className="task-location">
            <span>
              <Icon name="pin" size={28} />
            </span>
            <div>
              <p>COLLECTION TASK · {current.id}</p>
              <h2>{current.location}</h2>
              <span>{current.ward} · Zone 14A · 7:00–10:00 AM</span>
            </div>
          </div>
          <div className="task-reason">
            <Icon name="alert" />
            <span>
              <strong>{current.category}</strong>
              {current.reason}
            </span>
          </div>
          <div className="task-actions">
            <Button
              variant="secondary"
              onClick={() => setScreen("route")}
              icon="map"
            >
              View location
            </Button>
            <Button
              onClick={() => setScreen("tasks")}
              icon={current.status === "Assigned" ? "arrow" : "check"}
            >
              {current.status === "Assigned"
                ? "Start collection"
                : "Continue task"}
            </Button>
          </div>
        </Card>
      ) : (
        <EmptyState
          icon="check"
          title="No assigned tasks"
          text="No collection tasks are assigned right now."
        />
      )}
      <div className="worker-shortcuts">
        <button onClick={() => setScreen("scanner")}>
          <Icon name="scan" />
          <span>
            <strong>Scan QR</strong>
            <small>Verify a collection point</small>
          </span>
          <Icon name="arrow" />
        </button>
        <button onClick={() => setScreen("history")}>
          <Icon name="chart" />
          <span>
            <strong>Daily history</strong>
            <small>See completed collections</small>
          </span>
          <Icon name="arrow" />
        </button>
      </div>
    </>
  )
}

function WorkerTasks({
  tasks,
  update,
  requestReassignment,
}: {
  tasks: Complaint[]
  update: (id: string, weight?: number) => void
  requestReassignment: (id: string) => void
}) {
  const [selected, setSelected] = useState<Complaint>()
  const [weight, setWeight] = useState("")
  const [evidence, setEvidence] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  return (
    <>
      <PageTitle
        title="Today's tasks"
        subtitle="Complete collection, record weight and add evidence."
      />
      <div className="task-list">
        {tasks.map((task, i) => (
          <Card className="task-card" key={task.id}>
            <div className="task-number">{i + 1}</div>
            <div>
              <div className="task-top">
                <PriorityBadge priority={task.priority} />
                <StatusBadge status={task.status} />
              </div>
              <h3>{task.location}</h3>
              <p>
                {task.category} · {task.ward} · Zone 14A
              </p>
              <small>
                <Icon name="clock" size={15} /> 7:00–10:00 AM
              </small>
            </div>
            <div style={{display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end"}}>
              {task.status === "Assigned" && <Button variant="secondary" onClick={() => requestReassignment(task.id)}>Request reassignment</Button>}
              <Button
              onClick={() =>
                task.status === "Assigned" ? update(task.id) : setSelected(task)
              }
              variant={task.status === "Verified" ? "secondary" : "primary"}
            >
              {task.status === "Assigned"
                ? "Start"
                : task.status === "Verified"
                  ? "Completed"
                  : "Verify collection"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
      {selected && (
        <Modal title="Verify collection" onClose={() => setSelected(undefined)}>
          <div className="verification-flow">
            <div className="verified-location">
              <Icon name="scan" />
              <span>
                <small>LOCATION VERIFIED</small>
                <strong>{selected.location}</strong>
                <p>QR: Z14A-005 · No duplicate record found</p>
              </span>
            </div>
            <label className="field-label">
              Waste type
              <select>
                <option>Mixed dry waste</option>
                <option>Plastic</option>
                <option>Paper</option>
                <option>Organic waste</option>
              </select>
            </label>
            <label className="field-label">
              Weight collected (kg)
              <div className="input-with-unit">
                <Icon name="scale" />
                <input
                  type="number"
                  min="0.1"
                  max="500"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="For example: 12.5"
                />
                <span>kg</span>
              </div>
            </label>
            <button
              className={`evidence-upload ${evidence ? "done" : ""}`}
              onClick={() => setEvidence(true)}
            >
              <Icon name={evidence ? "check" : "camera"} />
              <span>
                <strong>
                  {evidence ? "Completion photo added" : "Add completion photo"}
                </strong>
                <small>
                  {evidence
                    ? "Evidence ready to submit"
                    : "Required for complaint collection"}
                </small>
              </span>
            </button>
            <label className="confirm-check">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              <span>I confirm the waste was collected at this location.</span>
            </label>
            <Button
              disabled={!weight || !evidence || !confirmed}
              onClick={() => {
                update(selected.id, Number(weight))
                setSelected(undefined)
              }}
              icon="shield"
            >
              Submit verified collection
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}

function Scanner({ onScan }: { onScan: () => void }) {
  const [scanned, setScanned] = useState(false)
  return (
    <>
      <PageTitle
        title="Scan collection point"
        subtitle="Scan once to verify the exact location and prevent duplicate records."
      />
      <Card className="scanner-card">
        {!scanned ? (
          <>
            <div className="scanner-view">
              <span className="corner one" />
              <span className="corner two" />
              <span className="corner three" />
              <span className="corner four" />
              <Icon name="scan" size={68} />
            </div>
            <h2>Place QR code inside the frame</h2>
            <p>Make sure the code is clear and well lit.</p>
            <Button onClick={() => setScanned(true)} icon="scan">
              Simulate QR scan
            </Button>
          </>
        ) : (
          <>
            <span className="confirmation-icon">
              <Icon name="check" size={35} />
            </span>
            <Badge tone="green">Valid collection point</Badge>
            <h2>Street 5 Community Bin</h2>
            <div className="scan-details">
              <div>
                <span>Location</span>
                <strong>Ward 14, Street 5</strong>
              </div>
              <div>
                <span>Collection zone</span>
                <strong>Zone 14A</strong>
              </div>
              <div>
                <span>Scheduled time</span>
                <strong>7:00–10:00 AM</strong>
              </div>
              <div>
                <span>Status</span>
                <StatusBadge status="Assigned" />
              </div>
            </div>
            <Button onClick={onScan}>Continue to collection</Button>
          </>
        )}
      </Card>
    </>
  )
}

function AgencyHome({ setScreen }: { setScreen: (s: Screen) => void }) {
  return (
    <>
      <div className="welcome-row">
        <div>
          <p className="eyebrow">GREENLOOP RECYCLING AGENCY</p>
          <h1>Verified materials, clear records</h1>
          <p>Incoming material dashboard · June 2025</p>
        </div>
        <Button icon="truck" onClick={() => setScreen("incoming")}>
          View incoming loads
        </Button>
      </div>
      <div className="kpi-grid agency-kpis">
        {[
          ["truck", "Incoming today", "3 loads", "418 kg expected"],
          ["scale", "Received this month", "12.8 tonnes", "41 verified loads"],
          ["recycle", "Materials recycled", "8.7 tonnes", "68% processed"],
          ["clock", "Awaiting verification", "2 loads", "267 kg"],
        ].map(([icon, label, value, note]) => (
          <Card key={label}>
            <span className="icon-tile">
              <Icon name={icon as IconName} />
            </span>
            <p>{label}</p>
            <h2>{value}</h2>
            <small>{note}</small>
          </Card>
        ))}
      </div>
      <Card>
        <div className="card-title-row">
          <div>
            <h2>Material journey</h2>
            <p>Every quantity is linked to a verified collection.</p>
          </div>
          <Badge tone="green">
            <Icon name="shield" size={14} /> Traceable
          </Badge>
        </div>
        <div className="material-journey">
          {[
            ["truck", "Collection"],
            ["scale", "Verified weight"],
            ["building", "Agency received"],
            ["recycle", "Recycling record"],
          ].map(([icon, label], i) => (
            <div key={label}>
              <span>
                <Icon name={icon as IconName} />
              </span>
              <strong>{label}</strong>
              {i < 3 && <Icon name="arrow" />}
            </div>
          ))}
        </div>
      </Card>
      <Incoming compact />
    </>
  )
}

function Incoming({ compact = false }: { compact?: boolean }) {
  const [verified, setVerified] = useState<string[]>(["TR-2081"])
  const loads = [
    [
      "TR-2084",
      "Ward 14 · Team 04",
      "Mixed plastic",
      "186.5 kg",
      "Today, 12:30 PM",
    ],
    [
      "TR-2083",
      "Ward 12 · Team 02",
      "Paper & cardboard",
      "142.0 kg",
      "Today, 11:45 AM",
    ],
    ["TR-2081", "Ward 9 · Team 07", "PET plastic", "89.5 kg", "Today, 9:20 AM"],
  ]
  return (
    <>
      {!compact && (
        <PageTitle
          title="Incoming material"
          subtitle="Confirm received quantities against verified collection records."
        />
      )}
      <Card className="incoming-card">
        <div className="card-title-row">
          <div>
            <h2>
              {compact
                ? "Today's incoming loads"
                : "Material verification queue"}
            </h2>
            <p>Source weights are locked after field verification.</p>
          </div>
          {compact && <Badge tone="purple">3 loads</Badge>}
        </div>
        {loads.map(([id, source, type, weight, time]) => (
          <div className="load-row" key={id}>
            <span className="load-icon">
              <Icon name="truck" />
            </span>
            <div>
              <strong>{type}</strong>
              <span>
                {id} · {source}
              </span>
              <small>{time}</small>
            </div>
            <div>
              <small>VERIFIED SOURCE WEIGHT</small>
              <strong>{weight}</strong>
            </div>
            {verified.includes(id) ? (
              <Badge tone="green">
                <Icon name="check" size={14} /> Received
              </Badge>
            ) : (
              <Button onClick={() => setVerified([...verified, id])}>
                Verify received
              </Button>
            )}
          </div>
        ))}
      </Card>
    </>
  )
}

function Analytics() {
  return (
    <>
      <PageTitle
        title="Analytics"
        subtitle="Factual metrics from verified municipal records · June 1–30, 2025"
      />
      <div className="two-col chart-layout">
        <Card>
          <h3>Collection volume</h3>
          <p className="help-text">Daily verified weight in tonnes</p>
          <div className="column-chart">
            {[48, 62, 56, 78, 72, 88, 68].map((h, i) => (
              <div key={i}>
                <i style={{ height: `${h}%` }} />
                <span>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3>Complaint types</h3>
          <p className="help-text">612 reports received this month</p>
          {[
            ["Overflowing bins", 42],
            ["Missed pickup", 28],
            ["Illegal dumping", 18],
            ["Other", 12],
          ].map(([l, v]) => (
            <div className="bar-row" key={l}>
              <span>{l}</span>
              <div>
                <i style={{ width: `${v}%` }} />
              </div>
              <b>{v}%</b>
            </div>
          ))}
        </Card>
      </div>
      <Card className="ward-table">
        <h3>Ward performance</h3>
        <p className="help-text">
          Comparison uses factual service metrics only; no arbitrary ranking.
        </p>
        <div className="ward-row head">
          <span>Ward</span>
          <span>Waste collected</span>
          <span>Complaints</span>
          <span>Resolved</span>
          <span>Missed pickups</span>
          <span>Recycled</span>
        </div>
        {[
          ["Ward 14", "8.4 t", "96", "88", "3", "1.8 t"],
          ["Ward 12", "7.9 t", "84", "79", "2", "1.6 t"],
          ["Ward 9", "6.7 t", "73", "65", "5", "1.3 t"],
          ["Ward 18", "8.1 t", "81", "76", "2", "1.7 t"],
        ].map((r) => (
          <div className="ward-row" key={r[0]}>
            {r.map((v, i) => (
              <span key={i}>{v}</span>
            ))}
          </div>
        ))}
      </Card>
    </>
  )
}

function Hotspots() {
  return (
    <>
      <PageTitle
        title="Waste hotspots"
        subtitle="Locations with repeated complaints or missed collections this month."
      />
      <div className="hotspot-grid">
        {[
          ["Street 5, Lakshmi Nagar", 12, 4, 3, "High"],
          ["Government School Road", 7, 1, 4, "Critical"],
          ["Market Road", 9, 3, 2, "High"],
          ["Central Bus Stop", 6, 2, 2, "Medium"],
        ].map(([place, reports, missed, repeated, priority]) => (
          <Card className="hotspot-card" key={place}>
            <div className="card-head">
              <span className="hotspot-icon">
                <Icon name="alert" />
              </span>
              <PriorityBadge priority={priority as Complaint["priority"]} />
            </div>
            <p className="eyebrow">REPEATED WASTE LOCATION</p>
            <h2>{place}</h2>
            <div className="hotspot-stats">
              <span>
                <b>{reports}</b> complaints
              </span>
              <span>
                <b>{missed}</b> missed pickups
              </span>
              <span>
                <b>{repeated}</b> repeat reports
              </span>
            </div>
            <Button variant="secondary" icon="map">
              View location
            </Button>
          </Card>
        ))}
      </div>
    </>
  )
}

function GenericPage({ screen, role }: { screen: Screen role: Role }) {
  if (screen === "notifications")
    return (
      <>
        <PageTitle
          title="Notifications"
          subtitle="Important updates about collection and reports."
        />
        <Card className="notification-list">
          {[
            [
              "truck",
              "Report assigned",
              "Your report SW-10482 has been assigned to Collection Team 04.",
              "10 minutes ago",
            ],
            [
              "bell",
              "Collection reminder",
              "Dry waste collection is scheduled tomorrow from 7–9 AM.",
              "2 hours ago",
            ],
            [
              "gift",
              "Eco points earned",
              "You earned 54 Eco Points from verified plastic recycling.",
              "Yesterday",
            ],
            [
              "recycle",
              "Community update",
              "Ward 14 recycled 1.8 tonnes this month.",
              "2 days ago",
            ],
          ].map(([icon, title, text, time], i) => (
            <div className={i === 0 ? "unread" : ""} key={title}>
              <span className="icon-tile">
                <Icon name={icon as IconName} />
              </span>
              <span>
                <strong>{title}</strong>
                <p>{text}</p>
                <small>{time}</small>
              </span>
              {i === 0 && <i />}
            </div>
          ))}
        </Card>
      </>
    )
  if (screen === "profile")
    return (
      <>
        <PageTitle
          title="Profile"
          subtitle="Your account, ward and language preferences."
        />
        <Card className="profile-card">
          <span className="profile-avatar">
            {roleInfo[role].demo
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </span>
          <h2>{roleInfo[role].demo}</h2>
          <Badge tone="purple">{roleInfo[role].label}</Badge>
          <div className="profile-fields">
            <label>
              Mobile number
              <input value="+91 ••••• 48210" readOnly />
            </label>
            <label>
              Ward / service area
              <input
                value={
                  role === "agency" ? "Ward Cluster 2" : "Ward 14 · Zone 14A"
                }
                readOnly
              />
            </label>
            <label>
              Preferred language
              <select defaultValue="English">
                <option>English</option>
                <option>हिन्दी</option>
                <option>తెలుగు</option>
              </select>
            </label>
          </div>
          <Button>Save preferences</Button>
        </Card>
      </>
    )
  if (screen === "route")
    return (
      <>
        <PageTitle
          title="Collection route"
          subtitle="6 remaining stops · Estimated finish 10:20 AM"
        />
        <Card className="route-card">
          <MiniMap complaints={initialComplaints} />
          <div className="route-list">
            {[
              "Street 5 Community Bin",
              "School Road Point",
              "Lakshmi Nagar Block C",
            ].map((p, i) => (
              <div key={p}>
                <span>{i + 1}</span>
                <div>
                  <strong>{p}</strong>
                  <small>
                    {i === 0 ? "Next · 650 m away" : `${i + 2} km away`}
                  </small>
                </div>
                <Button variant="ghost">Navigate</Button>
              </div>
            ))}
          </div>
        </Card>
      </>
    )
  if (screen === "history")
    return (
      <>
        <PageTitle
          title={role === "agency" ? "Recycling history" : "Collection history"}
          subtitle="Verified records with traceable weights."
        />
        <Card className="history-card">
          {[
            ["COL-4821", "Street 8, Ward 14", "12.5 kg", "Today, 8:42 AM"],
            ["COL-4819", "Market Lane, Ward 14", "18.2 kg", "Today, 8:10 AM"],
            ["COL-4814", "Block C Community Point", "9.8 kg", "Today, 7:35 AM"],
          ].map((r) => (
            <div className="history-row" key={r[0]}>
              <span className="icon-tile">
                <Icon name="check" />
              </span>
              <div>
                <strong>{r[1]}</strong>
                <span>
                  {r[0]} · {r[3]}
                </span>
              </div>
              <b>{r[2]}</b>
              <Badge tone="green">Verified</Badge>
            </div>
          ))}
        </Card>
      </>
    )
  if (screen === "workers")
    return (
      <>
        <PageTitle
          title="Worker assignment"
          subtitle="Assign available workers to complaints, zones and missed pickups."
        />
        <div className="worker-grid">
          {[
            ["Ramesh Kumar", "Available", "Team 04", "14A"],
            ["Sunita Devi", "On Collection", "Team 02", "12B"],
            ["Arjun Naik", "Available", "Team 07", "09C"],
            ["Mohammed Irfan", "On Break", "Team 05", "18A"],
            ["Lakshmi Yadav", "Available", "Team 03", "14B"],
            ["Suresh Reddy", "On Collection", "Team 06", "11A"],
          ].map(([name, status, team, zone]) => (
            <Card key={name}>
              <div className="person-row">
                <span className="avatar">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div>
                  <strong>{name}</strong>
                  <p>
                    {team} · Zone {zone}
                  </p>
                </div>
              </div>
              <Badge
                tone={
                  status === "Available"
                    ? "green"
                    : status === "On Break"
                      ? "yellow"
                      : "blue"
                }
              >
                {status}
              </Badge>
              <Button
                variant={status === "Available" ? "primary" : "secondary"}
                disabled={status !== "Available"}
              >
                Assign task
              </Button>
            </Card>
          ))}
        </div>
      </>
    )
  if (screen === "collection")
    return (
      <>
        <PageTitle
          title="Collection management"
          subtitle="Today's zone progress and field team assignments."
        />
        <div className="zone-grid">
          {[
            ["14A", "Team 04", 18, 24, "7:00–10:00 AM"],
            ["12B", "Team 02", 22, 26, "7:00–10:00 AM"],
            ["09C", "Team 07", 15, 18, "6:30–9:30 AM"],
            ["18A", "Team 05", 20, 22, "7:00–10:00 AM"],
          ].map(([zone, team, done, total, time]) => (
            <Card key={zone}>
              <div className="card-head">
                <span className="zone-badge">{zone}</span>
                <Badge tone="blue">In progress</Badge>
              </div>
              <h2>Zone {zone}</h2>
              <p>
                {team} · {time}
              </p>
              <div className="zone-numbers">
                <strong>
                  {done} / {total}
                </strong>
                <span>locations complete</span>
              </div>
              <div className="progress">
                <i
                  style={{ width: `${(Number(done) / Number(total)) * 100}%` }}
                />
              </div>
              <Button variant="secondary">Manage zone</Button>
            </Card>
          ))}
        </div>
      </>
    )
  return (
    <EmptyState
      icon="list"
      title="Nothing here yet"
      text="This section is ready for future verified records."
    />
  )
}

function EmptyState({
  icon,
  title,
  text,
}: {
  icon: IconName
  title: string
  text: string
}) {
  return (
    <Card className="empty-state">
      <span>
        <Icon name={icon} size={34} />
      </span>
      <h2>{title}</h2>
      <p>{text}</p>
    </Card>
  )
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-head">
          <h2>{title}</h2>
          <button onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}

export default function App() {
  const [role, setRole] = useState<Role>()
  const [screen, setScreen] = useState<Screen>("home")
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem("swachhsetu-requests")
      return saved ? JSON.parse(saved) : initialComplaints
    } catch { return initialComplaints }
  })
  const [toast, setToast] = useState("")
  const active = complaints[0] || initialComplaints[0]
  const tasks = useMemo(
    () =>
      complaints.filter(
        (c) => c.worker === "Ramesh Kumar" || c.id === "SW-10482",
      ),
    [complaints],
  )
  useEffect(() => { try { localStorage.setItem("swachhsetu-requests", JSON.stringify(complaints)) } catch {} }, [complaints])
  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 3000)
  }
  const updateStatus = (id: string, weight?: number) =>
    setComplaints((list) =>
      list.map((c) => {
        if (c.id !== id) return c
        const i = statusOrder.indexOf(c.status)
        const status = weight
          ? "Verified"
          : statusOrder[Math.min(i + 1, statusOrder.length - 1)]
        notify(
          weight
            ? `Collection verified: ${weight} kg recorded`
            : `Status updated to ${status}`,
        )
        return { ...c, status, weight: weight || c.weight }
      }),
    )
  const assign = (id: string, worker = "Ramesh Kumar") => {
    setComplaints((list) => list.map((c) => c.id === id ? { ...c, status: "Assigned", worker, reassignmentRequested: false } : c))
    notify(`Assigned to ${worker} · Municipal collection team`)
  }
  const requestReassignment = (id: string) => {
    setComplaints((list) => list.map((c) => c.id === id ? { ...c, reassignmentRequested: true } : c))
    notify("Reassignment request sent to the municipal operator")
  }
  if (!role)
    return (
      <Login
        onLogin={(r) => {
          setRole(r)
          setScreen("home")
        }}
      />
    )
  let page: React.ReactNode
  if (role === "citizen") {
    if (screen === "home")
      page = <CitizenHome setScreen={setScreen} active={active} />
    else if (screen === "homeService")
      page = <HomeServiceRequest onSubmit={(c) => { setComplaints(list => [c, ...list]); notify("Home service request sent to municipal operator") }} onDone={() => setScreen("track")} />
    else if (screen === "report")
      page = (
        <ReportFlow
          onSubmit={(c) => {
            setComplaints((list) => [c, ...list.filter((x) => x.id !== c.id)])
            notify("Report submitted successfully")
          }}
          onDone={() => setScreen("track")}
        />
      )
    else if (screen === "track") page = <TrackReport complaint={active} />
    else if (screen === "schedule") page = <Schedule />
    else if (screen === "impact") page = <Impact />
    else if (screen === "rewards") page = <Rewards />
    else page = <GenericPage screen={screen} role={role} />
  } else if (role === "operator") {
    if (screen === "home")
      page = <OperatorHome complaints={complaints} setScreen={setScreen} />
    else if (screen === "complaints")
      page = (
        <Complaints
          complaints={complaints}
          assign={assign}
          requestReassignment={requestReassignment}
          advance={updateStatus}
        />
      )
    else if (screen === "map") page = <FullMap complaints={complaints} />
    else if (screen === "hotspots") page = <Hotspots />
    else if (screen === "analytics") page = <Analytics />
    else if (screen === "incoming") page = <Incoming />
    else page = <GenericPage screen={screen} role={role} />
  } else if (role === "worker") {
    if (screen === "home")
      page = <WorkerHome tasks={tasks} setScreen={setScreen} />
    else if (screen === "tasks")
      page = <WorkerTasks tasks={tasks} update={updateStatus} requestReassignment={requestReassignment} />
    else if (screen === "scanner")
      page = <Scanner onScan={() => setScreen("tasks")} />
    else page = <GenericPage screen={screen} role={role} />
  } else {
    if (screen === "home") page = <AgencyHome setScreen={setScreen} />
    else if (screen === "incoming" || screen === "tasks") page = <Incoming />
    else page = <GenericPage screen={screen} role={role} />
  }
  return (
    <>
      <AppShell
        role={role}
        screen={screen}
        setScreen={setScreen}
        onLogout={() => {
          setRole(undefined)
          setScreen("home")
        }}
      >
        {page}
      </AppShell>
      {toast && (
        <div className="toast">
          <Icon name="check" />
          <span>{toast}</span>
        </div>
      )}
    </>
  )
}
