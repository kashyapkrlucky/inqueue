import { PageHeader } from "@/shared/components/ui/PageHeader";
import { TagsIcon } from "lucide-react";
import CreateLabel from "../components/CreateLabel";
import { useEffect } from "react";
import { useLabelStore } from "../store/useLabelStore";
import PageLoader from "@/shared/components/loaders/PageLoader";
import ListLoading from "@/shared/components/ui/ListLoading";
import LabelCard from "../components/LabelCard";

export default function Labels() {
  const { labelLoading, error, getLabels, labels } = useLabelStore();
  useEffect(() => {
    getLabels();
  }, [getLabels]);

  if (labelLoading) {
    return <PageLoader />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  return (
    <div className="max-w-7xl mx-auto p-6 pb-0 h-screen flex flex-col gap-4 overflow-hidden">
      <PageHeader
        icon={<TagsIcon className="w-5 h-5 text-indigo-600" />}
        title={`Task Labels`}
        description="Organize your tasks with custom labels for better tracking."
        subContent={<CreateLabel />}
      />

      <ListLoading isLoading={labelLoading} items={labels}>
        {(label) => <LabelCard label={label} />}
      </ListLoading>
    </div>
  );
}
