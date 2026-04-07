// components/PreviewBanner.tsx
// Visual indicator when viewing content in preview mode

import Link from 'next/link';
import { getPreviewSession } from '@/lib/wix-preview';
import { disablePreview } from '@/lib/preview-actions';

export async function PreviewBanner() {
  const session = await getPreviewSession();
  
  if (!session?.isActive) {
    return null;
  }

  const expiresIn = Math.ceil((session.expiresAt - Date.now()) / (1000 * 60 * 60)); // hours

  return (
    <div className="sticky top-0 z-50 w-full border-b-2 border-dashed border-yellow-500 bg-yellow-100 px-4 py-3 text-center">
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">👁️</span>
          <span className="font-semibold text-yellow-900">
            PREVIEW MODE
          </span>
          <span className="text-sm text-yellow-800">
            {session.editorName && `- ${session.editorName}`}
          </span>
        </div>
        
        <span className="text-xs text-yellow-700">
          (Expires in {expiresIn}h)
        </span>

        <div className="flex items-center gap-2">
          <Link
            href="/preview/dashboard"
            className="rounded bg-yellow-600 px-3 py-1 text-xs font-medium text-white hover:bg-yellow-700"
          >
            Preview Dashboard
          </Link>
          
          <form action={disablePreview}>
            <button
              type="submit"
              className="rounded border border-yellow-600 px-3 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-200"
            >
              Exit Preview
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
