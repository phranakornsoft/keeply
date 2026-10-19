import { createElement, useState, type ChangeEvent, type ReactNode } from "react";

type Page = "home" | "items" | "lists" | "members" | "detail" | "add-item" | "add-list" | "profile" | "settings" | "year-plan" | "member-profile" | "notification-detail" | "add-quarter-plan" | "add-expense" | "subscriptions" | "edit-profile" | "line-login";
type IconName =
  | "home" | "box" | "list" | "users" | "bell" | "chevron" | "plus"
  | "phone" | "chair" | "coffee" | "check" | "clock" | "cart" | "card"
  | "wallet" | "calendar" | "store" | "receipt" | "back" | "more"
  | "sparkle" | "shield" | "tag" | "camera" | "settings" | "user" | "logout";

const paths: Record<IconName, ReactNode> = {
  home: <><path d="M3 10.8 12 3l9 7.8" /><path d="M5.5 9.3V21h13V9.3M9 21v-7h6v7" /></>,
  box: <><path d="m4 7 8-4 8 4-8 4-8-4Z" /><path d="m4 7 8 4 8-4v10l-8 4-8-4V7Z" /><path d="M12 11v10" /></>,
  list: <><path d="M9 6h11M9 12h11M9 18h11" /><path d="m3 6 .8.8L5.5 5M3 12l.8.8 1.7-1.8M3 18l.8.8 1.7-1.8" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.8M16 3.2a4 4 0 0 1 0 7.6" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  phone: <><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M10 5h4M11 18h2" /></>,
  chair: <><path d="M6 11h12a2 2 0 0 1 2 2v4H4v-4a2 2 0 0 1 2-2ZM6 17v4M18 17v4M8 11V7a4 4 0 0 1 8 0v4" /></>,
  coffee: <><path d="M4 7h13v8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V7ZM17 10h2a3 3 0 0 1 0 6h-2M7 3v1M11 2v2M15 3v1" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  cart: <><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M3 4h2l2.4 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 7H6" /></>,
  card: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h4" /></>,
  wallet: <><path d="M4 6h14a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V6a3 3 0 0 1 3-3h13v3" /><path d="M15 12h7v4h-7a2 2 0 0 1 0-4Z" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  store: <><path d="M3 10 5 4h14l2 6" /><path d="M5 13v8h14v-8M9 21v-6h6v6" /><path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" /></>,
  receipt: <><path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2Z" /><path d="M9 7h6M9 11h6M9 15h3" /></>,
  back: <path d="m15 18-6-6 6-6" />,
  more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
  sparkle: <><path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3ZM6 14l.8 2.2L9 17l-2.2.8L6 20l-.8-2.2L3 17l2.2-.8L6 14Z" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
  tag: <><path d="M20.6 13.6 11 4H4v7l9.6 9.6a2 2 0 0 0 2.8 0l4.2-4.2a2 2 0 0 0 0-2.8Z" /><circle cx="7.5" cy="7.5" r="1" /></>,
  camera: <><path d="M14.5 4 16 6h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l1.5-2h5Z" /><circle cx="12" cy="13" r="4" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  logout: <><path d="M10 17l5-5-5-5M15 12H3M15 3h5a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-5" /></>,
};

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Heading({ level = 2, className = "", children }: { level?: 1 | 2 | 3; className?: string; children: ReactNode }) {
  return createElement(`h${level}`, { className }, children);
}

function Button({ className = "", children, onClick, ariaLabel }: { className?: string; children: ReactNode; onClick?: () => void; ariaLabel?: string }) {
  return createElement("button", { type: "button", className, onClick, "aria-label": ariaLabel }, children);
}

function Input({ value, placeholder, type = "text", onChange }: { value: string; placeholder?: string; type?: string; onChange: (value: string) => void }) {
  return createElement("input", { value, type, placeholder, onChange: (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value), className: "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-300 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100" });
}

const products = [
  { id: 1, name: "ขาตั้งโทรศัพท์", detail: "Shopee · 24 พ.ค. 2568", price: "฿500", daily: "฿0.68/วัน", value: "฿284", used: "10 เดือน", progress: 57, icon: "phone" as IconName, tone: "bg-sky-100 text-sky-700", category: "อิเล็กทรอนิกส์" },
  { id: 2, name: "เก้าอี้ทำงาน", detail: "IKEA · 12 ม.ค. 2568", price: "฿4,290", daily: "฿2.35/วัน", value: "฿3,752", used: "4 เดือน", progress: 87, icon: "chair" as IconName, tone: "bg-amber-100 text-amber-700", category: "เฟอร์นิเจอร์" },
  { id: 3, name: "เครื่องชงกาแฟ", detail: "Central · 3 พ.ย. 2567", price: "฿3,290", daily: "฿3.01/วัน", value: "฿2,138", used: "1 ปี 6 เดือน", progress: 65, icon: "coffee" as IconName, tone: "bg-emerald-100 text-emerald-700", category: "ของใช้ในบ้าน" },
];

const tabs: { id: "home" | "items" | "lists" | "members"; label: string; icon: IconName }[] = [
  { id: "home", label: "บ้าน", icon: "home" },
  { id: "items", label: "สิ่งของ", icon: "box" },
  { id: "lists", label: "รายการ", icon: "list" },
  { id: "members", label: "สมาชิก", icon: "users" },
];

