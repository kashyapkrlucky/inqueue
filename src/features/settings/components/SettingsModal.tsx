import { SettingsIcon } from "lucide-react";
import { useState } from "react";
import { useSettingsStore } from "../store/useSettingsStore";
import Select from "@/shared/components/form/Select";
import { Button } from "@/shared/components/form/Button";
import Modal from "@/shared/components/ui/Modal";

export const SettingsModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { settings, getSettings } = useSettingsStore();
    const updateSettings = useSettingsStore((state) => state.updateSettings);
    const [timezone, setTimezone] = useState(settings?.timezone || "Europe/Berlin");
    const [notificationTime, setNotificationTime] = useState(
        settings?.notificationTime || "07:00"
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isInvalid = !timezone || !notificationTime;
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await updateSettings({ timezone, notificationTime });
        setIsSubmitting(false);
        setIsOpen(false);
    }

    const openSettings = () => {
        setIsOpen(true);
        getSettings();
    };
    return (
        <>
            <button
                className="flex items-center justify-center p-2  rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 shadow-sm"
                onClick={openSettings}
                aria-label="Open settings"
            >
                <SettingsIcon />
            </button>

            <Modal
                title="Application Settings"
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    <Select
                        id="timezone"
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
                        id="notificationTime"
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
            </Modal>
        </>
    );
};