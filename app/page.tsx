import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { monsieur_La_Doulaise } from './ui/fonts';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6 background">
      <div className="flex h-15 shrink-0 items-end rounded-lg p-4 md:h-15 flex-row flex-wrap justify-between w-full md:w-8/12 mx-auto">
        <AcmeLogo />

        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 p-1">
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
      </div>
    </main>
  );
}