const appNotifications = [
  { id: 1, icon: "wallet" as IconName, title: "พฤษภาคมใช้จ่ายเกินงบ", detail: "ชำระแล้ว ฿3,120 จากงบ ฿2,550 · เกิน ฿570", time: "วันนี้ · 10:24", tone: "bg-rose-100 text-rose-700", type: "เร่งด่วน", badge: "bg-rose-100 text-rose-700", opensPlan: true },
  { id: 2, icon: "card" as IconName, title: "ใกล้ถึงกำหนดชำระค่างวด", detail: "เก้าอี้ทำงาน ฿429 · ครบกำหนดในอีก 3 วัน", time: "วันนี้ · 08:30", tone: "bg-amber-100 text-amber-700", type: "เตือนชำระ", badge: "bg-amber-100 text-amber-700", opensPlan: true },
  { id: 3, icon: "check" as IconName, title: "เมษายนต่ำกว่างบที่กำหนด", detail: "ประหยัดได้ ฿70 และนำไปรวมในงบสำรองแล้ว", time: "เมื่อวาน · 18:45", tone: "bg-emerald-100 text-emerald-700", type: "ข่าวดี", badge: "bg-emerald-100 text-emerald-700", opensPlan: true },
  { id: 4, icon: "calendar" as IconName, title: "มีการเพิ่มรายการใน Q3", detail: "พ่อเพิ่ม “เปลี่ยนโทรศัพท์” งบประมาณ ฿8,000", time: "27 พ.ค. · 14:12", tone: "bg-sky-100 text-sky-700", type: "Year Plan", badge: "bg-sky-100 text-sky-700", opensPlan: true },
];

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [previousPage, setPreviousPage] = useState<Page>("items");
  const [category, setCategory] = useState("ทั้งหมด");
  const [notice, setNotice] = useState("");
  const [canAdd, setCanAdd] = useState(true);
  const [completed, setCompleted] = useState<number[]>([3]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [readNotifications, setReadNotifications] = useState<number[]>([3, 4]);
  const [selectedNotificationId, setSelectedNotificationId] = useState(1);
  const [selectedMember, setSelectedMember] = useState("แม่");
  const [selectedQuarter, setSelectedQuarter] = useState("Q2");
  const [profile, setProfile] = useState({ name: "พีรพัฒน์", email: "peeraphat@keeply.family", phone: "081-234-5678", birthday: "1992-08-18", bio: "ดูแลของใช้และแผนค่าใช้จ่ายของบ้าน" });
  const [lineConnected, setLineConnected] = useState(false);

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2300);
  };

  const openDetail = () => {
    setPreviousPage(page);
    setPage("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto min-h-screen max-w-3xl bg-slate-50 shadow-sm">
        {page === "detail" ? (
          <ProductDetail onBack={() => setPage(previousPage === "detail" ? "items" : previousPage)} notify={notify} />
        ) : page === "add-item" ? (
          <AddItemPage onBack={() => setPage("items")} onSave={() => { notify("เพิ่มสิ่งของใหม่เรียบร้อยแล้ว"); setPage("items"); }} />
        ) : page === "add-list" ? (
          <AddSharedListPage onBack={() => setPage("lists")} onSave={() => { notify("เพิ่มรายการร่วมกันเรียบร้อยแล้ว"); setPage("lists"); }} />
        ) : page === "profile" ? (
          <ProfilePage profile={profile} lineConnected={lineConnected} onBack={() => setPage("members")} openEdit={() => setPage("edit-profile")} openLine={() => setPage("line-login")} openSettings={() => setPage("settings")} notify={notify} />
        ) : page === "edit-profile" ? (
          <EditProfilePage profile={profile} onBack={() => setPage("profile")} onSave={(value) => { setProfile(value); notify("บันทึกโปรไฟล์เรียบร้อยแล้ว"); setPage("profile"); }} />
        ) : page === "line-login" ? (
          <LineLoginPage connected={lineConnected} profileName={profile.name} onBack={() => setPage("profile")} onConnected={() => { setLineConnected(true); notify("เชื่อมต่อบัญชี LINE เรียบร้อยแล้ว"); setPage("profile"); }} onDisconnected={() => { setLineConnected(false); notify("ยกเลิกการเชื่อมต่อ LINE แล้ว"); setPage("profile"); }} />
        ) : page === "settings" ? (
          <SettingsPage onBack={() => setPage("profile")} notify={notify} />
        ) : page === "year-plan" ? (
          <YearPlanPage
            onBack={() => setPage("home")}
            notify={notify}
            addPlan={(quarter) => { setSelectedQuarter(quarter); setPage("add-quarter-plan"); }}
            addExpense={() => setPage("add-expense")}
            openSubscriptions={() => setPage("subscriptions")}
          />
        ) : page === "member-profile" ? (
          <MemberProfilePage memberName={selectedMember} onBack={() => setPage("members")} notify={notify} />
        ) : page === "notification-detail" ? (
          <NotificationDetailPage notificationId={selectedNotificationId} onBack={() => setPage("home")} openYearPlan={() => setPage("year-plan")} />
        ) : page === "add-quarter-plan" ? (
          <AddQuarterPlanPage quarter={selectedQuarter} onBack={() => setPage("year-plan")} onSave={() => { notify(`เพิ่มแผนใน ${selectedQuarter} เรียบร้อยแล้ว`); setPage("year-plan"); }} />
        ) : page === "add-expense" ? (
          <AddExpensePage onBack={() => setPage("year-plan")} onSave={() => { notify("บันทึกค่าใช้จ่ายเดือนนี้เรียบร้อยแล้ว"); setPage("year-plan"); }} />
        ) : page === "subscriptions" ? (
          <SubscriptionsPage onBack={() => setPage("year-plan")} notify={notify} />
        ) : (
          <>
            <AppHeader page={page} unreadCount={appNotifications.length - readNotifications.length} openNotifications={() => setShowNotifications(true)} openProfile={() => setPage("profile")} />
            <main className="px-4 pb-28 pt-5 sm:px-6">
              {page === "home" && <HomePage setPage={setPage} openDetail={openDetail} />}
              {page === "items" && <ItemsPage category={category} setCategory={setCategory} openDetail={openDetail} addItem={() => setPage("add-item")} notify={notify} />}
              {page === "lists" && <ListsPage completed={completed} setCompleted={setCompleted} addList={() => setPage("add-list")} notify={notify} />}
              {page === "members" && <MembersPage canAdd={canAdd} setCanAdd={setCanAdd} openMember={(name) => { if (name === "พีรพัฒน์") { setPage("profile"); } else { setSelectedMember(name); setPage("member-profile"); } }} openSettings={() => setPage("settings")} notify={notify} />}
            </main>
            <BottomNav page={page} setPage={setPage} />
          </>
        )}
      </div>
      {showNotifications && (
        <NotificationCenter
          readNotifications={readNotifications}
          setReadNotifications={setReadNotifications}
          onClose={() => setShowNotifications(false)}
          openNotification={(id) => {
            setSelectedNotificationId(id);
            setShowNotifications(false);
            setPage("notification-detail");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
      {notice && <div className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-slate-900 px-4 py-2.5 text-xs text-white shadow-xl"><Icon name="check" className="size-4 text-sky-300" />{notice}</div>}
    </div>
  );
}

function AppHeader({ page, unreadCount, openNotifications, openProfile }: { page: Page; unreadCount: number; openNotifications: () => void; openProfile: () => void }) {
  const titles: Record<string, string> = { home: "บ้านของเรา", items: "สิ่งของทั้งหมด", lists: "รายการร่วมกัน", members: "สมาชิกในบ้าน" };
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-slate-50/95 px-4 pb-3 pt-4 backdrop-blur sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium text-sky-700">KEEPly · ครอบครัวพีรพัฒน์</p>
          <Heading level={1} className="mt-0.5 text-xl font-bold tracking-tight">{titles[page]}</Heading>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openNotifications} ariaLabel={`การแจ้งเตือนที่ยังไม่ได้อ่าน ${unreadCount} รายการ`} className="relative flex size-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200"><Icon name="bell" className="size-5" />{unreadCount > 0 && <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-slate-50">{unreadCount}</span>}</Button>
          <Button onClick={openProfile} ariaLabel="เปิดโปรไฟล์" className="flex size-10 items-center justify-center rounded-full bg-sky-200 text-sm font-bold text-sky-800">พ</Button>
        </div>
      </div>
    </header>
  );
}

function NotificationCenter({ readNotifications, setReadNotifications, onClose, openNotification }: { readNotifications: number[]; setReadNotifications: (value: number[]) => void; onClose: () => void; openNotification: (id: number) => void }) {
  const unreadCount = appNotifications.length - readNotifications.length;
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col bg-slate-50 shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
          <Button onClick={onClose} ariaLabel="ปิดการแจ้งเตือน" className="flex size-10 items-center justify-center rounded-full bg-slate-50 text-slate-600 ring-1 ring-slate-200"><Icon name="back" className="size-5" /></Button>
          <div className="text-center"><Heading level={1} className="text-base font-bold">การแจ้งเตือน</Heading><p className="mt-0.5 text-[9px] text-slate-400">{unreadCount > 0 ? `ยังไม่ได้อ่าน ${unreadCount} รายการ` : "อ่านครบแล้ว"}</p></div>
          <Button onClick={() => setReadNotifications(appNotifications.map((item) => item.id))} ariaLabel="อ่านทั้งหมด" className="text-[10px] font-semibold text-sky-700">อ่านทั้งหมด</Button>
        </header>
        <main className="flex-1 px-4 pb-8 pt-5 sm:px-6">
          <section className="mb-5 rounded-2xl border border-rose-100 bg-rose-50 p-4">
            <div className="flex items-start gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-rose-600 shadow-sm"><Icon name="bell" className="size-5" /></div><div><p className="text-sm font-semibold text-rose-900">มี 1 รายการที่ควรตรวจสอบ</p><p className="mt-1 text-[11px] leading-5 text-rose-700">ค่าใช้จ่ายเดือนพฤษภาคมเกินงบที่กำหนดไว้ ฿570</p></div></div>
          </section>
          <div className="mb-3 flex items-center justify-between"><Heading level={2} className="text-sm font-bold">ล่าสุด</Heading><span className="text-[10px] text-slate-400">เรียงตามเวลา</span></div>
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {appNotifications.map((item, index) => {
              const isRead = readNotifications.includes(item.id);
              return (
                <Button
                  key={item.id}
                  onClick={() => {
                    if (!isRead) setReadNotifications([...readNotifications, item.id]);
                    openNotification(item.id);
                  }}
                  className={`relative flex w-full items-start gap-3 p-4 text-left ${index < appNotifications.length - 1 ? "border-b border-slate-100" : ""} ${isRead ? "bg-white" : "bg-sky-50/60"}`}
                >
                  {!isRead && <span className="absolute right-3 top-3 size-2 rounded-full bg-sky-500" />}
                  <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${item.tone}`}><Icon name={item.icon} className="size-5" /></span>
                  <span className="min-w-0 flex-1 pr-2">
                    <span className="flex items-center gap-2"><span className={`truncate text-sm ${isRead ? "font-medium text-slate-700" : "font-bold text-slate-900"}`}>{item.title}</span></span>
                    <span className="mt-1 block text-[10px] leading-4 text-slate-500">{item.detail}</span>
                    <span className="mt-2 flex items-center gap-2"><span className={`rounded-full px-2 py-0.5 text-[8px] font-semibold ${item.badge}`}>{item.type}</span><span className="text-[9px] text-slate-400">{item.time}</span></span>
                  </span>
                  <Icon name="chevron" className="mt-3 size-4 shrink-0 text-slate-300" />
                </Button>
              );
            })}
          </section>
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Icon name="settings" className="size-5" /></div><div className="min-w-0 flex-1"><p className="text-sm font-semibold">ตั้งค่าการแจ้งเตือน</p><p className="mt-0.5 text-[10px] text-slate-400">งบประมาณ ค่างวด และกิจกรรมในบ้าน</p></div><Icon name="chevron" className="size-4 text-slate-300" /></div>
          </section>
        </main>
      </div>
    </div>
  );
}

function HomePage({ setPage, openDetail }: { setPage: (page: Page) => void; openDetail: () => void }) {
  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl bg-slate-800 p-5 text-white shadow-lg shadow-slate-200">
        <div className="flex items-center justify-between">
          <div><p className="text-xs text-slate-400">สถานะบ้านวันนี้</p><p className="mt-1 text-lg font-semibold">ทุกอย่างเรียบร้อยดี</p></div>
          <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300"><Icon name="check" className="size-6" /></div>
        </div>
        <div className="mt-5 grid grid-cols-3 divide-x divide-white/10 rounded-2xl bg-white/5 py-3">
          <div className="text-center"><p className="text-xl font-bold">8</p><p className="mt-1 text-[10px] text-slate-400">สิ่งของ</p></div>
          <div className="text-center"><p className="text-xl font-bold">3</p><p className="mt-1 text-[10px] text-slate-400">ต้องซื้อ</p></div>
          <div className="text-center"><p className="text-xl font-bold">4</p><p className="mt-1 text-[10px] text-slate-400">สมาชิก</p></div>
        </div>
      </section>

      <Button onClick={() => setPage("year-plan")} className="w-full overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 to-emerald-50 p-4 text-left shadow-sm transition active:scale-[.99]">
        <span className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm"><Icon name="calendar" className="size-5" /></span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between gap-2"><span className="text-sm font-bold text-slate-800">Year Plan 2568</span><Icon name="chevron" className="size-4 text-sky-600" /></span>
            <span className="mt-1 block text-[11px] text-slate-500">วางแผนของเข้าบ้านและงบประมาณตลอดทั้งปี</span>
            <span className="mt-3 flex items-center gap-2">
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-white"><span className="block h-full w-[38%] rounded-full bg-sky-500" /></span>
              <span className="text-[10px] font-semibold text-sky-700">38%</span>
            </span>
            <span className="mt-1.5 flex justify-between text-[9px] text-slate-400"><span>ใช้แล้ว ฿18,240</span><span>งบทั้งปี ฿48,000</span></span>
          </span>
        </span>
      </Button>

      <section>
        <div className="mb-3 flex items-center justify-between"><Heading level={2} className="text-base font-bold">ต้องจัดการเร็ว ๆ นี้</Heading><Button onClick={() => setPage("lists")} className="text-xs font-semibold text-sky-700">ดูทั้งหมด</Button></div>
        <div className="space-y-2.5">
          <StatusRow icon="cart" tone="bg-amber-100 text-amber-700" title="ซื้อหลอดไฟห้องครัว" meta="แม่เพิ่มไว้ · ภายในวันนี้" badge="เร่งด่วน" />
          <StatusRow icon="clock" tone="bg-violet-100 text-violet-700" title="ชำระค่างวดเก้าอี้ทำงาน" meta="งวดที่ 4/10 · อีก 3 วัน" badge="฿429" />
          <StatusRow icon="shield" tone="bg-emerald-100 text-emerald-700" title="ประกันเครื่องชงกาแฟ" meta="เหลือความคุ้มครอง 46 วัน" badge="ตรวจสอบ" />
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between"><Heading level={2} className="text-base font-bold">สิ่งของที่ใช้ล่าสุด</Heading><Button onClick={() => setPage("items")} className="text-xs font-semibold text-sky-700">สิ่งของทั้งหมด</Button></div>
        <Button onClick={openDetail} className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition active:scale-[.99]">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700"><Icon name="phone" className="size-6" /></div>
            <div className="min-w-0 flex-1"><p className="text-sm font-semibold">ขาตั้งโทรศัพท์</p><p className="mt-1 text-xs text-slate-400">ใช้งานมาแล้ว 10 เดือน</p></div>
            <Icon name="chevron" className="size-5 text-slate-300" />
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[57%] rounded-full bg-sky-500" /></div>
          <div className="mt-2 flex justify-between text-[10px] text-slate-400"><span>คุ้มค่าแล้ว 57%</span><span>฿0.68 / วัน</span></div>
        </Button>
      </section>

      <section className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
        <div className="flex gap-3"><Icon name="sparkle" className="mt-0.5 size-5 shrink-0 text-sky-700" /><div><p className="text-sm font-semibold text-sky-900">เดือนนี้บ้านเราคุ้มขึ้น</p><p className="mt-1 text-xs leading-5 text-sky-700">ค่าเฉลี่ยการใช้งานต่อวันลดลง ฿3.40 เพราะเราใช้ของเดิมได้คุ้มค่าขึ้น</p></div></div>
      </section>
    </div>
  );
}

function YearPlanPage({ onBack, notify, addPlan, addExpense, openSubscriptions }: { onBack: () => void; notify: (message: string) => void; addPlan: (quarter: string) => void; addExpense: () => void; openSubscriptions: () => void }) {
  const [quarter, setQuarter] = useState("Q2");
  const quarters = [
    { id: "Q1", label: "ม.ค. – มี.ค.", amount: "฿12,190", status: "เสร็จแล้ว", tone: "bg-emerald-100 text-emerald-700" },
    { id: "Q2", label: "เม.ย. – มิ.ย.", amount: "฿8,550", status: "กำลังดำเนินการ", tone: "bg-sky-100 text-sky-700" },
    { id: "Q3", label: "ก.ค. – ก.ย.", amount: "฿11,500", status: "วางแผนไว้", tone: "bg-amber-100 text-amber-700" },
    { id: "Q4", label: "ต.ค. – ธ.ค.", amount: "฿15,760", status: "วางแผนไว้", tone: "bg-slate-100 text-slate-600" },
  ];
  const monthlyExpenses: Record<string, { month: string; budget: string; paid: string; difference: string; status: string; tone: string; bar: string }[]> = {
    Q1: [
      { month: "มกราคม", budget: "฿4,500", paid: "฿4,290", difference: "ต่ำกว่า ฿210", status: "ต่ำกว่างบ", tone: "bg-emerald-100 text-emerald-700", bar: "w-[95%] bg-emerald-500" },
      { month: "กุมภาพันธ์", budget: "฿3,000", paid: "฿2,610", difference: "ต่ำกว่า ฿390", status: "ต่ำกว่างบ", tone: "bg-emerald-100 text-emerald-700", bar: "w-[87%] bg-emerald-500" },
      { month: "มีนาคม", budget: "฿4,000", paid: "฿5,290", difference: "เกิน ฿1,290", status: "เกินงบ", tone: "bg-rose-100 text-rose-700", bar: "w-full bg-rose-500" },
    ],
    Q2: [
      { month: "เมษายน", budget: "฿3,000", paid: "฿2,930", difference: "ต่ำกว่า ฿70", status: "ต่ำกว่างบ", tone: "bg-emerald-100 text-emerald-700", bar: "w-[97%] bg-emerald-500" },
      { month: "พฤษภาคม", budget: "฿2,550", paid: "฿3,120", difference: "เกิน ฿570", status: "เกินงบ", tone: "bg-rose-100 text-rose-700", bar: "w-full bg-rose-500" },
      { month: "มิถุนายน", budget: "฿3,000", paid: "฿0", difference: "เหลือ ฿3,000", status: "ยังไม่ถึงกำหนด", tone: "bg-slate-100 text-slate-600", bar: "w-0 bg-slate-300" },
    ],
    Q3: [
      { month: "กรกฎาคม", budget: "฿3,500", paid: "฿0", difference: "เหลือ ฿3,500", status: "ยังไม่ถึงกำหนด", tone: "bg-slate-100 text-slate-600", bar: "w-0 bg-slate-300" },
      { month: "สิงหาคม", budget: "฿0", paid: "฿0", difference: "ยังไม่มีแผน", status: "ยังไม่ถึงกำหนด", tone: "bg-slate-100 text-slate-600", bar: "w-0 bg-slate-300" },
      { month: "กันยายน", budget: "฿8,000", paid: "฿0", difference: "เหลือ ฿8,000", status: "ยังไม่ถึงกำหนด", tone: "bg-slate-100 text-slate-600", bar: "w-0 bg-slate-300" },
    ],
    Q4: [
      { month: "ตุลาคม", budget: "฿0", paid: "฿0", difference: "ยังไม่มีแผน", status: "ยังไม่ถึงกำหนด", tone: "bg-slate-100 text-slate-600", bar: "w-0 bg-slate-300" },
      { month: "พฤศจิกายน", budget: "฿9,900", paid: "฿0", difference: "เหลือ ฿9,900", status: "ยังไม่ถึงกำหนด", tone: "bg-slate-100 text-slate-600", bar: "w-0 bg-slate-300" },
      { month: "ธันวาคม", budget: "฿5,860", paid: "฿0", difference: "เหลือ ฿5,860", status: "ยังไม่ถึงกำหนด", tone: "bg-slate-100 text-slate-600", bar: "w-0 bg-slate-300" },
    ],
  };
  const plans: Record<string, { icon: IconName; title: string; meta: string; price: string; tone: string; done?: boolean }[]> = {
    Q1: [
      { icon: "chair", title: "เก้าอี้ทำงาน", meta: "ม.ค. · เฟอร์นิเจอร์", price: "฿4,290", tone: "bg-amber-100 text-amber-700", done: true },
      { icon: "coffee", title: "เครื่องชงกาแฟ", meta: "มี.ค. · ของใช้ในบ้าน", price: "฿3,290", tone: "bg-emerald-100 text-emerald-700", done: true },
    ],
    Q2: [
      { icon: "card", title: "ผ่อนเก้าอี้ทำงาน", meta: "ทุกวันที่ 12 · เหลือ 6 งวด", price: "฿429/เดือน", tone: "bg-violet-100 text-violet-700" },
      { icon: "box", title: "เครื่องฟอกอากาศ", meta: "มิ.ย. · รอเปรียบเทียบราคา", price: "งบ ฿6,500", tone: "bg-sky-100 text-sky-700" },
      { icon: "shield", title: "ต่อประกันเครื่องชงกาแฟ", meta: "ภายใน 28 มิ.ย.", price: "฿1,200", tone: "bg-emerald-100 text-emerald-700" },
    ],
    Q3: [
      { icon: "box", title: "ชั้นเก็บของห้องครัว", meta: "ก.ค. · เฟอร์นิเจอร์", price: "งบ ฿3,500", tone: "bg-amber-100 text-amber-700" },
      { icon: "phone", title: "เปลี่ยนโทรศัพท์ของพ่อ", meta: "ก.ย. · อิเล็กทรอนิกส์", price: "งบ ฿8,000", tone: "bg-sky-100 text-sky-700" },
    ],
    Q4: [
      { icon: "box", title: "เครื่องดูดฝุ่น", meta: "พ.ย. · รอโปรปลายปี", price: "งบ ฿9,900", tone: "bg-sky-100 text-sky-700" },
      { icon: "chair", title: "ปรับมุมพักผ่อน", meta: "ธ.ค. · ของใช้ในบ้าน", price: "งบ ฿5,860", tone: "bg-amber-100 text-amber-700" },
    ],
  };
  const selected = quarters.find((item) => item.id === quarter) ?? quarters[1];

  return (
    <div className="min-h-screen pb-8">
      <SecondaryHeader title="Year Plan" onBack={onBack} action={<span className="rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-bold text-sky-700">2568</span>} />
      <main className="px-4 pt-5 sm:px-6">
        <section className="overflow-hidden rounded-3xl bg-slate-800 p-5 text-white shadow-lg shadow-slate-200">
          <div className="flex items-start justify-between">
            <div><p className="text-xs text-slate-400">งบประมาณทั้งปี</p><p className="mt-1 text-3xl font-bold">฿48,000</p></div>
            <div className="rounded-2xl bg-sky-300/10 px-3 py-2 text-right"><p className="text-[9px] text-slate-400">คงเหลือ</p><p className="text-sm font-bold text-sky-200">฿29,760</p></div>
          </div>
          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[38%] rounded-full bg-gradient-to-r from-sky-400 to-emerald-300" /></div>
          <div className="mt-2 flex justify-between text-[10px] text-slate-400"><span>ใช้แล้ว ฿18,240</span><span>38% ของแผน</span></div>
          <div className="mt-5 grid grid-cols-3 divide-x divide-white/10 rounded-2xl bg-white/5 py-3">
            <div className="text-center"><p className="text-base font-bold">8</p><p className="mt-0.5 text-[9px] text-slate-400">รายการ</p></div>
            <div className="text-center"><p className="text-base font-bold">3</p><p className="mt-0.5 text-[9px] text-slate-400">สำเร็จแล้ว</p></div>
            <div className="text-center"><p className="text-base font-bold">5</p><p className="mt-0.5 text-[9px] text-slate-400">กำลังวางแผน</p></div>
          </div>
        </section>

        <section className="mt-5">
          <div className="mb-3 flex items-end justify-between"><div><Heading level={2} className="text-base font-bold">แผนรายไตรมาส</Heading><p className="mt-0.5 text-[10px] text-slate-400">แตะเพื่อดูรายการในแต่ละช่วง</p></div><span className="text-[10px] font-medium text-slate-400">อัปเดตวันนี้</span></div>
          <div className="grid grid-cols-4 gap-2">
            {quarters.map((item) => <Button key={item.id} onClick={() => setQuarter(item.id)} className={`rounded-2xl px-2 py-3 text-center ring-1 transition ${quarter === item.id ? "bg-sky-700 text-white ring-sky-700 shadow-md shadow-sky-100" : "bg-white text-slate-500 ring-slate-200"}`}><span className="block text-xs font-bold">{item.id}</span><span className={`mt-1 block text-[8px] ${quarter === item.id ? "text-sky-200" : "text-slate-400"}`}>{item.label}</span></Button>)}
          </div>
        </section>

        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <div><Heading level={2} className="text-base font-bold">{selected.id} · {selected.label}</Heading><p className="mt-0.5 text-[10px] text-slate-400">วางงบไว้ {selected.amount}</p></div>
            <span className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${selected.tone}`}>{selected.status}</span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div><p className="text-sm font-semibold">ค่าใช้จ่ายรายเดือน</p><p className="mt-0.5 text-[10px] text-slate-400">เปรียบเทียบยอดชำระจริงกับงบที่กำหนด</p></div>
              <div className="flex size-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700"><Icon name="wallet" className="size-4" /></div>
            </div>
            {monthlyExpenses[quarter].map((expense, index) => (
              <Button key={expense.month} onClick={() => notify(`เปิดค่าใช้จ่ายเดือน${expense.month}`)} className={`block w-full p-4 text-left ${index < monthlyExpenses[quarter].length - 1 ? "border-b border-slate-100" : ""}`}>
                <span className="flex items-start justify-between gap-3">
                  <span><span className="block text-xs font-semibold">{expense.month}</span><span className="mt-1 block text-[9px] text-slate-400">งบ {expense.budget} · ชำระแล้ว {expense.paid}</span></span>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold ${expense.tone}`}>{expense.status}</span>
                </span>
                <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-slate-100"><span className={`block h-full rounded-full ${expense.bar}`} /></span>
                <span className={`mt-1.5 block text-right text-[9px] font-medium ${expense.status === "เกินงบ" ? "text-rose-600" : expense.status === "ต่ำกว่างบ" ? "text-emerald-600" : "text-slate-400"}`}>{expense.difference}</span>
              </Button>
            ))}
          </div>
          <Button onClick={addExpense} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-800 py-3 text-xs font-semibold text-white"><Icon name="receipt" className="size-4" /> บันทึกค่าใช้จ่ายเดือนนี้</Button>
        </section>

        <Button onClick={openSubscriptions} className="mt-5 flex w-full items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50 p-4 text-left">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm"><Icon name="card" className="size-5" /></span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-violet-900">รายการชำระประจำ</span><span className="mt-1 block text-[10px] text-violet-600">รายเดือน 3 รายการ · รายปี 2 รายการ</span></span>
          <span className="text-right"><span className="block text-xs font-bold text-violet-900">฿1,218/เดือน</span><Icon name="chevron" className="ml-auto mt-1 size-4 text-violet-400" /></span>
        </Button>

        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <div><Heading level={2} className="text-base font-bold">รายการตามแผน</Heading><p className="mt-0.5 text-[10px] text-slate-400">สิ่งของและภาระชำระใน {selected.id}</p></div>
          </div>
          <div className="space-y-2.5">
            {plans[quarter].map((plan) => (
              <Button key={plan.title} onClick={() => notify(`เปิดแผน ${plan.title}`)} className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 text-left shadow-sm">
                <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${plan.tone}`}><Icon name={plan.done ? "check" : plan.icon} className="size-5" /></span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{plan.title}</span><span className="mt-1 block truncate text-[10px] text-slate-400">{plan.meta}</span></span>
                <span className="text-right"><span className="block whitespace-nowrap text-xs font-bold">{plan.price}</span><Icon name="chevron" className="ml-auto mt-1 size-3.5 text-slate-300" /></span>
              </Button>
            ))}
          </div>
          <Button onClick={() => addPlan(quarter)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-sky-300 bg-sky-50 py-3 text-xs font-semibold text-sky-700"><Icon name="plus" className="size-4" /> เพิ่มแผนใน {quarter}</Button>
        </section>

        <section className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="flex gap-3"><Icon name="sparkle" className="mt-0.5 size-5 shrink-0 text-emerald-700" /><div><p className="text-sm font-semibold text-emerald-900">แผนปีนี้ยังสบายอยู่</p><p className="mt-1 text-[11px] leading-5 text-emerald-700">หากใช้จ่ายตามแผน บ้านจะเหลืองบสำรอง ฿4,300 สำหรับรายการฉุกเฉิน</p></div></div>
        </section>
      </main>
    </div>
  );
}

function StatusRow({ icon, tone, title, meta, badge }: { icon: IconName; tone: string; title: string; meta: string; badge: string }) {
  return <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm"><div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tone}`}><Icon name={icon} className="size-5" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{title}</p><p className="mt-1 truncate text-[11px] text-slate-400">{meta}</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600">{badge}</span></div>;
}

function ItemsPage({ category, setCategory, openDetail, addItem, notify }: { category: string; setCategory: (value: string) => void; openDetail: () => void; addItem: () => void; notify: (message: string) => void }) {
  const categories = ["ทั้งหมด", "อิเล็กทรอนิกส์", "ของใช้ในบ้าน", "เฟอร์นิเจอร์"];
  const filtered = category === "ทั้งหมด" ? products : products.filter((product) => product.category === category);
  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-3">
        {categories.map((item) => <Button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium ${category === item ? "bg-sky-700 text-white" : "bg-white text-slate-500 ring-1 ring-slate-200"}`}>{item}</Button>)}
      </div>
      <div className="mt-2 space-y-3">
        {filtered.map((product) => (
          <Button key={product.id} onClick={product.id === 1 ? openDetail : () => notify("กำลังเตรียมหน้ารายละเอียดสินค้านี้")} className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition active:scale-[.99]">
            <div className="flex items-start gap-3">
              <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${product.tone}`}><Icon name={product.icon} className="size-6" /></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0"><p className="truncate text-sm font-semibold">{product.name}</p><p className="mt-1 truncate text-[10px] text-slate-400">{product.detail}</p></div>
                  <Icon name="chevron" className="mt-1 size-4 shrink-0 text-slate-300" />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div><p className="text-xs font-bold">{product.price}</p><p className="mt-0.5 text-[9px] text-slate-400">ราคาซื้อ</p></div>
                  <div><p className="text-xs font-bold text-sky-700">{product.value}</p><p className="mt-0.5 text-[9px] text-slate-400">มูลค่าปัจจุบัน</p></div>
                  <div className="text-right"><p className="text-xs font-bold">{product.used}</p><p className="mt-0.5 text-[9px] text-slate-400">ใช้งานมาแล้ว</p></div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-sky-500" style={{ width: `${product.progress}%` }} /></div>
                <div className="mt-1.5 flex justify-between text-[9px] text-slate-400"><span>ความคุ้มค่า {product.progress}%</span><span className="font-medium text-slate-500">{product.daily}</span></div>
              </div>
            </div>
          </Button>
        ))}
      </div>
      <Button onClick={addItem} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-sky-300 bg-sky-50 py-3.5 text-sm font-semibold text-sky-700"><Icon name="plus" className="size-5" /> เพิ่มสิ่งของใหม่</Button>
    </div>
  );
}

function ListsPage({ completed, setCompleted, addList, notify }: { completed: number[]; setCompleted: (value: number[]) => void; addList: () => void; notify: (message: string) => void }) {
  const tasks = [
    { id: 1, title: "ซื้อหลอดไฟห้องครัว", meta: "แม่ · ภายในวันนี้", type: "ต้องซื้อ", tone: "bg-amber-100 text-amber-700" },
    { id: 2, title: "ประกอบชั้นวางของ", meta: "พ่อ · วันเสาร์", type: "ต้องทำ", tone: "bg-violet-100 text-violet-700" },
    { id: 3, title: "ขาตั้งโทรศัพท์", meta: "พีรพัฒน์ · ฿500", type: "ซื้อแล้ว", tone: "bg-emerald-100 text-emerald-700" },
    { id: 4, title: "กล่องเก็บสายไฟ", meta: "มิน · Shopee", type: "ต้องซื้อ", tone: "bg-amber-100 text-amber-700" },
  ];
  return (
    <div>
      <div className="mb-4 grid grid-cols-3 gap-2">{[["ต้องทำ", "2"], ["ต้องซื้อ", "3"], ["ซื้อแล้ว", "6"]].map(([label, count]) => <div key={label} className="rounded-2xl bg-white p-3 text-center ring-1 ring-slate-200"><p className="text-lg font-bold">{count}</p><p className="text-[10px] text-slate-400">{label}</p></div>)}</div>
      <div className="space-y-2.5">{tasks.map((task) => {
        const isDone = completed.includes(task.id);
        return <Button key={task.id} onClick={() => { setCompleted(isDone ? completed.filter((id) => id !== task.id) : [...completed, task.id]); notify(isDone ? "นำกลับเข้ารายการแล้ว" : "ทำรายการเสร็จแล้ว"); }} className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm"><span className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${isDone ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300"}`}>{isDone && <Icon name="check" className="size-3" />}</span><span className="min-w-0 flex-1"><span className={`block truncate text-sm font-semibold ${isDone ? "text-slate-400 line-through" : ""}`}>{task.title}</span><span className="mt-1 block text-[11px] text-slate-400">{task.meta}</span></span><span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${task.tone}`}>{task.type}</span></Button>;
      })}</div>
      <Button onClick={addList} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-200"><Icon name="plus" className="size-5" /> เพิ่มรายการร่วมกัน</Button>
    </div>
  );
}

function MembersPage({ canAdd, setCanAdd, openMember, openSettings, notify }: { canAdd: boolean; setCanAdd: (value: boolean) => void; openMember: (name: string) => void; openSettings: () => void; notify: (message: string) => void }) {
  const members = [["พ", "พีรพัฒน์", "เจ้าของบ้าน", "bg-sky-200 text-sky-800"], ["ม", "แม่", "เพิ่มและแก้ไขได้", "bg-rose-200 text-rose-800"], ["พ", "พ่อ", "เพิ่มและแก้ไขได้", "bg-amber-200 text-amber-800"], ["น", "น้องมิน", "ดูอย่างเดียว", "bg-emerald-200 text-emerald-800"]];
  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-sky-700 p-5 text-white"><div className="flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-2xl bg-white/15"><Icon name="users" className="size-6" /></div><div className="flex-1"><p className="font-semibold">ครอบครัวพีรพัฒน์</p><p className="text-xs text-sky-200">สมาชิก 4 คน · 1 ผู้ดูแล</p></div><Button onClick={openSettings} ariaLabel="ตั้งค่าบ้าน" className="flex size-9 items-center justify-center rounded-xl bg-white/10"><Icon name="settings" className="size-5" /></Button></div><Button onClick={() => notify("คัดลอกลิงก์เชิญสมาชิกแล้ว")} className="mt-5 w-full rounded-xl bg-white py-2.5 text-xs font-semibold text-sky-700">+ เชิญสมาชิกใหม่</Button></section>
      <section className="rounded-2xl border border-slate-200 bg-white">
        {members.map(([avatar, name, role, tone], index) => <Button key={name} onClick={() => openMember(name)} className={`flex w-full items-center gap-3 p-4 text-left ${index < members.length - 1 ? "border-b border-slate-100" : ""}`}><div className={`flex size-10 items-center justify-center rounded-full text-sm font-bold ${tone}`}>{avatar}</div><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{name}</p><p className="text-[11px] text-slate-400">{role}</p></div><Icon name="chevron" className="size-5 text-slate-300" /></Button>)}
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><Icon name="shield" className="size-5" /></div><div className="min-w-0 flex-1"><p className="text-sm font-semibold">อนุญาตให้เพิ่มข้อมูล</p><p className="text-[11px] text-slate-400">สินค้า งาน และรายการซื้อของ</p></div><Button onClick={() => { setCanAdd(!canAdd); notify(canAdd ? "ปิดสิทธิ์แล้ว" : "เปิดสิทธิ์แล้ว"); }} className={`relative h-7 w-12 rounded-full transition ${canAdd ? "bg-sky-600" : "bg-slate-300"}`}><span className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${canAdd ? "left-6" : "left-1"}`} /></Button></div></section>
    </div>
  );
}

function SecondaryHeader({ title, onBack, action }: { title: string; onBack: () => void; action?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/70 bg-slate-50/95 px-4 py-3 backdrop-blur">
      <Button onClick={onBack} ariaLabel="ย้อนกลับ" className="flex size-10 items-center justify-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200"><Icon name="back" className="size-5" /></Button>
      <Heading level={1} className="text-base font-bold">{title}</Heading>
      <div className="flex size-10 items-center justify-center">{action}</div>
    </header>
  );
}

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return <div><div className="mb-2 flex items-center justify-between"><p className="text-xs font-semibold text-slate-700">{label}</p>{hint && <span className="text-[10px] text-slate-400">{hint}</span>}</div>{children}</div>;
}

function AddSharedListPage({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  const [status, setStatus] = useState<"todo" | "buy" | "bought">("buy");
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("2025-05-30");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [assignee, setAssignee] = useState("ทุกคน");
  const [note, setNote] = useState("");
  const [addToItems, setAddToItems] = useState(true);

  const isProduct = status !== "todo";
  const canSave = name.trim() && (!isProduct || price);

  return (
    <div className="min-h-screen pb-8">
      <SecondaryHeader title="เพิ่มรายการร่วมกัน" onBack={onBack} />
      <main className="px-4 pt-5 sm:px-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <Heading level={2} className="text-base font-bold">ประเภทของรายการ</Heading>
          <p className="mt-1 text-[11px] text-slate-400">เลือกว่าอยากให้สมาชิกในบ้านช่วยจัดการอะไร</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { id: "todo" as const, label: "ต้องทำ", icon: "list" as IconName, active: "bg-violet-50 text-violet-700 ring-violet-300" },
              { id: "buy" as const, label: "ต้องซื้อ", icon: "cart" as IconName, active: "bg-amber-50 text-amber-700 ring-amber-300" },
              { id: "bought" as const, label: "ซื้อแล้ว", icon: "check" as IconName, active: "bg-emerald-50 text-emerald-700 ring-emerald-300" },
            ].map((item) => (
              <Button key={item.id} onClick={() => setStatus(item.id)} className={`flex flex-col items-center gap-2 rounded-2xl p-3 text-xs font-semibold ring-1 ${status === item.id ? item.active : "bg-slate-50 text-slate-400 ring-slate-200"}`}>
                <Icon name={item.icon} className="size-5" />{item.label}
              </Button>
            ))}
          </div>
        </section>

        <section className="mt-4 space-y-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div><Heading level={2} className="text-base font-bold">{isProduct ? "ข้อมูลสินค้า" : "ข้อมูลงาน"}</Heading><p className="mt-1 text-[11px] text-slate-400">สมาชิกทุกคนจะมองเห็นข้อมูลส่วนนี้</p></div>
          <Field label={isProduct ? "ชื่อสินค้า" : "ชื่องาน"} hint="จำเป็น">
            <Input value={name} onChange={setName} placeholder={isProduct ? "เช่น หลอดไฟห้องครัว" : "เช่น ประกอบชั้นวางของ"} />
          </Field>

          {isProduct && (
            <>
              <Field label="แหล่งซื้อ / ร้านค้า" hint="ระบุได้มากกว่า 1 แห่ง">
                <div className="relative"><Icon name="store" className="absolute left-3 top-3.5 size-4 text-slate-400" /><div className="pl-7"><Input value={source} onChange={setSource} placeholder="เช่น Shopee, HomePro หรือร้านใกล้บ้าน" /></div></div>
              </Field>
              <div className="grid grid-cols-[1fr_.65fr] gap-3">
                <Field label={status === "bought" ? "ราคาที่ซื้อ" : "งบประมาณ"} hint="บาท"><Input value={price} onChange={setPrice} type="number" placeholder="0.00" /></Field>
                <Field label="จำนวน"><Input value={quantity} onChange={setQuantity} type="number" placeholder="1" /></Field>
              </div>
            </>
          )}

          <Field label={status === "bought" ? "วันที่ซื้อ" : status === "buy" ? "วันที่ต้องการซื้อ" : "กำหนดเสร็จ"}>
            <Input value={date} onChange={setDate} type="date" />
          </Field>

          <Field label="มอบหมายให้">
            <div className="flex flex-wrap gap-2">{["ทุกคน", "พีรพัฒน์", "แม่", "พ่อ", "น้องมิน"].map((member) => <Button key={member} onClick={() => setAssignee(member)} className={`rounded-full px-3 py-2 text-[11px] font-medium ${assignee === member ? "bg-sky-700 text-white" : "bg-slate-100 text-slate-500"}`}>{member}</Button>)}</div>
          </Field>

          <Field label="หมายเหตุ" hint="ไม่บังคับ">
            <Input value={note} onChange={setNote} placeholder="เช่น เลือกแสง Warm white หรือรอโปร 6.6" />
          </Field>
        </section>

        {status === "bought" && (
          <section className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white text-sky-700"><Icon name="box" className="size-5" /></div>
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-sky-900">เพิ่มในสิ่งของของบ้านด้วย</p><p className="mt-0.5 text-[10px] text-sky-600">นำข้อมูลนี้ไปคำนวณมูลค่าและความคุ้มค่า</p></div>
              <Button onClick={() => setAddToItems(!addToItems)} ariaLabel="เพิ่มในสิ่งของของบ้าน" className={`relative h-7 w-12 rounded-full transition ${addToItems ? "bg-sky-600" : "bg-slate-300"}`}><span className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${addToItems ? "left-6" : "left-1"}`} /></Button>
            </div>
          </section>
        )}

        <div className="mt-4 rounded-2xl bg-slate-100 p-3.5">
          <div className="flex gap-2.5"><Icon name="users" className="mt-0.5 size-4 shrink-0 text-slate-500" /><p className="text-[10px] leading-5 text-slate-500">สมาชิกทุกคนจะได้รับแจ้งเตือนเมื่อสร้างรายการ และสามารถอัปเดตสถานะหรือเพิ่มรายละเอียดได้ตามสิทธิ์ของบ้าน</p></div>
        </div>

        <Button onClick={canSave ? onSave : undefined} className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold shadow-lg ${canSave ? "bg-sky-700 text-white shadow-sky-200" : "cursor-not-allowed bg-slate-200 text-slate-400 shadow-transparent"}`}><Icon name="plus" className="size-5" /> เพิ่มในรายการร่วมกัน</Button>
        {!canSave && <p className="mt-2 text-center text-[10px] text-slate-400">{isProduct ? "กรอกชื่อสินค้าและราคาเพื่อเพิ่มรายการ" : "กรอกชื่องานเพื่อเพิ่มรายการ"}</p>}
      </main>
    </div>
  );
}

function AddItemPage({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("2025-05-24");
  const [channel, setChannel] = useState("");
  const [payer, setPayer] = useState("พีรพัฒน์");
  const [payment, setPayment] = useState<"cash" | "installment">("cash");
  const [months, setMonths] = useState("10");
  const [category, setCategory] = useState("อิเล็กทรอนิกส์");

  return (
    <div className="min-h-screen pb-8">
      <SecondaryHeader title="เพิ่มสิ่งของใหม่" onBack={onBack} />
      <main className="px-4 pt-5 sm:px-6">
        <Button className="flex h-36 w-full flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-sky-300 bg-sky-50 text-sky-700">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-white shadow-sm"><Icon name="camera" className="size-5" /></span>
          <span className="text-xs font-semibold">เพิ่มรูปสิ่งของ</span>
          <span className="text-[10px] text-sky-500">ถ่ายรูปหรือเลือกจากคลังภาพ</span>
        </Button>

        <section className="mt-5 space-y-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div><Heading level={2} className="text-base font-bold">ข้อมูลสิ่งของ</Heading><p className="mt-1 text-[11px] text-slate-400">กรอกข้อมูลพื้นฐานเพื่อเริ่มคำนวณความคุ้มค่า</p></div>
          <Field label="ชื่อสิ่งของ"><Input value={name} onChange={setName} placeholder="เช่น หูฟังไร้สาย" /></Field>
          <Field label="หมวดหมู่">
            <div className="flex flex-wrap gap-2">{["อิเล็กทรอนิกส์", "ของใช้ในบ้าน", "เฟอร์นิเจอร์", "อื่น ๆ"].map((item) => <Button key={item} onClick={() => setCategory(item)} className={`rounded-full px-3 py-2 text-[11px] font-medium ${category === item ? "bg-sky-700 text-white" : "bg-slate-100 text-slate-500"}`}>{item}</Button>)}</div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="ราคาที่ซื้อ"><Input value={price} onChange={setPrice} placeholder="0.00" type="number" /></Field>
            <Field label="วันที่ซื้อ"><Input value={date} onChange={setDate} type="date" /></Field>
          </div>
          <Field label="ซื้อจากที่ไหน / ช่องทาง"><Input value={channel} onChange={setChannel} placeholder="เช่น Shopee, Central, IKEA" /></Field>
          <Field label="ผู้ชำระเงิน">
            <div className="grid grid-cols-2 gap-2">{["พีรพัฒน์", "บัญชีกลางของบ้าน"].map((item) => <Button key={item} onClick={() => setPayer(item)} className={`rounded-xl px-3 py-2.5 text-xs font-medium ${payer === item ? "bg-sky-50 text-sky-700 ring-1 ring-sky-300" : "bg-slate-50 text-slate-500 ring-1 ring-slate-200"}`}>{item}</Button>)}</div>
          </Field>
        </section>

        <section className="mt-4 space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div><Heading level={2} className="text-base font-bold">วิธีชำระเงิน</Heading><p className="mt-1 text-[11px] text-slate-400">ใช้ติดตามภาระค่าใช้จ่ายของบ้าน</p></div>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => setPayment("cash")} className={`rounded-2xl p-4 text-left ring-1 ${payment === "cash" ? "bg-emerald-50 text-emerald-800 ring-emerald-300" : "bg-slate-50 text-slate-500 ring-slate-200"}`}><Icon name="wallet" className="size-5" /><span className="mt-3 block text-xs font-semibold">ชำระเต็มจำนวน</span><span className="mt-1 block text-[9px] opacity-70">เงินสด / โอน / บัตร</span></Button>
            <Button onClick={() => setPayment("installment")} className={`rounded-2xl p-4 text-left ring-1 ${payment === "installment" ? "bg-violet-50 text-violet-800 ring-violet-300" : "bg-slate-50 text-slate-500 ring-slate-200"}`}><Icon name="card" className="size-5" /><span className="mt-3 block text-xs font-semibold">ผ่อนชำระ</span><span className="mt-1 block text-[9px] opacity-70">รายเดือน / บัตรเครดิต</span></Button>
          </div>
          {payment === "installment" && (
            <div className="rounded-2xl bg-violet-50 p-3.5">
              <Field label="จำนวนงวด" hint={price ? `ประมาณ ฿${Math.ceil(Number(price || 0) / Number(months || 1)).toLocaleString()}/เดือน` : undefined}>
                <div className="flex gap-2">{["3", "6", "10", "12"].map((item) => <Button key={item} onClick={() => setMonths(item)} className={`flex-1 rounded-xl py-2.5 text-xs font-semibold ${months === item ? "bg-violet-600 text-white" : "bg-white text-violet-600"}`}>{item}</Button>)}</div>
              </Field>
            </div>
          )}
        </section>

        <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <Heading level={2} className="text-base font-bold">เป้าหมายการใช้งาน</Heading>
          <p className="mt-1 text-[11px] text-slate-400">ระบบจะใช้ระยะเวลานี้คำนวณค่าเฉลี่ยต่อวัน</p>
          <div className="mt-4 flex gap-2">{["1 ปี", "2 ปี", "3 ปี", "5 ปี"].map((item, index) => <Button key={item} className={`flex-1 rounded-xl py-2.5 text-xs font-semibold ${index === 1 ? "bg-sky-700 text-white" : "bg-slate-100 text-slate-500"}`}>{item}</Button>)}</div>
        </section>

        <Button onClick={name && price ? onSave : undefined} className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold shadow-lg ${name && price ? "bg-sky-700 text-white shadow-sky-200" : "cursor-not-allowed bg-slate-200 text-slate-400 shadow-transparent"}`}><Icon name="check" className="size-5" /> บันทึกสิ่งของ</Button>
        {!name || !price ? <p className="mt-2 text-center text-[10px] text-slate-400">กรอกชื่อและราคาเพื่อบันทึก</p> : null}
      </main>
    </div>
  );
}

