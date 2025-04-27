"use client";

import { useAuth } from "@/contexts";
import { useEffect, useState } from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { redirect } from "next/navigation";
import useRecaptcha from "@/hooks/useRecaptcha";
import ReCAPTCHA from "react-google-recaptcha";

const login = async (email: string, password: string) => {
  const response = await fetch("http://127.0.0.1:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password }),
  });

  return await response.json();
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [reCaptchaToken, setReCaptchaToken] = useState<string | null>(null);
  const { token, signIn } = useAuth();
  const { capchaToken, recaptchaRef, handleRecaptcha } = useRecaptcha();

  const reCaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  useEffect(() => {
    if (token) {
      redirect("/access-log");
    }
  }, [token]);

  const submit = async (e: any) => {
    e.preventDefault();

    if (!reCaptchaToken) {
      alert("Molimo vas da potvrdite da niste robot");
      return;
    }

    if (!email || !password) {
      setErrorMessage("Proverite da li ste popunili email i lozinka polja");
      return;
    }

    login(email, password).then((response) => {
      console.log("response", response);
      if (!response.data.token) {
        setErrorMessage("Pogresan email ili lozinka.");
      }

      setEmail("");
      setPassword("");
      signIn(response.data);
    });
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start min-w-96">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 w-full">
          <img
            src="http://127.0.0.1:8000/images/grb-republike-srbije.png"
            alt="Grb Republike Srbije"
            className="w-44 mx-auto"
          />
          <hr className="w-1/2 mx-auto border-gray-300" />
          <h1 className="text-3xl font-bold text-center text-gray-900">
            IS Pristup
          </h1>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={submit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Email adresa
                </label>
                <div className="mt-2">
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Lozinka
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
                <div className="mt-4 flex items-center w-full">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={reCaptchaSiteKey}
                    onChange={(token) => {
                      setReCaptchaToken(token);
                      handleRecaptcha(token);
                    }}
                  />
                </div>
              </div>

              <div>
                <button
                  disabled={!capchaToken}
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Uloguj se
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      {!!errorMessage && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Greska prilikom pokusaja da se ulogujete
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul role="list" className="list-disc space-y-1 pl-5">
                  <li>{errorMessage}</li>
                </ul>
              </div>
            </div>
            <div className="shrink-0">
              <XCircleIcon
                aria-hidden="true"
                className="size-5 text-red-800"
                onClick={() => setErrorMessage("")}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
