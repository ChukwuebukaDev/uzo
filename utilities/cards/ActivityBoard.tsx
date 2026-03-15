"use client";

interface Activity {
  id: string;
  text: string;
  time: string;
}

interface Props {
  activities: Activity[];
}

export default function ActivityBoard({ activities }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5">

      <h3 className="text-lg font-semibold mb-4">
        Recent Activity
      </h3>

      <div className="flex flex-col gap-3 max-h-72 overflow-y-auto">
        {activities.length === 0 ? (
          <span className="text-gray-500 text-sm">
            No activity yet
          </span>
        ) : (
          activities.map((a) => (
            <div
              key={a.id}
              className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="text-sm text-gray-800">
                {a.text}
              </div>
              <div className="text-xs text-gray-500">
                {a.time}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}