function NotificationDetailPage({ notificationId, onBack, openYearPlan }: { notificationId: number; onBack: () => void; openYearPlan: () => void }) {
  const item = appNotifications.find((notification) => notification.id === notificationId) ?? appNotifications[0];
  const details: Record<number, { heading: string; primaryLabel: string; primary: string; secondaryLabel: string; secondary: string; difference: string; note: string }> = {
    1: { heading: "สรุปค่าใช้จ่ายเดือนพฤษภาคม", primaryLabel: "งบที่กำหนด", primary: "฿2,550", secondaryLabel: "ชำระจริง", secondary: "฿3,120", difference: "เกินงบ ฿570", note: "ค่าใช้จ่ายเพิ่มขึ้นจากเครื่องใช้ในบ้าน ฿890 แนะนำให้ปรับแผนเดือนมิถุนายนหรือนำงบสำรองมาใช้" },
    2: { heading: "ค่างวดที่กำลังจะถึง", primaryLabel: "ยอดชำระ", primary: "฿429", secondaryLabel: "วันครบกำหนด", secondary: "12 มิ.ย. 2568", difference: "เหลืออีก 3 วัน", note: "งวดที่ 4 จากทั้งหมด 10 งวด · ชำระผ่านบัตรเครดิต KBank อัตโนมัติ" },
    3: { heading: "สรุปค่าใช้จ่ายเดือนเมษายน", primaryLabel: "งบที่กำหนด", primary: "฿3,000", secondaryLabel: "ชำระจริง", secondary: "฿2,930", difference: "ประหยัด ฿70", note: "เงินส่วนต่างถูกนำไปรวมในงบสำรองของบ้านแล้ว ปัจจุบันมีงบสำรอง ฿4,300" },
    4: { heading: "รายละเอียดแผนที่เพิ่ม", primaryLabel: "งบประมาณ", primary: "฿8,000", secondaryLabel: "กำหนดซื้อ", secondary: "ก.ย. 2568", difference: "อยู่ใน Q3", note: "พ่อเพิ่มรายการ “เปลี่ยนโทรศัพท์” ในหมวดอิเล็กทรอนิกส์ และมอบหมายให้พีรพัฒน์ช่วยเปรียบเทียบราคา" },
  };
  const detail = details[item.id];
  const isAlert = item.id === 1;

  return (
    <div className="min-h-screen pb-8">
      <SecondaryHeader title="รายละเอียดการแจ้งเตือน" onBack={onBack} />
      <main className="px-4 pt-5 sm:px-6">
        <section className={`rounded-3xl p-5 ${isAlert ? "bg-rose-50 ring-1 ring-rose-100" : "bg-white ring-1 ring-slate-200"}`}>
          <div className={`flex size-12 items-center justify-center rounded-2xl ${item.tone}`}><Icon name={item.icon} className="size-6" /></div>
          <span className={`mt-4 inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold ${item.badge}`}>{item.type}</span>
          <Heading level={1} className="mt-3 text-xl font-bold">{item.title}</Heading>
          <p className="mt-2 text-xs leading-5 text-slate-500">{item.detail}</p>
          <p className="mt-3 text-[10px] text-slate-400">{item.time} · ครอบครัวพีรพัฒน์</p>
        </section>

        <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <Heading level={2} className="text-sm font-bold">{detail.heading}</Heading>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 p-3.5"><p className="text-[10px] text-slate-400">{detail.primaryLabel}</p><p className="mt-1 text-lg font-bold">{detail.primary}</p></div>
            <div className="rounded-2xl bg-slate-50 p-3.5"><p className="text-[10px] text-slate-400">{detail.secondaryLabel}</p><p className="mt-1 text-lg font-bold">{detail.secondary}</p></div>
          </div>
          <div className={`mt-3 rounded-2xl px-4 py-3 text-sm font-semibold ${isAlert ? "bg-rose-100 text-rose-700" : item.id === 3 ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"}`}>{detail.difference}</div>
        </section>

        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex gap-3"><Icon name="sparkle" className="mt-0.5 size-5 shrink-0 text-sky-700" /><div><p className="text-sm font-semibold">รายละเอียดเพิ่มเติม</p><p className="mt-1 text-[11px] leading-5 text-slate-500">{detail.note}</p></div></div>
        </section>
        <Button onClick={openYearPlan} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-200"><Icon name="calendar" className="size-5" /> ดูใน Year Plan</Button>
      </main>
    </div>
  );
}

