import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useSupportStore } from "@/features/support/store/useSupportStore";
import Textarea from "../form/Textarea";
import Modal from "../ui/Modal";
import { Button } from "../form/Button";
import Select from "../form/Select";
import { feedbackTypeConfig } from "@/features/tasks/utils";

export function FeedbackForm() {
  const [feedbackType, setFeedbackType] = useState("");
  const [description, setDescription] = useState("");
  const [isModalForm, setIsModalForm] = useState(false);
  const { addFeedback } = useSupportStore();

  const handleSubmit = () => {
    addFeedback({ feedbackType, description });
    setIsModalForm(false);
    setFeedbackType("");
    setDescription("");
  };

  return (
    <>
      <Button onClick={() => setIsModalForm(true)}>
        <PlusIcon className="w-6 h-6" />
        <span className="ml-2">Submit Request</span>
      </Button>

      <Modal
        title="Submit Your Feedback"
        isOpen={isModalForm}
        size="lg"
        onClose={() => setIsModalForm(false)}
        footer={
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!feedbackType || !description}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        }
      >
        <form className="space-y-4">
          <Select
            label="Feedback Type"
            value={feedbackType}
            onChange={(e) => setFeedbackType(e.target.value)}
            disabled={false}
            onClick={(e) => e.stopPropagation()}
            boxClassName="sm:col-span-3 flex flex-col gap-2"
          >
            {Object.entries(feedbackTypeConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </Select>
          <Textarea
            placeholder="Enter description"
            label="Description"
            value={description}
            rows={5}
            onChange={(e) => setDescription(e.target.value)}
          />
        </form>
      </Modal>
    </>
  );
}
