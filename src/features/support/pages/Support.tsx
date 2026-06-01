import { FeedbackForm } from "@/shared/components/layout/FeedbackForm";
import ListLoading from "@/shared/components/ui/ListLoading";
import { PageHeader } from "@/shared/components/ui/PageHeader";
import { MessageCircleQuestionMarkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSupportStore } from "../store/useSupportStore";
import Pagination from "@/shared/components/ui/Pagination";
import CustomToast from "@/shared/components/ui/CustomToast";
import { feedbackTypeConfig } from "@/features/tasks/utils";
import { formatDate } from "@/shared/utils";

export default function Support() {

  const { feedbacks, getFeedbacks, loading, error, totalPages } = useSupportStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  if (error) {
    CustomToast("error", error);
  }
  useEffect(() => {
    getFeedbacks(currentPage, itemsPerPage);
  }, [getFeedbacks, currentPage, itemsPerPage]);

  return (
    <div className="max-w-7xl mx-auto p-6 pb-0 h-screen flex flex-col gap-4 overflow-hidden">
      <PageHeader
        icon={
          <MessageCircleQuestionMarkIcon className="w-5 h-5 text-indigo-600" />
        }
        title="My Open Requests"
        description="Track your support requests and updates."
        subContent={<FeedbackForm />}
      />
      <section className="flex-1 pt-4 overflow-y-auto">
        <ListLoading
          isLoading={loading}
          items={feedbacks}
          gap="py-1"
          emptyMessage="No tasks found, Try adjusting filters or create a new task."
        >
          {(feedback) => {
            return (
              <div className="grid grid-cols-11 gap-4 bg-white border border-gray-200 rounded-lg p-4 items-center text-sm" key={feedback._id}>
                
                <p className="col-span-5 text-gray-800">{feedback.description}</p>
                <p className="col-span-1">
                  <span className={`px-2 py-1 rounded-lg uppercase font-bold tracking-wide ${feedback.status === "closed" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}>
                    {feedback.status}
                  </span> 
                </p>
                <div className="col-span-2">
                  <span
                    className={"w-3 h-3 rounded-full inline-block " + feedbackTypeConfig[feedback.feedbackType as keyof typeof feedbackTypeConfig].color}
                  >

                  </span>
                  <span className="ml-2">{feedbackTypeConfig[feedback.feedbackType as keyof typeof feedbackTypeConfig].label}</span>
                </div>
                <p className="col-span-1 text-gray-800 text-right">{formatDate(new Date(feedback.createdAt))}</p>

                <p className="col-span-2 text-gray-800">{feedback.comment || "--"}</p>
              </div>
            );
          }}
        </ListLoading>
      </section>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