function MemberProfilePage({ memberName, onBack, notify }: { memberName: string; onBack: () => void; notify: (message: string) => void }) {
  const profiles: Record<string, { avatar: string; role: string; joined: string; email: string; tone: string; items: string; tasks: string; spending: string; permission: string; activities: string[] }> = {
    แม่: { avatar: "ม", role: "สมาชิกในบ้าน", joined: "เข้าร่วมเมื่อ 12 ม.ค. 2568", email: "mae@keeply.family", tone: "from-rose-500 to-rose-400", items: "5", tasks: "12", spending: "฿6,840", permission: "เพิ่มและแก้ไขข้อมูลได้", activities: ["เพิ่มรายการซื้อหลอดไฟห้องครัว", "บันทึกค่าใช้จ่ายของใช้ในบ้าน ฿890", "ทำรายการซื้อของเสร็จ 2 รายการ"] },
    พ่อ: { avatar: "พ", role: "สมาชิกในบ้าน", joined: "เข้าร่วมเมื่อ 12 ม.ค. 2568", email: "por@keeply.family", tone: "from-amber-500 to-amber-400", items: "3", tasks: "8", spending: "฿8,000", permission: "เพิ่มและแก้ไขข้อมูลได้", activities: ["เพิ่มแผนเปลี่ยนโทรศัพท์ใน Q3", "อัปเดตราคาชั้นวางของ", "รับมอบหมายงานประกอบชั้น"] },
    น้องมิน: { avatar: "น", role: "สมาชิกในบ้าน", joined: "เข้าร่วมเมื่อ 2 ก.พ. 2568", email: "min@keeply.family", tone: "from-emerald-500 to-emerald-400", items: "1", tasks: "4", spending: "฿500", permission: "ดูข้อมูลได้อย่างเดียว", activities: ["ดู Year Plan ของครอบครัว", "เพิ่มความคิดเห็นในรายการโทรศัพท์", "ดูรายละเอียดเครื่องชงกาแฟ"] },
  };
  const profile = profiles[memberName] ?? profiles["แม่"];

  return (
    <div className="min-h-screen pb-8">
      <SecondaryHeader title="โปรไฟล์สมาชิก" onBack={onBack} action={<Button onClick={() => notify(`เปิดเมนูจัดการ ${memberName}`)} ariaLabel="จัดการสมาชิก" className="flex size-10 items-center justify-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200"><Icon name="more" className="size-5" /></Button>} />
      <main className="px-4 pt-5 sm:px-6">
        <section className={`rounded-3xl bg-gradient-to-br ${profile.tone} p-6 text-center text-white shadow-lg`}>
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-white/20 text-2xl font-bold ring-4 ring-white/20">{profile.avatar}</div>
          <Heading level={1} className="mt-4 text-xl font-bold">{memberName}</Heading>
          <p className="mt-1 text-xs text-white/75">{profile.role} · {profile.joined}</p>
          <p className="mt-3 text-[10px] text-white/70">{profile.email}</p>
        </section>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[["สิ่งของ", profile.items], ["งานที่ทำ", profile.tasks], ["ยอดที่ดูแล", profile.spending]].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-3 text-center"><p className="text-base font-bold">{value}</p><p className="mt-1 text-[9px] text-slate-400">{label}</p></div>)}
        </div>

        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700"><Icon name="shield" className="size-5" /></div><div className="min-w-0 flex-1"><p className="text-sm font-semibold">สิทธิ์การใช้งาน</p><p className="mt-0.5 text-[10px] text-slate-400">{profile.permission}</p></div><Button onClick={() => notify(`พร้อมแก้ไขสิทธิ์ของ ${memberName}`)} className="rounded-xl bg-slate-100 px-3 py-2 text-[10px] font-semibold text-slate-600">จัดการ</Button></div>
        </section>

        <section className="mt-5">
          <Heading level={2} className="mb-3 text-base font-bold">กิจกรรมล่าสุด</Heading>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {profile.activities.map((activity, index) => <div key={activity} className={`flex items-start gap-3 p-4 ${index < profile.activities.length - 1 ? "border-b border-slate-100" : ""}`}><span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-700"><Icon name={index === 0 ? "plus" : index === 1 ? "receipt" : "check"} className="size-3" /></span><div><p className="text-xs font-medium">{activity}</p><p className="mt-1 text-[9px] text-slate-400">{index === 0 ? "วันนี้ · 09:42" : index === 1 ? "เมื่อวาน · 18:20" : "3 วันที่แล้ว"}</p></div></div>)}
          </div>
        </section>
      </main>
    </div>
  );
}

function AddQuarterPlanPage({ quarter, onBack, onSave }: { quarter: string; onBack: () => void; onSave: () => void }) {
  const quarterMonths: Record<string, string[]> = { Q1: ["มกราคม", "กุมภาพันธ์", "มีนาคม"], Q2: ["เมษายน", "พฤษภาคม", "มิถุนายน"], Q3: ["กรกฎาคม", "สิงหาคม", "กันยายน"], Q4: ["ตุลาคม", "พฤศจิกายน", "ธันวาคม"] };
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [month, setMonth] = useState(quarterMonths[quarter][0]);
  const [type, setType] = useState("ซื้อสิ่งของ");
  const [owner, setOwner] = useState("พีรพัฒน์");
  const [note, setNote] = useState("");

  return (
    <div className="min-h-screen pb-8">
      <SecondaryHeader title={`เพิ่มแผนใน ${quarter}`} onBack={onBack} action={<span className="rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-bold text-sky-700">2568</span>} />
      <main className="px-4 pt-5 sm:px-6">
        <section className="rounded-3xl bg-sky-700 p-5 text-white">
          <div className="flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-2xl bg-white/15"><Icon name="calendar" className="size-5" /></div><div><p className="text-sm font-semibold">{quarter} · {quarterMonths[quarter][0]} – {quarterMonths[quarter][2]}</p><p className="mt-1 text-[10px] text-sky-200">รายการนี้จะรวมอยู่ในงบประมาณรายปี</p></div></div>
        </section>
        <section className="mt-4 space-y-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <Field label="ประเภทแผน">
            <div className="grid grid-cols-3 gap-2">{["ซื้อสิ่งของ", "ซ่อมบำรุง", "ชำระเงิน"].map((item) => <Button key={item} onClick={() => setType(item)} className={`rounded-xl px-2 py-2.5 text-[10px] font-semibold ${type === item ? "bg-sky-700 text-white" : "bg-slate-100 text-slate-500"}`}>{item}</Button>)}</div>
          </Field>
          <Field label="ชื่อรายการ" hint="จำเป็น"><Input value={name} onChange={setName} placeholder="เช่น เปลี่ยนเครื่องฟอกอากาศ" /></Field>
          <Field label="งบประมาณ" hint="บาท"><Input value={budget} onChange={setBudget} type="number" placeholder="0.00" /></Field>
          <Field label="เดือนที่วางแผน">
            <div className="grid grid-cols-3 gap-2">{quarterMonths[quarter].map((item) => <Button key={item} onClick={() => setMonth(item)} className={`rounded-xl py-2.5 text-[10px] font-semibold ${month === item ? "bg-amber-100 text-amber-800 ring-1 ring-amber-300" : "bg-slate-50 text-slate-500 ring-1 ring-slate-200"}`}>{item}</Button>)}</div>
          </Field>
          <Field label="ผู้รับผิดชอบ">
            <div className="flex flex-wrap gap-2">{["พีรพัฒน์", "แม่", "พ่อ", "น้องมิน"].map((item) => <Button key={item} onClick={() => setOwner(item)} className={`rounded-full px-3 py-2 text-[10px] font-medium ${owner === item ? "bg-sky-700 text-white" : "bg-slate-100 text-slate-500"}`}>{item}</Button>)}</div>
          </Field>
          <Field label="หมายเหตุ" hint="ไม่บังคับ"><Input value={note} onChange={setNote} placeholder="รายละเอียด ร้านค้าที่สนใจ หรือสิ่งที่ต้องตรวจสอบ" /></Field>
        </section>
        <Button onClick={name && budget ? onSave : undefined} className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold ${name && budget ? "bg-sky-700 text-white shadow-lg shadow-sky-200" : "cursor-not-allowed bg-slate-200 text-slate-400"}`}><Icon name="plus" className="size-5" /> เพิ่มแผนใน {quarter}</Button>
      </main>
    </div>
  );
}

function AddExpensePage({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("2025-05-30");
  const [category, setCategory] = useState("ของใช้ในบ้าน");
  const [payment, setPayment] = useState("โอนเงิน");
  const [related, setRelated] = useState("ไม่ผูกกับแผน");
  const [note, setNote] = useState("");
  const difference = 2550 - Number(amount || 0);

  return (
    <div className="min-h-screen pb-8">
      <SecondaryHeader title="บันทึกค่าใช้จ่าย" onBack={onBack} />
      <main className="px-4 pt-5 sm:px-6">
        <section className="rounded-3xl bg-slate-800 p-5 text-white">
          <p className="text-xs text-slate-400">งบเดือนพฤษภาคม</p><div className="mt-1 flex items-end justify-between"><p className="text-2xl font-bold">฿2,550</p><p className="text-[10px] text-slate-400">ชำระแล้ว ฿3,120</p></div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-full rounded-full bg-rose-400" /></div>
          <p className="mt-2 text-[10px] font-medium text-rose-300">ปัจจุบันเกินงบ ฿570</p>
        </section>
        <section className="mt-4 space-y-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <Field label="จำนวนเงิน" hint="บาท"><Input value={amount} onChange={setAmount} type="number" placeholder="0.00" /></Field>
          {amount && <div className={`rounded-2xl p-3 text-xs font-semibold ${difference >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{difference >= 0 ? `ต่ำกว่างบเดือนนี้ ฿${difference.toLocaleString()}` : `ยอดนี้สูงกว่างบเดือน ฿${Math.abs(difference).toLocaleString()}`}</div>}
          <Field label="วันที่ชำระ"><Input value={date} onChange={setDate} type="date" /></Field>
          <Field label="หมวดหมู่">
            <div className="flex flex-wrap gap-2">{["ของใช้ในบ้าน", "อาหาร", "เดินทาง", "สมาชิก", "อื่น ๆ"].map((item) => <Button key={item} onClick={() => setCategory(item)} className={`rounded-full px-3 py-2 text-[10px] font-medium ${category === item ? "bg-sky-700 text-white" : "bg-slate-100 text-slate-500"}`}>{item}</Button>)}</div>
          </Field>
          <Field label="ช่องทางชำระ">
            <div className="grid grid-cols-3 gap-2">{["โอนเงิน", "บัตรเครดิต", "เงินสด"].map((item) => <Button key={item} onClick={() => setPayment(item)} className={`rounded-xl py-2.5 text-[10px] font-semibold ${payment === item ? "bg-violet-50 text-violet-700 ring-1 ring-violet-300" : "bg-slate-50 text-slate-500 ring-1 ring-slate-200"}`}>{item}</Button>)}</div>
          </Field>
          <Field label="ผูกกับรายการในแผน">
            <div className="space-y-2">{["ไม่ผูกกับแผน", "เครื่องฟอกอากาศ", "ต่อประกันเครื่องชงกาแฟ"].map((item) => <Button key={item} onClick={() => setRelated(item)} className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-xs ${related === item ? "bg-sky-50 font-semibold text-sky-700 ring-1 ring-sky-300" : "bg-slate-50 text-slate-500 ring-1 ring-slate-200"}`}><span>{item}</span>{related === item && <Icon name="check" className="size-4" />}</Button>)}</div>
          </Field>
          <Field label="หมายเหตุ"><Input value={note} onChange={setNote} placeholder="เช่น ซื้อของใช้ประจำบ้านที่ HomePro" /></Field>
        </section>
        <Button onClick={amount ? onSave : undefined} className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold ${amount ? "bg-sky-700 text-white shadow-lg shadow-sky-200" : "cursor-not-allowed bg-slate-200 text-slate-400"}`}><Icon name="check" className="size-5" /> บันทึกค่าใช้จ่าย</Button>
      </main>
    </div>
  );
}

function SubscriptionsPage({ onBack, notify }: { onBack: () => void; notify: (message: string) => void }) {
  const [frequency, setFrequency] = useState<"monthly" | "yearly">("monthly");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [due, setDue] = useState("12");
  const monthly = [
    { name: "YouTube Premium", detail: "ทุกวันที่ 12 · บัตร KBank", price: "฿179", icon: "card" as IconName, tone: "bg-rose-100 text-rose-700", status: "อีก 3 วัน" },
    { name: "อินเทอร์เน็ตบ้าน", detail: "ทุกวันที่ 18 · AIS Fibre", price: "฿699", icon: "home" as IconName, tone: "bg-sky-100 text-sky-700", status: "อีก 9 วัน" },
    { name: "แพ็กเกจโทรศัพท์", detail: "ทุกวันที่ 25 · ชำระอัตโนมัติ", price: "฿340", icon: "phone" as IconName, tone: "bg-emerald-100 text-emerald-700", status: "อีก 16 วัน" },
  ];
  const yearly = [
    { name: "ภาษีรถยนต์", detail: "18 ส.ค. 2568 · รถครอบครัว", price: "฿3,200", icon: "receipt" as IconName, tone: "bg-amber-100 text-amber-700", status: "อีก 70 วัน" },
    { name: "ประกันรถยนต์", detail: "3 พ.ย. 2568 · ชั้น 1", price: "฿6,900", icon: "shield" as IconName, tone: "bg-violet-100 text-violet-700", status: "อีก 147 วัน" },
  ];
  const items = frequency === "monthly" ? monthly : yearly;

  return (
    <div className="min-h-screen pb-8">
      <SecondaryHeader title="รายการชำระประจำ" onBack={onBack} action={<Button onClick={() => setShowForm(!showForm)} ariaLabel="เพิ่มรายการชำระประจำ" className="flex size-10 items-center justify-center rounded-full bg-sky-700 text-white"><Icon name="plus" className="size-5" /></Button>} />
      <main className="px-4 pt-5 sm:px-6">
        <section className="rounded-3xl bg-gradient-to-br from-violet-700 to-sky-700 p-5 text-white shadow-lg shadow-violet-100">
          <p className="text-xs text-white/65">ภาระชำระประจำทั้งหมด</p><p className="mt-1 text-3xl font-bold">฿2,060<small className="ml-1 text-xs font-medium text-white/60">/เดือนเฉลี่ย</small></p>
          <div className="mt-5 grid grid-cols-2 divide-x divide-white/15 rounded-2xl bg-white/10 py-3"><div className="text-center"><p className="text-base font-bold">฿1,218</p><p className="mt-0.5 text-[9px] text-white/60">รายเดือน</p></div><div className="text-center"><p className="text-base font-bold">฿10,100</p><p className="mt-0.5 text-[9px] text-white/60">รายปี</p></div></div>
        </section>

        <div className="mt-5 grid grid-cols-2 rounded-2xl bg-slate-200 p-1">
          <Button onClick={() => setFrequency("monthly")} className={`rounded-xl py-2.5 text-xs font-semibold ${frequency === "monthly" ? "bg-white text-sky-700 shadow-sm" : "text-slate-500"}`}>รายเดือน · 3</Button>
          <Button onClick={() => setFrequency("yearly")} className={`rounded-xl py-2.5 text-xs font-semibold ${frequency === "yearly" ? "bg-white text-sky-700 shadow-sm" : "text-slate-500"}`}>รายปี · 2</Button>
        </div>

        {showForm && (
          <section className="mt-4 space-y-4 rounded-3xl border border-sky-200 bg-white p-4 shadow-sm">
            <div><Heading level={2} className="text-sm font-bold">เพิ่มรายการชำระประจำ</Heading><p className="mt-1 text-[10px] text-slate-400">ระบบจะแจ้งเตือนก่อนถึงกำหนด 3 วัน</p></div>
            <Field label="ชื่อรายการ"><Input value={name} onChange={setName} placeholder="เช่น Netflix หรือประกันบ้าน" /></Field>
            <div className="grid grid-cols-2 gap-3"><Field label="ยอดชำระ"><Input value={amount} onChange={setAmount} type="number" placeholder="0.00" /></Field><Field label={frequency === "monthly" ? "วันที่ชำระ" : "วันที่ครบกำหนด"}><Input value={due} onChange={setDue} type="number" placeholder="12" /></Field></div>
            <Button onClick={name && amount ? () => { notify(`เพิ่ม ${name} ในรายการชำระประจำแล้ว`); setShowForm(false); setName(""); setAmount(""); } : undefined} className={`w-full rounded-xl py-3 text-xs font-semibold ${name && amount ? "bg-sky-700 text-white" : "bg-slate-100 text-slate-400"}`}>บันทึกรายการ</Button>
          </section>
        )}

        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between"><Heading level={2} className="text-base font-bold">{frequency === "monthly" ? "ชำระทุกเดือน" : "ชำระทุกปี"}</Heading><span className="text-[10px] text-slate-400">แจ้งเตือนอัตโนมัติ</span></div>
          <div className="space-y-2.5">
            {items.map((item) => <Button key={item.name} onClick={() => notify(`เปิดรายละเอียด ${item.name}`)} className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm"><span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${item.tone}`}><Icon name={item.icon} className="size-5" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{item.name}</span><span className="mt-1 block truncate text-[10px] text-slate-400">{item.detail}</span></span><span className="text-right"><span className="block text-xs font-bold">{item.price}</span><span className="mt-1 block text-[9px] text-amber-600">{item.status}</span></span></Button>)}
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-sky-100 bg-sky-50 p-4">
          <div className="flex gap-3"><Icon name="bell" className="mt-0.5 size-5 shrink-0 text-sky-700" /><div><p className="text-sm font-semibold text-sky-900">ไม่พลาดทุกกำหนดชำระ</p><p className="mt-1 text-[10px] leading-5 text-sky-700">Keeply จะแจ้งเตือนล่วงหน้า 3 วัน และนำยอดที่ชำระแล้วไปรวมในค่าใช้จ่ายของเดือนให้อัตโนมัติ</p></div></div>
        </section>
      </main>
    </div>
  );
}

function EditProfilePage({ profile, onBack, onSave }: { profile: { name: string; email: string; phone: string; birthday: string; bio: string }; onBack: () => void; onSave: (value: { name: string; email: string; phone: string; birthday: string; bio: string }) => void }) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [birthday, setBirthday] = useState(profile.birthday);
  const [bio, setBio] = useState(profile.bio);
  const [visibility, setVisibility] = useState("สมาชิกในบ้าน");

  return (
    <div className="min-h-screen pb-8">
      <SecondaryHeader title="แก้ไขโปรไฟล์" onBack={onBack} />
      <main className="px-4 pt-5 sm:px-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm">
          <div className="relative mx-auto w-fit">
            <div className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-sky-200 to-sky-100 text-3xl font-bold text-sky-800 ring-4 ring-sky-50">{name.trim().charAt(0) || "พ"}</div>
            <Button ariaLabel="เปลี่ยนรูปโปรไฟล์" className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-full bg-sky-700 text-white shadow-lg ring-4 ring-white"><Icon name="camera" className="size-4" /></Button>
          </div>
          <p className="mt-4 text-sm font-semibold">รูปโปรไฟล์</p>
          <p className="mt-1 text-[10px] text-slate-400">รองรับ JPG หรือ PNG ขนาดไม่เกิน 5 MB</p>
        </section>

        <section className="mt-4 space-y-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div><Heading level={2} className="text-base font-bold">ข้อมูลส่วนตัว</Heading><p className="mt-1 text-[10px] text-slate-400">ข้อมูลนี้ใช้แสดงกับสมาชิกภายในบ้าน</p></div>
          <Field label="ชื่อที่แสดง" hint="จำเป็น"><Input value={name} onChange={setName} placeholder="ชื่อของคุณ" /></Field>
          <Field label="อีเมล"><Input value={email} onChange={setEmail} type="email" placeholder="name@example.com" /></Field>
          <Field label="เบอร์โทรศัพท์"><Input value={phone} onChange={setPhone} type="tel" placeholder="08x-xxx-xxxx" /></Field>
          <Field label="วันเกิด"><Input value={birthday} onChange={setBirthday} type="date" /></Field>
          <Field label="แนะนำตัว" hint={`${bio.length}/80`}><Input value={bio} onChange={(value) => setBio(value.slice(0, 80))} placeholder="เล่าเกี่ยวกับหน้าที่ของคุณในบ้าน" /></Field>
        </section>

        <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <Field label="การมองเห็นโปรไฟล์">
            <div className="space-y-2">
              {[
                ["สมาชิกในบ้าน", "ชื่อ รูป และกิจกรรมจะแสดงกับทุกคนในบ้าน"],
                ["เฉพาะผู้ดูแล", "ข้อมูลติดต่อจะแสดงกับเจ้าของบ้านเท่านั้น"],
              ].map(([label, detail]) => (
                <Button key={label} onClick={() => setVisibility(label)} className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left ring-1 ${visibility === label ? "bg-sky-50 ring-sky-300" : "bg-slate-50 ring-slate-200"}`}>
                  <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${visibility === label ? "border-sky-600 bg-sky-600 text-white" : "border-slate-300"}`}>{visibility === label && <Icon name="check" className="size-3" />}</span>
                  <span><span className="block text-xs font-semibold">{label}</span><span className="mt-0.5 block text-[9px] text-slate-400">{detail}</span></span>
                </Button>
              ))}
            </div>
          </Field>
        </section>

        <Button onClick={name.trim() && email.trim() ? () => onSave({ name, email, phone, birthday, bio }) : undefined} className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold ${name.trim() && email.trim() ? "bg-sky-700 text-white shadow-lg shadow-sky-200" : "cursor-not-allowed bg-slate-200 text-slate-400"}`}><Icon name="check" className="size-5" /> บันทึกการเปลี่ยนแปลง</Button>
      </main>
    </div>
  );
}

function LineLoginPage({ connected, profileName, onBack, onConnected, onDisconnected }: { connected: boolean; profileName: string; onBack: () => void; onConnected: () => void; onDisconnected: () => void }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [allowProfile, setAllowProfile] = useState(true);
  const [allowNotifications, setAllowNotifications] = useState(true);

  const connectLine = () => {
    const channelId = import.meta.env.VITE_LINE_CHANNEL_ID;
    const callbackUrl = import.meta.env.VITE_LINE_CALLBACK_URL;
    if (channelId && callbackUrl) {
      const state = crypto.randomUUID();
      sessionStorage.setItem("keeply_line_oauth_state", state);
      const authorizeUrl = new URL("https://access.line.me/oauth2/v2.1/authorize");
      authorizeUrl.searchParams.set("response_type", "code");
      authorizeUrl.searchParams.set("client_id", channelId);
      authorizeUrl.searchParams.set("redirect_uri", callbackUrl);
      authorizeUrl.searchParams.set("state", state);
      authorizeUrl.searchParams.set("scope", "profile openid email");
      window.location.assign(authorizeUrl.toString());
      return;
    }
    setIsConnecting(true);
    window.setTimeout(() => {
      setIsConnecting(false);
      onConnected();
    }, 900);
  };

  return (
    <div className="min-h-screen pb-8">
      <SecondaryHeader title="เชื่อมต่อ LINE Login" onBack={onBack} />
      <main className="px-4 pt-5 sm:px-6">
        <section className="rounded-3xl bg-gradient-to-br from-emerald-500 to-green-500 p-6 text-center text-white shadow-lg shadow-emerald-100">
          <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-white text-xl font-black tracking-tight text-emerald-500 shadow-lg">LINE</div>
          <Heading level={1} className="mt-5 text-xl font-bold">{connected ? "เชื่อมต่อ LINE แล้ว" : "เข้าสู่ระบบด้วย LINE"}</Heading>
          <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-white/80">{connected ? `บัญชี LINE เชื่อมกับโปรไฟล์ ${profileName} และพร้อมรับการแจ้งเตือน` : "เชื่อมบัญชีเพื่อเข้าสู่ Keeply ได้เร็วขึ้น และรับการแจ้งเตือนค่าใช้จ่ายผ่าน LINE"}</p>
        </section>

        {connected ? (
          <>
            <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">พ</div><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{profileName}</p><p className="mt-0.5 text-[10px] text-slate-400">LINE ID · เชื่อมต่อเมื่อวันนี้</p></div><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[9px] font-semibold text-emerald-700">เชื่อมต่อแล้ว</span></div>
            </section>
            <section className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center gap-3 border-b border-slate-100 p-4"><Icon name="shield" className="size-5 text-sky-700" /><div><p className="text-xs font-semibold">เข้าสู่ระบบอย่างปลอดภัย</p><p className="mt-0.5 text-[9px] text-slate-400">ใช้ LINE ยืนยันตัวตนแทนรหัสผ่าน</p></div></div>
              <div className="flex items-center gap-3 p-4"><Icon name="bell" className="size-5 text-sky-700" /><div><p className="text-xs font-semibold">รับการแจ้งเตือนผ่าน LINE</p><p className="mt-0.5 text-[9px] text-slate-400">งบเกินกำหนด ค่างวด และรายการจากสมาชิก</p></div></div>
            </section>
            <Button onClick={onDisconnected} className="mt-5 w-full rounded-2xl border border-rose-200 bg-rose-50 py-3.5 text-sm font-semibold text-rose-600">ยกเลิกการเชื่อมต่อ LINE</Button>
          </>
        ) : (
          <>
            <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <Heading level={2} className="text-sm font-bold">ข้อมูลที่ Keeply ขอเข้าถึง</Heading>
              <p className="mt-1 text-[10px] text-slate-400">คุณสามารถเปลี่ยนสิทธิ์การแจ้งเตือนได้ภายหลัง</p>
              <div className="mt-4 space-y-3">
                <LinePermission icon="user" title="โปรไฟล์พื้นฐาน" detail="ชื่อ รูปโปรไฟล์ และอีเมล" active={allowProfile} toggle={() => setAllowProfile(!allowProfile)} />
                <LinePermission icon="bell" title="การแจ้งเตือนจาก Keeply" detail="แจ้งเตือนงบและรายการที่ใกล้ถึงกำหนด" active={allowNotifications} toggle={() => setAllowNotifications(!allowNotifications)} />
              </div>
            </section>
            <section className="mt-4 rounded-2xl border border-sky-100 bg-sky-50 p-4">
              <div className="flex gap-3"><Icon name="shield" className="mt-0.5 size-5 shrink-0 text-sky-700" /><p className="text-[10px] leading-5 text-sky-700">Keeply จะไม่เห็นรหัสผ่าน LINE และจะใช้ข้อมูลตามสิทธิ์ที่คุณอนุญาตเท่านั้น คุณสามารถยกเลิกการเชื่อมต่อได้ทุกเมื่อ</p></div>
            </section>
            <Button onClick={allowProfile && !isConnecting ? connectLine : undefined} className={`mt-5 flex w-full items-center justify-center gap-3 rounded-2xl py-3.5 text-sm font-bold ${allowProfile ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" : "cursor-not-allowed bg-slate-200 text-slate-400"}`}>
              <span className="flex size-6 items-center justify-center rounded-md bg-white text-[8px] font-black text-emerald-500">LINE</span>
              {isConnecting ? "กำลังเชื่อมต่อ..." : "เข้าสู่ระบบด้วย LINE"}
            </Button>
            {!import.meta.env.VITE_LINE_CHANNEL_ID && <p className="mt-3 text-center text-[9px] leading-4 text-slate-400">ขณะนี้เป็นโหมดตัวอย่างสำหรับตรวจสอบหน้าจอ · การใช้งานจริงต้องกำหนด LINE Channel ID และ Callback URL</p>}
          </>
        )}
      </main>
    </div>
  );
}

function LinePermission({ icon, title, detail, active, toggle }: { icon: IconName; title: string; detail: string; active: boolean; toggle: () => void }) {
  return <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"><div className="flex size-10 items-center justify-center rounded-xl bg-white text-slate-600"><Icon name={icon} className="size-5" /></div><div className="min-w-0 flex-1"><p className="text-xs font-semibold">{title}</p><p className="mt-0.5 text-[9px] text-slate-400">{detail}</p></div><Button onClick={toggle} ariaLabel={title} className={`relative h-7 w-12 rounded-full transition ${active ? "bg-emerald-500" : "bg-slate-300"}`}><span className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${active ? "left-6" : "left-1"}`} /></Button></div>;
}

function ProfilePage({ profile, lineConnected, onBack, openEdit, openLine, openSettings, notify }: { profile: { name: string; email: string; phone: string; birthday: string; bio: string }; lineConnected: boolean; onBack: () => void; openEdit: () => void; openLine: () => void; openSettings: () => void; notify: (message: string) => void }) {
  return (
    <div className="min-h-screen pb-8">
      <SecondaryHeader title="โปรไฟล์สมาชิก" onBack={onBack} action={<Button onClick={openSettings} ariaLabel="ตั้งค่า" className="flex size-10 items-center justify-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200"><Icon name="settings" className="size-5" /></Button>} />
      <main className="px-4 pt-5 sm:px-6">
        <section className="rounded-3xl bg-gradient-to-br from-sky-700 to-sky-600 p-6 text-center text-white shadow-lg shadow-sky-200">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-sky-200 text-2xl font-bold text-sky-800 ring-4 ring-white/20">{profile.name.charAt(0) || "พ"}</div>
          <Heading level={2} className="mt-4 text-xl font-bold">{profile.name}</Heading>
          <p className="mt-1 text-xs text-sky-200">เจ้าของบ้าน · ผู้ดูแลระบบ</p>
          <Button onClick={openEdit} className="mt-5 rounded-xl bg-white/15 px-4 py-2 text-xs font-semibold">แก้ไขโปรไฟล์</Button>
        </section>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[["8", "สิ่งของ"], ["6", "รายการที่เพิ่ม"], ["฿8,240", "มูลค่ารวม"]].map(([value, label]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-3 text-center"><p className="text-base font-bold">{value}</p><p className="mt-1 text-[9px] text-slate-400">{label}</p></div>)}
        </div>
        <section className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <ProfileRow icon="user" title="ข้อมูลส่วนตัว" detail={`${profile.email} · ${profile.phone}`} onClick={openEdit} />
          <ProfileRow icon="user" title="LINE Login" detail={lineConnected ? "เชื่อมต่อแล้ว · รับการแจ้งเตือนผ่าน LINE" : "ยังไม่ได้เชื่อมต่อบัญชี LINE"} onClick={openLine} />
          <ProfileRow icon="shield" title="บทบาทในบ้าน" detail="เจ้าของบ้าน · จัดการได้ทั้งหมด" onClick={() => notify("เปิดรายละเอียดสิทธิ์")} />
          <ProfileRow icon="settings" title="การตั้งค่า" detail="การแจ้งเตือน ความเป็นส่วนตัว" onClick={openSettings} last />
        </section>
        <Button onClick={() => notify("ยังไม่ได้ออกจากระบบในตัวอย่างนี้")} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 py-3 text-sm font-semibold text-rose-600"><Icon name="logout" className="size-5" /> ออกจากระบบ</Button>
      </main>
    </div>
  );
}

function ProfileRow({ icon, title, detail, onClick, last }: { icon: IconName; title: string; detail: string; onClick: () => void; last?: boolean }) {
  return <Button onClick={onClick} className={`flex w-full items-center gap-3 p-4 text-left ${last ? "" : "border-b border-slate-100"}`}><div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Icon name={icon} className="size-5" /></div><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{title}</p><p className="mt-0.5 text-[10px] text-slate-400">{detail}</p></div><Icon name="chevron" className="size-4 text-slate-300" /></Button>;
}

function SettingsPage({ onBack, notify }: { onBack: () => void; notify: (message: string) => void }) {
  const [notifications, setNotifications] = useState(true);
  const [installments, setInstallments] = useState(true);
  const [approval, setApproval] = useState(true);
  return (
    <div className="min-h-screen pb-8">
      <SecondaryHeader title="การตั้งค่า" onBack={onBack} />
      <main className="px-4 pt-5 sm:px-6">
        <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">การแจ้งเตือน</p>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <SettingToggle icon="bell" title="การแจ้งเตือนทั่วไป" detail="กิจกรรมและรายการใหม่ในบ้าน" active={notifications} toggle={() => setNotifications(!notifications)} />
          <SettingToggle icon="card" title="เตือนวันชำระค่างวด" detail="แจ้งล่วงหน้า 3 วัน" active={installments} toggle={() => setInstallments(!installments)} last />
        </section>
        <p className="mb-2 mt-5 px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">การจัดการบ้าน</p>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <SettingToggle icon="shield" title="อนุมัติสินค้าราคาสูง" detail="รายการมูลค่าเกิน ฿3,000" active={approval} toggle={() => setApproval(!approval)} />
          <ProfileRow icon="users" title="จัดการสมาชิก" detail="4 สมาชิก · 1 ผู้ดูแล" onClick={() => notify("กลับไปจัดการที่หน้าสมาชิกได้")} />
          <ProfileRow icon="tag" title="จัดการหมวดหมู่" detail="4 หมวดหมู่ที่ใช้งาน" onClick={() => notify("เปิดการจัดการหมวดหมู่")} last />
        </section>
        <p className="mb-2 mt-5 px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">ข้อมูลและความเป็นส่วนตัว</p>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <ProfileRow icon="receipt" title="ส่งออกข้อมูล" detail="ดาวน์โหลดเป็น CSV หรือ PDF" onClick={() => notify("กำลังเตรียมไฟล์ข้อมูล")} />
          <ProfileRow icon="shield" title="ความเป็นส่วนตัว" detail="การเข้าถึงและความปลอดภัย" onClick={() => notify("เปิดการตั้งค่าความเป็นส่วนตัว")} last />
        </section>
        <p className="mt-6 text-center text-[10px] text-slate-400">KEEPly เวอร์ชัน 1.0.0</p>
      </main>
    </div>
  );
}

function SettingToggle({ icon, title, detail, active, toggle, last }: { icon: IconName; title: string; detail: string; active: boolean; toggle: () => void; last?: boolean }) {
  return <div className={`flex items-center gap-3 p-4 ${last ? "" : "border-b border-slate-100"}`}><div className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700"><Icon name={icon} className="size-5" /></div><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{title}</p><p className="mt-0.5 text-[10px] text-slate-400">{detail}</p></div><Button onClick={toggle} ariaLabel={title} className={`relative h-7 w-12 rounded-full transition ${active ? "bg-sky-600" : "bg-slate-300"}`}><span className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${active ? "left-6" : "left-1"}`} /></Button></div>;
}

function ProductDetail({ onBack, notify }: { onBack: () => void; notify: (message: string) => void }) {
  return (
    <div className="min-h-screen pb-8">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/70 bg-slate-50/95 px-4 py-3 backdrop-blur">
        <Button onClick={onBack} ariaLabel="ย้อนกลับ" className="flex size-10 items-center justify-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200"><Icon name="back" className="size-5" /></Button>
        <Heading level={1} className="text-base font-bold">รายละเอียดสิ่งของ</Heading>
        <Button onClick={() => notify("เปิดเมนูจัดการสินค้า")} ariaLabel="เมนูเพิ่มเติม" className="flex size-10 items-center justify-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200"><Icon name="more" className="size-5" /></Button>
      </header>

      <main className="px-4 pt-4 sm:px-6">
        <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="relative flex h-52 items-center justify-center bg-gradient-to-br from-sky-100 to-slate-100">
            <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1.5 text-[10px] font-semibold text-sky-700 backdrop-blur">อิเล็กทรอนิกส์</div>
            <Icon name="phone" className="size-24 text-sky-700/60" />
            <Button onClick={() => notify("พร้อมเพิ่มรูปสินค้า")} ariaLabel="เพิ่มรูปสินค้า" className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full bg-white text-slate-600 shadow"><Icon name="camera" className="size-5" /></Button>
          </div>
          <div className="p-5"><div className="flex items-start justify-between gap-4"><div><Heading level={2} className="text-xl font-bold">ขาตั้งโทรศัพท์</Heading><p className="mt-1 text-xs text-slate-400">เพิ่มโดย พีรพัฒน์</p></div><span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-semibold text-emerald-700">กำลังใช้งาน</span></div></div>
        </section>

        <section className="mt-4 rounded-3xl bg-slate-800 p-5 text-white">
          <div className="flex items-end justify-between"><div><p className="text-xs text-slate-400">มูลค่าปัจจุบัน</p><p className="mt-1 text-3xl font-bold">฿284</p></div><div className="text-right"><p className="text-sm font-semibold text-sky-200">฿0.68 / วัน</p><p className="mt-1 text-[10px] text-slate-400">ใช้งานมา 10 เดือน</p></div></div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[57%] rounded-full bg-sky-300" /></div>
          <div className="mt-2 flex justify-between text-[10px] text-slate-400"><span>ราคาซื้อ ฿500</span><span>คุ้มค่าแล้ว 57%</span></div>
        </section>

        <section className="mt-5">
          <Heading level={2} className="mb-3 text-base font-bold">ข้อมูลการซื้อ</Heading>
          <div className="grid grid-cols-2 gap-3">
            <InfoCard icon="calendar" label="ซื้อเมื่อ" value="24 พ.ค. 2568" />
            <InfoCard icon="store" label="ช่องทาง" value="Shopee" note="ร้าน Gadget Haus" />
            <InfoCard icon="wallet" label="ผู้ชำระ" value="พีรพัฒน์" note="บัญชีส่วนตัว" />
            <InfoCard icon="card" label="วิธีชำระ" value="ผ่อน 0% · 10 เดือน" note="บัตรเครดิต KBank" />
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><Icon name="card" className="size-5" /></div><div><p className="text-sm font-semibold">สถานะการผ่อนชำระ</p><p className="mt-0.5 text-[11px] text-slate-400">ชำระแล้ว 3 จาก 10 งวด</p></div></div><p className="text-sm font-bold">฿50/เดือน</p></div>
          <div className="mt-4 flex gap-1.5">{Array.from({ length: 10 }).map((_, index) => <span key={index} className={`h-2 flex-1 rounded-full ${index < 3 ? "bg-violet-500" : "bg-slate-100"}`} />)}</div>
          <div className="mt-3 flex justify-between text-[10px] text-slate-400"><span>ชำระแล้ว ฿150</span><span>คงเหลือ ฿350</span></div>
        </section>

        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><Icon name="receipt" className="size-5" /></div><div><p className="text-sm font-semibold">หลักฐานการซื้อ</p><p className="mt-0.5 text-[11px] text-slate-400">ใบเสร็จ Shopee · PDF</p></div></div><Button onClick={() => notify("เปิดดูใบเสร็จแล้ว")} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">ดูเอกสาร</Button></div>
        </section>

        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between"><div><p className="text-sm font-semibold">อายุการใช้งานที่ตั้งไว้</p><p className="mt-1 text-[11px] text-slate-400">2 ปี · ครบกำหนด 24 พ.ค. 2570</p></div><span className="rounded-full bg-sky-100 px-3 py-1.5 text-[10px] font-semibold text-sky-700">เหลือ 1 ปี 2 เดือน</span></div>
        </section>

        <Button onClick={() => notify("บันทึกการใช้งานวันนี้แล้ว")} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-200"><Icon name="check" className="size-5" /> บันทึกว่าใช้งานวันนี้</Button>
      </main>
    </div>
  );
}

function InfoCard({ icon, label, value, note }: { icon: IconName; label: string; value: string; note?: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-3.5"><Icon name={icon} className="size-5 text-sky-700" /><p className="mt-3 text-[10px] text-slate-400">{label}</p><p className="mt-0.5 text-xs font-semibold">{value}</p>{note && <p className="mt-0.5 truncate text-[9px] text-slate-400">{note}</p>}</div>;
}

function BottomNav({ page, setPage }: { page: Page; setPage: (page: Page) => void }) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-3xl -translate-x-1/2 items-center justify-around border-t border-slate-200 bg-white/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      {tabs.map((tab) => <Button key={tab.id} onClick={() => { setPage(tab.id); window.scrollTo({ top: 0, behavior: "smooth" }); }} className={`relative flex min-w-16 flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-medium ${page === tab.id ? "text-sky-700" : "text-slate-400"}`}><Icon name={tab.icon} className="size-5" /><span>{tab.label}</span>{page === tab.id && <span className="absolute -top-2 h-0.5 w-6 rounded-full bg-sky-600" />}</Button>)}
    </nav>
  );
}
