export default function ServiceCard({icon, title, desc}) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex items-start gap-3">
        <div className="text-teal-600 text-2xl">{icon}</div>
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-500">{desc}</div>
        </div>
      </div>
    </div>
  );
}
