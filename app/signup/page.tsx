import AcmeLogo from '@/app/ui/acme-logo';
import SignUpForm from '../ui/signup-form';
import Link from 'next/link';
import { lusitana } from '../ui/fonts';

 
export default function SignUpPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-sky-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <SignUpForm />

        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <p className={`${lusitana.className} mb-3 text-lg`}>
            Already have an account? <span><Link href={'/login'} className='text-black text-xl'>Sign in</Link></span>
          </p>
        </div>
      </div>

    </main>
  );
}