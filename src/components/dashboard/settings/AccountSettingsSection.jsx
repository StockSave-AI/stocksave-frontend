import { FaUser } from "react-icons/fa";
import SectionCard from "./SectionCard";
import { useLang } from "./languageContext";

export default function AccountSettingsSection() {
  const { lang, setLang, t } = useLang();

  return (
    <SectionCard icon={<FaUser />} title={t("accountSettings")}>
      <div className="grid md:grid-cols-2 gap-4">
        <select
          className="input"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="en">{t("language")}: English</option>
          <option value="es">{t("language")}: Español</option>
          <option value="fr">{t("language")}: Français</option>
          <option value="yo">{t("language")}: Yorùbá</option>
        </select>

        <select className="input">
          <option>{t("timeZone")}</option>
        </select>
      </div>
    </SectionCard>
  );
}
