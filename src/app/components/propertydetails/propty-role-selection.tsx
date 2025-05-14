'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ProptyChainRoleSelection() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();

  // Map UI roles to backend roles
  const roleMapping: Record<string, string> = {
    seeker: 'user',
    verifier: 'verifier',
    owner: 'owner',
    agent: 'agent',
  };

  const handleSave = () => {
    if (selectedRole) {
      // Map the selected UI role to the backend role
      const backendRole = roleMapping[selectedRole];

      // Store the role in localStorage
      localStorage.setItem('userRole', backendRole);

      console.log(`Selected role: ${backendRole}`);

      // Redirect to registration page
      router.push('/propty-registration');
    }
  };

  const roles = [
    {
      id: 'seeker',
      title: 'Seeker',
      description: 'I want to find, rent, or buy property.',
      imagePath: '/property-image/seeker.png',
      color: 'text-cyan-400',
    },
    {
      id: 'verifier',
      title: 'Verifier',
      description: 'I help maintain trust by securely verifying properties.',
      imagePath: '/property-image/Checked Identification Documents.png',
      color: 'text-cyan-400',
    },
    {
      id: 'owner',
      title: 'Owner',
      description: 'I want to list and sell/rent my property.',
      imagePath: '/property-image/Frame-owner.png',
      color: 'text-cyan-400',
    },
    {
      id: 'agent',
      title: 'Agent',
      description: 'I help clients',
      imagePath: '/property-image/Frame-agent.png',
      color: 'text-cyan-400',
    },
  ];

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#1a0e2e] bg-gradient-to-br from-[#1a0e2e] to-[#2a1a3e] p-4'>
      <div className='w-full max-w-4xl border border-blue-500/30 rounded-lg p-8 bg-[#1a0e2e]/60 backdrop-blur-md'>
        <h1 className='text-2xl font-semibold text-white text-center mb-10'>
          Who Are You on ProptyChain?
        </h1>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 relative'>
          {/* Vertical divider */}
          <div className='hidden md:block absolute left-1/2 top-1/4 bottom-1/4 w-px bg-blue-500/30'></div>

          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`
                relative p-5 rounded-lg cursor-pointer transition-all
                ${
                  selectedRole === role.id
                    ? 'bg-[#2a1a3e] border-2 border-blue-500/50'
                    : 'bg-[#1f1429] border border-[#ffffff10] hover:border-[#ffffff30]'
                }
              `}
            >
              <div className='flex flex-col items-center text-center gap-2'>
                <div className='mb-2'>
                  <Image
                    src={role.imagePath || '/placeholder.svg'}
                    alt={`${role.title} icon`}
                    width={32}
                    height={32}
                    className='mx-auto'
                  />
                </div>
                <h3 className={`font-medium ${role.color}`}>{role.title}</h3>
                <p className='text-sm text-gray-400'>{role.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={!selectedRole}
          className='w-full py-2.5 text-white font-medium bg-gradient-to-r from-blue-500 to-purple-500 rounded-md hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#1a0e2e] disabled:opacity-70 disabled:cursor-not-allowed transition-all border border-[#ffffff20] hover:bg-[#2a1a3e]'
        >
          Continue To Register
        </button>

        <p className='text-sm text-gray-400 text-center mt-4'>
          You can update your profile role later in your dashboard settings.
        </p>
      </div>
    </div>
  );
}
