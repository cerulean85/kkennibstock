'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { useState } from "react";

const SignUpPage = () => {
  return (
    <div className="container mt-5">
      <h2 className="mb-4">회원가입</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            아이디
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="아이디를 입력하세요"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            이메일
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="이메일을 입력하세요"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            비밀번호
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            비밀번호 확인
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            placeholder="비밀번호를 다시 입력하세요"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;