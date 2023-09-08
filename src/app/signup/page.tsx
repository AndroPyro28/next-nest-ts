"use client";
import { Button } from "@/components/Button";
import InputBox from "@/components/InputBox";
import { mutate, query } from "@/hooks/useQueryProcessor";
import Link from "next/link";
import React, { useRef } from "react";



const SignupPage = () => {

    type FormInputs = {
        name: string;
        email: string;
        password: string;
      };

      type responseData = {
        id: number;
        name: string;
        email: string
      }

  const data = useRef<FormInputs>({
    name: "",
    email: "",
    password: "",
  });
  const signup = mutate<FormInputs, responseData>(`/auth/register`,'POST', ['register']);

  const handleSignup = () => {
    signup.mutate(data.current,{
        onSettled: (data) => {
            console.log(data)
        }
    })
  }

  return (
    <div className="m-2 border rounded overflow-hidden shadow">
      <div className="p-2 bg-gradient-to-b from-white to-slate-200 text-slate-600">
        Sign up
      </div>
      <div className="p-2 flex flex-col gap-6">
        <InputBox
          autoComplete="off"
          name="name"
          labelText="Name"
          required
          onChange={(e) => (data.current.name = e.target.value)}
        />
        <InputBox
          name="email"
          labelText="Email"
          required
          onChange={(e) => (data.current.email = e.target.value)}
        />
        <InputBox
          name="password"
          labelText="password"
          type="password"
          required
          onChange={(e) => (data.current.password = e.target.value)}
        />
        <div className="flex justify-center items-center gap-2">
          <Button onClick={handleSignup}>Submit</Button>
          <Link className="" href={"/"}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;