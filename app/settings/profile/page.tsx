'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { nameRegex } from '@/lib/contant';
import { MemberService } from '@/services/MemberService';

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [validName, setValidName] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const _name = localStorage.getItem('name');
    if (_name) setName(_name);
    const _email = localStorage.getItem('email');
    if (_email) setEmail(_email);
  }, []);

  useEffect(() => {
    setValidName(nameRegex.test(name));
  }, [name]);

  const save = async () => {
    if (!name) {
      alert("Please enter your name.");
      return;
    }
    localStorage.setItem('name', name);
    const result = await new MemberService().updateName(email, name);
    if (result) {
      alert("Profile updated successfully!");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      save();
    }
  };

  return (
    <div>
      <div className="text-xl font-medium text-zinc-950 border-b border-zinc-200 pb-2 mb-4">
        Profile
      </div>
      <div className="p-3">
        <div>
          <div className="text-sm font-medium text-zinc-950 mb-1 px-1">Name</div>
          <div className="text-xs text-zinc-600 mb-2 px-1">
            The name associated with your account.
          </div>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 border border-zinc-300 rounded text-xs text-zinc-950 focus:outline-none focus:border-blue-500"
            placeholder="Enter your name"
          />
          {!validName && (
            <div className="flex items-center px-2 pt-2">
              <Image src="/images/icon/warning-small.png" width={16} height={16} alt="warning-small" />
              <div className="text-xs ms-2 text-[#E1594C]">
                Please enter your name (e.g., John Doe) using at least 5 characters.
              </div>
            </div>
          )}
        </div>
        <div className="mt-4">
          <div className="text-sm font-medium text-zinc-950 mb-1 px-1">Email address</div>
          <div className="text-xs text-zinc-600 mb-2 px-1">
            The email address associated with your account.
          </div>
          <input
            type="text"
            value={email}
            className="w-full px-3 border border-zinc-300 rounded text-xs text-gray-400 focus:outline-none focus:border-blue-500"
            placeholder="Enter your email"
            disabled
          />
        </div>
        <button
          className="w-[100px] h-8 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors mt-4"
          onClick={save}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;