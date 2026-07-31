import { useState } from "react";
import type { Settings } from "../types";
import Select from "@/shared/components/form/Select";
import { Button } from "@/shared/components/form/Button";
import { useSettingsStore } from "../store/useSettingsStore";

export function SaveSettings({ settings }: { settings: Settings }) {
    const updateSettings = useSettingsStore((state) => state.updateSettings);
    const [timezone, setTimezone] = useState(settings?.timezone || "Europe/Berlin");
    const [notificationTime, setNotificationTime] = useState(
        settings?.notificationTime || "07:00"
    );
    console.log("timezone", timezone);
    console.log("notificationTime", notificationTime);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const isInvalid = !timezone || !notificationTime;
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await updateSettings({ timezone, notificationTime });
        setIsSubmitting(false);
    }
    return (
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <Select
                label="Timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
            >
                <option value="">Select timezone</option>
                <option value="Europe/Berlin">Europe/Berlin</option>
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="America/New_York">America/New_York</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
            </Select>
            <Select
                label="Notification Time"
                value={notificationTime}
                onChange={(e) => setNotificationTime(e.target.value)}
            >
                <option value="">Select notification time</option>
                <option value="07:00">07:00</option>
                <option value="08:00">08:00</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
            </Select>

            <Button type="submit" disabled={isInvalid} loading={isSubmitting}>
                {isSubmitting ? "Updating Settings..." : "Update Settings"}
            </Button>
        </form>
    );
}
