import { Page } from "@/lib/contant";
import { MemberService } from "@/services/MemberService";
import React, { useState, useRef, useEffect } from "react";

const ProfileComponent: React.FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [picture, setPicture] = useState("");

  // 바깥 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    const _email = localStorage.getItem("email");
    if (!_email) return;
    setEmail(_email);

    const _name = localStorage.getItem("name");
    if (!_name) return;
    setName(_name);

    const _picture = localStorage.getItem("picture");
    if (!_picture) return;
    setPicture(_picture);
  }, []);

  return (
    <div className="relative flex justify-center items-center" ref={ref}>
      <span
        role="presentation"
        className="
          flex justify-center items-center
          w-[28px] h-[28px]
          text-xs rounded-full
          cursor-pointer
        "
        onClick={() => setOpen(v => !v)}
      >
        <img
          src={picture ? picture : "/images/icon/profile.svg"}
          className="w-[28px] h-[28px] rounded-full"
          onError={e => {
            e.currentTarget.src = "/images/icon/profile.svg";
          }}
        />
      </span>
      {open && (
        <div className="absolute top-full mt-2 right-0 bg-white border rounded shadow z-50 min-w-[120px] p-2">
          <div className="px-4 py-2 text-sm font-medium">{name}</div>
          <div className="px-4 pt-2 pb-4 text-xs border-b *:border-gray-200">{email}</div>
          <div
            className="px-4 mt-2 py-2 cursor-pointer text-xs hover:bg-gray-100 rounded"
            onClick={() => {
              const serv = new MemberService();
              serv.logOut();
              window.location.href = "/" + Page.LogIn;
              setOpen(false);
            }}
          >
            Log Out
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
