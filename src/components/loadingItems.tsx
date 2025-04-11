import { LoadingAppList } from "@/components/list/appList";
import { LoadingPagination } from "@/components/pagination";

export default function LoadingItems() {
  return (
    <div>
      <div role="status" className="animate-pulse">
        <div className="flex bg-gray-800 px-8 py-4 mb-8 h-14"></div>

        <div className="px-7 max-[500px]:px-0">
          <LoadingAppList />
          <LoadingPagination/>
        </div>
      </div>
    </div>
  );
}