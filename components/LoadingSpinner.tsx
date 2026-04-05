export default function LoadingSpinner({ message = "問題を生成中..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
