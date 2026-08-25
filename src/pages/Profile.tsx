import { useState, type ComponentType } from "react";
import ProfileHeader from "../features/profile/components/ProfileHeader";
import ProfileTabsNav from "../features/profile/components/ProfileTabsNav";
import AccountTab from "../features/profile/components/tabs/AccountTab";
import SecurityTab from "../features/profile/components/tabs/SecurityTab";
import NotificationsTab from "../features/profile/components/tabs/NotificationsTab";
import AppearanceTab from "../features/profile/components/tabs/AppearanceTab";
import FinancialProfileTab from "../features/profile/components/tabs/FinancialProfileTab";
import ProgressTab from "../features/profile/components/tabs/ProgressTab";
import PrivacyTab from "../features/profile/components/tabs/PrivacyTab";
import DangerTab from "../features/profile/components/tabs/DangerTab";
import type { ProfileTabId } from "../features/profile/types";

const TAB_CONTENT: Record<ProfileTabId, ComponentType> = {
  conta: AccountTab,
  seguranca: SecurityTab,
  notificacoes: NotificationsTab,
  aparencia: AppearanceTab,
  financeiro: FinancialProfileTab,
  jornada: ProgressTab,
  privacidade: PrivacyTab,
  perigo: DangerTab,
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState<ProfileTabId>("conta");
  const ActiveTabContent = TAB_CONTENT[activeTab];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      <ProfileHeader onEditClick={() => setActiveTab("conta")} />

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <ProfileTabsNav active={activeTab} onChange={setActiveTab} />
        <div className="flex-1 min-w-0">
          <ActiveTabContent />
        </div>
      </div>
    </div>
  );
}
